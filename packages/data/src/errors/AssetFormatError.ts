import { ErrorCode, GenshinManagerError } from '@genshin-manager/core'

import type { FileLocation } from '@/paths/FileLocation'

/**
 * Asset format error
 */
export class AssetFormatError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmAssetFormat

  /** Location path string */
  public readonly locationPath: string

  /**
   * Constructor for AssetFormatError
   * @param location - File path FileLocation of the asset
   * @param reason - Description of the format error
   * @param options - Error options
   */
  constructor(
    location: FileLocation,
    public readonly reason: string,
    options?: ErrorOptions,
  ) {
    super(`Invalid asset format: ${reason}`, options)
    this.locationPath = location.resolve()
  }
}
