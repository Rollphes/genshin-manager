import fs from 'fs'
import path from 'path'

import { EncryptedKeyMasterFile, ExcelBinOutputs } from '@/types'
import type { JsonObject, JsonValue } from '@/types/json'
import { masterFileFolderPath } from '@/utils/paths'

/**
 * Key path type for tracking nested locations
 */
type KeyPath = (string | number)[]

/**
 * Enhanced pattern definition for recursive value matching
 */
type RecursivePattern =
  | {
      type: 'primitive'
      value: JsonValue
    }
  | {
      type: 'array'
      elements: RecursivePattern[]
    }
  | {
      type: 'object'
      properties: Map<string, RecursivePattern>
      keyPaths: Map<string, KeyPath> // Track paths for encrypted keys
    }

/**
 * Decoding result with path information
 */
interface DecodingResult {
  success: boolean
  keyMappings: Map<KeyPath, string> // Maps encrypted key paths to original keys
  confidence: number // 0-1, higher is better
  errors?: string[] // List of errors encountered during decoding
  partialMatches?: KeyPath[] // Paths that had partial matches
}

/**
 * Decoding options
 */
interface DecodingOptions {
  matchStrategy?: 'exact' | 'subset' | 'fuzzy'
  maxDepth?: number
  enablePartialMatch?: boolean
}

/**
 * Enhanced encrypted key decoder with recursive support
 * Inspired by SimpleMasterFileGenerator patterns
 */
export class EncryptedKeyDecoder {
  private readonly masterFile: EncryptedKeyMasterFile
  private readonly patternCache = new Map<string, RecursivePattern>()
  private readonly matchResultCache = new Map<string, DecodingResult>()
  private readonly compiledPatterns = new Map<string, RecursivePattern>()

  /**
   * Constructor
   * @param fileName - ExcelBinOutput file name
   */
  constructor(fileName: keyof typeof ExcelBinOutputs) {
    try {
      const masterFilePath = path.join(
        masterFileFolderPath,
        `${fileName}.master.json`,
      )
      if (!fs.existsSync(masterFilePath))
        throw new Error('Master file not found')
      this.masterFile = JSON.parse(
        fs.readFileSync(masterFilePath, 'utf-8'),
      ) as EncryptedKeyMasterFile
      this.precompilePatterns()
    } catch (error) {
      throw new Error(`Failed to load master file: ${String(error)}`)
    }
  }

  /**
   * Process encrypted object array and decode keys recursively
   * @param encryptedData - Encrypted object array
   * @param options - Decoding options
   * @returns decoded object array
   */
  public execute(
    encryptedData: JsonObject[],
    options: DecodingOptions = {},
  ): JsonObject[] {
    const defaultOptions: Required<DecodingOptions> = {
      matchStrategy: 'subset',
      maxDepth: 10,
      enablePartialMatch: true,
      ...options,
    }

    const cacheKey = this.generateCacheKey(encryptedData, defaultOptions)

    if (this.matchResultCache.has(cacheKey)) {
      const cachedResult = this.matchResultCache.get(cacheKey)
      if (cachedResult) {
        return encryptedData.map(
          (obj) =>
            this.applyRecursiveDecoding(
              obj,
              cachedResult.keyMappings,
            ) as JsonObject,
        )
      }
    }

    const primaryPattern = this.compiledPatterns.get('primary')
    if (!primaryPattern)
      throw new Error('Primary pattern not found in compiled patterns')

    let bestResult = this.findBestKeyMapping(
      encryptedData,
      primaryPattern,
      defaultOptions,
    )

    if (
      (!bestResult.success || bestResult.confidence < 0.8) &&
      this.masterFile.alternativePatterns
    ) {
      for (let i = 0; i < this.masterFile.alternativePatterns.length; i++) {
        const altPattern = this.compiledPatterns.get(`alternative_${String(i)}`)
        if (!altPattern) continue
        const altResult = this.findBestKeyMapping(
          encryptedData,
          altPattern,
          defaultOptions,
        )

        if (altResult.confidence > bestResult.confidence) bestResult = altResult
      }
    }

    if (bestResult.success && bestResult.confidence > 0.5)
      this.matchResultCache.set(cacheKey, bestResult)

    if (!bestResult.success && !defaultOptions.enablePartialMatch) {
      const errorMessage = this.generateDetailedError(bestResult, encryptedData)
      throw new Error(errorMessage)
    }

    return encryptedData.map(
      (obj) =>
        this.applyRecursiveDecoding(obj, bestResult.keyMappings) as JsonObject,
    )
  }

