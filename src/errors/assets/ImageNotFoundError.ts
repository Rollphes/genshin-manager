import { AssetError } from '@/errors/assets/AssetError'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'

/**
 * Image not found error
 */
export class ImageNotFoundError extends AssetError {
  public readonly errorCode = GenshinManagerErrorCode.GM_ASSETS_IMAGE_NOT_FOUND

  /**
   * Constructor for ImageNotFoundError
   * @param imagePath - Image file path or identifier
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(imagePath: string, context?: ErrorContext, cause?: Error) {
    const message = `Image not found: ${imagePath}`

    super(message, imagePath, 'image', context, cause)
  }
}
