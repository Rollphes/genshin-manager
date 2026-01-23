import { Client } from '@/client/Client'
import { toEnum } from '@/domain/typeGuards/toEnum'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { StatProperty } from '@/models/StatProperty'
import { FightProp } from '@/types/enums'

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
   * @param inherentSkillId - inherent skill ID
   */
  constructor(inherentSkillId: number) {
    this.id = inherentSkillId
    const proudSkillGroupId = inherentSkillId
    const proudSkillJson = Client._filterBy(
      'ProudSkillExcelConfigData',
      'proudSkillGroupId',
      proudSkillGroupId,
    ).find((p) => p.level === 1)
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
    const enumContext = {
      source: 'ProudSkillExcelConfigData',
      recordId: `${String(proudSkillGroupId)}[1]`,
    } as const

    this.addProps = proudSkillJson.addProps
      .map((addProp, index) => {
        return {
          ...addProp,
          propType: toEnum(FightProp, addProp.propType, 'FightProp', {
            ...enumContext,
            path: `addProps[${String(index)}].propType`,
          }),
        }
      })
      .filter((addProp) => addProp.propType !== FightProp.FightPropNone)
      .map((addProp) => new StatProperty(addProp.propType, addProp.value))
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
   * @param characterId - character ID
   * @param skillDepotId - skill depot ID
   * @returns inherent skill order
   * @throws Error - When the avatar or skill depot data is not found
   */
  public static getInherentSkillOrderByCharacterId(
    characterId: number,
    skillDepotId?: number,
  ): number[] {
    const avatarJson = Client._findBy(
      'AvatarExcelConfigData',
      'id',
      characterId,
    )
    if (!avatarJson) {
      throw new Error(
        `AvatarExcelConfigData not found for id ${String(characterId)}`,
      )
    }

    const depotId =
      skillDepotId && [10000005, 10000007].includes(characterId)
        ? skillDepotId
        : avatarJson.skillDepotId
    const depotJson = Client._findBy(
      'AvatarSkillDepotExcelConfigData',
      'id',
      depotId,
    )
    if (!depotJson) {
      throw new Error(
        `AvatarSkillDepotExcelConfigData not found for id ${String(depotId)}`,
      )
    }

    return depotJson.inherentProudSkillOpens.map((k) => k.proudSkillGroupId)
  }
}
