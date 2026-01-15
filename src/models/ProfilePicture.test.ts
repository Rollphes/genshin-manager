import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ProfilePicture } from '@/models/ProfilePicture'
import { Type as ProfilePictureType } from '@/types/generated/ProfilePictureExcelConfigData'

describe('ProfilePicture', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all profile picture IDs', () => {
      const ids = ProfilePicture.allProfilePictureIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
    })
  })

  describe('Static Methods', () => {
    it('should find profile picture ID by unlock param', () => {
      const profilePictureId =
        ProfilePicture.findProfilePictureIdByUnlockParam(10000002)
      expect(profilePictureId).toBe(3400)
    })

    it('should return undefined for non-existent unlock param', () => {
      const profilePictureId =
        ProfilePicture.findProfilePictureIdByUnlockParam(99999999)
      expect(profilePictureId).toBeUndefined()
    })
  })

  describe('Constructor', () => {
    it('should create ProfilePicture with valid ID', () => {
      const ids = ProfilePicture.allProfilePictureIds
      const profilePicture = new ProfilePicture(ids[0])
      expect(profilePicture).toBeDefined()
      expect(profilePicture.id).toBe(ids[0])
    })
  })

  describe('Avatar Type (PROFILE_PICTURE_UNLOCK_BY_AVATAR)', () => {
    let profilePicture: ProfilePicture

    beforeAll(() => {
      profilePicture = new ProfilePicture(1)
    })

    it('should have correct id', () => {
      expect(profilePicture.id).toBe(1)
    })

    it('should have correct type', () => {
      expect(profilePicture.type).toBe(
        ProfilePictureType.ProfilePictureUnlockByAvatar,
      )
    })

    it('should have characterId', () => {
      expect(profilePicture.characterId).toBe(10000005)
    })

    it('should have costumeId', () => {
      expect(profilePicture.costumeId).toBe(200500)
    })

    it('should have icon as ImageAssets', () => {
      expect(profilePicture.icon).toBeInstanceOf(ImageAssets)
    })

    it('should not have materialId', () => {
      expect(profilePicture.materialId).toBeUndefined()
    })

    it('should not have questId', () => {
      expect(profilePicture.questId).toBeUndefined()
    })
  })

  describe('Costume Type (PROFILE_PICTURE_UNLOCK_BY_COSTUME)', () => {
    let profilePicture: ProfilePicture

    beforeAll(() => {
      profilePicture = new ProfilePicture(11)
    })

    it('should have correct id', () => {
      expect(profilePicture.id).toBe(11)
    })

    it('should have correct type', () => {
      expect(profilePicture.type).toBe(
        ProfilePictureType.ProfilePictureUnlockByCostume,
      )
    })

    it('should have characterId', () => {
      expect(profilePicture.characterId).toBe(10000005)
    })

    it('should have costumeId', () => {
      expect(profilePicture.costumeId).toBe(200501)
    })

    it('should have icon as ImageAssets', () => {
      expect(profilePicture.icon).toBeInstanceOf(ImageAssets)
    })
  })

  describe('Item Type (PROFILE_PICTURE_UNLOCK_BY_ITEM)', () => {
    let profilePicture: ProfilePicture

    beforeAll(() => {
      profilePicture = new ProfilePicture(99999)
    })

    it('should have correct id', () => {
      expect(profilePicture.id).toBe(99999)
    })

    it('should have correct type', () => {
      expect(profilePicture.type).toBe(
        ProfilePictureType.ProfilePictureUnlockByItem,
      )
    })

    it('should have materialId', () => {
      expect(profilePicture.materialId).toBe(320001)
    })

    it('should not have characterId', () => {
      expect(profilePicture.characterId).toBeUndefined()
    })

    it('should not have costumeId', () => {
      expect(profilePicture.costumeId).toBeUndefined()
    })

    it('should have icon as ImageAssets', () => {
      expect(profilePicture.icon).toBeInstanceOf(ImageAssets)
    })
  })

  describe('Quest Type (PROFILE_PICTURE_UNLOCK_BY_PARENT_QUEST)', () => {
    let profilePicture: ProfilePicture

    beforeAll(() => {
      profilePicture = new ProfilePicture(100010)
    })

    it('should have correct id', () => {
      expect(profilePicture.id).toBe(100010)
    })

    it('should have correct type', () => {
      expect(profilePicture.type).toBe(
        ProfilePictureType.ProfilePictureUnlockByParentQuest,
      )
    })

    it('should have questId', () => {
      expect(profilePicture.questId).toBe(72105)
    })

    it('should not have characterId', () => {
      expect(profilePicture.characterId).toBeUndefined()
    })

    it('should not have materialId', () => {
      expect(profilePicture.materialId).toBeUndefined()
    })

    it('should have icon as ImageAssets', () => {
      expect(profilePicture.icon).toBeInstanceOf(ImageAssets)
    })
  })
})
