import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'

/**
 * Class of character's talent.
 */
export class Talent {
  /**
   * Talent id
   */
  public readonly id: number
  /**
   * Talent name
   */
  public readonly name: string
  /**
   * Talent description
   */
  public readonly description: string
  /**
   * Talent icon
   */
  public readonly icon: ImageAssets
  /**
   * Whether the talent is locked
   */
  public readonly locked: boolean

  constructor(talentId: number, locked: boolean = false) {
    this.id = talentId
    this.locked = locked
    const talentJson = Client.cachedExcelBinOutputGetter(
      'AvatarTalentExcelConfigData',
      this.id,
    )
    this.name =
      Client.cachedTextMap.get(String(talentJson.nameTextMapHash)) || ''
    this.description =
      Client.cachedTextMap.get(String(talentJson.descTextMapHash)) || ''
    this.icon = new ImageAssets(talentJson.icon as string)
  }
}
