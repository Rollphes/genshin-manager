import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * Master file configuration error for encrypted key decoding issues
 */
export class MasterFileConfigurationError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GM_DECODE_MASTER_NOT_FOUND

  /**
   * Constructor for MasterFileConfigurationError
   * @param masterFilePath - Path to the master file
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(masterFilePath: string, context?: ErrorContext, cause?: Error) {
    const message = `Failed to load or parse master file: ${masterFilePath}`

    const fileContext = ErrorContextFactory.createFileContext(
      masterFilePath,
      'load master file',
    )

    const mergedContext = ErrorContextFactory.merge(context, fileContext)

    super(message, mergedContext, cause)
  }
}
