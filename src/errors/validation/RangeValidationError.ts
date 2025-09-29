import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { ValidationError } from '@/errors/validation/ValidationError'

/**
 * Range validation error for numeric value validation
 */
export class RangeValidationError extends ValidationError {
  public readonly errorCode = GenshinManagerErrorCode.GM_VALIDATION_RANGE

  /**
   * Constructor for RangeValidationError
   * @param value - The value that was out of range
   * @param min - Minimum allowed value
   * @param max - Maximum allowed value
   * @param propertyName - Name of the property being validated
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    value: number,
    min: number,
    max: number,
    propertyName = 'value',
    context?: ErrorContext,
    cause?: Error,
  ) {
    const message = `${propertyName} must be between ${min.toString()} and ${max.toString()}, got ${value.toString()}`

    const rangeContext = ErrorContextFactory.createValidationContext(
      propertyName,
      `${min.toString()}-${max.toString()}`,
      value,
    )

    const mergedContext = ErrorContextFactory.merge(context, rangeContext)

    super(message, mergedContext, undefined, cause)
  }
}
