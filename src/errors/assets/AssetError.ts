import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * Base asset error class
 */
export abstract class AssetError extends GenshinManagerError {
  /**
   * Asset file path or identifier
   */
  public readonly assetPath: string

  /**
   * Asset type (image, audio, etc.)
   */
  public readonly assetType: string

  /**
   * Constructor for AssetError
   * @param message - Error message
   * @param assetPath - Asset file path or identifier
   * @param assetType - Type of asset
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    message: string,
    assetPath: string,
    assetType: string,
    context?: ErrorContext,
    cause?: Error,
  ) {
    const assetContext = ErrorContextFactory.createAssetContext(
      assetPath,
      assetType === 'image' ? assetPath : undefined,
      assetType === 'audio' ? assetPath : undefined,
      `load ${assetType}`,
    )

    const mergedContext = ErrorContextFactory.merge(context, assetContext)

    super(message, mergedContext, cause)

    this.assetPath = assetPath
    this.assetType = assetType
  }
}
