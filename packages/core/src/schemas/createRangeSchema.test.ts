import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { createRangeSchema } from '@/schemas/createRangeSchema'

describe('createRangeSchema', () => {
  describe('basic functionality', () => {
    it('should create a ZodNumber schema', () => {
      const schema = createRangeSchema(1, 10)
      expect(schema).toBeInstanceOf(z.ZodNumber)
    })

    it('should validate numbers within range', () => {
      const schema = createRangeSchema(1, 10)
      expect(schema.safeParse(1).success).toBe(true)
      expect(schema.safeParse(5).success).toBe(true)
      expect(schema.safeParse(10).success).toBe(true)
    })

    it('should reject numbers below minimum', () => {
      const schema = createRangeSchema(1, 10)
      const result = schema.safeParse(0)
      expect(result.success).toBe(false)
    })

    it('should reject numbers above maximum', () => {
      const schema = createRangeSchema(1, 10)
      const result = schema.safeParse(11)
      expect(result.success).toBe(false)
    })
  })

  describe('error messages', () => {
    it('should include fieldName in min error message', () => {
      const schema = createRangeSchema(5, 10, 'level')
      const result = schema.safeParse(4)
      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues[0].message).toBe('level must be at least 5')
    })

    it('should include fieldName in max error message', () => {
      const schema = createRangeSchema(5, 10, 'level')
      const result = schema.safeParse(11)
      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues[0].message).toBe('level must be at most 10')
    })

    it('should use default fieldName "value"', () => {
      const schema = createRangeSchema(5, 10)
      const result = schema.safeParse(4)
      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues[0].message).toBe('value must be at least 5')
    })
  })

  describe('edge cases', () => {
    it('should handle zero as minimum', () => {
      const schema = createRangeSchema(0, 100)
      expect(schema.safeParse(0).success).toBe(true)
      expect(schema.safeParse(-1).success).toBe(false)
    })

    it('should handle negative range', () => {
      const schema = createRangeSchema(-10, -1)
      expect(schema.safeParse(-5).success).toBe(true)
      expect(schema.safeParse(0).success).toBe(false)
      expect(schema.safeParse(-11).success).toBe(false)
    })

    it('should handle single value range', () => {
      const schema = createRangeSchema(5, 5)
      expect(schema.safeParse(5).success).toBe(true)
      expect(schema.safeParse(4).success).toBe(false)
      expect(schema.safeParse(6).success).toBe(false)
    })

    it('should handle large numbers', () => {
      const schema = createRangeSchema(0, 2147483647)
      expect(schema.safeParse(2147483647).success).toBe(true)
    })

    it('should reject non-number types', () => {
      const schema = createRangeSchema(1, 10)
      expect(schema.safeParse('5').success).toBe(false)
      expect(schema.safeParse(null).success).toBe(false)
      expect(schema.safeParse(undefined).success).toBe(false)
    })

    it('should handle decimal numbers', () => {
      const schema = createRangeSchema(0, 1)
      expect(schema.safeParse(0.5).success).toBe(true)
    })
  })
})
