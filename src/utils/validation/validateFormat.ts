import type { ErrorContext } from '@/errors/base/ErrorContext'
import { FormatValidationError } from '@/errors/validation/FormatValidationError'

/**
 * Validate string format using regex
 * @param value - String to validate
 * @param pattern - Regex pattern
 * @param fieldName - Name of the field being validated
 * @param expectedFormat - Description of expected format
 * @param context - Additional error context
 * @returns validated string
 * @throws FormatValidationError if validation fails
 */
export function validateFormat(
  value: string,
  pattern: RegExp,
  fieldName: string,
  expectedFormat: string,
  context?: ErrorContext,
): string {
  if (!pattern.test(value))
    throw new FormatValidationError(fieldName, expectedFormat, value, context)

  return value
}
