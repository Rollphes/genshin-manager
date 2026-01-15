import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { RangeValidationError } from '@/errors/validation/RangeValidationError'
import { ValidationError } from '@/errors/validation/ValidationError'

describe('RangeValidationError', () => {
  describe('constructor', () => {
    it('should create error with value, min, and max', () => {
      const error = new RangeValidationError(100, 1, 10)
      expect(error.message).toContain('100')
      expect(error.message).toContain('1')
      expect(error.message).toContain('10')
    })

    it('should format message with default propertyName', () => {
      const error = new RangeValidationError(100, 1, 10)
      expect(error.message).toBe('value must be between 1 and 10, got 100')
    })

    it('should format message with custom propertyName', () => {
      const error = new RangeValidationError(100, 1, 10, 'level')
      expect(error.message).toBe('level must be between 1 and 10, got 100')
    })

    it('should handle negative values', () => {
      const error = new RangeValidationError(-5, 0, 100)
      expect(error.message).toBe('value must be between 0 and 100, got -5')
    })

    it('should handle decimal values', () => {
      const error = new RangeValidationError(1.5, 0, 1)
      expect(error.message).toBe('value must be between 0 and 1, got 1.5')
    })

    it('should set errorCode to GM_VALIDATION_RANGE', () => {
      const error = new RangeValidationError(100, 1, 10)
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GM_VALIDATION_RANGE)
    })

    it('should set name to RangeValidationError', () => {
      const error = new RangeValidationError(100, 1, 10)
      expect(error.name).toBe('RangeValidationError')
    })

    it('should be instance of ValidationError', () => {
      const error = new RangeValidationError(100, 1, 10)
      expect(error).toBeInstanceOf(ValidationError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new RangeValidationError(100, 1, 10)
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new RangeValidationError(100, 1, 10)
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new RangeValidationError(100, 1, 10)
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set propertyKey in context', () => {
      const error = new RangeValidationError(100, 1, 10, 'level')
      expect(error.context?.propertyKey).toBe('level')
    })

    it('should set expectedValue in context', () => {
      const error = new RangeValidationError(100, 1, 10, 'level')
      expect(error.context?.expectedValue).toBe('1-10')
    })

    it('should set actualValue in context', () => {
      const error = new RangeValidationError(100, 1, 10, 'level')
      expect(error.context?.actualValue).toBe(100)
    })

    it('should accept context parameter', () => {
      const context = { operation: 'validate' }
      const error = new RangeValidationError(100, 1, 10, 'value', context)
      expect(error.context?.operation).toBe('validate')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new RangeValidationError(
        100,
        1,
        10,
        'value',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new RangeValidationError(100, 1, 10)
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM1001')
      expect(detailed).toContain('must be between')
    })

    it('should serialize to JSON', () => {
      const error = new RangeValidationError(100, 1, 10)
      const json = error.toJSON()
      expect(json.name).toBe('RangeValidationError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GM_VALIDATION_RANGE)
    })
  })
})
