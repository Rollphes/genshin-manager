import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
export type ProfilePictureType =
  | 'PROFILE_PICTURE_UNLOCK_BY_AVATAR'
  | 'PROFILE_PICTURE_UNLOCK_BY_COSTUME'
  | 'PROFILE_PICTURE_UNLOCK_BY_ITEM'

export class ProfilePicture {
  public readonly id: number
  public readonly type: ProfilePictureType
  public readonly avatarId?: number
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
      this.avatarId = infoId
    } else if (String(infoId) in cachedCostume) {
      this.costumeId = infoId
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
}
