import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'
import { Weapon } from '@/models/weapon/Weapon'
import { WeaponRefinement } from '@/models/weapon/WeaponRefinement'

describe('Weapon', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all weapon IDs', () => {
      const ids = Weapon.allWeaponIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toContain(11509)
    })
  })

  describe('Static Methods', () => {
    it('should get weapon ID by name', () => {
      const ids = Weapon.getWeaponIdByName('Mistsplitter Reforged')
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids).toContain(11509)
    })

    it('should return empty array for non-existent weapon name', () => {
      const ids = Weapon.getWeaponIdByName('Non Existent Weapon')
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBe(0)
    })
  })

  describe('Constructor', () => {
    it('should create Weapon with default values', () => {
      const weapon = new Weapon(11509)
      expect(weapon).toBeDefined()
      expect(weapon.id).toBe(11509)
      expect(weapon.level).toBe(1)
      expect(weapon.isAscended).toBe(true)
      expect(weapon.refinementRank).toBe(1)
    })

    it('should create Weapon with custom values', () => {
      const weapon = new Weapon(11509, 90, true, 5)
      expect(weapon.id).toBe(11509)
      expect(weapon.level).toBe(90)
      expect(weapon.isAscended).toBe(true)
      expect(weapon.refinementRank).toBe(5)
    })
  })

  describe('Instance Properties (Mistsplitter Reforged Lv90 R5)', () => {
    let weapon: Weapon

    beforeAll(() => {
      weapon = new Weapon(11509, 90, true, 5)
    })

    it('should have correct id', () => {
      expect(weapon.id).toBe(11509)
    })

    it('should have correct level', () => {
      expect(weapon.level).toBe(90)
    })

    it('should have correct isAscended', () => {
      expect(weapon.isAscended).toBe(true)
    })

    it('should have correct refinementRank', () => {
      expect(weapon.refinementRank).toBe(5)
    })

    it('should have correct name', () => {
      expect(weapon.name).toBe('Mistsplitter Reforged')
    })

    it('should have non-empty description', () => {
      expect(weapon.description).toBeDefined()
      expect(weapon.description.length).toBeGreaterThan(0)
    })

    it('should have correct type', () => {
      expect(weapon.type).toBe('WEAPON_SWORD_ONE_HAND')
    })

    it('should have skill name', () => {
      expect(weapon.skillName).toBeDefined()
      expect(weapon.skillName).toBe("Mistsplitter's Edge")
    })

    it('should have skill description', () => {
      expect(weapon.skillDescription).toBeDefined()
      expect(weapon.skillDescription?.length).toBeGreaterThan(0)
    })

    it('should have correct maxLevel', () => {
      expect(weapon.maxLevel).toBe(90)
    })

    it('should have correct promoteLevel', () => {
      expect(weapon.promoteLevel).toBe(6)
    })

    it('should have correct rarity', () => {
      expect(weapon.rarity).toBe(5)
    })

    it('should have stats as array of StatProperty', () => {
      expect(weapon.stats).toBeDefined()
      expect(Array.isArray(weapon.stats)).toBe(true)
      expect(weapon.stats.length).toBeGreaterThan(0)
      weapon.stats.forEach((stat) => {
        expect(stat).toBeInstanceOf(StatProperty)
      })
    })

    it('should have correct isAwaken', () => {
      expect(weapon.isAwaken).toBe(true)
    })

    it('should have icon as ImageAssets', () => {
      expect(weapon.icon).toBeInstanceOf(ImageAssets)
    })

    it('should have ascensionMaterials as array', () => {
      expect(weapon.ascensionMaterials).toBeDefined()
      expect(Array.isArray(weapon.ascensionMaterials)).toBe(true)
    })

    it('should have refinementAddProps as array', () => {
      expect(weapon.refinementAddProps).toBeDefined()
      expect(Array.isArray(weapon.refinementAddProps)).toBe(true)
    })

    it('should have correct summary', () => {
      expect(weapon.summary).toBeDefined()
      expect(weapon.summary.name).toBe('Mistsplitter Reforged')
      expect(weapon.summary.type).toBe('WEAPON_SWORD_ONE_HAND')
      expect(weapon.summary.rarity).toBe(5)
      expect(weapon.summary.level).toBe('90/90')
      expect(weapon.summary.refinement).toBe('R5')
    })

    it('should have correct isCanAscend (max level)', () => {
      expect(weapon.isCanAscend).toBe(false)
    })

    it('should have empty nextAscensionMaterials when max level', () => {
      expect(weapon.nextAscensionMaterials).toEqual([])
    })

    it('should have totalAscensionMaterials as array', () => {
      expect(weapon.totalAscensionMaterials).toBeDefined()
      expect(Array.isArray(weapon.totalAscensionMaterials)).toBe(true)
    })

    it('should have correct isCanRefine (max refinement)', () => {
      expect(weapon.isCanRefine).toBe(false)
    })

    it('should have correct maxRefinementRank', () => {
      expect(weapon.maxRefinementRank).toBe(5)
    })
  })

  describe('Instance Properties (Low Level Weapon)', () => {
    let weapon: Weapon

    beforeAll(() => {
      weapon = new Weapon(11509, 20, false, 1)
    })

    it('should have correct level', () => {
      expect(weapon.level).toBe(20)
    })

    it('should have correct isAscended', () => {
      expect(weapon.isAscended).toBe(false)
    })

    it('should have correct refinementRank', () => {
      expect(weapon.refinementRank).toBe(1)
    })

    it('should be able to ascend', () => {
      expect(weapon.isCanAscend).toBe(true)
    })

    it('should have nextAscensionMaterials', () => {
      expect(weapon.nextAscensionMaterials).toBeDefined()
      expect(Array.isArray(weapon.nextAscensionMaterials)).toBe(true)
      expect(weapon.nextAscensionMaterials.length).toBeGreaterThan(0)
    })

    it('should have totalAscensionMaterials', () => {
      expect(weapon.totalAscensionMaterials).toBeDefined()
      expect(Array.isArray(weapon.totalAscensionMaterials)).toBe(true)
      expect(weapon.totalAscensionMaterials.length).toBeGreaterThan(0)
    })

    it('should be able to refine', () => {
      expect(weapon.isCanRefine).toBe(true)
    })
  })

  describe('Instance Properties (Low Rarity Weapon - Dull Blade)', () => {
    let weapon: Weapon

    beforeAll(() => {
      weapon = new Weapon(11101, 70, true, 1)
    })

    it('should have correct rarity', () => {
      expect(weapon.rarity).toBe(1)
    })

    it('should have correct maxLevel (70 for 1-2 star weapons)', () => {
      expect(weapon.maxLevel).toBe(70)
    })

    it('should not be able to ascend at max level', () => {
      expect(weapon.isCanAscend).toBe(false)
    })
  })

  describe('Instance Methods', () => {
    let weapon: Weapon

    beforeAll(() => {
      weapon = new Weapon(11509, 90, true, 5)
    })

    it('should get refinement effect for current rank', () => {
      const effect = weapon.getRefinementEffect()
      expect(effect).toBeInstanceOf(WeaponRefinement)
    })

    it('should get refinement effect for specified rank', () => {
      const effect = weapon.getRefinementEffect(1)
      expect(effect).toBeInstanceOf(WeaponRefinement)
    })

    it('should calculate weapon level materials', () => {
      const materials = weapon.calculateWeaponLevelMaterials(1, 90)
      expect(materials).toBeDefined()
      expect(Array.isArray(materials)).toBe(true)
      expect(materials.length).toBeGreaterThan(0)
      materials.forEach((mat) => {
        expect(mat).toHaveProperty('id')
        expect(mat).toHaveProperty('count')
        expect(typeof mat.id).toBe('number')
        expect(typeof mat.count).toBe('number')
      })
    })

    it('should return empty array when calculating materials for same level', () => {
      const materials = weapon.calculateWeaponLevelMaterials(90, 90)
      expect(materials).toEqual([])
    })
  })
})
