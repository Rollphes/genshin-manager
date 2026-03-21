import { AnchorSet } from '@/anchor/AnchorSet'
import { PathFeatures } from '@/feature/PathFeatures'
import { FlatEntries } from '@/flatten/FlatEntries'
import { loadAnchor } from '@/io/loadAnchor'
import type {
  Anchor,
  AnchorFile,
  AnchorName,
  ElementFeatures,
  FeatureKey,
  PathSegment,
  RestorationResult,
  RestoreOptions,
} from '@/types'
import type { JsonObject, JsonValue } from '@/types/json'

/**
 * Restores encrypted keys to their correct names using anchor files.
 *
 * Uses feature matching (value + pattern) to identify encrypted keys
 * and replace them with their correct names from the anchor file.
 */
export class KeyRestorer {
  /** Regex pattern for encrypted keys (all uppercase letters) */
  private static readonly encryptedKeyPattern = /^[A-Z]+$/

  /** Map of feature key to anchor for quick lookup */
  private readonly featureKeyToAnchor: Map<FeatureKey, Anchor>

  /**
   * Create KeyRestorer instance (internal use only)
   * @param anchorFile - anchor file containing key mappings
   */
  private constructor(anchorFile: AnchorFile) {
    this.featureKeyToAnchor = this.buildFeatureMap(anchorFile)
  }

  /**
   * Restore encrypted keys in a JSON string
   * @param name - anchor name (type-safe)
   * @param encryptedJson - JSON string with encrypted key names
   * @param options - restore options
   * @returns restoration result with restored objects and key info
   */
  public static restore(
    name: AnchorName,
    encryptedJson: string,
    options?: RestoreOptions,
  ): RestorationResult {
    const anchorFile = loadAnchor(name)
    const restorer = new KeyRestorer(anchorFile)
    const objects = JSON.parse(encryptedJson) as JsonObject[]
    return restorer.restoreAll(
      objects,
      options?.excludeEncryptedKeysFromData ?? false,
    )
  }

  /**
   * Type guard for JsonObject
   * @param value - value to check
   * @returns true if value is a JsonObject
   */
  private static isObject(value: JsonValue): value is JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  /**
   * Restore all objects in an array
   * @param objects - array of objects with encrypted key names
   * @param excludeEncryptedFromData - exclude encrypted keys from data output
   * @returns restoration result with restored data and key info
   */
  private restoreAll(
    objects: JsonObject[],
    excludeEncryptedFromData: boolean,
  ): RestorationResult {
    const allRestoredKeys = new Set<PathSegment>()
    const allUnresolvedKeys = new Set<PathSegment>()

    const restoredObjects = objects.map((obj) => {
      const { entries } = new FlatEntries(obj)
      const { features } = new PathFeatures(entries)
      const encryptedToCorrect = this.matchFeatures(features)

      const { restoredKeys, unresolvedKeys } = this.collectKeys(
        obj,
        encryptedToCorrect,
      )
      restoredKeys.forEach((k) => allRestoredKeys.add(k))
      unresolvedKeys.forEach((k) => allUnresolvedKeys.add(k))
      return this.reconstructObject(obj, encryptedToCorrect)
    })

    // Exclude encrypted keys from data output if requested
    const finalObjects = excludeEncryptedFromData
      ? restoredObjects.map((obj) => this.excludeEncryptedKeys(obj))
      : restoredObjects

    return {
      data: finalObjects as unknown[],
      restoredKeys: [...allRestoredKeys].sort(),
      unresolvedKeys: [...allUnresolvedKeys].sort(),
    }
  }

  /**
   * Exclude encrypted keys (all uppercase) from object recursively
   * @param obj - object to process
   * @returns object with encrypted keys excluded
   */
  private excludeEncryptedKeys(obj: JsonObject): JsonObject {
    const result: JsonObject = {}

    for (const [key, value] of Object.entries(obj)) {
      if (KeyRestorer.encryptedKeyPattern.test(key)) continue

      if (KeyRestorer.isObject(value)) {
        result[key] = this.excludeEncryptedKeys(value)
      } else if (Array.isArray(value)) {
        result[key] = value.map((item) =>
          KeyRestorer.isObject(item) ? this.excludeEncryptedKeys(item) : item,
        )
      } else {
        result[key] = value
      }
    }

    return result
  }

  /**
   * Build feature key to anchor map from anchor file
   * Creates an entry for each value in the anchor's values array
   * @param anchorFile - anchor file to build map from
   * @returns map of feature keys to anchors
   */
  private buildFeatureMap(anchorFile: AnchorFile): Map<FeatureKey, Anchor> {
    const map = new Map<FeatureKey, Anchor>()

    // Add anchors - regular anchors first, then cross-file (regular take precedence)
    ;[...anchorFile.anchors, ...anchorFile.crossFileAnchors].forEach(
      (anchor) => {
        anchor.feature.values.forEach((value) => {
          const key = AnchorSet.createFeatureKey(value, anchor.feature.pattern)
          if (!map.has(key)) map.set(key, anchor)
        })
      },
    )

    return map
  }

