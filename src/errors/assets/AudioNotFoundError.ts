import { AssetError } from '@/errors'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'

/**
 * Audio not found error
 */
export class AudioNotFoundError extends AssetError {
  public readonly errorCode = GenshinManagerErrorCode.GM_ASSETS_AUDIO_NOT_FOUND

  /**
   * Constructor for AudioNotFoundError
   * @param audioPath - Audio file path or identifier
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(audioPath: string, context?: ErrorContext, cause?: Error) {
    const message = `Audio not found: ${audioPath}`

    super(message, audioPath, 'audio', context, cause)
  }
}
