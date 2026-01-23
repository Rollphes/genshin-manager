import { EnumValidationError } from '@/errors/validation/EnumValidationError'
import type { EnumContext } from '@/types/errorContext'

/**
 * Converts an unknown value to an enum value with type validation
 * @param enumObject - The enum object to validate against
 * @param value - The value to validate
 * @param enumName - The name of the enum (for error messages)
 * @param context - Structured context for error messages
 * @returns The validated enum value
 * @throws EnumValidationError if the value is not a valid enum value
 */
export function toEnum<T extends Record<string, string>, V>(
  enumObject: T,
  value: V,
  enumName: string,
  context?: EnumContext,
): [V] extends [T[keyof T]] ? never : T[keyof T] {
  const allowedValues = Object.values(enumObject)
  if (typeof value !== 'string' || !allowedValues.includes(value))
    throw new EnumValidationError(value, allowedValues, enumName, context)

  return value as [V] extends [T[keyof T]] ? never : T[keyof T]
}
