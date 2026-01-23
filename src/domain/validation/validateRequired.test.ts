import { describe, expect, it } from 'vitest'

import { validateRequired } from '@/domain/validation/validateRequired'
import { RequiredFieldError } from '@/errors/validation/RequiredFieldError'

describe('validateRequired', () => {
  it('should return value if present', () => {
    const result = validateRequired('value', 'fieldName')
    expect(result).toBe('value')
  })

  it('should return value for falsy but defined values', () => {
    expect(validateRequired(0, 'num')).toBe(0)
    expect(validateRequired('', 'str')).toBe('')
    expect(validateRequired(false, 'bool')).toBe(false)
  })

  it('should throw RequiredFieldError for null', () => {
    expect(() => validateRequired(null, 'fieldName')).toThrow(
      RequiredFieldError,
    )
  })

  it('should throw RequiredFieldError for undefined', () => {
    expect(() => {
      validateRequired(undefined, 'fieldName')
    }).toThrow(RequiredFieldError)
  })

  it('should include field name in error message', () => {
    try {
      validateRequired(null, 'myField')
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(RequiredFieldError)
      expect((error as RequiredFieldError).message).toContain('myField')
    }
  })

  it('should pass context to error', () => {
    const context = { source: 'Test' }
    try {
      validateRequired(null, 'fieldName', context)
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(RequiredFieldError)
      expect((error as RequiredFieldError).source).toBe('Test')
    }
  })
})
