import { Client } from '@/client/Client'
import { OutOfRangeError } from '@/errors/OutOfRangeError'
import { CharacterAscension } from '@/models/character/CharacterAscension'
import { StatProperty } from '@/models/StatProperty'
import { FightPropType } from '@/types'
import { calculatePromoteLevel } from '@/utils/calculatePromoteLevel'
import { JsonObject } from '@/utils/JsonParser'

/**
 * Class of character's base stats
 */
export class CharacterBaseStats {
  /**
   * Character ID
   */
  public readonly id: number
  /**
   * Character level
   */
  public readonly level: number
  /**
   * Character promote level
   */
  public readonly promoteLevel: number
  /**
   * Character is ascended
   */
  public readonly isAscended: boolean
  /**
   * Character stats
   */
  public readonly stats: StatProperty[]

  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a character's base stats
   * @param characterId Character ID
   * @param level Character level (1-90). Default: 1
   * @param isAscended Character is ascended (true or false). Default: false
   */
  constructor(
    characterId: number,
    level: number = 1,
    isAscended: boolean = false,
  ) {
    this.id = characterId
    this.level = level
    if (this.level < 1 || this.level > 90)
      throw new OutOfRangeError('level', this.level, 1, 90)
    this.isAscended = isAscended
    const avatarJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarExcelConfigData',
      this.id,
    )

    const avatarPromotesJson = Client._getJsonFromCachedExcelBinOutput(
      'AvatarPromoteExcelConfigData',
      avatarJson.avatarPromoteId as number,
    )
    this.promoteLevel = calculatePromoteLevel(
      avatarPromotesJson,
      this.level,
      this.isAscended,
    )

    const ascension = new CharacterAscension(this.id, this.promoteLevel)

    const propGrowCurves = avatarJson.propGrowCurves as JsonObject[]

    this.stats = this.calculateStatus(avatarJson, propGrowCurves, ascension)
  }

  /**
   * Calculate character's status
   * @param avatarJson Avatar json
   * @param propGrowCurves Prop grow curves
   * @param ascension Character ascension
   * @returns Character's status
   */
  private calculateStatus(
    avatarJson: JsonObject,
    propGrowCurves: JsonObject[],
    ascension: CharacterAscension,
  ): StatProperty[] {
    const initValueObj: Partial<Record<FightPropType, number>> = {
      FIGHT_PROP_BASE_HP: avatarJson.hpBase as number,
      FIGHT_PROP_BASE_ATTACK: avatarJson.attackBase as number,
      FIGHT_PROP_BASE_DEFENSE: avatarJson.defenseBase as number,
      FIGHT_PROP_CRITICAL: avatarJson.critical as number,
      FIGHT_PROP_CRITICAL_HURT: avatarJson.criticalHurt as number,
    }

    const status = Object.entries(initValueObj).map(([key, value]) => {
      const statProperty = new StatProperty(key as FightPropType, value)

      const propGrowCurve = propGrowCurves.find(
        (propGrowCurve) => propGrowCurve.type === statProperty.type,
      )

      if (propGrowCurve) {
        return this.getStatPropertyByJson(
          propGrowCurve,
          statProperty.value,
          ascension.addProps.find(
            (addProp) => addProp.type === statProperty.type,
          )?.value ?? 0,
        )
      } else {
        if (
          statProperty.type === 'FIGHT_PROP_CRITICAL_HURT' ||
          statProperty.type === 'FIGHT_PROP_CRITICAL'
        ) {
          return new StatProperty(
            statProperty.type,
            statProperty.value +
              (ascension.addProps.find(
                (addProp) => addProp.type === statProperty.type,
              )?.value ?? 0),
          )
        }
        return statProperty
      }
    })

    ascension.addProps.forEach((addProp) => {
      if (!status.some((statProperty) => statProperty.type === addProp.type))
        status.push(addProp)
    })

    return status
  }

  /**
   * Get stat value by json
   * @param propGrowCurve Json object
   * @param initValue Initial value
   * @param addValue Add value
   * @returns Stat value
   */
  private getStatPropertyByJson(
    propGrowCurve: JsonObject,
    initValue: number,
    addValue: number = 0,
  ): StatProperty {
    const curveValue = Client._getJsonFromCachedExcelBinOutput(
      'AvatarCurveExcelConfigData',
      propGrowCurve.growCurve as string,
    )[this.level] as number

    const statValue = initValue * curveValue + addValue
    return new StatProperty(propGrowCurve.type as FightPropType, statValue)
  }
}
