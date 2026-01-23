import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { StatProperty } from '@/models/StatProperty'
import { skillLevelSchema } from '@/schemas/commonSchemas'
import { FightProp } from '@/types/enums'
import { CostItem } from '@/types/types'
import { toEnum } from '@/utils/typeGuards/toEnum'
import { validate } from '@/utils/validation/validate'

/**
 * Manages character skill leveling data including costs and stat bonuses
 */
export class CharacterSkillAscension {
  /**
   * Skill ID
   */
  public readonly id: number
  /**
   * Skill level
   */
  public readonly level: number
  /**
   * Skill ascension costItems
   */
  public readonly costItems: CostItem[]
  /**
   * Skill ascension costMora
   */
  public readonly costMora: number
  /**
   * Skill ascension addProps
   */
  public readonly addProps: StatProperty[]

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a character skill ascension
   * @param skillId - skill ID
   * @param level - skill level (1-15)
   */
  constructor(skillId: number, level = 1) {
    this.id = skillId
    this.level = level
    void validate(skillLevelSchema, this.level, {
      propertyKey: 'level',
    })
    const skillJson = Client._findBy(
      'AvatarSkillExcelConfigData',
      'id',
      this.id,
    )
    if (!skillJson) {
      throw new Error(
        `AvatarSkillExcelConfigData not found for id ${String(this.id)}`,
      )
    }

    const proudSkillGroupId = skillJson.proudSkillGroupId
    if (proudSkillGroupId === 0) {
      this.costItems = []
      this.costMora = 0
      this.addProps = []
      return
    }
    const proudSkillJson = Client._filterBy(
      'ProudSkillExcelConfigData',
      'proudSkillGroupId',
      proudSkillGroupId,
    ).find((p) => p.level === this.level)
    if (!proudSkillJson) {
      throw new AssetNotFoundError(
        `level ${String(this.level)}`,
        'ProudSkillExcelConfigData',
      )
    }
    this.costItems = proudSkillJson.costItems
      .filter((costItem) => costItem.id !== 0 && costItem.count !== 0)
      .map((costItem) => {
        return {
          id: costItem.id,
          count: costItem.count,
        }
      })
    this.costMora = proudSkillJson.coinCost
    const enumContext = {
      source: 'ProudSkillExcelConfigData',
      recordId: `${String(proudSkillGroupId)}[${String(this.level)}]`,
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
}
