import { z } from 'zod'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * Validation error for Zod schema validation failures
 */
export class ValidationError extends GenshinManagerError {
  public readonly errorCode: GenshinManagerErrorCode =
    GenshinManagerErrorCode.GM_VALIDATION_TYPE

  /**
   * Zod validation issues for detailed error information
   */
  public readonly zodIssues?: z.ZodIssue[]

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
  }

  /**
   * Create ValidationError from Zod error
   */
  public static fromZodError(
    zodError: z.ZodError,
    context?: ErrorContext,
  ): ValidationError {
    const issues = zodError.issues
    const firstIssue = issues[0]

    const message = `Validation failed at ${firstIssue.path.join('.')}: ${firstIssue.message}`

    const validationContext = ErrorContextFactory.createValidationContext(
      firstIssue.path.join('.') || 'unknown',
      'valid format',
      'received' in firstIssue ? firstIssue.received : undefined,
    )

    const mergedContext = ErrorContextFactory.merge(context, validationContext)

    return new ValidationError(message, mergedContext, issues, zodError)
  }

  /**
   * Get detailed validation error information
   */
  public getValidationDetails(): {
    path: string
    issue: string
    expected?: unknown
    received?: unknown
  }[] {
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
