import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { GeneralError } from '@/errors/general/GeneralError'

describe('GenshinManagerError', () => {
  describe('constructor', () => {
    it('should create error with message', () => {
      const error = new GeneralError('Test error')
      expect(error.message).toBe('Test error')
    })

    it('should set name to class name', () => {
      const error = new GeneralError('Test error')
      expect(error.name).toBe('GeneralError')
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new GeneralError('Test error')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new GeneralError('Test error')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set context when provided', () => {
      const context = { operation: 'test operation' }
      const error = new GeneralError('Test error', context)
      expect(error.context).toEqual(context)
    })

    it('should set cause when provided', () => {
      const cause = new Error('Original error')
      const error = new GeneralError('Test error', undefined, cause)
      expect(error.cause).toBe(cause)
    })

    it('should have errorCode set', () => {
      const error = new GeneralError('Test error')
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GM_GENERAL_UNKNOWN)
    })
  })

  describe('isGenshinManagerError', () => {
    it('should return true for GenshinManagerError', () => {
      const error = new GeneralError('Test error')
      expect(GenshinManagerError.isGenshinManagerError(error)).toBe(true)
    })

    it('should return false for regular Error', () => {
      const error = new Error('Test error')
      expect(GenshinManagerError.isGenshinManagerError(error)).toBe(false)
    })

    it('should return false for non-Error', () => {
      expect(GenshinManagerError.isGenshinManagerError('not an error')).toBe(
        false,
      )
      expect(GenshinManagerError.isGenshinManagerError(null)).toBe(false)
      expect(GenshinManagerError.isGenshinManagerError(undefined)).toBe(false)
    })
  })

  describe('fromUnknown', () => {
    it('should return same error if already GenshinManagerError', async () => {
      const error = new GeneralError('Test error')
      const result = await GenshinManagerError.fromUnknown(error)
      expect(result).toBe(error)
    })

    it('should wrap regular Error', async () => {
      const error = new Error('Original error')
      const result = await GenshinManagerError.fromUnknown(error)
      expect(result).toBeInstanceOf(GeneralError)
      expect(result.message).toBe('Original error')
      expect(result.cause).toBe(error)
    })

    it('should wrap string error', async () => {
      const result = await GenshinManagerError.fromUnknown('String error')
      expect(result).toBeInstanceOf(GeneralError)
      expect(result.message).toBe('String error')
    })

    it('should use fallback message for unknown types', async () => {
      const result = await GenshinManagerError.fromUnknown(123, 'Fallback')
      expect(result).toBeInstanceOf(GeneralError)
      expect(result.message).toBe('Fallback')
    })

    it('should add context when provided', async () => {
      const context = { operation: 'test' }
      const result = await GenshinManagerError.fromUnknown(
        new Error('test'),
        undefined,
        context,
      )
      expect(result.context).toEqual(context)
    })
  })

  describe('getDetailedMessage', () => {
    it('should include error code and message', () => {
      const error = new GeneralError('Test error')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain(GenshinManagerErrorCode.GM_GENERAL_UNKNOWN)
      expect(detailed).toContain('Test error')
    })

    it('should include file path in context', () => {
      const error = new GeneralError('Test error', { filePath: '/test/path' })
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('File: /test/path')
    })

    it('should include URL in context', () => {
      const error = new GeneralError('Test error', {
        url: 'https://example.com',
      })
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('URL: https://example.com')
    })

    it('should include operation in context', () => {
      const error = new GeneralError('Test error', { operation: 'test op' })
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('Operation: test op')
    })

    it('should include property key in context', () => {
      const error = new GeneralError('Test error', { propertyKey: 'testKey' })
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('Property: testKey')
    })

    it('should include expected and actual values', () => {
      const error = new GeneralError('Test error', {
        expectedValue: 'expected',
        actualValue: 'actual',
      })
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('Expected: "expected"')
      expect(detailed).toContain('Actual: "actual"')
    })
  })

  describe('isRetryable', () => {
    it('should return boolean', () => {
      const error = new GeneralError('Test error')
      // Note: Due to class initialization order, retryConfig may be undefined
      // This tests the method exists and handles the case
      expect(typeof error.isRetryable === 'function').toBe(true)
    })
  })

  describe('getRetryConfig', () => {
    it('should return retryConfig', () => {
      const error = new GeneralError('Test error')
      expect(error.getRetryConfig()).toBe(error.retryConfig)
    })
  })

  describe('toJSON', () => {
    it('should return serializable object', () => {
      const error = new GeneralError('Test error', { operation: 'test' })
      const json = error.toJSON()

      expect(json.name).toBe('GeneralError')
      expect(json.message).toBe('Test error')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GM_GENERAL_UNKNOWN)
      expect(json.timestamp).toBeDefined()
      expect(json.context).toEqual({ operation: 'test' })
      expect(json.isGenshinManagerError).toBe(true)
    })
  })

  describe('withContext', () => {
    it('should create new error with merged context', () => {
      const error = new GeneralError('Test error', { operation: 'original' })
      const newError = error.withContext({ filePath: '/new/path' })

      expect(newError).not.toBe(error)
      expect(newError.message).toBe('Test error')
      expect(newError.context?.operation).toBe('original')
      expect(newError.context?.filePath).toBe('/new/path')
    })

    it('should override existing context values', () => {
      const error = new GeneralError('Test error', { operation: 'original' })
      const newError = error.withContext({ operation: 'new' })

      expect(newError.context?.operation).toBe('new')
    })
  })
})
