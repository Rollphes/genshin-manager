import { describe, expect, it } from 'vitest'

import { PlayerDetail } from '@/dto/PlayerDetail'
import type { PlayerInfoResponse } from '@/types/api/responses'

describe('PlayerDetail', () => {
  const minimalResponse: PlayerInfoResponse = {
    level: 60,
    nameCardId: 210001,
  }

  const fullResponse: PlayerInfoResponse = {
    nickname: 'Traveler',
    level: 60,
    signature: 'Hello!',
    worldLevel: 8,
    nameCardId: 210001,
    finishAchievementNum: 500,
    towerFloorIndex: 12,
    towerLevelIndex: 3,
    towerStarIndex: 36,
    showAvatarInfoList: [
      {
        avatarId: 10000002,
        level: 90,
        costumeId: 200302,
        energyType: 4,
        talentLevel: 6,
      },
      { avatarId: 10000003, level: 80 },
    ],
    showNameCardIdList: [210001, 210002],
    profilePicture: { avatarId: 10000002, id: 1, costumeId: 200302 },
    isShowAvatarTalent: true,
    fetterCount: 20,
    theaterActIndex: 5,
    theaterModeIndex: 2,
    theaterStarIndex: 10,
  }

  it('should build from minimal response with defaults', () => {
    const detail = PlayerDetail.fromResponse(minimalResponse)
    expect(detail.nickname).toBe('')
    expect(detail.level).toBe(60)
    expect(detail.signature).toBe('')
    expect(detail.worldLevel).toBe(0)
    expect(detail.nameCardId).toBe(210001)
    expect(detail.finishAchievementNum).toBe(0)
    expect(detail.towerFloorIndex).toBe(0)
    expect(detail.characterPreviews).toEqual([])
    expect(detail.showNameCardIds).toEqual([])
    expect(detail.profilePictureId).toBeUndefined()
    expect(detail.profilePictureAvatarId).toBeUndefined()
    expect(detail.profilePictureCostumeId).toBeUndefined()
    expect(detail.maxFriendshipCharactersCount).toBe(0)
    expect(detail.isShowCharacterPreviewConstellation).toBe(false)
  })

  it('should build from full response', () => {
    const detail = PlayerDetail.fromResponse(fullResponse)
    expect(detail.nickname).toBe('Traveler')
    expect(detail.level).toBe(60)
    expect(detail.signature).toBe('Hello!')
    expect(detail.worldLevel).toBe(8)
    expect(detail.finishAchievementNum).toBe(500)
    expect(detail.towerFloorIndex).toBe(12)
    expect(detail.towerLevelIndex).toBe(3)
    expect(detail.towerStarIndex).toBe(36)
    expect(detail.characterPreviews).toHaveLength(2)
    expect(detail.characterPreviews[0]).toEqual({
      avatarId: 10000002,
      level: 90,
      costumeId: 200302,
      energyType: 4,
      talentLevel: 6,
    })
    expect(detail.characterPreviews[1]?.costumeId).toBeUndefined()
    expect(detail.showNameCardIds).toEqual([210001, 210002])
    expect(detail.profilePictureId).toBe(1)
    expect(detail.profilePictureAvatarId).toBe(10000002)
    expect(detail.profilePictureCostumeId).toBe(200302)
    expect(detail.maxFriendshipCharactersCount).toBe(20)
    expect(detail.isShowCharacterPreviewConstellation).toBe(true)
    expect(detail.theaterActIndex).toBe(5)
    expect(detail.theaterModeIndex).toBe(2)
    expect(detail.theaterStarIndex).toBe(10)
    expect(detail.data).toBe(fullResponse)
  })

  it('should handle profilePicture with only id', () => {
    const data: PlayerInfoResponse = {
      level: 1,
      nameCardId: 210001,
      profilePicture: { id: 11 },
    }
    const detail = PlayerDetail.fromResponse(data)
    expect(detail.profilePictureId).toBe(11)
    expect(detail.profilePictureAvatarId).toBeUndefined()
    expect(detail.profilePictureCostumeId).toBeUndefined()
  })

  it('should handle profilePicture with only costumeId', () => {
    const data: PlayerInfoResponse = {
      level: 1,
      nameCardId: 210001,
      profilePicture: { costumeId: 200301 },
    }
    const detail = PlayerDetail.fromResponse(data)
    expect(detail.profilePictureId).toBeUndefined()
    expect(detail.profilePictureCostumeId).toBe(200301)
  })

  it('should handle empty profilePicture', () => {
    const data: PlayerInfoResponse = {
      level: 1,
      nameCardId: 210001,
      profilePicture: {},
    }
    const detail = PlayerDetail.fromResponse(data)
    expect(detail.profilePictureId).toBeUndefined()
    expect(detail.profilePictureAvatarId).toBeUndefined()
    expect(detail.profilePictureCostumeId).toBeUndefined()
  })

  it('should handle undefined showAvatarInfoList', () => {
    const detail = PlayerDetail.fromResponse(minimalResponse)
    expect(detail.characterPreviews).toEqual([])
  })
})
