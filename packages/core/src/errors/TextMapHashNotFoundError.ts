import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import type { Language } from '@/types'
import type { LocationPath } from '@/types/LocationLike'
import { locationToString } from '@/types/LocationLike'

/**
 * Text map hash not found error
 */
export class TextMapHashNotFoundError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmTextMapHashNotFound

  /** Text map path string (converted from LocationPath) */
  public readonly textMapPath: string

  /** ExcelBin path string (converted from LocationPath) */
  public readonly excelBinPath: string

  /**
   * Constructor for TextMapHashNotFoundError
   * @param language - Language code
   * @param textMapLocation - Location or path string of the text map file
   * @param excelBinLocation - Location or path string of the ExcelBinOutput file that references this hash
   * @param hash - Missing hash value
   * @param options - Error options
   */
  constructor(
    public readonly language: Language,
    textMapLocation: LocationPath,
    excelBinLocation: LocationPath,
    public readonly hash: string,
    options?: ErrorOptions,
  ) {
    const textMapPathStr = locationToString(textMapLocation)
    const excelBinPathStr = locationToString(excelBinLocation)
    const message = `Text map hash '${hash}' not found in '${textMapPathStr}' for language '${language}'. Referenced from: ${excelBinPathStr}`

    super(message, options)
    this.textMapPath = textMapPathStr
    this.excelBinPath = excelBinPathStr
  }
}
