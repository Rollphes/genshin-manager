import { describe, expect, it } from 'vitest'

import { EnumValidationError } from '@/errors/validation/EnumValidationError'
import { validateEnum } from '@/utils/validation/validateEnum'

describe('validateEnum', () => {
  it('should return value if in allowed values', () => {
    const allowedValues = ['a', 'b', 'c'] as const
    const result = validateEnum('b', allowedValues, 'field')
    expect(result).toBe('b')
  })

  it('should work with number enums', () => {
    const allowedValues = [1, 2, 3] as const
    const result = validateEnum(2, allowedValues, 'field')
    expect(result).toBe(2)
  })

  it('should throw EnumValidationError for invalid value', () => {
    const allowedValues = ['a', 'b', 'c'] as const
    expect(() => validateEnum('d', allowedValues, 'field')).toThrow(
      EnumValidationError,
    )
  })

  it('should include allowed values in error', () => {
    const allowedValues = ['a', 'b', 'c'] as const
    try {
      validateEnum('d', allowedValues, 'field')
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(EnumValidationError)
      expect((error as EnumValidationError).message).toContain('a, b, c')
    }
  })

  it('should pass context to error', () => {
    const allowedValues = ['a', 'b'] as const
    const context = { operation: 'enum validation test' }
    try {
      validateEnum('c', allowedValues, 'field', context)
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(EnumValidationError)
      expect((error as EnumValidationError).context?.operation).toBe(
        'enum validation test',
      )
    }
  })
})
