import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { Costume } from '@/models/character/Costume'

/**
 * Type of character's profile picture.
 */
export type ProfilePictureType =
  | 'PROFILE_PICTURE_UNLOCK_BY_AVATAR'
  | 'PROFILE_PICTURE_UNLOCK_BY_COSTUME'
  | 'PROFILE_PICTURE_UNLOCK_BY_ITEM'

/**
 * Class of character's profile picture.
 */
export class ProfilePicture {
  /**
   * Profile picture id.
   */
  public readonly id: number
  /**
   * Profile picture type
   */
  public readonly type: ProfilePictureType
  /**
   * Avatar id.
   * Exists only if type is `PROFILE_PICTURE_UNLOCK_BY_AVATAR`
   */
  public readonly characterId?: number
  /**
   * Costume id.
   * Exists only if type is `PROFILE_PICTURE_UNLOCK_BY_COSTUME`
   */
  public readonly costumeId?: number
  /**
   * Material id.
   * Exists only if type is `PROFILE_PICTURE_UNLOCK_BY_ITEM`
   */
  public readonly materialId?: number
  /**
   * Profile picture icon.
   */
  public readonly icon: ImageAssets

  /**
   * Create a ProfilePicture.
   * @param profilePictureId Profile picture id
   */
  constructor(profilePictureId: number) {
    this.id = profilePictureId
    const profilePictureJson = Client._getJsonFromCachedExcelBinOutput(
      'ProfilePictureExcelConfigData',
      this.id,
    )

    const infoId = profilePictureJson.infoId as number
    const cachedAvatar = Client._getCachedExcelBinOutputByName(
      'AvatarExcelConfigData',
    )
    const cachedCostume = Client._getCachedExcelBinOutputByName(
      'AvatarCostumeExcelConfigData',
    )
    const cachedMaterial = Client._getCachedExcelBinOutputByName(
      'MaterialExcelConfigData',
    )
    if (String(infoId) in cachedAvatar) {
      this.characterId = infoId
      const characterInfo = new CharacterInfo(infoId)
      this.costumeId = characterInfo.defaultCostumeId
    } else if (String(infoId) in cachedCostume) {
      this.costumeId = infoId
      const costume = new Costume(infoId)
      this.characterId = costume.characterId
    } else if (String(infoId) in cachedMaterial) {
      this.materialId = infoId
    } else {
      throw new Error(
        `ProfilePictureId ${this.id} has invalid infoId ${infoId}`,
      )
    }

    this.icon = new ImageAssets(profilePictureJson.iconPath as string)
    this.type = profilePictureJson.type as ProfilePictureType
  }

  /**
   * Get all profile picture ids.
   * @returns Profile picture ids
   */
  public static getAllProfilePictureIds(): number[] {
    return Object.keys(
      Client._getCachedExcelBinOutputByName('ProfilePictureExcelConfigData'),
    ).map((id) => Number(id))
  }

  /**
   * Find profile picture id by info id.
   * @param infoId Costume id or Character id or Material id
   * @returns Profile picture id
   */
  public static findProfilePictureIdByInfoId(
    infoId: number,
  ): number | undefined {
    const profilePictureDatas = Object.values(
      Client._getCachedExcelBinOutputByName('ProfilePictureExcelConfigData'),
    )
    const profilePictureData = profilePictureDatas.find(
      (data) => data.infoId === infoId,
    )
    if (!profilePictureData) return
    return profilePictureData.id as number
  }
}
