import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import type { AssetContext } from '@/domain/types/errorContext'
import { AssetError } from '@/infrastructure/errors/AssetError'

/**
 * Asset not found error
 */
export class AssetNotFoundError extends AssetError {
  public readonly errorCode = GenshinManagerErrorCode.GmAssetsNotFound

  /**
   * Constructor for AssetNotFoundError
   * @param assetPath - Asset file path or identifier
   * @param assetType - Type of asset (used for message formatting)
   * @param context - Structured asset context
   * @param cause - Original error
   */
  constructor(
    assetPath: string,
    assetType = 'asset',
    context?: AssetContext,
    cause?: Error,
  ) {
    const locationPrefix = AssetError.buildAssetLocationPrefix(context)
    const typeName = assetType.charAt(0).toUpperCase() + assetType.slice(1)
    const message = `${locationPrefix}${typeName} not found: ${assetPath}`

    super(message, assetPath, assetType, context, cause)
  }
}
