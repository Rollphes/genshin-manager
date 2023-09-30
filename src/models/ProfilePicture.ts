import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { Costume } from '@/models/character/Costume'

export type ProfilePictureType =
  | 'PROFILE_PICTURE_UNLOCK_BY_AVATAR'
  | 'PROFILE_PICTURE_UNLOCK_BY_COSTUME'
  | 'PROFILE_PICTURE_UNLOCK_BY_ITEM'

export class ProfilePicture {
  public readonly id: number
  public readonly type: ProfilePictureType
  public readonly characterId?: number
  public readonly costumeId?: number
  public readonly materiaIid?: number
  public readonly icon: ImageAssets

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
      this.materiaIid = infoId
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
}
