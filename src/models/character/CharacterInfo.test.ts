import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { CharacterInfo } from '@/models/character/CharacterInfo'

describe('CharacterInfo', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all character IDs', () => {
      const ids = CharacterInfo.allCharacterIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toContain(10000002)
    })
  })

  describe('Static Methods', () => {
    it('should get character ID by full name', () => {
      const ids = CharacterInfo.getCharacterIdByName('Kamisato Ayaka')
      expect(ids).toEqual([10000002])
    })

    it('should return empty array for partial name', () => {
      const ids = CharacterInfo.getCharacterIdByName('Ayaka')
      expect(ids).toEqual([])
    })

    it('should get traveler skill depot IDs', () => {
      const depotIds = CharacterInfo.getTravelerSkillDepotIds(10000005)
      expect(depotIds).toBeDefined()
      expect(Array.isArray(depotIds)).toBe(true)
      expect(depotIds).toEqual([501, 502, 503, 504, 505, 506, 507, 508])
    })

    it('should get traveler skill depot IDs for female traveler', () => {
      const depotIds = CharacterInfo.getTravelerSkillDepotIds(10000007)
      expect(depotIds).toBeDefined()
      expect(Array.isArray(depotIds)).toBe(true)
      expect(depotIds.length).toBeGreaterThan(0)
    })
  })

  describe('Constructor', () => {
    it('should create CharacterInfo with character ID', () => {
      const info = new CharacterInfo(10000002)
      expect(info).toBeDefined()
      expect(info.id).toBe(10000002)
    })

    it('should create CharacterInfo for traveler with skill depot ID', () => {
      const info = new CharacterInfo(10000005, 504)
      expect(info).toBeDefined()
      expect(info.id).toBe(10000005)
      expect(info.depotId).toBe(504)
    })
  })

  describe('Instance Properties (Ayaka)', () => {
    let info: CharacterInfo

    beforeAll(() => {
      info = new CharacterInfo(10000002)
    })

    it('should have correct id', () => {
      expect(info.id).toBe(10000002)
    })

    it('should have correct defaultCostumeId', () => {
      expect(info.defaultCostumeId).toBe(200200)
    })

    it('should have correct name', () => {
      expect(info.name).toBe('Kamisato Ayaka')
    })

    it('should have correct maxLevel', () => {
      expect(info.maxLevel).toBe(90)
    })

    it('should have correct depotId', () => {
      expect(info.depotId).toBe(201)
    })

    it('should have correct element', () => {
      expect(info.element).toBe('Cryo')
    })

    it('should have correct skillOrder', () => {
      expect(info.skillOrder).toEqual([10024, 10018, 10019])
    })

    it('should have correct inherentSkillOrder', () => {
      expect(info.inherentSkillOrder).toEqual([221, 222, 223])
    })

    it('should have correct constellationIds', () => {
      expect(info.constellationIds).toEqual([21, 22, 23, 24, 25, 26])
    })

    it('should have correct proudMap', () => {
      expect(info.proudMap).toBeInstanceOf(Map)
      expect(info.proudMap.size).toBe(3)
      expect(info.proudMap.get(10024)).toBe(231)
      expect(info.proudMap.get(10018)).toBe(232)
      expect(info.proudMap.get(10019)).toBe(239)
    })

    it('should have correct rarity', () => {
      expect(info.rarity).toBe(5)
    })

    it('should have correct weaponType', () => {
      expect(info.weaponType).toBe('WEAPON_SWORD_ONE_HAND')
    })

    it('should have correct bodyType', () => {
      expect(info.bodyType).toBe('BODY_GIRL')
    })
  })

  describe('Traveler Special Cases', () => {
    it('should have undefined element for base traveler depot', () => {
      const info = new CharacterInfo(10000005, 501)
      expect(info.element).toBeUndefined()
    })

    it('should have element for elemental traveler depot', () => {
      const info = new CharacterInfo(10000005, 504)
      expect(info.element).toBeDefined()
    })
  })
})
