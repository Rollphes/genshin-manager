import type { ErrorContext } from '@/errors/base/ErrorContext'
import { RequiredFieldError } from '@/errors/validation/RequiredFieldError'

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Name of the field being validated
 * @param context - Additional error context
 * @returns validated value
 * @throws RequiredFieldError if validation fails
 */
export function validateRequired<T>(
  value: T | null | undefined,
  fieldName: string,
  context?: ErrorContext,
): T {
  if (value === null || value === undefined)
    throw new RequiredFieldError(fieldName, context)

  return value
}
