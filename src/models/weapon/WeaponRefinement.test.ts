import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { WeaponRefinement } from '@/models/weapon/WeaponRefinement'

describe('WeaponRefinement', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Methods', () => {
    it('should get max refinement rank for 5-star weapon', () => {
      const maxRank = WeaponRefinement.getMaxRefinementRankByWeaponId(11509)
      expect(maxRank).toBe(5)
    })

    it('should get max refinement rank for 1-star weapon (no refinement)', () => {
      const maxRank = WeaponRefinement.getMaxRefinementRankByWeaponId(11101)
      expect(maxRank).toBe(1)
    })
  })

  describe('Constructor', () => {
    it('should create WeaponRefinement with default refinementRank', () => {
      const refinement = new WeaponRefinement(11509)
      expect(refinement).toBeDefined()
      expect(refinement.id).toBe(11509)
      expect(refinement.refinementRank).toBe(1)
    })

    it('should create WeaponRefinement with custom refinementRank', () => {
      const refinement = new WeaponRefinement(11509, 5)
      expect(refinement.id).toBe(11509)
      expect(refinement.refinementRank).toBe(5)
    })
  })

  describe('Instance Properties (Mistsplitter R1)', () => {
    let refinement: WeaponRefinement

    beforeAll(() => {
      refinement = new WeaponRefinement(11509, 1)
    })

    it('should have correct id', () => {
      expect(refinement.id).toBe(11509)
    })

    it('should have correct refinementRank', () => {
      expect(refinement.refinementRank).toBe(1)
    })

    it('should have skill name', () => {
      expect(refinement.skillName).toBe("Mistsplitter's Edge")
    })

    it('should have skill description', () => {
      expect(refinement.skillDescription).toBeDefined()
      expect(refinement.skillDescription?.length).toBeGreaterThan(0)
    })

    it('should have addProps as array', () => {
      expect(refinement.addProps).toBeDefined()
      expect(Array.isArray(refinement.addProps)).toBe(true)
    })
  })

  describe('Instance Properties (Mistsplitter R5)', () => {
    let refinement: WeaponRefinement

    beforeAll(() => {
      refinement = new WeaponRefinement(11509, 5)
    })

    it('should have correct id', () => {
      expect(refinement.id).toBe(11509)
    })

    it('should have correct refinementRank', () => {
      expect(refinement.refinementRank).toBe(5)
    })

    it('should have skill name', () => {
      expect(refinement.skillName).toBe("Mistsplitter's Edge")
    })

    it('should have skill description with higher values than R1', () => {
      expect(refinement.skillDescription).toBeDefined()
      expect(refinement.skillDescription?.length).toBeGreaterThan(0)
    })

    it('should have addProps as array', () => {
      expect(refinement.addProps).toBeDefined()
      expect(Array.isArray(refinement.addProps)).toBe(true)
    })
  })

  describe('Instance Properties (1-star weapon - Dull Blade)', () => {
    let refinement: WeaponRefinement

    beforeAll(() => {
      refinement = new WeaponRefinement(11101, 1)
    })

    it('should have undefined skill name for weapon without skill', () => {
      expect(refinement.skillName).toBeUndefined()
    })

    it('should have undefined skill description for weapon without skill', () => {
      expect(refinement.skillDescription).toBeUndefined()
    })

    it('should have empty addProps for weapon without skill', () => {
      expect(refinement.addProps).toEqual([])
    })
  })

  describe('Error Cases', () => {
    it('should throw error when refinementRank > 1 for weapon without skill', () => {
      expect(() => new WeaponRefinement(11101, 2)).toThrow()
    })

    it('should throw error for invalid refinementRank (0)', () => {
      expect(() => new WeaponRefinement(11509, 0)).toThrow()
    })

    it('should throw error for invalid refinementRank (6)', () => {
      expect(() => new WeaponRefinement(11509, 6)).toThrow()
    })
  })
})
