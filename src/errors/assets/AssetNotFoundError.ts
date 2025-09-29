import { AssetError } from '@/errors'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'

/**
 * Asset not found error
 */
export class AssetNotFoundError extends AssetError {
  public readonly errorCode = GenshinManagerErrorCode.GM_ASSETS_NOT_FOUND

  /**
   * Constructor for AssetNotFoundError
   * @param assetPath - Asset file path or identifier
   * @param assetType - Type of asset
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    assetPath: string,
    assetType = 'asset',
    context?: ErrorContext,
    cause?: Error,
  ) {
    const message = `${assetType.charAt(0).toUpperCase() + assetType.slice(1)} not found: ${assetPath}`

    super(message, assetPath, assetType, context, cause)
  }
}