  /**
   * Pre-compile patterns for performance optimization
   */
  private precompilePatterns(): void {
    const primaryPattern = this.generateRecursivePattern(
      this.masterFile.keyMappingTemplate,
      [],
    )
    this.compiledPatterns.set('primary', primaryPattern)

    if (this.masterFile.alternativePatterns) {
      this.masterFile.alternativePatterns.forEach((altPattern, index) => {
        const compiledAlt = this.generateRecursivePattern(altPattern, [])
        this.compiledPatterns.set(`alternative_${String(index)}`, compiledAlt)
      })
    }
  }

  /**
   * Generate recursive pattern from master object
   * @param masterObject - Master object to analyze
   * @param currentPath - Current path in the object hierarchy
   * @returns recursive pattern representation
   */
  private generateRecursivePattern(
    masterObject: JsonValue,
    currentPath: KeyPath,
  ): RecursivePattern {
    const cacheKey = JSON.stringify({ object: masterObject, path: currentPath })
    const cached = this.patternCache.get(cacheKey)
    if (cached) return cached

    let pattern: RecursivePattern

    if (masterObject === null || masterObject === undefined) {
      pattern = { type: 'primitive', value: masterObject }
    } else if (Array.isArray(masterObject)) {
      pattern = {
        type: 'array',
        elements: masterObject.map((item, index) =>
          this.generateRecursivePattern(item, [...currentPath, index]),
        ),
      }
    } else if (typeof masterObject === 'object') {
      const properties = new Map<string, RecursivePattern>()
      const keyPaths = new Map<string, KeyPath>()

      for (const [key, value] of Object.entries(masterObject)) {
        const keyPath = [...currentPath, key]
        properties.set(key, this.generateRecursivePattern(value, keyPath))
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
   * Find best key mapping from encrypted data using pattern matching
   * @param encryptedData - Array of encrypted objects
   * @param pattern - Pattern to match against
   * @param options - Decoding options
   * @returns best decoding result
   */
  private findBestKeyMapping(
    encryptedData: JsonObject[],
    pattern: RecursivePattern,
    options: Required<DecodingOptions>,
  ): DecodingResult {
    let bestResult: DecodingResult = {
      success: false,
      keyMappings: new Map(),
      confidence: 0,
    }

    for (const obj of encryptedData) {
      const result = this.matchPatternRecursively(obj, pattern, [], options)
      if (result.confidence > bestResult.confidence) bestResult = result

      if (result.confidence >= 0.95) break
    }

    return bestResult
  }

  /**
   * Recursively match pattern against encrypted object
   * @param encryptedValue - Encrypted value to match
   * @param pattern - Pattern to match against
   * @param currentPath - Current path in the structure
   * @param options - Decoding options
   * @returns matching result with key mappings
   */
  private matchPatternRecursively(
    encryptedValue: JsonValue,
    pattern: RecursivePattern,
    currentPath: KeyPath,
    options: Required<DecodingOptions>,
  ): DecodingResult {
    if (currentPath.length > options.maxDepth)
      return { success: false, keyMappings: new Map(), confidence: 0 }

    switch (pattern.type) {
      case 'primitive':
        return this.matchPrimitivePattern(encryptedValue, pattern, options)
      case 'array':
        return this.matchArrayPattern(
          encryptedValue,
          pattern,
          currentPath,
          options,
        )
      case 'object':
        return this.matchObjectPattern(
          encryptedValue,
          pattern,
          currentPath,
          options,
        )
      default:
        return { success: false, keyMappings: new Map(), confidence: 0 }
    }
  }

  /**
   * Match primitive pattern
   */
  private matchPrimitivePattern(
    encryptedValue: JsonValue,
    pattern: { type: 'primitive'; value: JsonValue },
    options: Required<DecodingOptions>,
  ): DecodingResult {
    const matches = this.valueMatches(
      encryptedValue,
      pattern.value,
      options.matchStrategy,
    )
    return {
      success: matches,
      keyMappings: new Map(),
      confidence: matches ? 1 : 0,
    }
  }

  /**
   * Match array pattern
   */
  private matchArrayPattern(
    encryptedValue: JsonValue,
    pattern: { type: 'array'; elements: RecursivePattern[] },
    currentPath: KeyPath,
    options: Required<DecodingOptions>,
  ): DecodingResult {
    if (!Array.isArray(encryptedValue))
      return { success: false, keyMappings: new Map(), confidence: 0 }

    const keyMappings = new Map<KeyPath, string>()
    let totalConfidence = 0
    let matchedElements = 0

    const minLength = Math.min(encryptedValue.length, pattern.elements.length)

    for (let i = 0; i < minLength; i++) {
      const elementResult = this.matchPatternRecursively(
        encryptedValue[i],
        pattern.elements[i],
        [...currentPath, i],
        options,
      )

      if (elementResult.success) {
        matchedElements++
        totalConfidence += elementResult.confidence

        for (const [path, key] of elementResult.keyMappings)
          keyMappings.set(path, key)
      }
    }

    const confidence = minLength > 0 ? totalConfidence / minLength : 0
    const success =
      options.matchStrategy === 'exact'
        ? matchedElements === pattern.elements.length
        : matchedElements > 0

    return { success, keyMappings, confidence }
  }

  /**
   * Match object pattern
   */
  private matchObjectPattern(
    encryptedValue: JsonValue,
    pattern: {
      type: 'object'
      properties: Map<string, RecursivePattern>
      keyPaths: Map<string, KeyPath>
    },
    currentPath: KeyPath,
    options: Required<DecodingOptions>,
  ): DecodingResult {
    if (
      typeof encryptedValue !== 'object' ||
      encryptedValue === null ||
      Array.isArray(encryptedValue)
    )
      return { success: false, keyMappings: new Map(), confidence: 0 }

    const encryptedObj = encryptedValue
    const keyMappings = new Map<KeyPath, string>()
    let totalConfidence = 0
    let matchedProperties = 0

    const encryptedEntries = Object.entries(encryptedObj)
    const usedEncryptedKeys = new Set<string>()

    for (const [originalKey, originalPattern] of pattern.properties) {
      const bestMatch = this.findBestKeyMatch(
        originalPattern,
        encryptedEntries,
        usedEncryptedKeys,
        currentPath,
        options,
      )

      if (bestMatch) {
        matchedProperties++
        totalConfidence += bestMatch.confidence
        usedEncryptedKeys.add(bestMatch.encryptedKey)

        const originalKeyPath = pattern.keyPaths.get(originalKey)
        if (originalKeyPath) {
          const encryptedKeyPath = [...currentPath, bestMatch.encryptedKey]
          keyMappings.set(encryptedKeyPath, originalKey)
        }

        const nestedResult = this.matchPatternRecursively(
          encryptedObj[bestMatch.encryptedKey],
          originalPattern,
          [...currentPath, bestMatch.encryptedKey],
          options,
        )

        for (const [path, key] of nestedResult.keyMappings)
          keyMappings.set(path, key)
      }
    }

    const confidence =
      pattern.properties.size > 0
        ? totalConfidence / pattern.properties.size
        : 0
    const success =
      options.matchStrategy === 'exact'
        ? matchedProperties === pattern.properties.size
        : matchedProperties > 0

    return { success, keyMappings, confidence }
  }

  /**
   * Find best key match for a property
   */
  private findBestKeyMatch(
    originalPattern: RecursivePattern,
    encryptedEntries: [string, JsonValue][],
    usedEncryptedKeys: Set<string>,
    currentPath: KeyPath,
    options: Required<DecodingOptions>,
  ): { encryptedKey: string; confidence: number } | null {
    let bestMatch: { encryptedKey: string; confidence: number } | null = null

    for (const [encryptedKey, encryptedValue] of encryptedEntries) {
      if (usedEncryptedKeys.has(encryptedKey)) continue

      const matchResult = this.matchPatternRecursively(
        encryptedValue,
        originalPattern,
        [...currentPath, encryptedKey],
        options,
      )

      if (
        matchResult.success &&
        (!bestMatch || matchResult.confidence > bestMatch.confidence)
      )
        bestMatch = { encryptedKey, confidence: matchResult.confidence }
    }

    return bestMatch
  }

  /**
   * Check if two values match according to strategy
   * @param value1 - First value
   * @param value2 - Second value
   * @param strategy - Matching strategy
   * @returns whether values match
   */
  private valueMatches(
    value1: JsonValue,
    value2: JsonValue,
    strategy: 'exact' | 'subset' | 'fuzzy',
  ): boolean {
    if (strategy === 'exact') return value1 === value2

    if (strategy === 'fuzzy') {
      if (typeof value1 === typeof value2) {
        if (typeof value1 === 'string' && typeof value2 === 'string')
          return value1.toLowerCase() === value2.toLowerCase()

        if (typeof value1 === 'number' && typeof value2 === 'number')
          return Math.abs(value1 - value2) < 0.001
      }
    }

    if (value1 === null || value1 === undefined)
      return value2 === null || value2 === undefined

    return value1 === value2
  }

  /**
   * Apply recursive decoding to an object using key mappings
   * @param obj - Object to decode
   * @param keyMappings - Map of encrypted key paths to original keys
   * @returns decoded object
   */
  private applyRecursiveDecoding(
    obj: JsonValue,
    keyMappings: Map<KeyPath, string>,
  ): JsonValue {
    return this.applyDecodingAtPath(obj, [], keyMappings)
  }

  /**
   * Apply decoding at specific path in object hierarchy
   * @param value - Current value
   * @param currentPath - Current path
   * @param keyMappings - Key mappings
   * @returns decoded value
   */
  private applyDecodingAtPath(
    value: JsonValue,
    currentPath: KeyPath,
    keyMappings: Map<KeyPath, string>,
  ): JsonValue {
    if (value === null || value === undefined) return value

    if (Array.isArray(value)) {
      return value.map((item, index) =>
        this.applyDecodingAtPath(item, [...currentPath, index], keyMappings),
      )
    }

    if (typeof value === 'object') {
      const obj = value
      const decodedObj: JsonObject = {}

      for (const [encryptedKey, nestedValue] of Object.entries(obj)) {
        const keyPath = [...currentPath, encryptedKey]
        const pathKey = this.pathToString(keyPath)

        let originalKey = encryptedKey
        for (const [mappedPath, mappedKey] of keyMappings) {
          if (this.pathToString(mappedPath) === pathKey) {
            originalKey = mappedKey
            break
          }
        }

        decodedObj[originalKey] = this.applyDecodingAtPath(
          nestedValue,
          keyPath,
          keyMappings,
        )
      }

      return decodedObj
    }

    return value
  }

  /**
   * Convert key path to string for comparison
   * @param path - Key path
   * @returns string representation
   */
  private pathToString(path: KeyPath): string {
    return path.map((segment) => String(segment)).join('.')
  }

  /**
   * Generate detailed error message with debugging information
   * @param result - Failed decoding result
   * @param encryptedData - Original encrypted data
   * @returns detailed error message
   */
  private generateDetailedError(
    result: DecodingResult,
    encryptedData: JsonObject[],
  ): string {
    const sourceFile = this.masterFile.metadata.sourceFile
    let message = `Could not determine key mapping for ${sourceFile}.\n`

    message += `Confidence level achieved: ${(result.confidence * 100).toFixed(1)}%\n`

    if (result.errors && result.errors.length > 0)
      message += `Errors encountered:\n${result.errors.map((e) => `  - ${e}`).join('\n')}\n`

    if (result.partialMatches && result.partialMatches.length > 0)
      message += `Partial matches found at paths:\n${result.partialMatches.map((p) => `  - ${this.pathToString(p)}`).join('\n')}\n`

    if (encryptedData.length > 0) {
      const sampleKeys = Object.keys(encryptedData[0]).slice(0, 5)
      message += `Sample encrypted keys: [${sampleKeys.join(', ')}${sampleKeys.length === 5 ? ', ...' : ''}]\n`
    }

    const masterKeys = Object.keys(this.masterFile.keyMappingTemplate).slice(
      0,
      5,
    )
    message += `Expected master keys: [${masterKeys.join(', ')}${masterKeys.length === 5 ? ', ...' : ''}]\n`

    message += '\nConsider:'
    message += '\n- Checking if the master file matches the data structure'
    message += '\n- Using enablePartialMatch: true for partial decoding'
    message += '\n- Regenerating the master file if the data format has changed'

    return message
  }

  /**
   * Generate cache key for performance optimization
   * @param encryptedData - Encrypted data
   * @param options - Decoding options
   * @returns cache key string
   */
  private generateCacheKey(
    encryptedData: JsonObject[],
    options: Required<DecodingOptions>,
  ): string {
    const dataSignature = encryptedData
      .slice(0, 3)
      .map((obj) => {
        const keys = Object.keys(obj).sort()
        const types = keys.map((key) => typeof obj[key])
        return `${keys.join(',')}:${types.join(',')}`
      })
      .join('|')

    const optionsSignature = `${options.matchStrategy}-${String(options.maxDepth)}-${String(options.enablePartialMatch)}`

    return `${dataSignature}::${optionsSignature}`
  }
}
