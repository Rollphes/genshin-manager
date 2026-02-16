import type { JsonPropertyPath, JsonValue, RecursivePattern } from '@/types'

/**
 * Compiles JSON values into recursive patterns for matching
 */
export class PatternCompiler {
  /** Cache using object identity + path for non-primitive values */
  private readonly objectCache = new WeakMap<
    object,
    Map<string, RecursivePattern>
  >()
  /** Cache for primitive values by path */
  private readonly primitiveCache = new Map<string, RecursivePattern>()

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
    const pathKey = JSON.stringify(currentPath)
    const cached = this.getCached(masterObject, pathKey)
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

    this.setCached(masterObject, pathKey, pattern)
    return pattern
  }

  /**
   * Clear the pattern cache
   */
  public clearCache(): void {
    this.primitiveCache.clear()
    // WeakMap entries are automatically garbage collected when objects are no longer referenced
  }

  /**
   * Get cached pattern for a value
   * @param value - The value to look up
   * @param pathKey - Serialized path key
   * @returns Cached pattern or undefined
   */
  private getCached(
    value: JsonValue,
    pathKey: string,
  ): RecursivePattern | undefined {
    if (value !== null && typeof value === 'object') {
      const objCache = this.objectCache.get(value)
      return objCache?.get(pathKey)
    }
    // Primitives use path + value as key
    const primitiveKey = `${pathKey}:${String(value)}`
    return this.primitiveCache.get(primitiveKey)
  }

  /**
   * Set cached pattern for a value
   * @param value - The value to cache
   * @param pathKey - Serialized path key
   * @param pattern - Pattern to cache
   */
  private setCached(
    value: JsonValue,
    pathKey: string,
    pattern: RecursivePattern,
  ): void {
    if (value !== null && typeof value === 'object') {
      let objCache = this.objectCache.get(value)
      if (!objCache) {
        objCache = new Map()
        this.objectCache.set(value, objCache)
      }
      objCache.set(pathKey, pattern)
    } else {
      const primitiveKey = `${pathKey}:${String(value)}`
      this.primitiveCache.set(primitiveKey, pattern)
    }
  }
}
