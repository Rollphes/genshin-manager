import type {
  DecodingOptions,
  DecodingResult,
  EncryptedKeyMasterFile,
  JsonObject,
  RecursivePattern,
  RequiredDecodingOptions,
} from '@genshin-manager/crypto'
import {
  decodePropertyNames,
  findBestKeyMapping,
  PatternCompiler,
} from '@genshin-manager/crypto'
import fs from 'fs'

import { AssetFormatError } from '@/errors/AssetFormatError'
import { AssetNotFoundError } from '@/errors/AssetNotFoundError'
import { Location } from '@/paths/Location'
import type { ExcelBinOutputs } from '@/types/excelBinOutputs'
import type { DecodedType as GeneratedDecodedType } from '@/types/generated/MasterFileMap'

/**
 * Encrypted key decoder with recursive support
 * Orchestrates pattern compilation, matching, and decoding application
 */
export class EncryptedKeyDecoder<T extends keyof typeof ExcelBinOutputs> {
  private readonly masterFile: EncryptedKeyMasterFile
  private readonly matchResultCache = new Map<string, DecodingResult>()
  private readonly compiledPatterns = new Map<string, RecursivePattern>()

  private readonly patternCompiler = new PatternCompiler()

  /**
   * Constructor for EncryptedKeyDecoder
   * @param fileName - ExcelBinOutput file name.
   * @throws {@link AssetNotFoundError} - When master file is not found.
   * @throws {@link AssetFormatError} - When master file is malformed.
   */
  constructor(fileName: T) {
    const masterFileName = `${fileName}.master.json`
    const masterLocation = Location.masterFile(masterFileName)
    try {
      const masterFilePath = masterLocation.resolve()
      if (!fs.existsSync(masterFilePath))
        throw new AssetNotFoundError(masterLocation)

      const masterContent = fs.readFileSync(masterFilePath, 'utf-8')
      this.masterFile = JSON.parse(masterContent) as EncryptedKeyMasterFile
      this.precompilePatterns()
    } catch (error) {
      if (error instanceof AssetNotFoundError) throw error
      if (error instanceof SyntaxError) {
        throw new AssetFormatError(
          masterLocation,
          `Failed to parse JSON: ${error.message}`,
          { cause: error },
        )
      }
      if (error instanceof Error && 'code' in error)
        throw new AssetNotFoundError(masterLocation, { cause: error })

      throw error
    }
  }

  /**
   * Process encrypted object array and decode keys recursively.
   * @param encryptedData - Encrypted object array.
   * @param options - Decoding options.
   * @returns Decoded object array with proper typing.
   * @throws {@link AssetFormatError} - When primary pattern is not found or encrypted data is empty.
   */
  public execute(
    encryptedData: readonly JsonObject[],
    options: DecodingOptions = {},
  ): GeneratedDecodedType<T> {
    if (encryptedData.length === 0) {
      throw new AssetFormatError(
        Location.masterFile(this.masterFile.metadata.sourceFile),
        'Encrypted data array is empty',
      )
    }

    const defaultOptions: RequiredDecodingOptions = {
      matchStrategy: 'subset',
      maxDepth: 10,
      enablePartialMatch: true,
      ...options,
    }

    const cacheKey = this.generateCacheKey(encryptedData, defaultOptions)

    const cachedResult = this.matchResultCache.get(cacheKey)
    if (cachedResult) {
      return encryptedData.map(
        (obj) => decodePropertyNames(obj, cachedResult.keyMappings) as never,
      )
    }

    const primaryPattern = this.compiledPatterns.get('primary')
    if (!primaryPattern) {
      throw new AssetFormatError(
        Location.masterFile(this.masterFile.metadata.sourceFile),
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
      throw new AssetFormatError(
        Location.masterFile(this.masterFile.metadata.sourceFile),
        errorMessage,
      )
    }

    return encryptedData.map(
      (obj) => decodePropertyNames(obj, bestResult.keyMappings) as never,
    )
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
      for (const [
        index,
        altPattern,
      ] of this.masterFile.alternativePatterns.entries()) {
        const compiledAlt = this.patternCompiler.compile(altPattern)
        this.compiledPatterns.set(`alternative_${String(index)}`, compiledAlt)
      }
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
        .map((p) => p.join('.'))
        .map((s) => `  - ${s}`)
        .join('\n')}\n`
    }

    const sampleKeys = Object.keys(encryptedData[0]).slice(0, 5)
    message += `Sample encrypted keys: [${sampleKeys.join(', ')}${sampleKeys.length === 5 ? ', ...' : ''}]\n`

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
   * @param encryptedData - Encrypted data (must be non-empty, validated by execute)
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
