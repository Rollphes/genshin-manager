import type { Language } from '@genshin-manager/core'
import { ErrorCode, GenshinManagerError } from '@genshin-manager/core'
import type { Location } from '@genshin-manager/query'

/**
 * Text map hash not found error
 */
export class TextMapHashNotFoundError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmTextMapHashNotFound

  /** Text map path string */
  public readonly textMapPath: string

  /** ExcelBin path string */
  public readonly excelBinPath: string

  /**
   * Constructor for TextMapHashNotFoundError
   * @param language - Language code
   * @param textMapLocation - Query Location of the text map file
   * @param excelBinLocation - Query Location of the ExcelBinOutput file that references this hash
   * @param hash - Missing hash value
   * @param options - Error options
   */
  constructor(
    public readonly language: Language,
    textMapLocation: Location,
    excelBinLocation: Location,
    public readonly hash: string,
    options?: ErrorOptions,
  ) {
    const textMapPathStr = textMapLocation.toString()
    const excelBinPathStr = excelBinLocation.toString()
    const message = `Text map hash '${hash}' not found in '${textMapPathStr}' for language '${language}'. Referenced from: ${excelBinPathStr}`

    super(message, options)
    this.textMapPath = textMapPathStr
    this.excelBinPath = excelBinPathStr
  }
}
