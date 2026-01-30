import { describe, expect, it } from 'vitest'

import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import { TextMapFormatError } from '@/errors/TextMapFormatError'
import { Language } from '@/types'

describe('TextMapFormatError', () => {
  const testLocationPath = '/cache/TextMap/TextMapEN.json'

  describe('Basic properties', () => {
    it('should have GmTextMapFormat error code', () => {
      const error = new TextMapFormatError(
        Language.En,
        testLocationPath,
        'expected Record<string, string>',
      )
      expect(error.errorCode).toBe(ErrorCode.GmTextMapFormat)
    })

    it('should be an instance of GenshinManagerError', () => {
      const error = new TextMapFormatError(
        Language.En,
        testLocationPath,
        'expected Record<string, string>',
      )
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should have correct name', () => {
      const error = new TextMapFormatError(
        Language.En,
        testLocationPath,
        'expected Record<string, string>',
      )
      expect(error.name).toBe('TextMapFormatError')
    })

    it('should have language property', () => {
      const error = new TextMapFormatError(
        Language.En,
        testLocationPath,
        'expected Record<string, string>',
      )
      expect(error.language).toBe(Language.En)
    })

    it('should have locationPath property', () => {
      const error = new TextMapFormatError(
        Language.En,
        testLocationPath,
        'expected Record<string, string>',
      )
      expect(error.locationPath).toBe(testLocationPath)
    })

    it('should have reason property', () => {
      const error = new TextMapFormatError(
        Language.En,
        testLocationPath,
        'expected Record<string, string>',
      )
      expect(error.reason).toBe('expected Record<string, string>')
    })

    it('should have correct message format', () => {
      const error = new TextMapFormatError(
        Language.En,
        testLocationPath,
        'expected Record<string, string>',
      )
      expect(error.message).toBe(
        "Invalid text map format for language 'en': expected Record<string, string>",
      )
    })
  })

  describe('Error chaining', () => {
    it('should support cause option', () => {
      const cause = new Error('original')
      const error = new TextMapFormatError(
        Language.En,
        testLocationPath,
        'expected Record<string, string>',
        { cause },
      )
      expect(error.cause).toBe(cause)
    })
  })
})
