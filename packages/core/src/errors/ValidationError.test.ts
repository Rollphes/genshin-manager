import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import { ValidationError } from '@/errors/ValidationError'

describe('ValidationError', () => {
  const testLocationPath = 'TestClass.testMethod.testParam'

  it('should create error with ZodError and location', () => {
    const schema = z.string()
    const result = schema.safeParse(123)
    if (!result.success) {
      const error = new ValidationError(result.error, testLocationPath)

      expect(error).toBeInstanceOf(GenshinManagerError)
      expect(error.errorCode).toBe(ErrorCode.GmValidation)
      expect(error.zodError).toBe(result.error)
      expect(error.locationPath).toBe(testLocationPath)
    }
  })

  it('should support cause option for error chaining', () => {
    const originalError = new Error('Parse error')
    const schema = z.number()
    const result = schema.safeParse('not a number')
    if (!result.success) {
      const error = new ValidationError(result.error, testLocationPath, {
        cause: originalError,
      })

      expect(error.cause).toBe(originalError)
    }
  })

  it('should work without cause', () => {
    const schema = z.number()
    const result = schema.safeParse('invalid')
    if (!result.success) {
      const error = new ValidationError(result.error, testLocationPath)
      expect(error.cause).toBeUndefined()
    }
  })

  it('should have correct name property', () => {
    const schema = z.number()
    const result = schema.safeParse('invalid')
    if (!result.success) {
      const error = new ValidationError(result.error, testLocationPath)
      expect(error.name).toBe('ValidationError')
    }
  })

  it('should include location in message', () => {
    const schema = z.number()
    const result = schema.safeParse('invalid')
    if (!result.success) {
      const error = new ValidationError(result.error, testLocationPath)
      expect(error.message).toContain('TestClass')
    }
  })
})
