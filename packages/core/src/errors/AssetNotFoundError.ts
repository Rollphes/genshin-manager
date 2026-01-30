import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import type { LocationPath } from '@/types/LocationLike'
import { locationToString } from '@/types/LocationLike'

/**
 * Asset not found error
 */
export class AssetNotFoundError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmAssetNotFound

  /** Location path string (converted from LocationPath) */
  public readonly locationPath: string

  /**
   * Constructor for AssetNotFoundError
   * @param location - Location or path string of the asset location
   * @param options - Error options
   */
  constructor(location: LocationPath, options?: ErrorOptions) {
    super('Asset not found', options)
    this.locationPath = locationToString(location)
  }
}
