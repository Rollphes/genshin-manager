import fs from 'fs'
import path from 'path'

import { applyDecoding } from '@/domain/crypto/applyDecoding'
import { pathToString } from '@/domain/crypto/pathToString'
import { PatternCompiler } from '@/domain/crypto/PatternCompiler'
import { findBestKeyMapping } from '@/domain/crypto/PatternMatcher'
import type {
  DecodingOptions,
  DecodingResult,
  RecursivePattern,
  RequiredDecodingOptions,
} from '@/domain/crypto/types'
import { ValidationError } from '@/domain/errors/validation/ValidationError'
import type { JsonObject } from '@/domain/types/json'
import { AssetCorruptedError } from '@/infrastructure/errors/AssetCorruptedError'
import { ConfigMissingError } from '@/infrastructure/errors/ConfigMissingError'
import { masterFileFolderPath } from '@/infrastructure/paths'
import { EncryptedKeyMasterFile } from '@/infrastructure/types/crypto'
import { ExcelBinOutputs } from '@/infrastructure/types/excelBinOutputs'
import type { DecodedType as GeneratedDecodedType } from '@/infrastructure/types/generated/MasterFileMap'

/**
 * Enhanced encrypted key decoder with recursive support
 * Orchestrates pattern compilation, matching, and decoding application
 * @template T - ExcelBinOutput file name type
 */
export class EncryptedKeyDecoder<T extends keyof typeof ExcelBinOutputs> {
  private readonly masterFile: EncryptedKeyMasterFile
  private readonly matchResultCache = new Map<string, DecodingResult>()
  private readonly compiledPatterns = new Map<string, RecursivePattern>()

  private readonly patternCompiler = new PatternCompiler()

  /**
   * Constructor.
   * @param fileName - ExcelBinOutput file name.
   * @throws {@link ConfigMissingError} - When master file path is missing.
   * @throws {@link AssetCorruptedError} - When master file fails to load or parse.
   */
  constructor(fileName: T) {
    try {
      const masterFilePath = path.join(
        masterFileFolderPath,
        `${fileName}.master.json`,
      )
      if (!fs.existsSync(masterFilePath))
        throw new ConfigMissingError('masterFilePath', masterFilePath)
      const masterContent = fs.readFileSync(masterFilePath, 'utf-8')
      this.masterFile = JSON.parse(masterContent) as EncryptedKeyMasterFile
      this.precompilePatterns()
    } catch (error) {
      if (error instanceof ConfigMissingError) throw error
      throw new AssetCorruptedError(
        `${fileName}.master.json`,
        `Failed to load or parse: ${String(error)}`,
      )
    }
  }

  /**
   * Process encrypted object array and decode keys recursively.
   * @param encryptedData - Encrypted object array.
   * @param options - Decoding options.
   * @returns Decoded object array with proper typing.
   * @throws {@link AssetCorruptedError} - When primary pattern is not found.
   */
  public execute(
    encryptedData: readonly JsonObject[],
    options: DecodingOptions = {},
  ): GeneratedDecodedType<T> {
    const defaultOptions: RequiredDecodingOptions = {
      matchStrategy: 'subset',
      maxDepth: 10,
      enablePartialMatch: true,
      ...options,
    }

    const cacheKey = this.generateCacheKey(encryptedData, defaultOptions)

    if (this.matchResultCache.has(cacheKey)) {
      const cachedResult = this.matchResultCache.get(cacheKey)
      if (cachedResult) {
        // Cast is safe: applyDecoding transforms to match MasterFileMap structure
        return encryptedData.map((obj) =>
          applyDecoding(obj, cachedResult.keyMappings),
        ) as unknown as GeneratedDecodedType<T>
      }
    }

    const primaryPattern = this.compiledPatterns.get('primary')
    if (!primaryPattern) {
      throw new AssetCorruptedError(
        'compiledPatterns',
        'Primary pattern not found in compiled patterns',
      )
    }

    let bestResult = findBestKeyMapping(
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
        const altResult = findBestKeyMapping(
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
      throw new ValidationError('Encrypted data validation failed', {
        propertyKey: 'encryptedData',
        actualValue: errorMessage,
      })
    }

    // Cast is safe: applyDecoding transforms to match MasterFileMap structure
    return encryptedData.map((obj) =>
      applyDecoding(obj, bestResult.keyMappings),
    ) as unknown as GeneratedDecodedType<T>
  }

  /**
   * Pre-compile patterns for performance optimization
   */
  private precompilePatterns(): void {
    const primaryPattern = this.patternCompiler.compile(
      this.masterFile.keyMappingTemplate,
    )
    this.compiledPatterns.set('primary', primaryPattern)

    if (this.masterFile.alternativePatterns) {
      this.masterFile.alternativePatterns.forEach((altPattern, index) => {
        const compiledAlt = this.patternCompiler.compile(altPattern)
        this.compiledPatterns.set(`alternative_${String(index)}`, compiledAlt)
      })
    }
  }

  /**
   * Generate detailed error message with debugging information
   * @param result - Failed decoding result
   * @param encryptedData - Original encrypted data
   * @returns detailed error message
   */
  private generateDetailedError(
    result: DecodingResult,
    encryptedData: readonly JsonObject[],
  ): string {
    const sourceFile = this.masterFile.metadata.sourceFile
    let message = `Could not determine key mapping for ${sourceFile}.\n`

    message += `Confidence level achieved: ${(result.confidence * 100).toFixed(1)}%\n`

    if (result.errors && result.errors.length > 0)
      message += `Errors encountered:\n${result.errors.map((e) => `  - ${e}`).join('\n')}\n`

    if (result.partialMatches && result.partialMatches.length > 0) {
      message += `Partial matches found at paths:\n${result.partialMatches
        .map((p) => pathToString(p))
        .map((s) => `  - ${s}`)
        .join('\n')}\n`
    }

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
    encryptedData: readonly JsonObject[],
    options: RequiredDecodingOptions,
  ): string {
    const keys = Object.keys(encryptedData[0]).sort()
    const dataSignature = keys.join(',')

    const optionsSignature = `${options.matchStrategy}-${String(options.maxDepth)}-${String(options.enablePartialMatch)}`

    return `${dataSignature}::${optionsSignature}`
  }
}
