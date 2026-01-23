import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import { ErrorContextFactory } from '@/domain/errors/base/ErrorContext'
import { ValidationError } from '@/domain/errors/validation/ValidationError'
import type { ValidationContext } from '@/domain/types/errorContext'

/**
 * Context for FormatValidationError (fieldName is provided separately)
 */
type FormatValidationContext = Omit<ValidationContext, 'propertyKey'>

/**
 * Format validation error
 */
export class FormatValidationError extends ValidationError {
  public readonly errorCode = GenshinManagerErrorCode.GmValidationFormat

  /**
   * Constructor for FormatValidationError
   * @param fieldName - Name of the field being validated
   * @param expectedFormat - Description of expected format
   * @param actualValue - The invalid value
   * @param context - Structured validation context (without propertyKey)
   * @param cause - Original error
   */
  constructor(
    fieldName: string,
    expectedFormat: string,
    actualValue: unknown,
    context?: FormatValidationContext,
    cause?: Error,
  ) {
    const locationPrefix =
      FormatValidationError.buildFormatLocationPrefix(context)
    const message = `${locationPrefix}${fieldName} has invalid format: expected ${expectedFormat}, got ${String(actualValue)}`

    const formatContext = ErrorContextFactory.createValidationContext(
      fieldName,
      expectedFormat,
      actualValue,
    )

    // Add source information to context metadata
    const mergedContext = context?.source
      ? {
          ...formatContext,
          metadata: {
            source: context.source,
            recordId: context.recordId,
          },
        }
      : formatContext

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
  private static buildFormatLocationPrefix(
    context?: FormatValidationContext,
  ): string {
    if (!context?.source) return ''

    let prefix = context.source
    if (context.recordId !== undefined) prefix += `#${String(context.recordId)}`

    return `[${prefix}] `
  }
}
