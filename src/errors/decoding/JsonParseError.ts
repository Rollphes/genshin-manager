import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * JSON parse error for debugging which JSON file caused test failures
 */
export class JsonParseError extends GenshinManagerError {
  public readonly errorCode =
    GenshinManagerErrorCode.GM_DECODE_JSON_PARSE_FAILED

  /**
   * Name of the JSON file (e.g., "AvatarExcelConfigData")
   */
  public readonly jsonFileName: string

  /**
   * Path to the master file
   */
  public readonly masterFilePath: string

  /**
   * Path to the cache file
   */
  public readonly cacheFilePath: string

  /**
   * Constructor for JsonParseError
   * @param message - Error message
   * @param jsonFileName - Name of the JSON file (without extension)
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    message: string,
    jsonFileName: string,
    context?: ErrorContext,
    cause?: Error,
  ) {
    const masterFilePath = `masterFiles/${jsonFileName}.master.json`
    const cacheFilePath = `cache/ExcelBinOutput/${jsonFileName}.json`

    const fileContext = ErrorContextFactory.createFileContext(
      cacheFilePath,
      'parse JSON data',
    )

    const mergedContext = ErrorContextFactory.merge(context, fileContext, {
      jsonFile: jsonFileName,
      metadata: {
        masterFilePath,
        cacheFilePath,
        jsonFileName,
      },
    })

    super(message, mergedContext, cause)

    this.jsonFileName = jsonFileName
    this.masterFilePath = masterFilePath
    this.cacheFilePath = cacheFilePath
  }

  /**
   * Create a JsonParseError from an unknown error with JSON file context
   * @param error - The original error
   * @param jsonFileName - Name of the JSON file
   * @param context - Additional context
   */
  public static fromError(
    error: unknown,
    jsonFileName: string,
    context?: ErrorContext,
  ): JsonParseError {
    const message =
      error instanceof Error ? error.message : 'Unknown JSON parse error'
    const cause = error instanceof Error ? error : undefined

    return new JsonParseError(message, jsonFileName, context, cause)
  }

  /**
   * Get related file paths for debugging
   */
  public getRelatedFiles(): {
    jsonFileName: string
    masterFilePath: string
    cacheFilePath: string
  } {
    return {
      jsonFileName: this.jsonFileName,
      masterFilePath: this.masterFilePath,
      cacheFilePath: this.cacheFilePath,
    }
  }

  /**
   * Get troubleshooting suggestions for this error
   */
  public getTroubleshootingSuggestions(): string[] {
    return [
      `1. Check if ${this.masterFilePath} exists and is valid JSON`,
      `2. Verify ${this.cacheFilePath} structure matches the master file`,
      `3. Run: npx tsx scripts/generate-structural-master.ts -t ${this.jsonFileName}`,
      `4. Compare with a known working version of the master file`,
      `5. Check if the game version update changed the data structure`,
    ]
  }

  /**
   * Get a formatted debug message with file information
   */
  public override getDetailedMessage(): string {
    const baseMessage = super.getDetailedMessage()

    return `${baseMessage}

Related Files:
  - JSON Name: ${this.jsonFileName}
  - Master File: ${this.masterFilePath}
  - Cache File: ${this.cacheFilePath}

Debug Steps:
${this.getTroubleshootingSuggestions().join('\n')}`
  }
}
