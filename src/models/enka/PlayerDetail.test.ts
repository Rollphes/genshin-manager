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

  describe('Default Values (Minimal Data)', () => {
    it('should use default values for missing optional fields', () => {
      const minimalData = {
        level: 1,
        nameCardId: 210001,
      }
      const playerDetail = new PlayerDetail(minimalData)
      expect(playerDetail.nickname).toBe('')
      expect(playerDetail.signature).toBe('')
      expect(playerDetail.worldLevel).toBe(0)
      expect(playerDetail.finishAchievementNum).toBe(0)
      expect(playerDetail.towerFloorIndex).toBe(0)
      expect(playerDetail.towerLevelIndex).toBe(0)
      expect(playerDetail.towerStarIndex).toBe(0)
      expect(playerDetail.maxFriendshipCharactersCount).toBe(0)
      expect(playerDetail.theaterActIndex).toBe(0)
      expect(playerDetail.theaterModeIndex).toBe(0)
      expect(playerDetail.theaterStarIndex).toBe(0)
      expect(playerDetail.isShowCharacterPreviewConstellation).toBe(false)
    })

    it('should handle undefined showAvatarInfoList', () => {
      const minimalData = {
        level: 1,
        nameCardId: 210001,
      }
      const playerDetail = new PlayerDetail(minimalData)
      expect(playerDetail.characterPreviews).toEqual([])
    })

    it('should handle undefined showNameCardIdList', () => {
      const minimalData = {
        level: 1,
        nameCardId: 210001,
      }
      const playerDetail = new PlayerDetail(minimalData)
      expect(playerDetail.showNameCards).toEqual([])
    })
  })

  describe('ProfilePicture Variations', () => {
    it('should use profilePicture.id when available', () => {
      const dataWithId = {
        level: 1,
        nameCardId: 210001,
        profilePicture: { id: 11 },
      }
      const playerDetail = new PlayerDetail(dataWithId)
      expect(playerDetail.profilePicture).toBeInstanceOf(ProfilePicture)
    })

    it('should use costumeId when profilePicture.id is not available', () => {
      const dataWithCostume = {
        level: 1,
        nameCardId: 210001,
        profilePicture: { costumeId: 200301 },
      }
      const playerDetail = new PlayerDetail(dataWithCostume)
      expect(playerDetail.profilePicture).toBeInstanceOf(ProfilePicture)
    })

    it('should use avatarId when profilePicture.id and costumeId are not available', () => {
      const dataWithAvatar = {
        level: 1,
        nameCardId: 210001,
        profilePicture: { avatarId: 10000002 },
      }
      const playerDetail = new PlayerDetail(dataWithAvatar)
      expect(playerDetail.profilePicture).toBeInstanceOf(ProfilePicture)
    })

    it('should use default avatarId when no profilePicture info available', () => {
      const dataNoProfile = {
        level: 1,
        nameCardId: 210001,
        profilePicture: {},
      }
      const playerDetail = new PlayerDetail(dataNoProfile)
      expect(playerDetail.profilePicture).toBeInstanceOf(ProfilePicture)
    })
  })
})
