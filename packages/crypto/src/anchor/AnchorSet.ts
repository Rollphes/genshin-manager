import type {
  Anchor,
  FeatureEntry,
  FeatureKey,
  FileFeatures,
  PathSegment,
  StructurePattern,
} from '@/types'
import type { JsonPrimitive } from '@/types/json'

/**
 * Brand symbol for AnchorGroupKey (local use only)
 */
declare const _anchorGroupKeyBrand: unique symbol

/**
 * Branded type for grouping anchors by (correctKey + pattern)
 * Used internally to collect multiple values for the same key+pattern combination
 */
type AnchorGroupKey = string & {
  readonly [_anchorGroupKeyBrand]: typeof _anchorGroupKeyBrand
}

/**
 * Data for grouping values by (correctKey + pattern)
 */
interface AnchorGroupData {
  values: Set<JsonPrimitive>
  pattern: StructurePattern
  correctKey: PathSegment
  ancestorKeys: PathSegment[]
}

/**
 * Extracts unique anchors from all elements' path features.
 *
 * An anchor is a feature (value + structure pattern) that maps to exactly one key
 * across all elements, making it uniquely identifiable.
 */
export class AnchorSet {
  /**
   * Maximum number of values to collect per key for drift-resistant matching
   */
  private static readonly MAX_VALUES_PER_KEY = 10

  /** Regex pattern for numeric segments (array indices) */
  private static readonly numericPattern = /^\d+$/

  /** Regex pattern for plaintext keys (contains lowercase letters) */
  private static readonly plaintextPattern = /[a-z]/

  /** Extracted anchors */
  public readonly anchors: Anchor[]

  /** Feature map built from input features */
  private readonly featureMap: Map<FeatureKey, FeatureEntry>

  /**
   * Create a new AnchorExtractor instance
   * @param fileFeatures - features for all elements in the file
   */
  constructor(fileFeatures: FileFeatures) {
    this.featureMap = this.buildFeatureMap(fileFeatures)
    this.anchors = this.extractUniqueAnchors()
  }

  /**
   * Keys excluded due to non-uniqueness
   */
  public get excludedKeys(): PathSegment[] {
    const anchorKeys = new Set(this.anchors.map((a) => a.correctKey))
    return [
      ...new Set(
        [...this.featureMap.values()]
          .filter((e) => e.correctKeys.size > 1)
          .flatMap((e) => [...e.correctKeys]),
      ),
    ]
      .filter((k) => !anchorKeys.has(k))
      .sort()
  }

  /**
   * Ancestor keys derivable from child anchors
   */
  public get derivedAncestorKeys(): PathSegment[] {
    return [...new Set(this.anchors.flatMap((a) => a.ancestorKeys))].sort()
  }

  /**
   * Create feature key for uniqueness check and cross-file matching
   * @param value - primitive value
   * @param pattern - structure pattern
   * @returns branded feature key for Map lookup
   */
  public static createFeatureKey(
    value: JsonPrimitive,
    pattern: StructurePattern,
  ): FeatureKey {
    return JSON.stringify({ value, pattern }) as FeatureKey
  }

  /**
   * Extract key hierarchy from path (current key + ancestor keys)
   * @param path - path segments
   * @returns key hierarchy { key: current key, ancestors: [parent, grandparent, ...] }
   */
  public static extractKeyHierarchy(path: PathSegment[]): {
    key: PathSegment
    ancestors: PathSegment[]
  } {
    const [key = '' as PathSegment, ...ancestors] = [...path]
      .reverse()
      .filter((seg) => !AnchorSet.numericPattern.test(seg))

    return { key, ancestors }
  }

  /**
   * Select diverse values from a set (maximize diversity)
   * For numbers: spread across the range using even spacing
   * For strings/mixed: take first maxCount values
   * @param values - all available values
   * @param maxCount - maximum number of values to select
   * @returns selected values
   */
  public static selectDiverseValues(
    values: Set<JsonPrimitive>,
    maxCount: number,
  ): JsonPrimitive[] {
    const arr = [...values]
    if (values.size <= maxCount) return arr

    if (arr.every((v): v is number => typeof v === 'number'))
      return AnchorSet.selectEvenlySpaced(arr, maxCount)

    return arr.slice(0, maxCount)
  }

