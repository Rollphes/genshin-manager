import { describe, expect, it } from 'vitest'

import { EnumValidationError } from '@/domain/errors/validation/EnumValidationError'
import { toEnum } from '@/domain/typeGuards/toEnum'

enum TestEnum {
  ValueA = 'VALUE_A',
  ValueB = 'VALUE_B',
  ValueC = 'VALUE_C',
}

describe('toEnum', () => {
  describe('valid conversions', () => {
    it('should convert unknown value to enum', () => {
      const value: unknown = 'VALUE_A'
      const result = toEnum(TestEnum, value, 'TestEnum')
      expect(result).toBe(TestEnum.ValueA)
    })

    it('should convert string value to enum', () => {
      const value = 'VALUE_B' as string
      const result = toEnum(TestEnum, value, 'TestEnum')
      expect(result).toBe(TestEnum.ValueB)
    })

    it('should work with all enum values', () => {
      for (const enumValue of Object.values(TestEnum)) {
        const value: unknown = enumValue
        const result = toEnum(TestEnum, value, 'TestEnum')
        expect(result).toBe(enumValue)
      }
    })
  })

  describe('invalid conversions', () => {
    it('should throw EnumValidationError for invalid string value', () => {
      const value: unknown = 'INVALID_VALUE'
      expect(() => toEnum(TestEnum, value, 'TestEnum')).toThrow(
        EnumValidationError,
      )
    })

    it('should throw EnumValidationError for number value', () => {
      const value: unknown = 123
      expect(() => toEnum(TestEnum, value, 'TestEnum')).toThrow(
        EnumValidationError,
      )
    })

    it('should throw EnumValidationError for null value', () => {
      const value: unknown = null
      expect(() => toEnum(TestEnum, value, 'TestEnum')).toThrow(
        EnumValidationError,
      )
    })

    it('should throw EnumValidationError for undefined value', () => {
      const value: unknown = undefined
      expect(() => toEnum(TestEnum, value, 'TestEnum')).toThrow(
        EnumValidationError,
      )
    })

    it('should throw EnumValidationError for object value', () => {
      const value: unknown = { key: 'value' }
      expect(() => toEnum(TestEnum, value, 'TestEnum')).toThrow(
        EnumValidationError,
      )
    })
  })

  describe('error messages', () => {
    it('should include enum name in error message', () => {
      const value: unknown = 'INVALID'
      try {
        toEnum(TestEnum, value, 'TestEnum')
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(EnumValidationError)
        expect((error as EnumValidationError).message).toContain('TestEnum')
      }
    })

    it('should include allowed values in error message', () => {
      const value: unknown = 'INVALID'
      try {
        toEnum(TestEnum, value, 'TestEnum')
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(EnumValidationError)
        const message = (error as EnumValidationError).message
        expect(message).toContain('VALUE_A')
        expect(message).toContain('VALUE_B')
        expect(message).toContain('VALUE_C')
      }
    })

    it('should include context in error message when provided', () => {
      const value: unknown = 'INVALID'
      try {
        toEnum(TestEnum, value, 'TestEnum', {
          source: 'TestSource',
          recordId: 123,
          path: 'testProperty',
        })
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(EnumValidationError)
        expect((error as EnumValidationError).message).toContain(
          '[TestSource#123.testProperty]',
        )
      }
    })
  })
})
