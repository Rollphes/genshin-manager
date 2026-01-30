import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import type { Language } from '@/types'
import type { LocationPath } from '@/types/LocationLike'
import { locationToString } from '@/types/LocationLike'

/**
 * Text map format error
 */
export class TextMapFormatError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmTextMapFormat

  /** Location path string (converted from LocationPath) */
  public readonly locationPath: string

  /**
   * Constructor for TextMapFormatError
   * @param language - Language code
   * @param location - Location or path string of the text map file
   * @param reason - Description of the format error
   * @param options - Error options
   */
  constructor(
    public readonly language: Language,
    location: LocationPath,
    public readonly reason: string,
    options?: ErrorOptions,
  ) {
    super(
      `Invalid text map format for language '${language}': ${reason}`,
      options,
    )
    this.locationPath = locationToString(location)
  }
}
