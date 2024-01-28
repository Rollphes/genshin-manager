import { Client } from '@/client/Client'
import { FightPropType } from '@/types'
/**
 * Class of stat property
 */
export class StatProperty {
  /**
   * Stat type
   */
  public readonly type: FightPropType
  /**
   * Stat name
   */
  public readonly name: string
  /**
   * Whether the stat is a percent value
   */
  public readonly isPercent: boolean
  /**
   * Stat value
   */
  public readonly value: number

  /**
   * Create a StatProperty
   * @param type FightPropType
   * @param value Value of the stat
   */
  constructor(type: FightPropType, value: number) {
    this.type = type

    const manualTextJson = Client._getJsonFromCachedExcelBinOutput(
      'ManualTextMapConfigData',
      this.type,
    )

    this.name =
      Client.cachedTextMap.get(
        String(manualTextJson.textMapContentTextMapHash),
      ) || ''

    this.isPercent = percentFightPropType.includes(this.type)

    this.value = this.cleanUp(value)
  }

  /**
   * Get multiplied value
   * @returns Multiplied value
   */
  public get multipliedValue(): number {
    return this.cleanUp(this.value * (this.isPercent ? 100 : 1))
  }

  /**
   * IEEE 754 rounding method
   * @param v Value
   * @returns Rounded value
   */
  private cleanUp(v: number): number {
    return Math.round(v * 100000) / 100000 + 0
  }
}

const percentFightPropType: FightPropType[] = [
  'FIGHT_PROP_HP_PERCENT',
  'FIGHT_PROP_ATTACK_PERCENT',
  'FIGHT_PROP_DEFENSE_PERCENT',
  'FIGHT_PROP_SPEED_PERCENT',

  'FIGHT_PROP_CRITICAL',
  'FIGHT_PROP_CRITICAL_HURT',

  'FIGHT_PROP_CHARGE_EFFICIENCY',

  'FIGHT_PROP_HEAL_ADD',
  'FIGHT_PROP_HEALED_ADD',
  'FIGHT_PROP_PHYSICAL_SUB_HURT',
  'FIGHT_PROP_PHYSICAL_ADD_HURT',
  'FIGHT_PROP_FIRE_ADD_HURT',
  'FIGHT_PROP_ELEC_ADD_HURT',
  'FIGHT_PROP_WATER_ADD_HURT',
  'FIGHT_PROP_GRASS_ADD_HURT',
  'FIGHT_PROP_WIND_ADD_HURT',
  'FIGHT_PROP_ROCK_ADD_HURT',
  'FIGHT_PROP_ICE_ADD_HURT',
  'FIGHT_PROP_FIRE_SUB_HURT',
  'FIGHT_PROP_ELEC_SUB_HURT',
  'FIGHT_PROP_WATER_SUB_HURT',
  'FIGHT_PROP_GRASS_SUB_HURT',
  'FIGHT_PROP_WIND_SUB_HURT',
  'FIGHT_PROP_ROCK_SUB_HURT',
  'FIGHT_PROP_ICE_SUB_HURT',

  'FIGHT_PROP_SKILL_CD_MINUS_RATIO',
  'FIGHT_PROP_SHIELD_COST_MINUS_RATIO',
]
