import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { ProfilePictureType } from '@/types'

/**
 * Class of character's profile picture
 */
export class ProfilePicture {
  /**
   * Profile picture ID
   */
  public readonly id: number
  /**
   * Profile picture type
   */
  public readonly type: ProfilePictureType
  /**
   * Avatar ID
   * @description Exists only if type is `PROFILE_PICTURE_UNLOCK_BY_AVATAR`
   */
  public readonly characterId?: number
  /**
   * Costume ID
   * @description Exists only if type is `PROFILE_PICTURE_UNLOCK_BY_COSTUME`
   */
  public readonly costumeId?: number
  /**
   * Material ID
   * @description Exists only if type is `PROFILE_PICTURE_UNLOCK_BY_ITEM`
   */
  public readonly materialId?: number
  /**
   * Quest ID
   * @description Exists only if type is `PROFILE_PICTURE_UNLOCK_BY_PARENT_QUEST`
   */
  public readonly questId?: number
  /**
   * Profile picture icon
   */
  public readonly icon: ImageAssets

  /**
   * Create a ProfilePicture
   * @param profilePictureId Profile picture ID
   */
  constructor(profilePictureId: number) {
    this.id = profilePictureId
    const profilePictureJson = Client._getJsonFromCachedExcelBinOutput(
      'ProfilePictureExcelConfigData',
      this.id,
    )

    const unlockParam = profilePictureJson.unlockParam as number

    switch (profilePictureJson.type) {
      case 'PROFILE_PICTURE_UNLOCK_BY_AVATAR':
        this.characterId = unlockParam
        this.costumeId = new CharacterInfo(unlockParam).defaultCostumeId
        break
      case 'PROFILE_PICTURE_UNLOCK_BY_COSTUME':
        this.costumeId = unlockParam
        this.characterId = new CharacterCostume(unlockParam).characterId
        break
      case 'PROFILE_PICTURE_UNLOCK_BY_ITEM':
        this.materialId = unlockParam
        break
      case 'PROFILE_PICTURE_UNLOCK_BY_PARENT_QUEST':
        this.questId = unlockParam
        break
    }

    this.icon = new ImageAssets(profilePictureJson.iconPath as string)
    this.type = profilePictureJson.type as ProfilePictureType
  }

  /**
   * Get all profile picture IDs
   * @returns Profile picture IDs
   */
  public static get allProfilePictureIds(): number[] {
    return Object.keys(
      Client._getCachedExcelBinOutputByName('ProfilePictureExcelConfigData'),
    ).map((id) => Number(id))
  }

  /**
   * Find profile picture ID by info ID
   * @param unlockParam Costume ID or Character ID or Material ID or Quest ID
   * @returns Profile picture ID
   */
  public static findProfilePictureIdByUnlockParam(
    unlockParam: number,
  ): number | undefined {
    const profilePictureDatas = Object.values(
      Client._getCachedExcelBinOutputByName('ProfilePictureExcelConfigData'),
    )
    const profilePictureData = profilePictureDatas.find(
      (data) => data.unlockParam === unlockParam,
    )
    if (!profilePictureData) return
    return profilePictureData.id as number
  }
}
