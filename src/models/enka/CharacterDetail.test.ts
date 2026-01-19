import { beforeAll, describe, expect, it } from 'vitest'

import { createEnkaDataResponse } from '@/__test__/__mocks__/api/enka-manager/createEnkaDataResponse'
import { Client } from '@/client/Client'
import { Artifact } from '@/models/Artifact'
import { CharacterConstellation } from '@/models/character/CharacterConstellation'
import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterSkill } from '@/models/character/CharacterSkill'
import { CharacterStatusManager } from '@/models/character/CharacterStatusManager'
import { CharacterDetail } from '@/models/enka/CharacterDetail'
import { SetBonus } from '@/models/SetBonus'
import { WeaponInfo } from '@/models/weapon/WeaponInfo'

describe('CharacterDetail', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create CharacterDetail from mock data', () => {
      const mockData = createEnkaDataResponse(800000001, true)
      if (!mockData.avatarInfoList) return
      const characterDetail = new CharacterDetail(mockData.avatarInfoList[0])
      expect(characterDetail).toBeDefined()
    })
  })

  describe('Instance Properties', () => {
    let characterDetail: CharacterDetail

    beforeAll(() => {
      const mockData = createEnkaDataResponse(800000001, true)
      if (!mockData.avatarInfoList) return
      characterDetail = new CharacterDetail(mockData.avatarInfoList[0])
    })

    it('should have correct id', () => {
      expect(characterDetail.id).toBe(10000002)
    })

    it('should have name as string', () => {
      expect(characterDetail.name).toBeDefined()
      expect(typeof characterDetail.name).toBe('string')
    })

    it('should have element defined or undefined', () => {
      expect(
        characterDetail.element === undefined ||
          typeof characterDetail.element === 'string',
      ).toBe(true)
    })

    it('should have rarity as number', () => {
      expect(characterDetail.rarity).toBeDefined()
      expect(typeof characterDetail.rarity).toBe('number')
    })

    it('should have bodyType as string', () => {
      expect(characterDetail.bodyType).toBeDefined()
      expect(typeof characterDetail.bodyType).toBe('string')
    })

    it('should have weaponType as string', () => {
      expect(characterDetail.weaponType).toBeDefined()
      expect(typeof characterDetail.weaponType).toBe('string')
    })

    it('should have costume as CharacterCostume', () => {
      expect(characterDetail.costume).toBeInstanceOf(CharacterCostume)
    })

    it('should have correct level', () => {
      expect(characterDetail.level).toBe(90)
    })

    it('should have maxLevel as number', () => {
      expect(characterDetail.maxLevel).toBeDefined()
      expect(typeof characterDetail.maxLevel).toBe('number')
    })

    it('should have levelXp as number', () => {
      expect(characterDetail.levelXp).toBeDefined()
      expect(typeof characterDetail.levelXp).toBe('number')
    })

    it('should have promoteLevel as number', () => {
      expect(characterDetail.promoteLevel).toBeDefined()
      expect(typeof characterDetail.promoteLevel).toBe('number')
    })

    it('should have constellations as array', () => {
      expect(characterDetail.constellations).toBeDefined()
      expect(Array.isArray(characterDetail.constellations)).toBe(true)
    })

    it('should have constellations as CharacterConstellation instances', () => {
      if (characterDetail.constellations.length > 0) {
        expect(characterDetail.constellations[0]).toBeInstanceOf(
          CharacterConstellation,
        )
      }
    })

    it('should have skills as array', () => {
      expect(characterDetail.skills).toBeDefined()
      expect(Array.isArray(characterDetail.skills)).toBe(true)
    })

    it('should have skills as CharacterSkill instances', () => {
      if (characterDetail.skills.length > 0)
        expect(characterDetail.skills[0]).toBeInstanceOf(CharacterSkill)
    })

    it('should have combatStatus as CharacterStatusManager', () => {
      expect(characterDetail.combatStatus).toBeInstanceOf(
        CharacterStatusManager,
      )
    })

    it('should have weapon as WeaponInfo', () => {
      expect(characterDetail.weapon).toBeInstanceOf(WeaponInfo)
    })

    it('should have artifacts as array', () => {
      expect(characterDetail.artifacts).toBeDefined()
      expect(Array.isArray(characterDetail.artifacts)).toBe(true)
    })

    it('should have artifacts as Artifact instances', () => {
      if (characterDetail.artifacts.length > 0)
        expect(characterDetail.artifacts[0]).toBeInstanceOf(Artifact)
    })

    it('should have friendShipLevel as number', () => {
      expect(characterDetail.friendShipLevel).toBeDefined()
      expect(typeof characterDetail.friendShipLevel).toBe('number')
      expect(characterDetail.friendShipLevel).toBe(10)
    })

    it('should have setBonus as SetBonus', () => {
      expect(characterDetail.setBonus).toBeInstanceOf(SetBonus)
    })

    it('should have data as original API data', () => {
      expect(characterDetail.data).toBeDefined()
      expect(characterDetail.data.avatarId).toBe(10000002)
    })
  })

  describe('Derived Properties', () => {
    let characterDetail: CharacterDetail

    beforeAll(() => {
      const mockData = createEnkaDataResponse(800000001, true)
      if (!mockData.avatarInfoList) return
      characterDetail = new CharacterDetail(mockData.avatarInfoList[0])
    })

    it('should have defaultCostumeId', () => {
      expect(characterDetail.defaultCostumeId).toBeDefined()
      expect(typeof characterDetail.defaultCostumeId).toBe('number')
    })

    it('should have depotId', () => {
      expect(characterDetail.depotId).toBeDefined()
      expect(typeof characterDetail.depotId).toBe('number')
    })
  })
})
