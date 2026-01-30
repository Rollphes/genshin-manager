import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'
import { ProfilePicture } from '@/profile/ProfilePicture'
import { ProfilePictureUnlockType } from '@/types/enums'

describe('ProfilePicture', () => {
  it('should create avatar-type profile picture', () => {
    const icon = new ImageAssets({
      name: 'UI_AvatarIcon_Hutao',
      imageBaseURL: 'https://example.com',
    })
    const pp = new ProfilePicture({
      id: 1,
      type: ProfilePictureUnlockType.ProfilePictureUnlockByAvatar,
      characterId: 10000046,
      costumeId: 204601,
      materialId: undefined,
      questId: undefined,
      icon,
    })

    expect(pp.id).toBe(1)
    expect(pp.type).toBe(ProfilePictureUnlockType.ProfilePictureUnlockByAvatar)
    expect(pp.characterId).toBe(10000046)
    expect(pp.costumeId).toBe(204601)
    expect(pp.materialId).toBeUndefined()
  })

  it('should create item-type profile picture', () => {
    const icon = new ImageAssets({
      name: 'UI_AvatarIcon_Item',
      imageBaseURL: 'https://example.com',
    })
    const pp = new ProfilePicture({
      id: 2,
      type: ProfilePictureUnlockType.ProfilePictureUnlockByItem,
      characterId: undefined,
      costumeId: undefined,
      materialId: 100001,
      questId: undefined,
      icon,
    })

    expect(pp.materialId).toBe(100001)
    expect(pp.characterId).toBeUndefined()
  })
})
