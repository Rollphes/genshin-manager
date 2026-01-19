import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { StatProperty } from '@/models/StatProperty'
import { skillLevelSchema } from '@/schemas/commonSchemas'
import { PropType } from '@/types/generated/ProudSkillExcelConfigData'
import { toFightPropType } from '@/utils/typeGuards/toFightPropType'
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
   * @param level skill level (1-15)
   */
  constructor(skillId: number, level = 1) {
    this.id = skillId
    this.level = level
    void validate(skillLevelSchema, this.level, {
      propertyKey: 'level',
    })
    const skillJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarSkillExcelConfigData',
      this.id,
    )
    const proudSkillGroupId = skillJson.proudSkillGroupId
    if (proudSkillGroupId === 0) {
      this.costItems = []
      this.costMora = 0
      this.addProps = []
      return
    }
    const proudSkillJson = Client._getJsonFromCachedExcelBinOutput(
      'ProudSkillExcelConfigData',
      proudSkillGroupId,
    )[this.level]
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
    this.addProps = proudSkillJson.addProps
      .filter((addProp) => addProp.propType !== PropType.FightPropNone)
      .map(
        (addProp) =>
          new StatProperty(
            toFightPropType(addProp.propType, 'CharacterSkillAscension'),
            addProp.value,
          ),
      )
  }
}
