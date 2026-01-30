import { z } from 'zod'

/**
 * Range validation schema factory (min to max)
 * @param min - Minimum value
 * @param max - Maximum value
 * @param fieldName - Field name for error messages (default: 'value')
 * @returns Zod number schema with min/max validation
 */
export function createRangeSchema(
  min: number,
  max: number,
  fieldName = 'value',
): z.ZodNumber {
  return z
    .number()
    .min(min, {
      message: `${fieldName} must be at least ${min.toString()}`,
    })
    .max(max, {
      message: `${fieldName} must be at most ${max.toString()}`,
    })
}
