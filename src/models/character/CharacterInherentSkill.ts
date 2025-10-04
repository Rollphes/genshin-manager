import { Client } from '@/client'
import { AssetNotFoundError } from '@/errors'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { StatProperty } from '@/models/StatProperty'
import { PropType } from '@/types/generated/ProudSkillExcelConfigData'
import { toFightPropType } from '@/utils/typeGuards'

/**
 * Represents a character's passive skill with unlocked bonuses and effects
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
   * @param inherentSkillId inherent skill ID
   */
  constructor(inherentSkillId: number) {
    this.id = inherentSkillId
    const proudSkillGroupId = inherentSkillId
    const proudSkillJson = Client._getJsonFromCachedExcelBinOutput(
      'ProudSkillExcelConfigData',
      proudSkillGroupId,
    )[1]
    if (!proudSkillJson) {
      throw new AssetNotFoundError(
        `proudSkillGroupId ${String(proudSkillGroupId)} level 1`,
        'ProudSkillExcelConfigData',
      )
    }
    this.name = Client._cachedTextMap.get(proudSkillJson.nameTextMapHash) ?? ''
    this.description =
      Client._cachedTextMap.get(proudSkillJson.descTextMapHash) ?? ''
    this.icon = new ImageAssets(proudSkillJson.icon)
    this.addProps = proudSkillJson.addProps
      .filter((addProp) => addProp.propType !== PropType.FightPropNone)
      .map(
        (addProp) =>
          new StatProperty(
            toFightPropType(addProp.propType, 'CharacterInherentSkill'),
            addProp.value,
          ),
      )
  }

  /**
   * Get all inherent skill IDs
   * @returns all inherent skill IDs
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
   * @param characterId character ID
   * @param skillDepotId skill depot ID
   * @returns inherent skill order
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
        : avatarJson.skillDepotId
    const depotJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarSkillDepotExcelConfigData',
      depotId,
    )
    return depotJson.inherentProudSkillOpens.map((k) => k.proudSkillGroupId)
  }
}
