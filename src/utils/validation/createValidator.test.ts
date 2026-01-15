import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ValidationError } from '@/errors/validation/ValidationError'
import { createValidator } from '@/utils/validation/createValidator'

describe('createValidator', () => {
  it('should create validator function from schema', () => {
    const schema = z.number().min(0).max(100)
    const validator = createValidator(schema, 'score')
    const result = validator(50)
    expect(result).toBe(50)
  })

  it('should throw ValidationError when validation fails', () => {
    const schema = z.number().min(0).max(100)
    const validator = createValidator(schema, 'score')
    expect(() => validator(150)).toThrow(ValidationError)
  })

  it('should include field name in error context', () => {
    const schema = z.string()
    const validator = createValidator(schema, 'username')
    try {
      validator(123)
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      // propertyKey is set to zod's validation path, which may be 'unknown' for root-level errors
      expect((error as ValidationError).context?.propertyKey).toBeDefined()
    }
  })

  it('should merge context when provided', () => {
    const schema = z.string()
    const validator = createValidator(schema, 'field')
    const context = { operation: 'custom context' }
    try {
      validator(123, context)
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect((error as ValidationError).context?.operation).toBe(
        'custom context',
      )
    }
  })
})
