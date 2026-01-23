import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import { ErrorContextFactory } from '@/domain/errors/base/ErrorContext'
import { ValidationError } from '@/domain/errors/validation/ValidationError'
import type { ValidationContext } from '@/domain/types/errorContext'

/**
 * Context for RequiredFieldError (fieldName is provided separately)
 */
type RequiredFieldContext = Omit<ValidationContext, 'propertyKey'>

/**
 * Required field validation error
 */
export class RequiredFieldError extends ValidationError {
  public readonly errorCode = GenshinManagerErrorCode.GmValidationRequired

  /**
   * Constructor for RequiredFieldError
   * @param fieldName - Name of the required field
   * @param context - Structured validation context (without propertyKey)
   * @param cause - Original error
   */
  constructor(
    fieldName: string,
    context?: RequiredFieldContext,
    cause?: Error,
  ) {
    const locationPrefix =
      RequiredFieldError.buildRequiredLocationPrefix(context)
    const message = `${locationPrefix}Required field '${fieldName}' is missing`

    const fieldContext = ErrorContextFactory.createValidationContext(
      fieldName,
      'non-null value',
      undefined,
    )

    // Add source information to context metadata
    const mergedContext = context?.source
      ? {
          ...fieldContext,
          metadata: {
            source: context.source,
            recordId: context.recordId,
          },
        }
      : fieldContext

    super(message, mergedContext, undefined, cause)

    // Store context info
    Object.assign(this, {
      propertyKey: fieldName,
      source: context?.source,
      recordId: context?.recordId,
    })
  }

  /**
   * Build location prefix from context
   * @param context - Validation context
   * @returns Location prefix string
   */
  private static buildRequiredLocationPrefix(
    context?: RequiredFieldContext,
  ): string {
    if (!context?.source) return ''

    let prefix = context.source
    if (context.recordId !== undefined) prefix += `#${String(context.recordId)}`

    return `[${prefix}] `
  }
}
