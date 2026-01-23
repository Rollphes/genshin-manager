import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterCostume } from '@/models/character/CharacterCostume'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { ProfilePictureUnlockType } from '@/types/enums'
import { toEnum } from '@/utils/typeGuards/toEnum'

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
  public readonly type: ProfilePictureUnlockType
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
   * @param profilePictureId - profile picture ID
   */
  constructor(profilePictureId: number) {
    this.id = profilePictureId
    const profilePictureJson = Client._findBy(
      'ProfilePictureExcelConfigData',
      'id',
      this.id,
    )
    if (!profilePictureJson) {
      throw new AssetNotFoundError(
        `ProfilePicture ${String(this.id)}`,
        'ProfilePictureExcelConfigData',
      )
    }

    const unlockParam = profilePictureJson.unlockParam

    this.type = toEnum(
      ProfilePictureUnlockType,
      profilePictureJson.type,
      'ProfilePictureUnlockType',
      {
        source: 'ProfilePictureExcelConfigData',
        recordId: this.id,
        path: 'type',
      },
    )

    switch (this.type) {
      case ProfilePictureUnlockType.ProfilePictureUnlockByAvatar:
        this.characterId = unlockParam
        this.costumeId = new CharacterInfo(unlockParam).defaultCostumeId
        break
      case ProfilePictureUnlockType.ProfilePictureUnlockByCostume:
        this.costumeId = unlockParam
        this.characterId = new CharacterCostume(unlockParam).characterId
        break
      case ProfilePictureUnlockType.ProfilePictureUnlockByItem:
        this.materialId = unlockParam
        break
      case ProfilePictureUnlockType.ProfilePictureUnlockByParentQuest:
        this.questId = unlockParam
        break
    }

    this.icon = new ImageAssets(profilePictureJson.iconPath)
  }

  /**
   * Get all profile picture IDs
   * @returns profile picture IDs
   */
  public static get allProfilePictureIds(): number[] {
    return Client._getAll('ProfilePictureExcelConfigData').map(
      (data) => data.id,
    )
  }

  /**
   * Find profile picture ID by info ID
   * @param unlockParam - costume ID or Character ID or Material ID or Quest ID
   * @returns profile picture ID
   */
  public static findProfilePictureIdByUnlockParam(
    unlockParam: number,
  ): number | undefined {
    const profilePictureData = Client._findBy(
      'ProfilePictureExcelConfigData',
      'unlockParam',
      unlockParam,
    )
    if (!profilePictureData) return
    return profilePictureData.id
  }
}