  /**
   * Match features to anchors and build key mapping
   * @param features - path features from flattened object
   * @returns key mapping (encrypted → correct)
   */
  private matchFeatures(
    features: ElementFeatures,
  ): Map<PathSegment, PathSegment> {
    const encryptedToCorrect = new Map<PathSegment, PathSegment>()

    features
      .map((feature) => ({
        feature,
        anchor: this.featureKeyToAnchor.get(
          AnchorSet.createFeatureKey(feature.value, feature.pattern),
        ),
      }))
      .filter(
        (entry): entry is { feature: typeof entry.feature; anchor: Anchor } =>
          entry.anchor !== undefined,
      )
      .forEach(({ feature, anchor }) => {
        const { key: encryptedKey, ancestors: encryptedAncestors } =
          AnchorSet.extractKeyHierarchy(feature.path)

        // Only map if encrypted key is different from correct key
        if (encryptedKey !== anchor.correctKey)
          encryptedToCorrect.set(encryptedKey, anchor.correctKey)

        // Also restore ancestor keys if present
        anchor.ancestorKeys
          .slice(0, encryptedAncestors.length)
          .forEach((correct, i) => {
            if (encryptedAncestors[i] !== correct)
              encryptedToCorrect.set(encryptedAncestors[i], correct)
          })
      })

    return encryptedToCorrect
  }

  /**
   * Collect all keys and categorize as restored or unresolved
   * @param obj - object to analyze
   * @param encryptedToCorrect - key mapping (encrypted → correct)
   * @returns collected keys categorized as restored or unresolved
   */
  private collectKeys(
    obj: JsonObject,
    encryptedToCorrect: Map<PathSegment, PathSegment>,
  ): { restoredKeys: Set<PathSegment>; unresolvedKeys: Set<PathSegment> } {
    const restoredKeys = new Set<PathSegment>()
    const unresolvedKeys = new Set<PathSegment>()

    Object.entries(obj).forEach(([key, value]) => {
      const keyAsSegment = key as PathSegment
      if (encryptedToCorrect.has(keyAsSegment)) restoredKeys.add(keyAsSegment)
      else if (KeyRestorer.encryptedKeyPattern.test(key))
        unresolvedKeys.add(keyAsSegment)

      // Recurse into nested structures
      const nested = this.collectKeysFromValue(value, encryptedToCorrect)
      nested.restoredKeys.forEach((k) => restoredKeys.add(k))
      nested.unresolvedKeys.forEach((k) => unresolvedKeys.add(k))
    })

    return { restoredKeys, unresolvedKeys }
  }

  /**
   * Collect keys from a value (handles objects, arrays, and primitives)
   * @param value - value to analyze
   * @param encryptedToCorrect - key mapping (encrypted → correct)
   * @returns collected keys categorized as restored or unresolved
   */
  private collectKeysFromValue(
    value: JsonValue,
    encryptedToCorrect: Map<PathSegment, PathSegment>,
  ): { restoredKeys: Set<PathSegment>; unresolvedKeys: Set<PathSegment> } {
    if (KeyRestorer.isObject(value))
      return this.collectKeys(value, encryptedToCorrect)

    if (Array.isArray(value)) {
      const restoredKeys = new Set<PathSegment>()
      const unresolvedKeys = new Set<PathSegment>()

      value.forEach((item) => {
        const nested = this.collectKeysFromValue(item, encryptedToCorrect)
        nested.restoredKeys.forEach((k) => restoredKeys.add(k))
        nested.unresolvedKeys.forEach((k) => unresolvedKeys.add(k))
      })

      return { restoredKeys, unresolvedKeys }
    }

    return { restoredKeys: new Set(), unresolvedKeys: new Set() }
  }

  /**
   * Reconstruct object with correct key names
   * @param obj - original object
   * @param encryptedToCorrect - key mapping (encrypted → correct)
   * @returns reconstructed object
   */
  private reconstructObject(
    obj: JsonObject,
    encryptedToCorrect: Map<PathSegment, PathSegment>,
  ): JsonObject {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        const keyAsSegment = key as PathSegment
        const newKey = encryptedToCorrect.get(keyAsSegment) ?? keyAsSegment
        return [newKey, this.reconstructValue(value, encryptedToCorrect)]
      }),
    ) as JsonObject
  }

  /**
   * Reconstruct a value (handles objects, arrays, and primitives)
   * @param value - value to reconstruct
   * @param encryptedToCorrect - key mapping (encrypted → correct)
   * @returns reconstructed value
   */
  private reconstructValue(
    value: JsonValue,
    encryptedToCorrect: Map<PathSegment, PathSegment>,
  ): JsonValue {
    if (KeyRestorer.isObject(value))
      return this.reconstructObject(value, encryptedToCorrect)
    if (Array.isArray(value)) {
      return value.map((item) =>
        this.reconstructValue(item, encryptedToCorrect),
      )
    }
    return value
  }
}
