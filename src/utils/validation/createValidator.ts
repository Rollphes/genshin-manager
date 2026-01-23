import { z } from 'zod'

import type { ValidationContext } from '@/types/errorContext'
import { validate } from '@/utils/validation/validate'

/**
 * Context for created validators (without propertyKey, which is pre-defined)
 */
type CreatedValidatorContext = Omit<ValidationContext, 'propertyKey'>

/**
 * Create a validation function from a Zod schema
 * @param schema - Zod schema
 * @param fieldName - Name of the field for error messages
 * @returns validation function
 */
export function createValidator<T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
): (data: unknown, context?: CreatedValidatorContext) => T {
  return (data: unknown, context?: CreatedValidatorContext): T => {
    return validate(schema, data, {
      propertyKey: fieldName,
      source: context?.source,
      recordId: context?.recordId,
    })
  }
}
