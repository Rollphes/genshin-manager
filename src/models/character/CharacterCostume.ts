import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'

/**
 * Represents character outfit skins and alternative visual appearances
 */
export class CharacterCostume {
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
   * Costume card
   */
  public readonly card: ImageAssets

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a Costume
   * @param costumeId - costume ID
   */
  constructor(costumeId: number) {
    this.id = costumeId
    const costumeJson = Client._findBy(
      'AvatarCostumeExcelConfigData',
      'skinId',
      this.id,
    )
    if (!costumeJson) {
      throw new Error(
        `AvatarCostumeExcelConfigData not found for costumeId ${String(this.id)}`,
      )
    }

    this.characterId = costumeJson.characterId
    const avatarJson = Client._findBy(
      'AvatarExcelConfigData',
      'id',
      this.characterId,
    )
    if (!avatarJson) {
      throw new Error(
        `AvatarExcelConfigData not found for characterId ${String(this.characterId)}`,
      )
    }

    const nameTextMapHash = costumeJson.nameTextMapHash
    const descTextMapHash = costumeJson.descTextMapHash
    this.name = Client._cachedTextMap.get(nameTextMapHash) ?? ''
    this.description = Client._cachedTextMap.get(descTextMapHash) ?? ''
    this.quality = costumeJson.quality
    const sideIconName = costumeJson.quality
      ? costumeJson.sideIconName
      : avatarJson.sideIconName
    this.sideIcon = new ImageAssets(sideIconName)
    const nameParts = this.sideIcon.name.split('_')
    const avatarTag = nameParts[nameParts.length - 1]
    this.icon = new ImageAssets('UI_AvatarIcon_' + avatarTag)
    this.art = new ImageAssets(
      costumeJson.quality
        ? 'UI_Costume_' + avatarTag
        : 'UI_Gacha_AvatarImg_' + avatarTag,
    )
    this.card = new ImageAssets('UI_AvatarIcon_' + avatarTag + '_Card')
  }

  /**
   * Get all costume IDs
   * @returns all costume IDs
   */
  public static get allCostumeIds(): number[] {
    const costumeDatas = Client._getAll('AvatarCostumeExcelConfigData')
    return costumeDatas.map((k) => k.skinId)
  }
}
