import { ErrorCode, GenshinManagerError } from '@genshin-manager/core'

import type { FileLocation } from '@/paths/FileLocation'

/**
 * Asset not found error
 */
export class AssetNotFoundError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmAssetNotFound

  /** Location path string */
  public readonly locationPath: string

  /**
   * Constructor for AssetNotFoundError
   * @param location - File path FileLocation of the asset
   * @param options - Error options
   */
  constructor(location: FileLocation, options?: ErrorOptions) {
    super('Asset not found', options)
    this.locationPath = location.resolve()
  }
}
