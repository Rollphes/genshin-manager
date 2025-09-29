import {
  AssetCorruptedError,
  AssetDownloadFailedError,
  AssetError,
  AssetNotFoundError,
  AudioNotFoundError,
  ImageNotFoundError,
} from '@/errors'
import type { ErrorContext } from '@/errors/base/ErrorContext'

/**
 * Factory for creating asset errors
 */
export const AssetErrorFactory = {
  /**
   * Create asset error based on the type of failure
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
   * Create image-specific error
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
   * Create audio-specific error
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
