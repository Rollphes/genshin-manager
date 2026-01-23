import { RequiredFieldError } from '@/domain/errors/validation/RequiredFieldError'
import type { ValidationContext } from '@/domain/types/errorContext'

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Name of the field being validated
 * @param context - Structured validation context
 * @returns validated value
 * @throws RequiredFieldError if validation fails
 */
export function validateRequired<T>(
  value: T | null | undefined,
  fieldName: string,
  context?: Omit<ValidationContext, 'propertyKey'>,
): T {
  if (value === null || value === undefined)
    throw new RequiredFieldError(fieldName, context)

  return value
}
