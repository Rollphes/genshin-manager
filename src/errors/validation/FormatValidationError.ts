import { ValidationError } from '@/errors'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'

/**
 * Format validation error
 */
export class FormatValidationError extends ValidationError {
  public readonly errorCode = GenshinManagerErrorCode.GM_VALIDATION_FORMAT

  /**
   * Constructor for FormatValidationError
   * @param value - The invalid value
   * @param expectedFormat - Description of expected format
   * @param propertyName - Name of the property being validated
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    value: unknown,
    expectedFormat: string,
    propertyName = 'value',
    context?: ErrorContext,
    cause?: Error,
  ) {
    const message = `${propertyName} has invalid format: expected ${expectedFormat}, got ${String(value)}`

    const formatContext = ErrorContextFactory.createValidationContext(
      propertyName,
      expectedFormat,
      value,
    )

    const mergedContext = ErrorContextFactory.merge(context, formatContext)

    super(message, mergedContext, undefined, cause)
  }
}
