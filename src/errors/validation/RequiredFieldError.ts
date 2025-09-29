import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { ValidationError } from '@/errors/validation/ValidationError'

/**
 * Required field validation error
 */
export class RequiredFieldError extends ValidationError {
  public readonly errorCode = GenshinManagerErrorCode.GM_VALIDATION_REQUIRED

  /**
   * Constructor for RequiredFieldError
   * @param fieldName - Name of the required field
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(fieldName: string, context?: ErrorContext, cause?: Error) {
    const message = `Required field '${fieldName}' is missing`

    const fieldContext = ErrorContextFactory.createValidationContext(
      fieldName,
      'non-null value',
      undefined,
    )

    const mergedContext = ErrorContextFactory.merge(context, fieldContext)

    super(message, mergedContext, undefined, cause)
  }
}
