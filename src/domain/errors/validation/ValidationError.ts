import { z } from 'zod'

import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import type { ErrorContext } from '@/domain/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/domain/errors/base/ErrorContext'
import { GenshinManagerError } from '@/domain/errors/base/GenshinManagerError'
import type { ValidationContext } from '@/domain/types/errorContext'
import type { ValidationDetail } from '@/domain/types/types'

/**
 * Validation error for Zod schema validation failures
 */
export class ValidationError extends GenshinManagerError {
  public readonly errorCode: GenshinManagerErrorCode =
    GenshinManagerErrorCode.GmValidationType

  /**
   * Zod validation issues for detailed error information
   */
  public readonly zodIssues?: z.ZodIssue[]

  /**
   * Property key being validated
   */
  public readonly propertyKey?: string

  /**
   * Data source where the validation occurs
   */
  public readonly source?: string

  /**
   * Record ID within the data source
   */
  public readonly recordId?: string | number

  /**
   * Constructor for ValidationError
   * @param message - Human-readable error message
   * @param context - Error context
   * @param zodIssues - Zod validation issues
   * @param cause - Original error
   */
  constructor(
    message: string,
    context?: ErrorContext,
    zodIssues?: z.ZodIssue[],
    cause?: Error,
  ) {
    super(message, context, cause)
    this.zodIssues = zodIssues
    this.propertyKey = context?.propertyKey
  }

  /**
   * Create ValidationError from Zod error.
   * @param zodError - Zod validation error.
   * @param validationContext - Structured validation context.
   */
  public static fromZodError(
    zodError: z.ZodError,
    validationContext?: ValidationContext,
  ): ValidationError {
    const issues = zodError.issues
    const firstIssue = issues[0]

    const locationPrefix =
      ValidationError.buildLocationPrefix(validationContext)
    const pathStr = firstIssue.path.join('.')
    const path =
      pathStr.length > 0
        ? pathStr
        : (validationContext?.propertyKey ?? 'unknown')
    const message = `${locationPrefix}Validation failed at ${path}: ${firstIssue.message}`

    const errorContext = ErrorContextFactory.createValidationContext(
      path,
      'valid format',
      'received' in firstIssue ? firstIssue.received : undefined,
    )

    // Add source information to context metadata
    const mergedContext = validationContext?.source
      ? {
          ...errorContext,
          metadata: {
            source: validationContext.source,
            recordId: validationContext.recordId,
          },
        }
      : errorContext

    const error = new ValidationError(message, mergedContext, issues, zodError)

    // Store validation context info
    Object.assign(error, {
      propertyKey: validationContext?.propertyKey,
      source: validationContext?.source,
      recordId: validationContext?.recordId,
    })

    return error
  }

  /**
   * Build location prefix from ValidationContext
   * @param context - Validation context
   * @returns Location prefix string
   */
  private static buildLocationPrefix(context?: ValidationContext): string {
    if (!context?.source) return ''

    const parts: string[] = [context.source]

    if (context.recordId !== undefined)
      parts[0] += `#${String(context.recordId)}`

    return `[${parts.join('.')}] `
  }

  /**
   * Get detailed validation error information
   */
  public getValidationDetails(): ValidationDetail[] {
    if (!this.zodIssues) return []

    return this.zodIssues.map((issue) => ({
      path: issue.path.join('.') || 'root',
      issue: issue.message,
      expected: 'expected' in issue ? issue.expected : undefined,
      received: 'received' in issue ? issue.received : undefined,
    }))
  }

  /**
   * Get formatted error message with all validation issues
   */
  public getFormattedMessage(): string {
    if (!this.zodIssues || this.zodIssues.length === 0) return this.message

    const details = this.getValidationDetails()
    if (details.length === 1) return this.message

    const additionalIssues = details
      .slice(1)
      .map((detail) => `  - ${detail.path}: ${detail.issue}`)
      .join('\n')

    return `${this.message}\nAdditional issues:\n${additionalIssues}`
  }
}
