import { AssetCorruptedError } from '@/errors/assets/AssetCorruptedError'
import { AssetDownloadFailedError } from '@/errors/assets/AssetDownloadFailedError'
import { AssetError } from '@/errors/assets/AssetError'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { AudioNotFoundError } from '@/errors/assets/AudioNotFoundError'
import { ImageNotFoundError } from '@/errors/assets/ImageNotFoundError'
import type { ErrorContext } from '@/errors/base/ErrorContext'

/**
 * Factory for creating asset errors
 */
export const AssetErrorFactory = {
  /**
   * Create asset error based on the type of failure.
   * @param assetPath - Path to the asset file.
   * @param assetType - Type of the asset (e.g., 'image', 'audio').
   * @param failureType - Type of failure that occurred.
   * @param details - Additional error details.
   * @param details.downloadUrl - URL from which download was attempted.
   * @param details.statusCode - HTTP status code if applicable.
   * @param details.corruptionDetails - Details about the corruption.
   * @param details.context - Additional error context.
   * @param details.cause - Original error that caused this failure.
   */
  createFromFailure(
    assetPath: string,
    assetType: string,
    failureType: 'not_found' | 'corrupted' | 'download_failed',
    details?: {
      downloadUrl?: string
      statusCode?: number
      corruptionDetails?: string
      context?: ErrorContext
      cause?: Error
    },
  ): AssetError {
    const { downloadUrl, statusCode, corruptionDetails, context, cause } =
      details ?? {}

    switch (failureType) {
      case 'not_found':
        return new AssetNotFoundError(assetPath, assetType, context, cause)
      case 'corrupted':
        return new AssetCorruptedError(
          assetPath,
          assetType,
          corruptionDetails,
          context,
          cause,
        )
      case 'download_failed':
        return new AssetDownloadFailedError(
          assetPath,
          assetType,
          downloadUrl,
          statusCode,
          context,
          cause,
        )
      default:
        return new AssetNotFoundError(assetPath, assetType, context, cause)
    }
  },

  /**
   * Create image-specific error.
   * @param imagePath - Path to the image file.
   * @param failureType - Type of failure that occurred.
   * @param details - Additional error details.
   * @param details.downloadUrl - URL from which download was attempted.
   * @param details.statusCode - HTTP status code if applicable.
   * @param details.corruptionDetails - Details about the corruption.
   * @param details.context - Additional error context.
   * @param details.cause - Original error that caused this failure.
   */
  createImageError(
    imagePath: string,
    failureType: 'not_found' | 'corrupted' | 'download_failed',
    details?: {
      downloadUrl?: string
      statusCode?: number
      corruptionDetails?: string
      context?: ErrorContext
      cause?: Error
    },
  ): AssetError {
    const { context, cause } = details ?? {}

    switch (failureType) {
      case 'not_found':
        return new ImageNotFoundError(imagePath, context, cause)
      case 'corrupted':
        return new AssetCorruptedError(
          imagePath,
          'image',
          details?.corruptionDetails,
          context,
          cause,
        )
      case 'download_failed':
        return new AssetDownloadFailedError(
          imagePath,
          'image',
          details?.downloadUrl,
          details?.statusCode,
          context,
          cause,
        )
      default:
        return new ImageNotFoundError(imagePath, context, cause)
    }
  },

  /**
   * Create audio-specific error.
   * @param audioPath - Path to the audio file.
   * @param failureType - Type of failure that occurred.
   * @param details - Additional error details.
   * @param details.downloadUrl - URL from which download was attempted.
   * @param details.statusCode - HTTP status code if applicable.
   * @param details.corruptionDetails - Details about the corruption.
   * @param details.context - Additional error context.
   * @param details.cause - Original error that caused this failure.
   */
  createAudioError(
    audioPath: string,
    failureType: 'not_found' | 'corrupted' | 'download_failed',
    details?: {
      downloadUrl?: string
      statusCode?: number
      corruptionDetails?: string
      context?: ErrorContext
      cause?: Error
    },
  ): AssetError {
    const { context, cause } = details ?? {}

    switch (failureType) {
      case 'not_found':
        return new AudioNotFoundError(audioPath, context, cause)
      case 'corrupted':
        return new AssetCorruptedError(
          audioPath,
          'audio',
          details?.corruptionDetails,
          context,
          cause,
        )
      case 'download_failed':
        return new AssetDownloadFailedError(
          audioPath,
          'audio',
          details?.downloadUrl,
          details?.statusCode,
          context,
          cause,
        )
      default:
        return new AudioNotFoundError(audioPath, context, cause)
    }
  },
}
