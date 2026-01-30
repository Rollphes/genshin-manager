import { describe, expect, it } from 'vitest'

import { ErrorCode } from '@/errors/ErrorCodes'
import { GeneralError } from '@/errors/GeneralError'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

describe('GeneralError', () => {
  describe('Basic properties', () => {
    it('should have GmGeneral error code', () => {
      const error = new GeneralError('test message')
      expect(error.errorCode).toBe(ErrorCode.GmGeneral)
    })

    it('should be an instance of GenshinManagerError', () => {
      const error = new GeneralError('test message')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should have correct name', () => {
      const error = new GeneralError('test message')
      expect(error.name).toBe('GeneralError')
    })

    it('should have correct message', () => {
      const error = new GeneralError('test message')
      expect(error.message).toBe('test message')
    })
  })

  describe('Error chaining', () => {
    it('should support cause option', () => {
      const cause = new Error('original')
      const error = new GeneralError('wrapped', { cause })
      expect(error.cause).toBe(cause)
    })
  })
})
