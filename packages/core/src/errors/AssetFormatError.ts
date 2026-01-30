import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import type { LocationPath } from '@/types/LocationLike'
import { locationToString } from '@/types/LocationLike'

/**
 * Asset format error
 */
export class AssetFormatError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmAssetFormat

  /** Location path string (converted from LocationPath) */
  public readonly locationPath: string

  /**
   * Constructor for AssetFormatError
   * @param location - Location or path string of the asset location
   * @param reason - Description of the format error
   * @param options - Error options
   */
  constructor(
    location: LocationPath,
    public readonly reason: string,
    options?: ErrorOptions,
  ) {
    super(`Invalid asset format: ${reason}`, options)
    this.locationPath = locationToString(location)
  }
}
