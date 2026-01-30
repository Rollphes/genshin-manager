import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { createArtifactLevelSchema } from '@/schemas/createArtifactLevelSchema'

describe('createArtifactLevelSchema', () => {
  describe('basic functionality', () => {
    it('should create a ZodNumber schema', () => {
      const schema = createArtifactLevelSchema(20)
      expect(schema).toBeInstanceOf(z.ZodNumber)
    })

    it('should validate artifact levels from 0 to maxLevel', () => {
      const schema = createArtifactLevelSchema(20)
      expect(schema.safeParse(0).success).toBe(true)
      expect(schema.safeParse(10).success).toBe(true)
      expect(schema.safeParse(20).success).toBe(true)
    })

    it('should reject negative levels', () => {
      const schema = createArtifactLevelSchema(20)
      expect(schema.safeParse(-1).success).toBe(false)
    })

    it('should reject levels above maxLevel', () => {
      const schema = createArtifactLevelSchema(20)
      expect(schema.safeParse(21).success).toBe(false)
    })
  })

  describe('different maxLevels', () => {
    it('should handle 1-star artifact (maxLevel 4)', () => {
      const schema = createArtifactLevelSchema(4)
      expect(schema.safeParse(0).success).toBe(true)
      expect(schema.safeParse(4).success).toBe(true)
      expect(schema.safeParse(5).success).toBe(false)
    })

    it('should handle 2-star artifact (maxLevel 4)', () => {
      const schema = createArtifactLevelSchema(4)
      expect(schema.safeParse(4).success).toBe(true)
    })

    it('should handle 3-star artifact (maxLevel 12)', () => {
      const schema = createArtifactLevelSchema(12)
      expect(schema.safeParse(0).success).toBe(true)
      expect(schema.safeParse(12).success).toBe(true)
      expect(schema.safeParse(13).success).toBe(false)
    })

    it('should handle 4-star artifact (maxLevel 16)', () => {
      const schema = createArtifactLevelSchema(16)
      expect(schema.safeParse(16).success).toBe(true)
      expect(schema.safeParse(17).success).toBe(false)
    })

    it('should handle 5-star artifact (maxLevel 20)', () => {
      const schema = createArtifactLevelSchema(20)
      expect(schema.safeParse(20).success).toBe(true)
      expect(schema.safeParse(21).success).toBe(false)
    })
  })

  describe('error messages', () => {
    it('should include artifact level in error message', () => {
      const schema = createArtifactLevelSchema(20)
      const result = schema.safeParse(-1)
      expect(result.success).toBe(false)
      if (!result.success)
        expect(result.error.issues[0].message).toContain('artifact level')
    })
  })
})
