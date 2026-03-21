import type { ElementFeatures, FlattenedEntry } from '@/types'

/**
 * Represents calculated features for flattened entries
 */
export class PathFeatures {
  /** Regex pattern for enum values (UPPER_SNAKE_CASE) */
  private static readonly enumPattern = /^[A-Z][A-Z0-9_]*$/

  /** Regex pattern for numeric segments (array indices) */
  private static readonly numericPattern = /^\d+$/

  /** Calculated features */
  public readonly features: ElementFeatures

  /**
   * Create a new FeatureCalculator instance
   * @param entries - flattened entries from ObjectFlattener
   */
  constructor(entries: FlattenedEntry[]) {
    this.features = entries.map(({ path, valueType, value }) => ({
      path,
      value,
      pattern: {
        depth: path.length,
        valueType,
        isEnum:
          typeof value === 'string' && PathFeatures.enumPattern.test(value),
        isArrayElement:
          path.length > 0 &&
          PathFeatures.numericPattern.test(path[path.length - 1]),
        arrayDepth: path.filter((seg) => PathFeatures.numericPattern.test(seg))
          .length,
      },
    }))
  }
}
