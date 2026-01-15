import { z } from 'zod'

import type { ErrorContext } from '@/errors/base/ErrorContext'
import { validate } from '@/utils/validation/validate'

/**
 * Create a validation function from a Zod schema
 * @param schema - Zod schema
 * @param fieldName - Name of the field for error messages
 * @returns validation function
 */
export function createValidator<T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
): (data: unknown, context?: ErrorContext) => T {
  return (data: unknown, context?: ErrorContext): T => {
    return validate(schema, data, {
      ...context,
      propertyKey: fieldName,
    })
  }
}
