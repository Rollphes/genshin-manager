import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { GeneralError } from '@/errors/general/GeneralError'

describe('GeneralError', () => {
  describe('constructor', () => {
    it('should create error with message', () => {
      const error = new GeneralError('Test error message')
      expect(error.message).toBe('Test error message')
    })

    it('should set name to GeneralError', () => {
      const error = new GeneralError('Test error')
      expect(error.name).toBe('GeneralError')
    })

    it('should set errorCode to GM_GENERAL_UNKNOWN', () => {
      const error = new GeneralError('Test error')
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GM_GENERAL_UNKNOWN)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new GeneralError('Test error')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should be instance of Error', () => {
      const error = new GeneralError('Test error')
      expect(error).toBeInstanceOf(Error)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new GeneralError('Test error')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new GeneralError('Test error')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should accept context parameter', () => {
      const context = { operation: 'test', filePath: '/test/path' }
      const error = new GeneralError('Test error', context)
      expect(error.context).toEqual(context)
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new GeneralError('Wrapped error', undefined, cause)
      expect(error.cause).toBe(cause)
    })
  })

  describe('static type guard', () => {
    it('should return true for GeneralError', () => {
      const error = new GeneralError('Test error')
      expect(GenshinManagerError.isGenshinManagerError(error)).toBe(true)
    })

    it('should return false for regular Error', () => {
      const error = new Error('Regular error')
      expect(GenshinManagerError.isGenshinManagerError(error)).toBe(false)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new GeneralError('Test error')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM9001')
      expect(detailed).toContain('Test error')
    })

    it('should serialize to JSON', () => {
      const error = new GeneralError('Test error', { operation: 'test' })
      const json = error.toJSON()
      expect(json.name).toBe('GeneralError')
      expect(json.message).toBe('Test error')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GM_GENERAL_UNKNOWN)
      expect(json.context).toEqual({ operation: 'test' })
    })

    it('should create new error with merged context', () => {
      const error = new GeneralError('Test error', { operation: 'original' })
      const newError = error.withContext({ filePath: '/new/path' })
      expect(newError).not.toBe(error)
      expect(newError.context?.operation).toBe('original')
      expect(newError.context?.filePath).toBe('/new/path')
    })
  })
})
