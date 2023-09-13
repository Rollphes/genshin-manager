import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'

/**
 * Class of character's skill.
 */
export class Skill {
  /**
   * Skill id
   */
  public readonly id: number
  /**
   * Skill name
   */
  public readonly name: string
  /**
   * Skill description
   */
  public readonly description: string
  /**
   * Skill icon
   */
  public readonly icon: ImageAssets
  /**
   * level + extraLevel
   */
  public readonly level: number
  /**
   * Levels increased by talent
   */
  public readonly extraLevel: number

  /**
   * Create a Skill
   * @param skillId Skill id
   * @param level Skill level
   * @param extraLevel Levels increased by talent
   */
  constructor(skillId: number, level: number = 1, extraLevel: number = 0) {
    this.id = skillId
    const skillJson = Client._getJsonFromCachedExcelBinOutput(
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
  /**
   * Get all skill ids
   * @returns All skill ids
   */
  public static getAllSkillIds(): number[] {
    const skillDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarSkillExcelConfigData'),
    )
    return skillDatas.map((data) => data.id as number)
  }
}
