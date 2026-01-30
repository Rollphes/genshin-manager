import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { createUpdateIntervalSchema } from '@/schemas/createUpdateIntervalSchema'

describe('createUpdateIntervalSchema', () => {
  describe('basic functionality', () => {
    it('should create a ZodNumber schema', () => {
      const schema = createUpdateIntervalSchema(1000)
      expect(schema).toBeInstanceOf(z.ZodNumber)
    })

    it('should validate intervals from minInterval to maxInterval', () => {
      const schema = createUpdateIntervalSchema(1000, 10000)
      expect(schema.safeParse(1000).success).toBe(true)
      expect(schema.safeParse(5000).success).toBe(true)
      expect(schema.safeParse(10000).success).toBe(true)
    })

    it('should reject intervals below minInterval', () => {
      const schema = createUpdateIntervalSchema(1000)
      expect(schema.safeParse(999).success).toBe(false)
    })

    it('should reject intervals above maxInterval', () => {
      const schema = createUpdateIntervalSchema(1000, 10000)
      expect(schema.safeParse(10001).success).toBe(false)
    })
  })

  describe('default maxInterval', () => {
    it('should use 2147483647 as default maxInterval', () => {
      const schema = createUpdateIntervalSchema(0)
      expect(schema.safeParse(2147483647).success).toBe(true)
      expect(schema.safeParse(2147483648).success).toBe(false)
    })

    it('should accept large intervals with default max', () => {
      const schema = createUpdateIntervalSchema(1000)
      expect(schema.safeParse(1000000000).success).toBe(true)
    })
  })

  describe('custom intervals', () => {
    it('should handle millisecond intervals', () => {
      const schema = createUpdateIntervalSchema(100, 60000)
      expect(schema.safeParse(100).success).toBe(true)
      expect(schema.safeParse(60000).success).toBe(true)
    })

    it('should handle zero minInterval', () => {
      const schema = createUpdateIntervalSchema(0)
      expect(schema.safeParse(0).success).toBe(true)
    })
  })

  describe('error messages', () => {
    it('should include updateInterval in error message', () => {
      const schema = createUpdateIntervalSchema(1000)
      const result = schema.safeParse(500)
      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues[0].message).toContain('updateInterval')
    })
  })
})
