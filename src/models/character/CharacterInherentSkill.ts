import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { StatProperty } from '@/models/StatProperty'
import { FightPropType } from '@/types'
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
   * Inherent Skill addProps
   */
  public readonly addProps: StatProperty[]

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

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
      Client._cachedTextMap.get(String(proudSkillJson.nameTextMapHash)) || ''
    this.description =
      Client._cachedTextMap.get(String(proudSkillJson.descTextMapHash)) || ''
    this.icon = new ImageAssets(proudSkillJson.icon as string)
    this.addProps = (proudSkillJson.addProps as JsonObject[])
      .map((addProp) =>
        addProp.propType !== undefined && addProp.value !== undefined
          ? new StatProperty(
              addProp.propType as FightPropType,
              (addProp.value ?? 0) as number,
            )
          : undefined,
      )
      .filter((k): k is StatProperty => k !== undefined)
  }

  /**
   * Get all inherent skill IDs
   * @returns All inherent skill IDs
   */
  public static get allInherentSkillIds(): number[] {
    const characterIds = CharacterInfo.allCharacterIds
    return characterIds.flatMap((characterId) => {
      if ([10000005, 10000007].includes(characterId)) {
        return CharacterInfo.getTravelerSkillDepotIds(characterId).flatMap(
          (skillDepotId) => {
            return new CharacterInfo(characterId, skillDepotId)
              .inherentSkillOrder
          },
        )
      }
      return new CharacterInfo(characterId).inherentSkillOrder
    })
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
