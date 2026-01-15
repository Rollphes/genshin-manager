import { z } from 'zod'

import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ValidationError } from '@/errors/validation/ValidationError'

/**
 * Validate data against a Zod schema with proper error handling
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param context - Additional error context
 * @returns validated data
 * @throws ValidationError if validation fails
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: ErrorContext,
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError)
      throw ValidationError.fromZodError(error, context)

    throw error
  }
}
