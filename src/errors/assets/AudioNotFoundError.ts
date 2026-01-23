import { AssetError } from '@/errors/assets/AssetError'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { AssetContext } from '@/types/errorContext'

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
