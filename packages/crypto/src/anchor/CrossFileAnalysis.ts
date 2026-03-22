import { AnchorSet } from '@/anchor/AnchorSet'
import type {
  Anchor,
  AnchorName,
  CrossFileAnchor,
  FeatureKey,
  FileFeatures,
  PathSegment,
  StructurePattern,
} from '@/types'
import type { JsonPrimitive } from '@/types/json'

/**
 * Entry for feature-to-key mapping in cross-file analysis
 */
interface CrossFileFeatureEntry {
  correctKeys: Set<PathSegment>
  value: JsonPrimitive
  pattern: StructurePattern
}

/**
 * File analysis data for cross-file resolution
 */
interface FileAnalysis {
  anchorName: AnchorName
  featureMap: Map<FeatureKey, CrossFileFeatureEntry>
}

/**
 * Represents cross-file analysis results for resolving key conflicts.
 *
 * Some keys may conflict in one file but be unique in others. This class analyzes
 * multiple files to find source files where specific keys can be uniquely identified.
 */
export class CrossFileAnalysis {
  /** Maximum number of sample values to collect per key */
  private static readonly MAX_SAMPLE_VALUES = 10

  private readonly fileAnalyses: FileAnalysis[]

  /**
   * Create a new CrossFileAnalysis instance
   * @param files - map of anchor name to file features
   */
  constructor(files: Map<AnchorName, FileFeatures>) {
    this.fileAnalyses = [...files].map(([anchorName, features]) =>
      this.buildAnalysis(anchorName, features),
    )
  }

  /**
   * List of analyzed file names
   */
  public get analyzedFiles(): AnchorName[] {
    return this.fileAnalyses.map((a) => a.anchorName)
  }

  /**
   * Total number of features across all files
   */
  public get featureCount(): number {
    return this.fileAnalyses.reduce((sum, a) => sum + a.featureMap.size, 0)
  }

  /**
   * Keys that are unique (map to exactly one correctKey)
   */
  public get uniqueKeys(): PathSegment[] {
    return this.collectKeysByCondition((e) => e.correctKeys.size === 1)
  }

  /**
   * Keys that conflict (map to multiple correctKeys)
   */
  public get conflictingKeys(): PathSegment[] {
    return this.collectKeysByCondition((e) => e.correctKeys.size > 1)
  }

  /**
   * Convert CrossFileAnchor to Anchor format for inclusion in anchor files
   * @param crossFileAnchor - cross-file anchor to convert
   * @returns anchor in standard format
   */
  public static toAnchor(crossFileAnchor: CrossFileAnchor): Anchor {
    return {
      feature: {
        values: crossFileAnchor.sampleValues,
        pattern: crossFileAnchor.pattern,
      },
      correctKey: crossFileAnchor.correctKey,
      ancestorKeys: [] as PathSegment[],
    }
  }

  /**
   * Get cross-file anchors for target keys
   * @param targetKeys - keys to find anchors for
   * @returns cross-file anchors for keys that can be resolved
   */
  public getCrossFileAnchors(
    targetKeys: readonly PathSegment[],
  ): CrossFileAnchor[] {
    return targetKeys
      .map((key) => this.findAnchorForKey(key))
      .filter((a): a is CrossFileAnchor => a !== undefined)
  }

  /**
   * Collect keys from entries matching a condition
   * @param predicate - condition to filter entries
   * @returns sorted unique keys
   */
  private collectKeysByCondition(
    predicate: (entry: CrossFileFeatureEntry) => boolean,
  ): PathSegment[] {
    return [
      ...new Set(
        this.fileAnalyses.flatMap((a) =>
          [...a.featureMap.values()]
            .filter(predicate)
            .flatMap((e) => [...e.correctKeys]),
        ),
      ),
    ].sort()
  }

  /**
   * Build analysis data for a single file
   * @param anchorName - anchor name for the file
   * @param fileFeatures - features for all elements in the file
   * @returns file analysis data
   */
  private buildAnalysis(
    anchorName: AnchorName,
    fileFeatures: FileFeatures,
  ): FileAnalysis {
    const featureMap = new Map<FeatureKey, CrossFileFeatureEntry>()

    for (const feature of fileFeatures.flat()) {
      if (
        feature.pattern.valueType === 'array' ||
        feature.pattern.valueType === 'object'
      )
        continue

      const featureKey = AnchorSet.createFeatureKey(
        feature.value,
        feature.pattern,
      )
      const { key: correctKey } = AnchorSet.extractKeyHierarchy(feature.path)

      const entry = featureMap.get(featureKey)
      if (entry !== undefined) {
        entry.correctKeys.add(correctKey)
      } else {
        featureMap.set(featureKey, {
          correctKeys: new Set([correctKey]),
          value: feature.value,
          pattern: feature.pattern,
        })
      }
    }

    return { anchorName, featureMap }
  }

  /**
   * Find anchor for a single key by searching files where it is unique
   * @param targetKey - key to find
   * @returns cross-file anchor or undefined
   */
  private findAnchorForKey(
    targetKey: PathSegment,
  ): CrossFileAnchor | undefined {
    for (const analysis of this.fileAnalyses) {
      const result = this.checkKeyUniqueness(targetKey, analysis)
      if (result !== undefined) return result
    }
    return undefined
  }

  /**
   * Check if a key is unique in a specific file
   * @param targetKey - key to check
   * @param analysis - file analysis data
   * @returns cross-file anchor if unique, undefined otherwise
   */
  private checkKeyUniqueness(
    targetKey: PathSegment,
    analysis: FileAnalysis,
  ): CrossFileAnchor | undefined {
    const entries = [...analysis.featureMap.values()].filter((e) =>
      e.correctKeys.has(targetKey),
    )

    if (entries.length === 0 || entries.some((e) => e.correctKeys.size > 1))
      return undefined

    return {
      correctKey: targetKey,
      pattern: entries[0].pattern,
      sourceFile: analysis.anchorName,
      sampleValues: AnchorSet.selectDiverseValues(
        new Set(entries.map((e) => e.value)),
        CrossFileAnalysis.MAX_SAMPLE_VALUES,
      ),
    }
  }
}
