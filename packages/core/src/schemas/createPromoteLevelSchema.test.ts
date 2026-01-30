import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { createPromoteLevelSchema } from '@/schemas/createPromoteLevelSchema'

describe('createPromoteLevelSchema', () => {
  describe('basic functionality', () => {
    it('should create a ZodNumber schema', () => {
      const schema = createPromoteLevelSchema(6)
      expect(schema).toBeInstanceOf(z.ZodNumber)
    })

    it('should validate promote levels from 0 to maxPromoteLevel', () => {
      const schema = createPromoteLevelSchema(6)
      expect(schema.safeParse(0).success).toBe(true)
      expect(schema.safeParse(3).success).toBe(true)
      expect(schema.safeParse(6).success).toBe(true)
    })

    it('should reject negative levels', () => {
      const schema = createPromoteLevelSchema(6)
      expect(schema.safeParse(-1).success).toBe(false)
    })

    it('should reject levels above maxPromoteLevel', () => {
      const schema = createPromoteLevelSchema(6)
      expect(schema.safeParse(7).success).toBe(false)
    })
  })

  describe('different maxPromoteLevels', () => {
    it('should handle character promote level (maxPromoteLevel 6)', () => {
      const schema = createPromoteLevelSchema(6)
      expect(schema.safeParse(0).success).toBe(true)
      expect(schema.safeParse(6).success).toBe(true)
      expect(schema.safeParse(7).success).toBe(false)
    })

    it('should handle 1-2 star weapon (maxPromoteLevel 4)', () => {
      const schema = createPromoteLevelSchema(4)
      expect(schema.safeParse(0).success).toBe(true)
      expect(schema.safeParse(4).success).toBe(true)
      expect(schema.safeParse(5).success).toBe(false)
    })

    it('should handle custom maxPromoteLevel', () => {
      const schema = createPromoteLevelSchema(3)
      expect(schema.safeParse(0).success).toBe(true)
      expect(schema.safeParse(3).success).toBe(true)
      expect(schema.safeParse(4).success).toBe(false)
    })
  })

  describe('error messages', () => {
    it('should include promoteLevel in error message', () => {
      const schema = createPromoteLevelSchema(6)
      const result = schema.safeParse(-1)
      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues[0].message).toContain('promoteLevel')
    })
  })
})
