import { z } from 'zod'

import { ValidationError } from '@/errors/validation/ValidationError'
import type { ValidationContext } from '@/types/errorContext'
import { validate } from '@/utils/validation/validate'

/**
 * Context for object validation (without propertyKey, which is derived per property)
 */
type ObjectValidationContext = Omit<ValidationContext, 'propertyKey'>

/**
 * Validate object with multiple properties
 * @param obj - Object to validate
 * @param validations - Validation configurations for each property
 * @param context - Structured validation context (without propertyKey)
 * @returns validated object
 * @throws ValidationError if any property validation fails
 */
export function validateObject<T extends Record<string, unknown>>(
  obj: unknown,
  validations: {
    [K in keyof T]: z.ZodSchema<T[K]>
  },
  context?: ObjectValidationContext,
): T {
  if (typeof obj !== 'object' || obj === null) {
    throw new ValidationError('Expected object for validation', {
      propertyKey: 'object',
      operation: 'object validation',
    })
  }

  const typedObj = obj as Record<string, unknown>
  const result: Partial<T> = {}

  for (const [key, schema] of Object.entries(validations)) {
    try {
      const validatedResult = validate(schema as z.ZodSchema, typedObj[key], {
        propertyKey: key,
        source: context?.source,
        recordId: context?.recordId,
      })
      result[key as keyof T] = validatedResult as T[keyof T]
    } catch (error) {
      if (error instanceof ValidationError) {
        const objectContext = {
          ...error.context,
          operation: 'object property validation',
          metadata: {
            ...error.context?.metadata,
            objectKey: key,
          },
        }
        throw error.withContext(objectContext)
      }
      throw error
    }
  }

  return result as T
}
