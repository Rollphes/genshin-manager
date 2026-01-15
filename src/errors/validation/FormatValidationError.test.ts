import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { FormatValidationError } from '@/errors/validation/FormatValidationError'
import { ValidationError } from '@/errors/validation/ValidationError'

describe('FormatValidationError', () => {
  describe('constructor', () => {
    it('should create error with value and expectedFormat', () => {
      const error = new FormatValidationError('abc', 'ISO date format')
      expect(error.message).toContain('ISO date format')
      expect(error.message).toContain('abc')
    })

    it('should format message with default propertyName', () => {
      const error = new FormatValidationError('abc', 'email')
      expect(error.message).toBe(
        'value has invalid format: expected email, got abc',
      )
    })

    it('should format message with custom propertyName', () => {
      const error = new FormatValidationError('abc', 'email', 'userEmail')
      expect(error.message).toBe(
        'userEmail has invalid format: expected email, got abc',
      )
    })

    it('should set errorCode to GM_VALIDATION_FORMAT', () => {
      const error = new FormatValidationError('abc', 'email')
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GM_VALIDATION_FORMAT)
    })

    it('should set name to FormatValidationError', () => {
      const error = new FormatValidationError('abc', 'email')
      expect(error.name).toBe('FormatValidationError')
    })

    it('should be instance of ValidationError', () => {
      const error = new FormatValidationError('abc', 'email')
      expect(error).toBeInstanceOf(ValidationError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new FormatValidationError('abc', 'email')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new FormatValidationError('abc', 'email')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new FormatValidationError('abc', 'email')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set propertyKey in context', () => {
      const error = new FormatValidationError('abc', 'email', 'userEmail')
      expect(error.context?.propertyKey).toBe('userEmail')
    })

    it('should set expectedValue in context', () => {
      const error = new FormatValidationError('abc', 'email', 'userEmail')
      expect(error.context?.expectedValue).toBe('email')
    })

    it('should set actualValue in context', () => {
      const error = new FormatValidationError('abc', 'email', 'userEmail')
      expect(error.context?.actualValue).toBe('abc')
    })

    it('should accept context parameter', () => {
      const context = { operation: 'validate' }
      const error = new FormatValidationError('abc', 'email', 'value', context)
      expect(error.context?.operation).toBe('validate')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new FormatValidationError(
        'abc',
        'email',
        'value',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new FormatValidationError('abc', 'email')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM1004')
      expect(detailed).toContain('invalid format')
    })

    it('should serialize to JSON', () => {
      const error = new FormatValidationError('abc', 'email')
      const json = error.toJSON()
      expect(json.name).toBe('FormatValidationError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GM_VALIDATION_FORMAT)
    })
  })
})
