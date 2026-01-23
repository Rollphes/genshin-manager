import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { EnumValidationError } from '@/errors/validation/EnumValidationError'
import { ValidationError } from '@/errors/validation/ValidationError'

describe('EnumValidationError', () => {
  describe('constructor', () => {
    it('should create error with value and allowedValues', () => {
      const error = new EnumValidationError('invalid', ['a', 'b', 'c'])
      expect(error.message).toContain('a, b, c')
      expect(error.message).toContain('invalid')
    })

    it('should format message with default propertyName', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'])
      expect(error.message).toBe('value must be one of: a, b, got invalid')
    })

    it('should format message with custom propertyName', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'], 'type')
      expect(error.message).toBe('type must be one of: a, b, got invalid')
    })

    it('should include source and path prefix from context', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'], 'type', {
        source: 'TestConfig',
        recordId: 123,
        path: 'propType',
      })
      expect(error.message).toContain('[TestConfig#123.propType]')
    })

    it('should handle numeric allowed values', () => {
      const error = new EnumValidationError(5, [1, 2, 3])
      expect(error.message).toContain('1, 2, 3')
      expect(error.message).toContain('5')
    })

    it('should set errorCode to GmValidationEnum', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'])
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GmValidationEnum)
    })

    it('should set name to EnumValidationError', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'])
      expect(error.name).toBe('EnumValidationError')
    })

    it('should be instance of ValidationError', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'])
      expect(error).toBeInstanceOf(ValidationError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'])
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'])
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'])
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set propertyKey in context', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'], 'type')
      expect(error.context?.propertyKey).toBe('type')
    })

    it('should set expectedValue in context', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'], 'type')
      expect(error.context?.expectedValue).toBe('one of: a, b')
    })

    it('should set actualValue in context', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'], 'type')
      expect(error.context?.actualValue).toBe('invalid')
    })

    it('should accept context parameter with source info', () => {
      const context = { source: 'TestSource', recordId: 456, path: 'field' }
      const error = new EnumValidationError(
        'invalid',
        ['a', 'b'],
        'value',
        context,
      )
      expect(error.source).toBe('TestSource')
      expect(error.recordId).toBe(456)
      expect(error.path).toBe('field')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new EnumValidationError(
        'invalid',
        ['a', 'b'],
        'value',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'])
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM1005')
      expect(detailed).toContain('must be one of')
    })

    it('should serialize to JSON', () => {
      const error = new EnumValidationError('invalid', ['a', 'b'])
      const json = error.toJSON()
      expect(json.name).toBe('EnumValidationError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GmValidationEnum)
    })
  })
})
