import { Client } from '@/client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { Type as ProfilePictureType } from '@/types/generated/ProfilePictureExcelConfigData'

/**
 * Manages character avatar images and profile picture assets
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

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a ProfilePicture
   * @param profilePictureId profile picture ID
   */
  constructor(profilePictureId: number) {
    this.id = profilePictureId
    const profilePictureJson = Client._getJsonFromCachedExcelBinOutput(
      'ProfilePictureExcelConfigData',
      this.id,
    )

    const unlockParam = profilePictureJson.unlockParam

    switch (profilePictureJson.type) {
      case ProfilePictureType.ProfilePictureUnlockByAvatar:
        this.characterId = unlockParam
        this.costumeId = new CharacterInfo(unlockParam).defaultCostumeId
        break
      case ProfilePictureType.ProfilePictureUnlockByCostume:
        this.costumeId = unlockParam
        this.characterId = new CharacterCostume(unlockParam).characterId
        break
      case ProfilePictureType.ProfilePictureUnlockByItem:
        this.materialId = unlockParam
        break
      case ProfilePictureType.ProfilePictureUnlockByParentQuest:
        this.questId = unlockParam
        break
    }

    this.icon = new ImageAssets(profilePictureJson.iconPath)
    this.type = profilePictureJson.type
  }

  /**
   * Get all profile picture IDs
   * @returns profile picture IDs
   */
  public static get allProfilePictureIds(): number[] {
    return Object.keys(
      Client._getCachedExcelBinOutputByName('ProfilePictureExcelConfigData'),
    ).map((id) => Number(id))
  }

  /**
   * Find profile picture ID by info ID
   * @param unlockParam costume ID or Character ID or Material ID or Quest ID
   * @returns profile picture ID
   */
  public static findProfilePictureIdByUnlockParam(
    unlockParam: number,
  ): number | undefined {
    const profilePictureDatas = Object.values(
      Client._getCachedExcelBinOutputByName('ProfilePictureExcelConfigData'),
    )
    const profilePictureData = profilePictureDatas.find(
      (data) => data !== undefined && data.unlockParam === unlockParam,
    )
    if (!profilePictureData) return
    return profilePictureData.id
  }
}
