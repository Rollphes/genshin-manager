import type { ZodError } from 'zod'

import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

/**
 * Validation error for Zod schema validation failures
 */
export class ValidationError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmValidation

  /**
   * Constructor for ValidationError
   * @param zodError - Zod validation error
   * @param options - Error options
   */
  constructor(
    public readonly zodError: ZodError,
    options?: ErrorOptions,
  ) {
    super(zodError.message, options)
  }
}
