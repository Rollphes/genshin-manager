import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { ValidationError } from '@/errors/validation/ValidationError'

/**
 * Enum validation error
 */
export class EnumValidationError extends ValidationError {
  public readonly errorCode = GenshinManagerErrorCode.GM_VALIDATION_ENUM

  /**
   * Constructor for EnumValidationError
   * @param value - The invalid value
   * @param allowedValues - Array of allowed values
   * @param propertyName - Name of the property being validated
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    value: unknown,
    allowedValues: unknown[],
    propertyName = 'value',
    context?: ErrorContext,
    cause?: Error,
  ) {
    const allowedStr = allowedValues.map(String).join(', ')
    const contextPrefix = context?.propertyKey
      ? `[${context.propertyKey}] `
      : ''
    const message = `${contextPrefix}${propertyName} must be one of: ${allowedStr}, got ${String(value)}`

    const enumContext = ErrorContextFactory.createValidationContext(
      propertyName,
      `one of: ${allowedStr}`,
      value,
    )

    const mergedContext = ErrorContextFactory.merge(context, enumContext)

    super(message, mergedContext, undefined, cause)
  }
}
