import type { Language } from '@genshin-manager/core'
import { ErrorCode, GenshinManagerError } from '@genshin-manager/core'

import type { Location } from '@/paths/Location'

/**
 * Text map format error
 */
export class TextMapFormatError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmTextMapFormat

  /** Location path string */
  public readonly locationPath: string

  /**
   * Constructor for TextMapFormatError
   * @param language - Language code
   * @param location - File path Location of the text map file
   * @param reason - Description of the format error
   * @param options - Error options
   */
  constructor(
    public readonly language: Language,
    location: Location,
    public readonly reason: string,
    options?: ErrorOptions,
  ) {
    super(
      `Invalid text map format for language '${language}': ${reason}`,
      options,
    )
    this.locationPath = location.toString()
  }
}
