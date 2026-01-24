import { AssetError } from '@/adapter/input/errors/AssetError'
import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import type { AssetContext } from '@/domain/types/errorContext'

/**
 * Asset corrupted error
 */
export class AssetCorruptedError extends AssetError {
  public readonly errorCode = GenshinManagerErrorCode.GmAssetsCorrupted

  /**
   * Details about the corruption
   */
  public readonly corruptionDetails?: string

  /**
   * Constructor for AssetCorruptedError
   * @param assetPath - Asset file path or identifier
   * @param corruptionDetails - Details about the corruption
   * @param context - Structured asset context
   * @param cause - Original error
   */
  constructor(
    assetPath: string,
    corruptionDetails?: string,
    context?: AssetContext,
    cause?: Error,
  ) {
    const locationPrefix = AssetError.buildAssetLocationPrefix(context)
    const detailsSuffix = corruptionDetails ? ` (${corruptionDetails})` : ''
    const message = `${locationPrefix}Asset is corrupted: ${assetPath}${detailsSuffix}`

    super(message, assetPath, 'corrupted', context, cause)

    this.corruptionDetails = corruptionDetails
  }
}
