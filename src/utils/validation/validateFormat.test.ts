import { describe, expect, it } from 'vitest'

import { FormatValidationError } from '@/errors/validation/FormatValidationError'
import { validateFormat } from '@/utils/validation/validateFormat'

describe('validateFormat', () => {
  it('should return value if matches pattern', () => {
    const pattern = /^\d{4}-\d{2}-\d{2}$/
    const result = validateFormat('2024-01-15', pattern, 'date', 'YYYY-MM-DD')
    expect(result).toBe('2024-01-15')
  })

  it('should work with email pattern', () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const result = validateFormat(
      'test@example.com',
      emailPattern,
      'email',
      'email format',
    )
    expect(result).toBe('test@example.com')
  })

  it('should throw FormatValidationError for non-matching value', () => {
    const pattern = /^\d+$/
    expect(() =>
      validateFormat('abc', pattern, 'number', 'digits only'),
    ).toThrow(FormatValidationError)
  })

  it('should include expected format in error', () => {
    const pattern = /^\d+$/
    try {
      validateFormat('abc', pattern, 'number', 'digits only')
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(FormatValidationError)
      expect((error as FormatValidationError).message).toContain('digits only')
    }
  })

  it('should pass context to error', () => {
    const pattern = /^\d+$/
    const context = { operation: 'format validation test' }
    try {
      validateFormat('abc', pattern, 'number', 'digits only', context)
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(FormatValidationError)
      expect((error as FormatValidationError).context?.operation).toBe(
        'format validation test',
      )
    }
  })
})
