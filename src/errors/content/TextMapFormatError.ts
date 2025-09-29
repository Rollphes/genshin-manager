import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * Text map format error
 */
export class TextMapFormatError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GM_CONTENT_TEXT_MAP_FORMAT

  /**
   * Text map key or identifier
   */
  public readonly textMapKey: string

  /**
   * Expected format description
   */
  public readonly expectedFormat: string

  /**
   * Constructor for TextMapFormatError
   * @param textMapKey - Text map key or identifier
   * @param expectedFormat - Expected format description
   * @param actualValue - Actual invalid value
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    textMapKey: string,
    expectedFormat: string,
    actualValue: unknown,
    context?: ErrorContext,
    cause?: Error,
  ) {
    const message = `Invalid text map format for '${textMapKey}': expected ${expectedFormat}, got ${String(actualValue)}`

    const contentContext = ErrorContextFactory.createValidationContext(
      textMapKey,
      expectedFormat,
      actualValue,
    )

    const mergedContext = ErrorContextFactory.merge(context, contentContext, {
      operation: 'parse text map',
    })

    super(message, mergedContext, cause)

    this.textMapKey = textMapKey
    this.expectedFormat = expectedFormat
  }
}
