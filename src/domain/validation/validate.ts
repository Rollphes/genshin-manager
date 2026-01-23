import { z } from 'zod'

import { ValidationError } from '@/domain/errors/validation/ValidationError'
import type { ValidationContext } from '@/domain/types/errorContext'

/**
 * Validate data against a Zod schema with proper error handling
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param context - Structured validation context
 * @returns validated data
 * @throws ValidationError if validation fails
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: ValidationContext,
): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError)
      throw ValidationError.fromZodError(error, context)

    throw error
  }
}
