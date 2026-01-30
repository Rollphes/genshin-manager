import type { ZodError } from 'zod'

import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import type { LocationPath } from '@/types/LocationLike'
import { locationToString } from '@/types/LocationLike'

/**
 * Validation error for Zod schema validation failures
 */
export class ValidationError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmValidation

  /** Location path string (converted from LocationPath) */
  public readonly locationPath?: string

  /**
   * Constructor for ValidationError
   * @param zodError - Zod validation error
   * @param location - Location or path string where validation failed (optional)
   * @param options - Error options
   */
  constructor(
    public readonly zodError: ZodError,
    location?: LocationPath,
    options?: ErrorOptions,
  ) {
    const locationStr = location ? locationToString(location) : undefined
    const pathSuffix = locationStr ? ` at ${locationStr}` : ''
    super(`${zodError.message}${pathSuffix}`, options)
    this.locationPath = locationStr
  }
}
