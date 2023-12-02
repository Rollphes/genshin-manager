import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'

/**
 * Class of character's costume
 */
export class Costume {
  /**
   * Costume ID
   */
  public readonly id: number
  /**
   * Character ID
   */
  public readonly characterId: number
  /**
   * Costume name
   */
  public readonly name: string
  /**
   * Costume description
   */
  public readonly description: string
  /**
   * Costume quality
   */
  public readonly quality: number
  /**
   * Costume side icon
   */
  public readonly sideIcon: ImageAssets
  /**
   * Costume icon
   */
  public readonly icon: ImageAssets
  /**
   * Costume art
   */
  public readonly art: ImageAssets

  /**
   * Create a Costume
   * @param costumeId Costume ID
   */
  constructor(costumeId: number) {
    this.id = costumeId
    const costumeJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarCostumeExcelConfigData',
      this.id,
    )
    this.characterId = costumeJson.characterId as number
    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      this.characterId,
    )

    this.name =
      Client.cachedTextMap.get(String(costumeJson.nameTextMapHash)) || ''
    this.description =
      Client.cachedTextMap.get(String(costumeJson.descTextMapHash)) || ''
    this.quality = (costumeJson.quality as number) || 0
    const sideIconName =
      costumeJson.quality && typeof avatarJson != 'undefined'
        ? (costumeJson.sideIconName as string)
        : (avatarJson.sideIconName as string)
    this.sideIcon = new ImageAssets(sideIconName)
    const nameParts = this.sideIcon.name.split('_')
    const avatarTag = nameParts[nameParts.length - 1]
    this.icon = new ImageAssets('UI_AvatarIcon_' + avatarTag)
    this.art = new ImageAssets(
      costumeJson.quality
        ? 'UI_Costume_' + avatarTag
        : 'UI_Gacha_AvatarImg_' + avatarTag,
    )
  }

  /**
   * Get all costume IDs
   * @returns All costume IDs
   */
  public static getAllCostumeIds(): number[] {
    const costumeDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarCostumeExcelConfigData'),
    )
    return costumeDatas.map((k) => k.skinId as number)
  }
}
