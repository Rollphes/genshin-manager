import { Client } from '@/application/client/Client'
import { calculatePromoteLevel } from '@/domain/parsers/calculatePromoteLevel'
import { characterLevelSchema } from '@/domain/schemas/commonSchemas'
import { toEnum } from '@/domain/typeGuards/toEnum'
import { FightProp, GrowCurve } from '@/domain/types/enums'
import { validate } from '@/domain/validation/validate'
import { CharacterAscension } from '@/interface/character/CharacterAscension'
import { StatProperty } from '@/interface/StatProperty'

type Stats = Partial<Record<FightProp, number>>

/**
 * Represents a character's base statistical properties and attributes
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
   * @param characterId - character ID
   * @param level - character level (1-100)
   * @param isAscended - character is ascended
   */
  constructor(characterId: number, level = 1, isAscended = false) {
    this.id = characterId
    this.level = validate(characterLevelSchema, level, {
      propertyKey: 'level',
    })
    this.isAscended = isAscended
    const avatarJson = Client._findBy('AvatarExcelConfigData', 'id', this.id)
    if (!avatarJson) {
      throw new Error(
        `AvatarExcelConfigData not found for id ${String(this.id)}`,
      )
    }

    const avatarPromotesJson = Client._filterBy(
      'AvatarPromoteExcelConfigData',
      'avatarPromoteId',
      avatarJson.avatarPromoteId,
    )
    this.promoteLevel = calculatePromoteLevel(
      avatarPromotesJson,
      this.level,
      this.isAscended,
    )

    const ascension = new CharacterAscension(this.id, this.promoteLevel)

    const initStats: Stats = {
      FIGHT_PROP_BASE_HP: avatarJson.hpBase,
      FIGHT_PROP_BASE_ATTACK: avatarJson.attackBase,
      FIGHT_PROP_BASE_DEFENSE: avatarJson.defenseBase,
      FIGHT_PROP_CRITICAL: avatarJson.critical,
      FIGHT_PROP_CRITICAL_HURT: avatarJson.criticalHurt,
    }
    const enumContext = {
      source: 'AvatarExcelConfigData',
      recordId: avatarJson.id,
    } as const

    this.stats = this.calculateStats(
      initStats,
      avatarJson.propGrowCurves.map((propGrowCurve, index) => {
        return {
          growCurve: toEnum(GrowCurve, propGrowCurve.growCurve, 'GrowCurve', {
            ...enumContext,
            path: `propGrowCurves[${String(index)}].growCurve`,
          }),
          type: toEnum(FightProp, propGrowCurve.type, 'FightProp', {
            ...enumContext,
            path: `propGrowCurves[${String(index)}].type`,
          }),
        }
      }),
      ascension,
    )
  }

  private calculateStats(
    initStats: Stats,
    propGrowCurves: {
      growCurve: GrowCurve
      type: FightProp
    }[],
    ascension: CharacterAscension,
  ): StatProperty[] {
    const status = Object.entries(initStats).map(([key, value]) => {
      const statProperty = new StatProperty(
        toEnum(FightProp, key, 'FightProp', { path: 'initStats' }),
        value,
      )

      const propGrowCurve = propGrowCurves.find(
        (propGrowCurve) => propGrowCurve.type === statProperty.type,
      )

      if (propGrowCurve) {
        return this.getStatPropertyByGrow(
          propGrowCurve.growCurve,
          statProperty.type,
          statProperty.value,
          ascension.addProps.find(
            (addProp) => addProp.type === statProperty.type,
          )?.value ?? 0,
        )
      } else {
        if (
          statProperty.type === FightProp.FightPropCriticalHurt ||
          statProperty.type === FightProp.FightPropCritical
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

  private getStatPropertyByGrow(
    type: GrowCurve,
    propType: FightProp,
    initValue: number,
    addValue = 0,
  ): StatProperty {
    const curveData = Client._filterBy(
      'AvatarCurveExcelConfigData',
      'level',
      this.level,
    ).find((c) =>
      c.curveInfos.some((info) => (info.type as string) === (type as string)),
    )
    const curveInfo = curveData?.curveInfos.find(
      (info) => (info.type as string) === (type as string),
    )
    const curveValue = curveInfo?.value ?? 1
    const statValue = initValue * curveValue + addValue
    return new StatProperty(propType, statValue)
  }
}
