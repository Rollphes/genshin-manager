import type { ZodType } from 'zod'

import { ValidationError } from '@/errors/ValidationError'

/**
 * Validate a value against a Zod schema
 *
 * @template T - Output type of the schema
 * @param schema - Zod schema to validate against
 * @param value - Value to validate
 * @returns Validated value
 * @throws {@link ValidationError} - If validation fails
 *
 * @example
 * ```typescript
 * const uid = validate(uidSchema, userInput)
 * ```
 */
export function validate<T>(schema: ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value)
  if (!result.success) throw new ValidationError(result.error)

  return result.data
}
