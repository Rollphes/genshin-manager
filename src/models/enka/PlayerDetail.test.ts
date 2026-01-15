import { beforeAll, describe, expect, it } from 'vitest'

import { createEnkaDataResponse } from '@/__test__/__mocks__/api/enka-manager/createEnkaDataResponse'
import { Client } from '@/client/Client'
import { CharacterPreview } from '@/models/enka/CharacterPreview'
import { PlayerDetail } from '@/models/enka/PlayerDetail'
import { Material } from '@/models/Material'
import { ProfilePicture } from '@/models/ProfilePicture'

describe('PlayerDetail', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create PlayerDetail from mock data', () => {
      const mockData = createEnkaDataResponse(800000001, true)
      const playerDetail = new PlayerDetail(mockData.playerInfo)
      expect(playerDetail).toBeDefined()
    })
  })

  describe('Instance Properties', () => {
    let playerDetail: PlayerDetail

    beforeAll(() => {
      const mockData = createEnkaDataResponse(800000001, true)
      playerDetail = new PlayerDetail(mockData.playerInfo)
    })

    it('should have correct nickname', () => {
      expect(playerDetail.nickname).toBe('Player800000001')
    })

    it('should have correct level', () => {
      expect(playerDetail.level).toBe(60)
    })

    it('should have correct signature', () => {
      expect(playerDetail.signature).toBe('Test signature')
    })

    it('should have correct worldLevel', () => {
      expect(playerDetail.worldLevel).toBe(8)
    })

    it('should have nameCard as Material', () => {
      expect(playerDetail.nameCard).toBeInstanceOf(Material)
    })

    it('should have correct finishAchievementNum', () => {
      expect(playerDetail.finishAchievementNum).toBe(500)
    })

    it('should have correct towerFloorIndex', () => {
      expect(playerDetail.towerFloorIndex).toBe(12)
    })

    it('should have correct towerLevelIndex', () => {
      expect(playerDetail.towerLevelIndex).toBe(3)
    })

    it('should have characterPreviews as array', () => {
      expect(playerDetail.characterPreviews).toBeDefined()
      expect(Array.isArray(playerDetail.characterPreviews)).toBe(true)
    })

    it('should have characterPreviews as CharacterPreview instances', () => {
      if (playerDetail.characterPreviews.length > 0) {
        expect(playerDetail.characterPreviews[0]).toBeInstanceOf(
          CharacterPreview,
        )
      }
    })

    it('should have showNameCards as Material instances', () => {
      expect(playerDetail.showNameCards).toBeDefined()
      expect(Array.isArray(playerDetail.showNameCards)).toBe(true)
      if (playerDetail.showNameCards.length > 0)
        expect(playerDetail.showNameCards[0]).toBeInstanceOf(Material)
    })

    it('should have profilePicture as ProfilePicture', () => {
      expect(playerDetail.profilePicture).toBeInstanceOf(ProfilePicture)
    })

    it('should have data as original API data', () => {
      expect(playerDetail.data).toBeDefined()
      expect(playerDetail.data.nickname).toBe('Player800000001')
    })
  })

  describe('Different UID Values', () => {
    it('should handle different UIDs', () => {
      const mockData = createEnkaDataResponse(123456789, true)
      const playerDetail = new PlayerDetail(mockData.playerInfo)
      expect(playerDetail.nickname).toBe('Player123456789')
    })
  })

  describe('Without Characters', () => {
    it('should work without character data', () => {
      const mockData = createEnkaDataResponse(800000001, false)
      const playerDetail = new PlayerDetail(mockData.playerInfo)
      expect(playerDetail).toBeDefined()
      expect(playerDetail.characterPreviews.length).toBeGreaterThan(0)
    })
  })
})
