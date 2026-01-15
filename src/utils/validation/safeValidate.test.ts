import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ValidationError } from '@/errors/validation/ValidationError'
import { safeValidate } from '@/utils/validation/safeValidate'

describe('safeValidate', () => {
  it('should return success result for valid data', () => {
    const schema = z.string()
    const result = safeValidate(schema, 'hello')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toBe('hello')
  })

  it('should return error result for invalid data', () => {
    const schema = z.string()
    const result = safeValidate(schema, 123)
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error).toBeInstanceOf(ValidationError)
  })

  it('should include context in error result', () => {
    const schema = z.string()
    const context = { operation: 'safe validation test' }
    const result = safeValidate(schema, 123, context)
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.context?.operation).toBe('safe validation test')
  })

  it('should re-throw non-ZodError errors', () => {
    const schema = z.string().refine(() => {
      throw new Error('Custom error')
    })
    expect(() => safeValidate(schema, 'test')).toThrow('Custom error')
  })
})
