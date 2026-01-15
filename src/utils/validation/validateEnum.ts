import type { ErrorContext } from '@/errors/base/ErrorContext'
import { EnumValidationError } from '@/errors/validation/EnumValidationError'

/**
 * Validate enum value
 * @param value - Value to validate
 * @param allowedValues - Array of allowed values
 * @param fieldName - Name of the field being validated
 * @param context - Additional error context
 * @returns validated value
 * @throws EnumValidationError if validation fails
 */
export function validateEnum<T>(
  value: unknown,
  allowedValues: readonly T[],
  fieldName: string,
  context?: ErrorContext,
): T {
  if (!allowedValues.includes(value as T))
    throw new EnumValidationError(value, [...allowedValues], fieldName, context)

  return value as T
}
