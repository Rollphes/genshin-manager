import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ValidationError } from '@/errors/validation/ValidationError'
import { batchValidate } from '@/utils/validation/batchValidate'

describe('batchValidate', () => {
  it('should validate multiple values successfully', () => {
    const validations = [
      { schema: z.string(), data: 'hello', fieldName: 'name' },
      { schema: z.number(), data: 42, fieldName: 'age' },
      { schema: z.boolean(), data: true, fieldName: 'active' },
    ] as const
    const result = batchValidate(validations)
    expect(result).toEqual(['hello', 42, true])
  })

  it('should return frozen array', () => {
    const validations = [
      { schema: z.string(), data: 'test', fieldName: 'value' },
    ] as const
    const result = batchValidate(validations)
    expect(Object.isFrozen(result)).toBe(true)
  })

  it('should throw ValidationError on first failure', () => {
    const validations = [
      { schema: z.string(), data: 'valid', fieldName: 'first' },
      { schema: z.number(), data: 'not-a-number', fieldName: 'second' },
      { schema: z.boolean(), data: true, fieldName: 'third' },
    ] as const
    expect(() => batchValidate(validations)).toThrow(ValidationError)
  })

  it('should include batch index in error context', () => {
    const validations = [
      { schema: z.string(), data: 'valid', fieldName: 'first' },
      { schema: z.number(), data: 'invalid', fieldName: 'second' },
    ] as const
    try {
      batchValidate(validations)
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect((error as ValidationError).context?.metadata).toHaveProperty(
        'batchIndex',
        1,
      )
      expect((error as ValidationError).context?.metadata).toHaveProperty(
        'batchFieldName',
        'second',
      )
    }
  })

  it('should include validation path in context', () => {
    const validations = [
      {
        schema: z.string(),
        data: 123,
        fieldName: 'testField',
        context: { operation: 'batch test' },
      },
    ] as const
    try {
      batchValidate(validations)
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      // batchValidate overwrites operation to 'batch validation'
      expect((error as ValidationError).context?.operation).toBe(
        'batch validation',
      )
    }
  })

  it('should re-throw non-ValidationError errors', () => {
    const validations = [
      {
        schema: z.string().refine(() => {
          throw new Error('Custom error')
        }),
        data: 'test',
        fieldName: 'field',
      },
    ] as const
    expect(() => batchValidate(validations)).toThrow('Custom error')
  })
})
