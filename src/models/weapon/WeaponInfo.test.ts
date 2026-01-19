import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { StatProperty } from '@/models/StatProperty'
import { WeaponInfo } from '@/models/weapon/WeaponInfo'

describe('WeaponInfo', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all weapon IDs', () => {
      const ids = WeaponInfo.allWeaponIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toContain(11509)
    })

    it('should not include black-listed weapon IDs', () => {
      const ids = WeaponInfo.allWeaponIds
      const blackWeaponIds = [
        10002, 10003, 10004, 10005, 10006, 10008, 11411, 11508, 12304, 12508,
        12509, 13304, 13503, 14306, 14411, 14508, 15306, 20001,
      ]
      blackWeaponIds.forEach((blackId) => {
        expect(ids).not.toContain(blackId)
      })
    })
  })

  describe('Static Methods', () => {
    it('should get weapon ID by name', () => {
      const ids = WeaponInfo.getWeaponIdByName('Mistsplitter Reforged')
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids).toContain(11509)
    })

    it('should return empty array for non-existent weapon name', () => {
      const ids = WeaponInfo.getWeaponIdByName('Non Existent Weapon')
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBe(0)
    })
  })

  describe('Constructor', () => {
    it('should create WeaponInfo with default values', () => {
      const info = new WeaponInfo(11509)
      expect(info).toBeDefined()
      expect(info.id).toBe(11509)
      expect(info.level).toBe(1)
      expect(info.isAscended).toBe(true)
      expect(info.refinementRank).toBe(1)
    })

    it('should create WeaponInfo with custom values', () => {
      const info = new WeaponInfo(11509, 90, true, 5)
      expect(info.id).toBe(11509)
      expect(info.level).toBe(90)
      expect(info.isAscended).toBe(true)
      expect(info.refinementRank).toBe(5)
    })
  })

  describe('Instance Properties (Mistsplitter Reforged Lv90)', () => {
    let info: WeaponInfo

    beforeAll(() => {
      info = new WeaponInfo(11509, 90, true, 5)
    })

    it('should have correct id', () => {
      expect(info.id).toBe(11509)
    })

    it('should have correct level', () => {
      expect(info.level).toBe(90)
    })

    it('should have correct maxLevel', () => {
      expect(info.maxLevel).toBe(90)
    })

    it('should have correct promoteLevel', () => {
      expect(info.promoteLevel).toBe(6)
    })

    it('should have correct isAscended', () => {
      expect(info.isAscended).toBe(true)
    })

    it('should have correct refinementRank', () => {
      expect(info.refinementRank).toBe(5)
    })

    it('should have correct name', () => {
      expect(info.name).toBe('Mistsplitter Reforged')
    })

    it('should have non-empty description', () => {
      expect(info.description).toBeDefined()
      expect(info.description.length).toBeGreaterThan(0)
    })

    it('should have correct type', () => {
      expect(info.type).toBe('WEAPON_SWORD_ONE_HAND')
    })

    it('should have skill name', () => {
      expect(info.skillName).toBeDefined()
      expect(info.skillName).toBe("Mistsplitter's Edge")
    })

    it('should have skill description', () => {
      expect(info.skillDescription).toBeDefined()
      expect(info.skillDescription?.length).toBeGreaterThan(0)
    })

    it('should have correct rarity', () => {
      expect(info.rarity).toBe(5)
    })

    it('should have stats as array of StatProperty', () => {
      expect(info.stats).toBeDefined()
      expect(Array.isArray(info.stats)).toBe(true)
      expect(info.stats.length).toBeGreaterThan(0)
      info.stats.forEach((stat) => {
        expect(stat).toBeInstanceOf(StatProperty)
      })
    })

    it('should have correct isAwaken (promoteLevel >= 2)', () => {
      expect(info.isAwaken).toBe(true)
    })

    it('should have icon as ImageAssets', () => {
      expect(info.icon).toBeInstanceOf(ImageAssets)
    })
  })

  describe('Instance Properties (Low Level - Not Awakened)', () => {
    let info: WeaponInfo

    beforeAll(() => {
      info = new WeaponInfo(11509, 20, false, 1)
    })

    it('should have correct promoteLevel', () => {
      expect(info.promoteLevel).toBe(0)
    })

    it('should have isAwaken false when promoteLevel < 2', () => {
      expect(info.isAwaken).toBe(false)
    })
  })

  describe('Instance Properties (Low Rarity Weapon - Dull Blade)', () => {
    let info: WeaponInfo

    beforeAll(() => {
      info = new WeaponInfo(11101, 70, true, 1)
    })

    it('should have correct rarity', () => {
      expect(info.rarity).toBe(1)
    })

    it('should have correct maxLevel (70 for 1-2 star weapons)', () => {
      expect(info.maxLevel).toBe(70)
    })
  })
})
