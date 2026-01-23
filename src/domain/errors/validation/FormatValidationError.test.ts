import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/domain/errors/base/GenshinManagerError'
import { FormatValidationError } from '@/domain/errors/validation/FormatValidationError'
import { ValidationError } from '@/domain/errors/validation/ValidationError'

describe('FormatValidationError', () => {
  describe('constructor', () => {
    it('should create error with fieldName and expectedFormat', () => {
      const error = new FormatValidationError(
        'dateField',
        'ISO date format',
        'abc',
      )
      expect(error.message).toContain('ISO date format')
      expect(error.message).toContain('abc')
    })

    it('should format message correctly', () => {
      const error = new FormatValidationError('userEmail', 'email', 'abc')
      expect(error.message).toBe(
        'userEmail has invalid format: expected email, got abc',
      )
    })

    it('should set errorCode to GmValidationFormat', () => {
      const error = new FormatValidationError('email', 'email format', 'abc')
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GmValidationFormat)
    })

    it('should set name to FormatValidationError', () => {
      const error = new FormatValidationError('email', 'email format', 'abc')
      expect(error.name).toBe('FormatValidationError')
    })

    it('should be instance of ValidationError', () => {
      const error = new FormatValidationError('email', 'email format', 'abc')
      expect(error).toBeInstanceOf(ValidationError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new FormatValidationError('email', 'email format', 'abc')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new FormatValidationError('email', 'email format', 'abc')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new FormatValidationError('email', 'email format', 'abc')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set propertyKey in context', () => {
      const error = new FormatValidationError('userEmail', 'email', 'abc')
      expect(error.context?.propertyKey).toBe('userEmail')
    })

    it('should set expectedValue in context', () => {
      const error = new FormatValidationError('userEmail', 'email', 'abc')
      expect(error.context?.expectedValue).toBe('email')
    })

    it('should set actualValue in context', () => {
      const error = new FormatValidationError('userEmail', 'email', 'abc')
      expect(error.context?.actualValue).toBe('abc')
    })

    it('should accept context parameter with source info', () => {
      const context = { source: 'TestSource', recordId: 123 }
      const error = new FormatValidationError(
        'email',
        'email format',
        'abc',
        context,
      )
      expect(error.source).toBe('TestSource')
      expect(error.recordId).toBe(123)
    })

    it('should include source in message when provided', () => {
      const context = { source: 'TestSource', recordId: 123 }
      const error = new FormatValidationError(
        'email',
        'email format',
        'abc',
        context,
      )
      expect(error.message).toContain('[TestSource#123]')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new FormatValidationError(
        'email',
        'email format',
        'abc',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new FormatValidationError('email', 'email format', 'abc')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM1004')
      expect(detailed).toContain('invalid format')
    })

    it('should serialize to JSON', () => {
      const error = new FormatValidationError('email', 'email format', 'abc')
      const json = error.toJSON()
      expect(json.name).toBe('FormatValidationError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GmValidationFormat)
    })
  })
})
