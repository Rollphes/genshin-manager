import type { KeyPath, RecursivePattern } from '@/domain/crypto/types'
import { isJsonArray } from '@/domain/typeGuards/isJsonArray'
import { isJsonObject } from '@/domain/typeGuards/isJsonObject'
import type { JsonValue } from '@/types/json'

/**
 * Compiles JSON values into recursive patterns for matching
 */
export class PatternCompiler {
  private readonly patternCache = new Map<string, RecursivePattern>()

  /**
   * Generate recursive pattern from master object
   * @param masterObject - Master object to analyze
   * @param currentPath - Current path in the object hierarchy
   * @returns recursive pattern representation
   */
  public compile(
    masterObject: JsonValue,
    currentPath: KeyPath = [],
  ): RecursivePattern {
    const cacheKey = JSON.stringify({ object: masterObject, path: currentPath })
    const cached = this.patternCache.get(cacheKey)
    if (cached) return cached

    let pattern: RecursivePattern

    if (masterObject === null || masterObject === undefined) {
      pattern = { type: 'primitive', value: masterObject }
    } else if (isJsonArray(masterObject)) {
      pattern = {
        type: 'array',
        elements: masterObject.map((item, index) =>
          this.compile(item, [...currentPath, index]),
        ),
      }
    } else if (isJsonObject(masterObject)) {
      const properties = new Map<string, RecursivePattern>()
      const keyPaths = new Map<string, KeyPath>()

      for (const [key, value] of Object.entries(masterObject)) {
        const keyPath = [...currentPath, key]
        properties.set(key, this.compile(value, keyPath))
        keyPaths.set(key, keyPath)
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
