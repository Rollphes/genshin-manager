import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Class of character's inherent skill
 */
export class CharacterInherentSkill {
  /**
   * Inherent Skill ID
   */
  public readonly id: number
  /**
   * Inherent Skill name
   */
  public readonly name: string
  /**
   * Inherent Skill description
   */
  public readonly description: string
  /**
   * Inherent Skill icon
   */
  public readonly icon: ImageAssets

  /**
   * Create a Inherent Skill
   * @param inherentSkillId Inherent Skill ID
   */
  constructor(inherentSkillId: number) {
    this.id = inherentSkillId
    const proudSkillGroupId = inherentSkillId
    const proudSkillJson = Client._getJsonFromCachedExcelBinOutput(
      'ProudSkillExcelConfigData',
      proudSkillGroupId,
    )[1] as JsonObject
    this.name =
      Client.cachedTextMap.get(String(proudSkillJson.nameTextMapHash)) || ''
    this.description =
      Client.cachedTextMap.get(String(proudSkillJson.descTextMapHash)) || ''
    this.icon = new ImageAssets(proudSkillJson.icon as string)
  }

  /**
   * Get all inherent skill IDs
   * @returns All inherent skill IDs
   */
  public static getAllInherentSkillIds(): number[] {
    const result: number[] = []
    const skillDepotJson = Object.values(
      Client._getCachedExcelBinOutputByName('AvatarSkillDepotExcelConfigData'),
    )
    skillDepotJson.forEach((k) => {
      ;(k.inherentProudSkillOpens as JsonObject[]).forEach((l) => {
        if (l.proudSkillGroupId === undefined) return
        result.push(l.proudSkillGroupId as number)
      })
    })
    return result
  }

  /**
   * Get inherent skill order by character ID
   * @param characterId Character ID
   * @param skillDepotId Skill depot ID
   * @returns Inherent skill order
   */
  public static getInherentSkillOrderByCharacterId(
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
    const result: number[] = []
    ;(depotJson.inherentProudSkillOpens as JsonObject[]).forEach((k) => {
      if (k.proudSkillGroupId === undefined) return
      result.push(k.proudSkillGroupId as number)
    })
    return result
  }
}