  /**
   * Create anchor group key for grouping by (correctKey + pattern)
   * @param correctKey - correct key name
   * @param pattern - structure pattern
   * @returns branded anchor group key for Map lookup
   */
  private static createAnchorGroupKey(
    correctKey: PathSegment,
    pattern: StructurePattern,
  ): AnchorGroupKey {
    return JSON.stringify({ correctKey, pattern }) as AnchorGroupKey
  }

  /**
   * Select evenly spaced values from a set of numbers
   * @param numbers - unique numbers to select from
   * @param count - number of values to select
   * @returns evenly spaced values
   */
  private static selectEvenlySpaced(
    numbers: number[],
    count: number,
  ): number[] {
    const sorted = [...numbers].sort((a, b) => a - b)
    const step = (sorted.length - 1) / (count - 1)
    return Array.from({ length: count }, (_, i) => sorted[Math.round(i * step)])
  }

  /**
   * Build feature map from file features
   * @param fileFeatures - features for all elements in the file
   * @returns map of feature key to feature entry
   */
  private buildFeatureMap(
    fileFeatures: FileFeatures,
  ): Map<FeatureKey, FeatureEntry> {
    return fileFeatures
      .flat()
      .filter(
        (f) =>
          f.pattern.valueType !== 'array' && f.pattern.valueType !== 'object',
      )
      .reduce((map, feature) => {
        const featureKey = AnchorSet.createFeatureKey(
          feature.value,
          feature.pattern,
        )
        const { key: correctKey, ancestors: ancestorKeys } =
          AnchorSet.extractKeyHierarchy(feature.path)

        const entry = map.get(featureKey)
        if (entry !== undefined) {
          entry.correctKeys.add(correctKey)
        } else {
          map.set(featureKey, {
            correctKeys: new Set([correctKey]),
            ancestorKeys,
            value: feature.value,
            pattern: feature.pattern,
          })
        }
        return map
      }, new Map<FeatureKey, FeatureEntry>())
  }

  /**
   * Extract unique anchors from feature map, collecting multiple values per key+pattern
   * @returns array of unique anchors
   */
  private extractUniqueAnchors(): Anchor[] {
    // Group by (correctKey, pattern) -> collect multiple values
    const keyPatternToValues = [...this.featureMap.values()]
      .filter((entry) => entry.correctKeys.size === 1)
      .reduce((map, entry) => {
        const correctKey = [...entry.correctKeys][0]
        const groupKey = AnchorSet.createAnchorGroupKey(
          correctKey,
          entry.pattern,
        )

        const existing = map.get(groupKey)
        if (existing !== undefined) {
          existing.values.add(entry.value)
          // Prefer plaintext ancestorKeys over encrypted ones
          if (
            entry.ancestorKeys.length > 0 &&
            entry.ancestorKeys.some((k) =>
              AnchorSet.plaintextPattern.test(k),
            ) &&
            (existing.ancestorKeys.length === 0 ||
              !existing.ancestorKeys.some((k) =>
                AnchorSet.plaintextPattern.test(k),
              ))
          )
            existing.ancestorKeys = entry.ancestorKeys
        } else {
          map.set(groupKey, {
            values: new Set([entry.value]),
            pattern: entry.pattern,
            correctKey,
            ancestorKeys: entry.ancestorKeys,
          })
        }
        return map
      }, new Map<AnchorGroupKey, AnchorGroupData>())

    // Create anchors with multiple values (diversity-selected) and sort by depth, then key name
    return [...keyPatternToValues.values()]
      .map((data) => ({
        feature: {
          values: AnchorSet.selectDiverseValues(
            data.values,
            AnchorSet.MAX_VALUES_PER_KEY,
          ),
          pattern: data.pattern,
        },
        correctKey: data.correctKey,
        ancestorKeys: data.ancestorKeys,
      }))
      .sort((a, b) => {
        if (a.feature.pattern.depth !== b.feature.pattern.depth)
          return a.feature.pattern.depth - b.feature.pattern.depth
        return a.correctKey.localeCompare(b.correctKey)
      })
  }
}
