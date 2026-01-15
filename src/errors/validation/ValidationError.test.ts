import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { ValidationError } from '@/errors/validation/ValidationError'

describe('ValidationError', () => {
  describe('constructor', () => {
    it('should create error with message', () => {
      const error = new ValidationError('Validation failed')
      expect(error.message).toBe('Validation failed')
    })

    it('should set errorCode to GM_VALIDATION_TYPE', () => {
      const error = new ValidationError('Validation failed')
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GM_VALIDATION_TYPE)
    })

    it('should set name to ValidationError', () => {
      const error = new ValidationError('Validation failed')
      expect(error.name).toBe('ValidationError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new ValidationError('Validation failed')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new ValidationError('Validation failed')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new ValidationError('Validation failed')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set zodIssues when provided', () => {
      const issues: z.ZodIssue[] = [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['name'],
          message: 'Expected string, received number',
        },
      ]
      const error = new ValidationError('Validation failed', undefined, issues)
      expect(error.zodIssues).toEqual(issues)
    })

    it('should have undefined zodIssues when not provided', () => {
      const error = new ValidationError('Validation failed')
      expect(error.zodIssues).toBeUndefined()
    })

    it('should accept context parameter', () => {
      const context = { operation: 'parse' }
      const error = new ValidationError('Validation failed', context)
      expect(error.context?.operation).toBe('parse')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new ValidationError(
        'Validation failed',
        undefined,
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('fromZodError', () => {
    it('should create error from ZodError', () => {
      const schema = z.object({ name: z.string() })
      try {
        schema.parse({ name: 123 })
      } catch (err) {
        if (err instanceof z.ZodError) {
          const error = ValidationError.fromZodError(err)
          expect(error).toBeInstanceOf(ValidationError)
          expect(error.message).toContain('name')
        }
      }
    })

    it('should store zodIssues from ZodError', () => {
      const schema = z.object({ name: z.string() })
      try {
        schema.parse({ name: 123 })
      } catch (err) {
        if (err instanceof z.ZodError) {
          const error = ValidationError.fromZodError(err)
          expect(error.zodIssues).toBeDefined()
          expect(error.zodIssues).toHaveLength(1)
        }
      }
    })

    it('should set cause to original ZodError', () => {
      const schema = z.object({ name: z.string() })
      try {
        schema.parse({ name: 123 })
      } catch (err) {
        if (err instanceof z.ZodError) {
          const error = ValidationError.fromZodError(err)
          expect(error.cause).toBe(err)
        }
      }
    })

    it('should accept context parameter', () => {
      const schema = z.object({ name: z.string() })
      const context = { schemaName: 'UserSchema' }
      try {
        schema.parse({ name: 123 })
      } catch (err) {
        if (err instanceof z.ZodError) {
          const error = ValidationError.fromZodError(err, context)
          expect(error.context?.schemaName).toBe('UserSchema')
        }
      }
    })
  })

  describe('getValidationDetails', () => {
    it('should return empty array when no zodIssues', () => {
      const error = new ValidationError('Validation failed')
      expect(error.getValidationDetails()).toEqual([])
    })

    it('should return details for each issue', () => {
      const issues: z.ZodIssue[] = [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['name'],
          message: 'Expected string, received number',
        },
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'string',
          path: ['age'],
          message: 'Expected number, received string',
        },
      ]
      const error = new ValidationError('Validation failed', undefined, issues)
      const details = error.getValidationDetails()
      expect(details).toHaveLength(2)
      expect(details[0].path).toBe('name')
      expect(details[0].issue).toBe('Expected string, received number')
      expect(details[1].path).toBe('age')
    })

    it('should return "root" for empty path', () => {
      const issues: z.ZodIssue[] = [
        {
          code: 'invalid_type',
          expected: 'object',
          received: 'string',
          path: [],
          message: 'Expected object, received string',
        },
      ]
      const error = new ValidationError('Validation failed', undefined, issues)
      const details = error.getValidationDetails()
      expect(details[0].path).toBe('root')
    })
  })

  describe('getFormattedMessage', () => {
    it('should return message when no zodIssues', () => {
      const error = new ValidationError('Validation failed')
      expect(error.getFormattedMessage()).toBe('Validation failed')
    })

    it('should return message when single issue', () => {
      const issues: z.ZodIssue[] = [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['name'],
          message: 'Expected string',
        },
      ]
      const error = new ValidationError('Validation failed', undefined, issues)
      expect(error.getFormattedMessage()).toBe('Validation failed')
    })

    it('should include additional issues when multiple', () => {
      const issues: z.ZodIssue[] = [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['name'],
          message: 'Expected string',
        },
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'string',
          path: ['age'],
          message: 'Expected number',
        },
      ]
      const error = new ValidationError('Validation failed', undefined, issues)
      const formatted = error.getFormattedMessage()
      expect(formatted).toContain('Additional issues:')
      expect(formatted).toContain('age')
      expect(formatted).toContain('Expected number')
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new ValidationError('Validation failed')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM1002')
      expect(detailed).toContain('Validation failed')
    })

    it('should serialize to JSON', () => {
      const error = new ValidationError('Validation failed')
      const json = error.toJSON()
      expect(json.name).toBe('ValidationError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GM_VALIDATION_TYPE)
    })
  })
})
