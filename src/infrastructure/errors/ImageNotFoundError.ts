import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import type { AssetContext } from '@/domain/types/errorContext'
import { AssetError } from '@/infrastructure/errors/AssetError'

/**
 * Image not found error
 */
export class ImageNotFoundError extends AssetError {
  public readonly errorCode = GenshinManagerErrorCode.GmAssetsImageNotFound

  /**
   * Constructor for ImageNotFoundError
   * @param imagePath - Image file path or identifier
   * @param context - Structured asset context
   * @param cause - Original error
   */
  constructor(imagePath: string, context?: AssetContext, cause?: Error) {
    const locationPrefix = AssetError.buildAssetLocationPrefix(context)
    const message = `${locationPrefix}Image not found: ${imagePath}`

    super(message, imagePath, 'image', context, cause)
  }
}
