import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * Low confidence error for encrypted key decoding
 */
export class LowConfidenceError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GM_DECODE_LOW_CONFIDENCE

  /**
   * Constructor for LowConfidenceError
   * @param sourceFile - Source file being decoded
   * @param confidence - Confidence level achieved
   * @param threshold - Minimum required confidence
   * @param context - Additional error context
   */
  constructor(
    sourceFile: string,
    confidence: number,
    threshold = 0.8,
    context?: ErrorContext,
  ) {
    const message = `Low confidence decoding for ${sourceFile}. Got ${(confidence * 100).toFixed(1)}%, required ${(threshold * 100).toFixed(1)}%`

    const decodingContext = ErrorContextFactory.createDecodingContext(
      sourceFile,
      undefined,
      'confidence check',
    )

    const mergedContext = ErrorContextFactory.merge(context, decodingContext, {
      actualValue: confidence,
      expectedValue: threshold,
    })

    super(message, mergedContext)
  }
}
