import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { createDynamicWeaponLevelSchema } from '@/schemas/createDynamicWeaponLevelSchema'

describe('createDynamicWeaponLevelSchema', () => {
  describe('basic functionality', () => {
    it('should create a ZodNumber schema', () => {
      const schema = createDynamicWeaponLevelSchema(90)
      expect(schema).toBeInstanceOf(z.ZodNumber)
    })

    it('should validate weapon levels from 1 to maxLevel', () => {
      const schema = createDynamicWeaponLevelSchema(90)
      expect(schema.safeParse(1).success).toBe(true)
      expect(schema.safeParse(45).success).toBe(true)
      expect(schema.safeParse(90).success).toBe(true)
    })

    it('should reject level 0', () => {
      const schema = createDynamicWeaponLevelSchema(90)
      expect(schema.safeParse(0).success).toBe(false)
    })

    it('should reject levels above maxLevel', () => {
      const schema = createDynamicWeaponLevelSchema(90)
      expect(schema.safeParse(91).success).toBe(false)
    })
  })

  describe('ascension-based maxLevels', () => {
    it('should handle ascension 0 (maxLevel 20)', () => {
      const schema = createDynamicWeaponLevelSchema(20)
      expect(schema.safeParse(1).success).toBe(true)
      expect(schema.safeParse(20).success).toBe(true)
      expect(schema.safeParse(21).success).toBe(false)
    })

    it('should handle ascension 1 (maxLevel 40)', () => {
      const schema = createDynamicWeaponLevelSchema(40)
      expect(schema.safeParse(40).success).toBe(true)
      expect(schema.safeParse(41).success).toBe(false)
    })

    it('should handle ascension 2 (maxLevel 50)', () => {
      const schema = createDynamicWeaponLevelSchema(50)
      expect(schema.safeParse(50).success).toBe(true)
      expect(schema.safeParse(51).success).toBe(false)
    })

    it('should handle ascension 3 (maxLevel 60)', () => {
      const schema = createDynamicWeaponLevelSchema(60)
      expect(schema.safeParse(60).success).toBe(true)
      expect(schema.safeParse(61).success).toBe(false)
    })

    it('should handle ascension 4 (maxLevel 70)', () => {
      const schema = createDynamicWeaponLevelSchema(70)
      expect(schema.safeParse(70).success).toBe(true)
      expect(schema.safeParse(71).success).toBe(false)
    })

    it('should handle ascension 5 (maxLevel 80)', () => {
      const schema = createDynamicWeaponLevelSchema(80)
      expect(schema.safeParse(80).success).toBe(true)
      expect(schema.safeParse(81).success).toBe(false)
    })

    it('should handle ascension 6 (maxLevel 90)', () => {
      const schema = createDynamicWeaponLevelSchema(90)
      expect(schema.safeParse(90).success).toBe(true)
      expect(schema.safeParse(91).success).toBe(false)
    })
  })

  describe('error messages', () => {
    it('should include weapon level in error message', () => {
      const schema = createDynamicWeaponLevelSchema(90)
      const result = schema.safeParse(0)
      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues[0].message).toContain('weapon level')
    })
  })
})
