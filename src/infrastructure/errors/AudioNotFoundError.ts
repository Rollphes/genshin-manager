import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import type { AssetContext } from '@/domain/types/errorContext'
import { AssetError } from '@/infrastructure/errors/AssetError'

/**
 * Audio not found error
 */
export class AudioNotFoundError extends AssetError {
  public readonly errorCode = GenshinManagerErrorCode.GmAssetsAudioNotFound

  /**
   * Constructor for AudioNotFoundError
   * @param audioPath - Audio file path or identifier
   * @param context - Structured asset context
   * @param cause - Original error
   */
  constructor(audioPath: string, context?: AssetContext, cause?: Error) {
    const locationPrefix = AssetError.buildAssetLocationPrefix(context)
    const message = `${locationPrefix}Audio not found: ${audioPath}`

    super(message, audioPath, 'audio', context, cause)
  }
}
