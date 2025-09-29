import { AssetError } from '@/errors'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'

/**
 * Asset corrupted error
 */
export class AssetCorruptedError extends AssetError {
  public readonly errorCode = GenshinManagerErrorCode.GM_ASSETS_CORRUPTED

  /**
   * Details about the corruption
   */
  public readonly corruptionDetails?: string

  /**
   * Constructor for AssetCorruptedError
   * @param assetPath - Asset file path or identifier
   * @param assetType - Type of asset
   * @param corruptionDetails - Details about the corruption
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    assetPath: string,
    assetType: string,
    corruptionDetails?: string,
    context?: ErrorContext,
    cause?: Error,
  ) {
    const message = `${assetType.charAt(0).toUpperCase() + assetType.slice(1)} is corrupted: ${assetPath}${corruptionDetails ? ` (${corruptionDetails})` : ''}`

    super(message, assetPath, assetType, context, cause)

    this.corruptionDetails = corruptionDetails
  }
}
