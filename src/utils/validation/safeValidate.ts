import { z } from 'zod'

import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ValidationError } from '@/errors/validation/ValidationError'

/**
 * Safely validate data and return result with success/error information
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param context - Additional error context
 * @returns validation result
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: ErrorContext,
): { success: true; data: T } | { success: false; error: ValidationError } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: ValidationError.fromZodError(error, context),
      }
    }

    // Re-throw non-Zod errors
    throw error
  }
}
