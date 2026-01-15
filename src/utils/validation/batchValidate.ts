import { z } from 'zod'

import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ValidationError } from '@/errors/validation/ValidationError'
import { validate } from '@/utils/validation/validate'

/**
 * Batch validate multiple values with different schemas
 * @param validations - Array of validation configurations
 * @returns array of validated values
 * @throws ValidationError if any validation fails
 */
export function batchValidate<T extends readonly unknown[]>(validations: {
  readonly [K in keyof T]: {
    schema: z.ZodSchema<T[K]>
    data: unknown
    fieldName: string
    context?: ErrorContext
  }
}): T {
  const results: unknown[] = []

  for (let i = 0; i < validations.length; i++) {
    const validation = validations[i]
    try {
      const result = validate(validation.schema, validation.data, {
        ...validation.context,
        propertyKey: validation.fieldName,
        validationPath: `batch[${i.toString()}].${validation.fieldName}`,
      })
      results[i] = result
    } catch (error) {
      if (error instanceof ValidationError) {
        // Add batch context to the error
        const batchContext = {
          ...error.context,
          operation: 'batch validation',
          metadata: {
            ...error.context?.metadata,
            batchIndex: i,
            batchFieldName: validation.fieldName,
          },
        }
        throw error.withContext(batchContext)
      }
      throw error
    }
  }

  return Object.freeze(results) as T
}
