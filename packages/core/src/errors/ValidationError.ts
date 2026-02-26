import type { ZodError } from 'zod'

import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

/**
 * Validation issue extracted from Zod errors
 */
export interface ValidationIssue {
  /** Property path where validation failed */
  readonly path: readonly (string | number)[]
  /** Validation error message */
  readonly message: string
}

/**
 * Validation error for Zod schema validation failures
 */
export class ValidationError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmValidation

  /** Validation issues with path and message */
  public readonly issues: readonly ValidationIssue[]

  /**
   * Constructor for ValidationError
   * @param zodError - Zod validation error
   * @param options - Error options
   */
  constructor(zodError: ZodError, options?: ErrorOptions) {
    super(zodError.message, options)
    // ZodIssue.path is (string | number)[] but TypeScript infers PropertyKey[]
    // Filter to ensure only string | number values
    this.issues = zodError.issues.map((issue) => ({
      path: issue.path.filter(
        (segment): segment is string | number =>
          typeof segment === 'string' || typeof segment === 'number',
      ),
      message: issue.message,
    }))
  }
}
