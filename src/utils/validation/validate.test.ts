import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ValidationError } from '@/errors/validation/ValidationError'
import { validate } from '@/utils/validation/validate'

describe('validate', () => {
  it('should validate valid data against schema', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    })
    const data = { name: 'Test', age: 25 }
    const result = validate(schema, data)
    expect(result).toEqual(data)
  })

  it('should validate primitive types', () => {
    const stringSchema = z.string()
    const numberSchema = z.number()
    const booleanSchema = z.boolean()

    expect(validate(stringSchema, 'hello')).toBe('hello')
    expect(validate(numberSchema, 42)).toBe(42)
    expect(validate(booleanSchema, true)).toBe(true)
  })

  it('should throw ValidationError for invalid data', () => {
    const schema = z.string()
    expect(() => validate(schema, 123)).toThrow(ValidationError)
  })

  it('should include context in error', () => {
    const schema = z.string()
    const context = { operation: 'test validation' }
    try {
      validate(schema, 123, context)
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect((error as ValidationError).context?.operation).toBe(
        'test validation',
      )
    }
  })

  it('should re-throw non-ZodError errors', () => {
    const schema = z.string().refine(() => {
      throw new Error('Custom error')
    })
    expect(() => validate(schema, 'test')).toThrow('Custom error')
  })
})
