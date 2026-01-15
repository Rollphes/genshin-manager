import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ValidationError } from '@/errors/validation/ValidationError'
import { validateObject } from '@/utils/validation/validateObject'

describe('validateObject', () => {
  it('should validate object with multiple properties', () => {
    const validations = {
      id: z.number(),
      name: z.string(),
      active: z.boolean(),
    }
    const obj = { id: 1, name: 'Test', active: true }
    const result = validateObject(obj, validations)
    expect(result).toEqual(obj)
  })

  it('should throw ValidationError for null input', () => {
    const validations = { name: z.string() }
    expect(() => validateObject(null, validations)).toThrow(ValidationError)
  })

  it('should throw ValidationError for non-object input', () => {
    const validations = { name: z.string() }
    expect(() => validateObject('string', validations)).toThrow(ValidationError)
  })

  it('should throw ValidationError for invalid property', () => {
    const validations = {
      id: z.number(),
      name: z.string(),
    }
    const obj = { id: 'not-a-number', name: 'Test' }
    expect(() => validateObject(obj, validations)).toThrow(ValidationError)
  })

  it('should include property key in error context', () => {
    const validations = {
      name: z.string(),
    }
    const obj = { name: 123 }
    try {
      validateObject(obj, validations)
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect((error as ValidationError).context?.metadata).toHaveProperty(
        'objectKey',
        'name',
      )
    }
  })

  it('should pass context to validation', () => {
    const validations = { value: z.number() }
    const obj = { value: 42 }
    const context = { operation: 'test' }
    const result = validateObject(obj, validations, context)
    expect(result).toEqual({ value: 42 })
  })

  it('should re-throw non-ValidationError errors', () => {
    const validations = {
      value: z.number().refine(() => {
        throw new Error('Custom error')
      }),
    }
    const obj = { value: 42 }
    expect(() => validateObject(obj, validations)).toThrow('Custom error')
  })
})
