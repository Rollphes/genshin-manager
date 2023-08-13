import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
export class Talent {
  public readonly id: number
  public readonly name: string
  public readonly description: string
  public readonly icon: ImageAssets
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
