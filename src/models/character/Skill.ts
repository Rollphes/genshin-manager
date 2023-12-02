import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'

/**
 * Class of character's skill
 */
export class Skill {
  /**
   * Skill ID
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
   * @param skillId Skill ID
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
   * Get all skill IDs
   * @returns All skill IDs
   */
  public static getAllSkillIds(): number[] {
    const skillDatas = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarSkillExcelConfigData'),
    )
    return skillDatas.map((data) => data.id as number)
  }

  /**
   * Get skill order by character ID
   * @param characterId Character ID
   * @param skillDepotId Skill depot ID
   * @returns Skill order
   */
  public static getSkillOrderByCharacterId(
    characterId: number,
    skillDepotId?: number,
  ): number[] {
    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      characterId,
    )
    const depotId =
      skillDepotId && [10000005, 10000007].includes(characterId)
        ? skillDepotId
        : (avatarJson.skillDepotId as number)
    const depotJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarSkillDepotExcelConfigData',
      depotId,
    )
    return [501, 701].includes(depotId)
      ? (depotJson.skills as number[]).slice(0, 1)
      : (depotJson.skills as number[])
          .slice(0, 2)
          .concat(depotJson.energySkill as number)
  }
}
