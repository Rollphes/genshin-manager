import { Client } from '@/client/Client'
import { StatProperty } from '@/models/StatProperty'
import { skillLevelSchema } from '@/schemas'
import { FightPropType } from '@/types'
import { JsonObject } from '@/types/json'
import { ValidationHelper } from '@/utils/ValidationHelper'

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
  public readonly costItems: {
    /**
     * Cost item ID (materialID)
     */
    id: number
    /**
     * Cost item count
     */
    count: number
  }[]
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
   * @param skillId skill ID
   * @param level skill level (1-15). Default: 1
   */
  constructor(skillId: number, level = 1) {
    this.id = skillId
    this.level = level
    void ValidationHelper.validate(skillLevelSchema, this.level, {
      propertyKey: 'level',
    })
    const skillJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarSkillExcelConfigData',
      this.id,
    )
    const proudSkillGroupId = skillJson.proudSkillGroupId as number
    if (proudSkillGroupId === 0) {
      this.costItems = []
      this.costMora = 0
      this.addProps = []
      return
    }
    const proudSkillJson = Client._getJsonFromCachedExcelBinOutput(
      'ProudSkillExcelConfigData',
      proudSkillGroupId,
    )[this.level] as JsonObject
    this.costItems = (proudSkillJson.costItems as JsonObject[])
      .filter(
        (costItem) => costItem.id !== undefined && costItem.count !== undefined,
      )
      .map((costItem) => {
        return {
          id: costItem.id as number,
          count: costItem.count as number,
        }
      })
    this.costMora = (proudSkillJson.coinCost as number | undefined) ?? 0
    this.addProps = (proudSkillJson.addProps as JsonObject[])
      .filter(
        (addProp) =>
          addProp.propType !== undefined &&
          addProp.propType !== 'FIGHT_PROP_NONE' &&
          addProp.value !== undefined,
      )
      .map(
        (addProp) =>
          new StatProperty(
            addProp.propType as FightPropType,
            (addProp.value ?? 0) as number,
          ),
      )
  }
}
