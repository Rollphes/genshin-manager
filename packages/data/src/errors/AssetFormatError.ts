import { ErrorCode, GenshinManagerError } from '@genshin-manager/core'

import type { Location } from '@/paths/Location'

/**
 * Asset format error
 */
export class AssetFormatError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmAssetFormat

  /** Location path string */
  public readonly locationPath: string

  /**
   * Constructor for AssetFormatError
   * @param location - File path Location of the asset
   * @param reason - Description of the format error
   * @param options - Error options
   */
  constructor(
    location: Location,
    public readonly reason: string,
    options?: ErrorOptions,
  ) {
    super(`Invalid asset format: ${reason}`, options)
    this.locationPath = location.toString()
  }
}
