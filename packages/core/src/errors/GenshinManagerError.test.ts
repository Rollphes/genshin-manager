import { describe, expect, it } from 'vitest'

import { ErrorCode } from '@/errors/ErrorCodes'
import { GeneralError } from '@/errors/GeneralError'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

describe('GenshinManagerError', () => {
  describe('Basic properties', () => {
    it('should be an instance of Error', () => {
      const error = new GeneralError('test message')
      expect(error).toBeInstanceOf(Error)
    })

    it('should be an instance of GenshinManagerError', () => {
      const error = new GeneralError('test message')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should have correct name property', () => {
      const error = new GeneralError('test message')
      expect(error.name).toBe('GeneralError')
    })

    it('should have correct message property', () => {
      const error = new GeneralError('test message')
      expect(error.message).toBe('test message')
    })

    it('should have errorCode property', () => {
      const error = new GeneralError('test message')
      expect(error.errorCode).toBe(ErrorCode.GmGeneral)
    })
  })

  describe('Error chaining with cause', () => {
    it('should support cause option', () => {
      const cause = new Error('original error')
      const error = new GeneralError('wrapper error', { cause })
      expect(error.cause).toBe(cause)
    })

    it('should work without cause', () => {
      const error = new GeneralError('no cause')
      expect(error.cause).toBeUndefined()
    })
  })

  describe('Stack trace', () => {
    it('should have stack property', () => {
      const error = new GeneralError('test')
      expect(error.stack).toBeDefined()
      expect(typeof error.stack).toBe('string')
    })
  })
})
