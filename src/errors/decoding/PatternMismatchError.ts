import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * Pattern mismatch error for encrypted key decoding
 */
export class PatternMismatchError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GM_DECODE_PATTERN_MISMATCH

  /**
   * Constructor for PatternMismatchError
   * @param sourceFile - Source file being decoded
   * @param confidence - Confidence level achieved
   * @param context - Additional error context
   */
  constructor(sourceFile: string, confidence: number, context?: ErrorContext) {
    const message = `Pattern mismatch in ${sourceFile}. Confidence level: ${(confidence * 100).toFixed(1)}%`

    const decodingContext = ErrorContextFactory.createDecodingContext(
      sourceFile,
      undefined,
      'pattern matching',
    )

    const mergedContext = ErrorContextFactory.merge(context, decodingContext, {
      actualValue: confidence,
      expectedValue: 'confidence > 0.5',
    })

    super(message, mergedContext)
  }
}
