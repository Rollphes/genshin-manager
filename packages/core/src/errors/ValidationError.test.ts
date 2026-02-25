import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import { ValidationError } from '@/errors/ValidationError'

describe('ValidationError', () => {
  it('should create error with validation issues', () => {
    const schema = z.string()
    const result = schema.safeParse(123)
    if (!result.success) {
      const error = new ValidationError(result.error)

      expect(error).toBeInstanceOf(GenshinManagerError)
      expect(error.errorCode).toBe(ErrorCode.GmValidation)
      expect(error.issues).toHaveLength(1)
      expect(error.issues[0].path).toEqual([])
      expect(error.issues[0].message).toContain('string')
    }
  })

  it('should support cause option for error chaining', () => {
    const originalError = new Error('Parse error')
    const schema = z.number()
    const result = schema.safeParse('not a number')
    if (!result.success) {
      const error = new ValidationError(result.error, {
        cause: originalError,
      })

      expect(error.cause).toBe(originalError)
    }
  })

  it('should work without cause', () => {
    const schema = z.number()
    const result = schema.safeParse('invalid')
    if (!result.success) {
      const error = new ValidationError(result.error)
      expect(error.cause).toBeUndefined()
    }
  })

  it('should have correct name property', () => {
    const schema = z.number()
    const result = schema.safeParse('invalid')
    if (!result.success) {
      const error = new ValidationError(result.error)
      expect(error.name).toBe('ValidationError')
    }
  })

  it('should use zodError message', () => {
    const schema = z.number()
    const result = schema.safeParse('invalid')
    if (!result.success) {
      const error = new ValidationError(result.error)
      expect(error.message).toBe(result.error.message)
    }
  })
})
