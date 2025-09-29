import { AssetError } from '@/errors/assets/AssetError'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'

/**
 * Asset download failed error
 */
export class AssetDownloadFailedError extends AssetError {
  public readonly errorCode = GenshinManagerErrorCode.GM_ASSETS_DOWNLOAD_FAILED

  /**
   * Download URL if different from asset path
   */
  public readonly downloadUrl?: string

  /**
   * HTTP status code if available
   */
  public readonly statusCode?: number

  /**
   * Constructor for AssetDownloadFailedError
   * @param assetPath - Asset file path or identifier
   * @param assetType - Type of asset
   * @param downloadUrl - Download URL
   * @param statusCode - HTTP status code
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    assetPath: string,
    assetType: string,
    downloadUrl?: string,
    statusCode?: number,
    context?: ErrorContext,
    cause?: Error,
  ) {
    const urlToShow = downloadUrl ?? assetPath
    const message = `Failed to download ${assetType}: ${urlToShow}${statusCode ? ` (HTTP ${statusCode.toString()})` : ''}`

    const downloadContext = downloadUrl
      ? ErrorContextFactory.createNetworkContext(downloadUrl, 'GET', statusCode)
      : undefined

    const mergedContext = ErrorContextFactory.merge(context, downloadContext)

    super(message, assetPath, assetType, mergedContext, cause)

    this.downloadUrl = downloadUrl
    this.statusCode = statusCode
  }
}
