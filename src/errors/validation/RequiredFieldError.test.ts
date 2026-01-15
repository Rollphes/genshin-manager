import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { RequiredFieldError } from '@/errors/validation/RequiredFieldError'
import { ValidationError } from '@/errors/validation/ValidationError'

describe('RequiredFieldError', () => {
  describe('constructor', () => {
    it('should create error with fieldName', () => {
      const error = new RequiredFieldError('username')
      expect(error.message).toContain('username')
    })

    it('should format message correctly', () => {
      const error = new RequiredFieldError('username')
      expect(error.message).toBe("Required field 'username' is missing")
    })

    it('should set errorCode to GM_VALIDATION_REQUIRED', () => {
      const error = new RequiredFieldError('username')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_VALIDATION_REQUIRED,
      )
    })

    it('should set name to RequiredFieldError', () => {
      const error = new RequiredFieldError('username')
      expect(error.name).toBe('RequiredFieldError')
    })

    it('should be instance of ValidationError', () => {
      const error = new RequiredFieldError('username')
      expect(error).toBeInstanceOf(ValidationError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new RequiredFieldError('username')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new RequiredFieldError('username')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new RequiredFieldError('username')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set propertyKey in context', () => {
      const error = new RequiredFieldError('username')
      expect(error.context?.propertyKey).toBe('username')
    })

    it('should set expectedValue in context', () => {
      const error = new RequiredFieldError('username')
      expect(error.context?.expectedValue).toBe('non-null value')
    })

    it('should set actualValue to undefined in context', () => {
      const error = new RequiredFieldError('username')
      expect(error.context?.actualValue).toBeUndefined()
    })

    it('should accept context parameter', () => {
      const context = { operation: 'validate' }
      const error = new RequiredFieldError('username', context)
      expect(error.context?.operation).toBe('validate')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new RequiredFieldError('username', undefined, cause)
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new RequiredFieldError('username')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM1003')
      expect(detailed).toContain('Required field')
    })

    it('should serialize to JSON', () => {
      const error = new RequiredFieldError('username')
      const json = error.toJSON()
      expect(json.name).toBe('RequiredFieldError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_VALIDATION_REQUIRED,
      )
    })
  })
})
