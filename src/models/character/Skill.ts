import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'

export class Skill {
  public readonly id: number
  public readonly name: string
  public readonly description: string
  public readonly icon: ImageAssets
  public readonly level: number
  public readonly extraLevel: number
  constructor(skillId: number, level: number, extraLevel: number = 0) {
    this.id = skillId
    const skillJson = Client.cachedExcelBinOutputGetter(
      'AvatarSkillExcelConfigData',
      this.id,
    )
    this.name =
      Client.cachedTextMap.get(String(skillJson.nameTextMapHash)) || ''
    this.description =
      Client.cachedTextMap.get(String(skillJson.descTextMapHash)) || ''
    this.icon = new ImageAssets(skillJson.skillIcon as string)
    this.extraLevel = extraLevel
    this.level = level + this.extraLevel
  }
}
