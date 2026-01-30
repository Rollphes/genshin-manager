import type { JsonPropertyPath, JsonValue, RecursivePattern } from '@/types'

/**
 * Compiles JSON values into recursive patterns for matching
 */
export class PatternCompiler {
  private readonly patternCache = new Map<string, RecursivePattern>()

  /**
   * Generate recursive pattern from master object
   * @param masterObject - Master object to analyze
   * @param currentPath - Current path in the object hierarchy
   * @returns Recursive pattern representation
   */
  public compile(
    masterObject: JsonValue,
    currentPath: JsonPropertyPath = [],
  ): RecursivePattern {
    const cacheKey = JSON.stringify({ object: masterObject, path: currentPath })
    const cached = this.patternCache.get(cacheKey)
    if (cached) return cached

    let pattern: RecursivePattern

    if (masterObject === null || masterObject === undefined) {
      pattern = { type: 'primitive', value: masterObject }
    } else if (Array.isArray(masterObject)) {
      const arrayValue: readonly JsonValue[] = masterObject
      pattern = {
        type: 'array',
        elements: arrayValue.map((item, index) =>
          this.compile(item, [...currentPath, index]),
        ),
      }
    } else if (typeof masterObject === 'object') {
      const properties = new Map<string, RecursivePattern>()
      const keyPaths = new Map<string, JsonPropertyPath>()

      for (const [propertyName, propertyValue] of Object.entries(
        masterObject,
      )) {
        const keyPath = [...currentPath, propertyName]
        properties.set(propertyName, this.compile(propertyValue, keyPath))
        keyPaths.set(propertyName, keyPath)
      }

      pattern = {
        type: 'object',
        properties,
        keyPaths,
      }
    } else {
      pattern = { type: 'primitive', value: masterObject }
    }

    this.patternCache.set(cacheKey, pattern)
    return pattern
  }

  /**
   * Clear the pattern cache
   */
  public clearCache(): void {
    this.patternCache.clear()
  }
}
