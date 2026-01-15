import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { StatProperty } from '@/models/StatProperty'
import { WeaponAscension } from '@/models/weapon/WeaponAscension'

describe('WeaponAscension', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Methods', () => {
    it('should get max promote level for 5-star weapon', () => {
      const maxLevel = WeaponAscension.getMaxPromoteLevelByWeaponId(11509)
      expect(maxLevel).toBe(6)
    })

    it('should get max promote level for 1-star weapon', () => {
      const maxLevel = WeaponAscension.getMaxPromoteLevelByWeaponId(11101)
      expect(maxLevel).toBe(4)
    })
  })

  describe('Constructor', () => {
    it('should create WeaponAscension with default promoteLevel', () => {
      const ascension = new WeaponAscension(11509)
      expect(ascension).toBeDefined()
      expect(ascension.id).toBe(11509)
      expect(ascension.promoteLevel).toBe(0)
    })

    it('should create WeaponAscension with custom promoteLevel', () => {
      const ascension = new WeaponAscension(11509, 6)
      expect(ascension.id).toBe(11509)
      expect(ascension.promoteLevel).toBe(6)
    })
  })

  describe('Instance Properties (promoteLevel 0)', () => {
    let ascension: WeaponAscension

    beforeAll(() => {
      ascension = new WeaponAscension(11509, 0)
    })

    it('should have correct id', () => {
      expect(ascension.id).toBe(11509)
    })

    it('should have correct promoteLevel', () => {
      expect(ascension.promoteLevel).toBe(0)
    })

    it('should have costItems as array', () => {
      expect(ascension.costItems).toBeDefined()
      expect(Array.isArray(ascension.costItems)).toBe(true)
    })

    it('should have costMora as 0 at promoteLevel 0', () => {
      expect(ascension.costMora).toBe(0)
    })

    it('should have addProps as array of StatProperty', () => {
      expect(ascension.addProps).toBeDefined()
      expect(Array.isArray(ascension.addProps)).toBe(true)
      ascension.addProps.forEach((prop) => {
        expect(prop).toBeInstanceOf(StatProperty)
      })
    })

    it('should have correct unlockMaxLevel at promoteLevel 0', () => {
      expect(ascension.unlockMaxLevel).toBe(20)
    })
  })

  describe('Instance Properties (promoteLevel 6)', () => {
    let ascension: WeaponAscension

    beforeAll(() => {
      ascension = new WeaponAscension(11509, 6)
    })

    it('should have correct id', () => {
      expect(ascension.id).toBe(11509)
    })

    it('should have correct promoteLevel', () => {
      expect(ascension.promoteLevel).toBe(6)
    })

    it('should have costItems with materials', () => {
      expect(ascension.costItems).toBeDefined()
      expect(Array.isArray(ascension.costItems)).toBe(true)
      expect(ascension.costItems.length).toBeGreaterThan(0)
      ascension.costItems.forEach((item) => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('count')
      })
    })

    it('should have correct costMora at promoteLevel 6', () => {
      expect(ascension.costMora).toBe(65000)
    })

    it('should have addProps as array of StatProperty', () => {
      expect(ascension.addProps).toBeDefined()
      expect(Array.isArray(ascension.addProps)).toBe(true)
      ascension.addProps.forEach((prop) => {
        expect(prop).toBeInstanceOf(StatProperty)
      })
    })

    it('should have correct unlockMaxLevel at promoteLevel 6', () => {
      expect(ascension.unlockMaxLevel).toBe(90)
    })
  })

  describe('Instance Properties (Low Rarity - Dull Blade promoteLevel 4)', () => {
    let ascension: WeaponAscension

    beforeAll(() => {
      ascension = new WeaponAscension(11101, 4)
    })

    it('should have correct promoteLevel', () => {
      expect(ascension.promoteLevel).toBe(4)
    })

    it('should have correct unlockMaxLevel (70 for 1-star)', () => {
      expect(ascension.unlockMaxLevel).toBe(70)
    })
  })
})
