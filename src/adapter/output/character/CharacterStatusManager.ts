import { StatProperty } from '@/adapter/output/StatProperty'
import { Client } from '@/application/client/Client'
import { FightProp } from '@/domain/types/enums'

/**
 * Manages character combat statistics and calculated property values
 */
export class CharacterStatusManager {
  private static readonly fightPropMap = {
    0: FightProp.FightPropNone,
    1: FightProp.FightPropBaseHP,
    2: FightProp.FightPropHP,
    3: FightProp.FightPropHPPercent,
    4: FightProp.FightPropBaseAttack,
    5: FightProp.FightPropAttack,
    6: FightProp.FightPropAttackPercent,
    7: FightProp.FightPropBaseDefense,
    8: FightProp.FightPropDefense,
    9: FightProp.FightPropDefensePercent,
    10: FightProp.FightPropBaseSpeed,
    11: FightProp.FightPropSpeedPercent,
    // 12: FIGHT_PROP_HP_MP_PERCENT
    // 13: FIGHT_PROP_ATTACK_MP_PERCENT
    20: FightProp.FightPropCritical,
    21: FightProp.FightPropAntiCritical,
    22: FightProp.FightPropCriticalHurt,
    23: FightProp.FightPropChargeEfficiency,
    24: FightProp.FightPropAddHurt,
    25: FightProp.FightPropSubHurt,
    26: FightProp.FightPropHealAdd,
    27: FightProp.FightPropHealedAdd,
    28: FightProp.FightPropElementMastery,
    29: FightProp.FightPropPhysicalSubHurt,
    30: FightProp.FightPropPhysicalAddHurt,
    // 31: FIGHT_PROP_DEFENCE_IGNORE_RATIO
    // 32: FIGHT_PROP_DEFENCE_IGNORE_DELTA
    40: FightProp.FightPropFireAddHurt,
    41: FightProp.FightPropElecAddHurt,
    42: FightProp.FightPropWaterAddHurt,
    43: FightProp.FightPropGrassAddHurt,
    44: FightProp.FightPropWindAddHurt,
    45: FightProp.FightPropRockAddHurt,
    46: FightProp.FightPropIceAddHurt,
    // 47: FIGHT_PROP_HIT_HEAD_ADD_HURT
    50: FightProp.FightPropFireSubHurt,
    51: FightProp.FightPropElecSubHurt,
    52: FightProp.FightPropWaterSubHurt,
    53: FightProp.FightPropGrassSubHurt,
    54: FightProp.FightPropWindSubHurt,
    55: FightProp.FightPropRockSubHurt,
    56: FightProp.FightPropIceSubHurt,
    60: FightProp.FightPropEffectHit,
    61: FightProp.FightPropEffectResist,
    // 62: FIGHT_PROP_FREEZE_RESIST
    // 64: FIGHT_PROP_DIZZY_RESIST
    65: FightProp.FightPropFreezeShorten,
    67: FightProp.FightPropDizzyShorten,
    // 70: FIGHT_PROP_MAX_FIRE_ENERGY
    // 71: FIGHT_PROP_MAX_ELEC_ENERGY
    // 72: FIGHT_PROP_MAX_WATER_ENERGY
    // 73: FIGHT_PROP_MAX_GRASS_ENERGY
    // 74: FIGHT_PROP_MAX_WIND_ENERGY
    // 75: FIGHT_PROP_MAX_ICE_ENERGY
    // 76: FIGHT_PROP_MAX_ROCK_ENERGY
    80: FightProp.FightPropSkillCDMinusRatio,
    81: FightProp.FightPropShieldCostMinusRatio,
    // 1000: FIGHT_PROP_CUR_FIRE_ENERGY
    // 1001: FIGHT_PROP_CUR_ELEC_ENERGY
    // 1002: FIGHT_PROP_CUR_WATER_ENERGY
    // 1003: FIGHT_PROP_CUR_GRASS_ENERGY
    // 1004: FIGHT_PROP_CUR_WIND_ENERGY
    // 1005: FIGHT_PROP_CUR_ICE_ENERGY
    // 1006: FIGHT_PROP_CUR_ROCK_ENERGY
    1010: FightProp.FightPropCurHP,
    2000: FightProp.FightPropMaxHP,
    2001: FightProp.FightPropCurAttack,
    2002: FightProp.FightPropCurDefense,
    2003: FightProp.FightPropCurSpeed,
    // 3000: FIGHT_PROP_NONEXTRA_ATTACK
    // 3001: FIGHT_PROP_NONEXTRA_DEFENSE
    // 3002: FIGHT_PROP_NONEXTRA_CRITICAL
    // 3003: FIGHT_PROP_NONEXTRA_ANTI_CRITICAL
    // 3004: FIGHT_PROP_NONEXTRA_CRITICAL_HURT
    // 3005: FIGHT_PROP_NONEXTRA_CHARGE_EFFICIENCY
    // 3006: FIGHT_PROP_NONEXTRA_ELEMENT_MASTERY
    // 3007: FIGHT_PROP_NONEXTRA_PHYSICAL_SUB_HURT
    // 3008: FIGHT_PROP_NONEXTRA_FIRE_ADD_HURT
    // 3009: FIGHT_PROP_NONEXTRA_ELEC_ADD_HURT
    // 3010: FIGHT_PROP_NONEXTRA_WATER_ADD_HURT
    // 3011: FIGHT_PROP_NONEXTRA_GRASS_ADD_HURT
    // 3012: FIGHT_PROP_NONEXTRA_WIND_ADD_HURT
    // 3013: FIGHT_PROP_NONEXTRA_ROCK_ADD_HURT
    // 3014: FIGHT_PROP_NONEXTRA_ICE_ADD_HURT
    // 3015: FIGHT_PROP_NONEXTRA_FIRE_SUB_HURT
    // 3016: FIGHT_PROP_NONEXTRA_ELEC_SUB_HURT
    // 3017: FIGHT_PROP_NONEXTRA_WATER_SUB_HURT
    // 3018: FIGHT_PROP_NONEXTRA_GRASS_SUB_HURT
    // 3019: FIGHT_PROP_NONEXTRA_WIND_SUB_HURT
    // 3020: FIGHT_PROP_NONEXTRA_ROCK_SUB_HURT
    // 3021: FIGHT_PROP_NONEXTRA_ICE_SUB_HURT
    // 3022: FIGHT_PROP_NONEXTRA_SKILL_CD_MINUS_RATIO
    // 3023: FIGHT_PROP_NONEXTRA_SHIELD_COST_MINUS_RATIO
    // 3024: FIGHT_PROP_NONEXTRA_PHYSICAL_ADD_HURT
    // 3025: FIGHT_PROP_ELEM_REACT_CRITICAL
    // 3026: FIGHT_PROP_ELEM_REACT_CRITICAL_HURT
    // 3027: FIGHT_PROP_ELEM_REACT_EXPLODE_CRITICAL
    // 3028: FIGHT_PROP_ELEM_REACT_EXPLODE_CRITICAL_HURT
    // 3029: FIGHT_PROP_ELEM_REACT_SWIRL_CRITICAL
    // 3030: FIGHT_PROP_ELEM_REACT_SWIRL_CRITICAL_HURT
    // 3031: FIGHT_PROP_ELEM_REACT_ELECTRIC_CRITICAL
    // 3032: FIGHT_PROP_ELEM_REACT_ELECTRIC_CRITICAL_HURT
    // 3033: FIGHT_PROP_ELEM_REACT_SCONDUCT_CRITICAL
    // 3034: FIGHT_PROP_ELEM_REACT_SCONDUCT_CRITICAL_HURT
    // 3035: FIGHT_PROP_ELEM_REACT_BURN_CRITICAL
    // 3036: FIGHT_PROP_ELEM_REACT_BURN_CRITICAL_HURT
    // 3037: FIGHT_PROP_ELEM_REACT_FROZENBROKEN_CRITICAL
    // 3038: FIGHT_PROP_ELEM_REACT_FROZENBROKEN_CRITICAL_HURT
    // 3039: FIGHT_PROP_ELEM_REACT_OVERGROW_CRITICAL
    // 3040: FIGHT_PROP_ELEM_REACT_OVERGROW_CRITICAL_HURT
    // 3041: FIGHT_PROP_ELEM_REACT_OVERGROW_FIRE_CRITICAL
    // 3042: FIGHT_PROP_ELEM_REACT_OVERGROW_FIRE_CRITICAL_HURT
    // 3043: FIGHT_PROP_ELEM_REACT_OVERGROW_ELECTRIC_CRITICAL
    // 3044: FIGHT_PROP_ELEM_REACT_OVERGROW_ELECTRIC_CRITICAL_HURT
    // 3045: FIGHT_PROP_BASE_ELEM_REACT_CRITICAL
    // 3046: FIGHT_PROP_BASE_ELEM_REACT_CRITICAL_HURT
  }
  /** Base HP */
  public readonly healthBase: StatProperty
  /** Flat HP bonus */
  public readonly healthFlat: StatProperty
  /** HP percentage bonus */
  public readonly healthPercent: StatProperty
  /** Base ATK */
  public readonly attackBase: StatProperty
  /** Flat ATK bonus */
  public readonly attackFlat: StatProperty
  /** ATK percentage bonus */
  public readonly attackPercent: StatProperty
  /** Base DEF */
  public readonly defenseBase: StatProperty
  /** Flat DEF bonus */
  public readonly defenseFlat: StatProperty
  /** DEF percentage bonus */
  public readonly defensePercent: StatProperty
  /** Base speed */
  public readonly speedBase: StatProperty
  /** Speed percentage bonus */
  public readonly speedPercent: StatProperty
  /** Critical rate */
  public readonly critRate: StatProperty
  /** Critical damage */
  public readonly critDamage: StatProperty
  /** Energy recharge */
  public readonly chargeEfficiency: StatProperty
  /** Healing bonus */
  public readonly healAdd: StatProperty
  /** Incoming healing bonus */
  public readonly healedAdd: StatProperty
  /** Elemental mastery */
  public readonly elementMastery: StatProperty
  /** Physical resistance */
  public readonly physicalRes: StatProperty
  /** Physical damage bonus */
  public readonly physicalDamage: StatProperty
  /** Pyro damage bonus */
  public readonly pyroDamage: StatProperty
  /** Electro damage bonus */
  public readonly electroDamage: StatProperty
  /** Hydro damage bonus */
  public readonly hydroDamage: StatProperty
  /** Dendro damage bonus */
  public readonly dendroDamage: StatProperty
  /** Anemo damage bonus */
  public readonly anemoDamage: StatProperty
  /** Geo damage bonus */
  public readonly geoDamage: StatProperty
  /** Cryo damage bonus */
  public readonly cryoDamage: StatProperty
  /** Pyro resistance */
  public readonly pyroRes: StatProperty
  /** Electro resistance */
  public readonly electroRes: StatProperty
  /** Hydro resistance */
  public readonly hydroRes: StatProperty
  /** Dendro resistance */
  public readonly dendroRes: StatProperty
  /** Anemo resistance */
  public readonly anemoRes: StatProperty
  /** Geo resistance */
  public readonly geoRes: StatProperty
  /** Cryo resistance */
  public readonly cryoRes: StatProperty
  /** Damage bonuses sorted by value (descending) */
  public readonly sortedDamageBonus: readonly StatProperty[]
  /** Pyro elemental burst energy cost */
  public readonly pyroEnergyCost: number
  /** Electro elemental burst energy cost */
  public readonly electroEnergyCost: number
  /** Hydro elemental burst energy cost */
  public readonly hydroEnergyCost: number
  /** Dendro elemental burst energy cost */
  public readonly dendroEnergyCost: number
  /** Anemo elemental burst energy cost */
  public readonly anemoEnergyCost: number
  /** Cryo elemental burst energy cost */
  public readonly cryoEnergyCost: number
  /** Geo elemental burst energy cost */
  public readonly geoEnergyCost: number
  /** Maximum elemental burst energy cost */
  public readonly energyCost: number
  /** Cooldown reduction */
  public readonly cooldownReduction: StatProperty
  /** Shield strength */
  public readonly shieldStrength: StatProperty
  /** Current pyro energy */
  public readonly currentPyroEnergy: number
  /** Current electro energy */
  public readonly currentElectroEnergy: number
  /** Current hydro energy */
  public readonly currentHydroEnergy: number
  /** Current dendro energy */
  public readonly currentDendroEnergy: number
  /** Current anemo energy */
  public readonly currentAnemoEnergy: number
  /** Current cryo energy */
  public readonly currentCryoEnergy: number
  /** Current geo energy */
  public readonly currentGeoEnergy: number
  /** Current maximum energy */
  public readonly currentEnergy: number
  /** Current HP */
  public readonly currentHealth: StatProperty
  /** Maximum HP (calculated) */
  public readonly maxHealth: StatProperty
  /** Total ATK (calculated) */
  public readonly attack: StatProperty
  /** Total DEF (calculated) */
  public readonly defense: StatProperty
  /** Total speed (calculated) */
  public readonly speed: StatProperty
  /** All stat properties */
  public readonly statProperties: readonly StatProperty[]

  private readonly fightPropData: Record<number, number | undefined>
  static {
    Client._addExcelBinOutputKeyFromClassPrototype(this.prototype)
  }

  /**
   * Create a CharacterStatusManager
   * @param fightPropData - fightPropMap from EnkaNetwork and other sources
   */
  constructor(fightPropData: Record<number, number | undefined>) {
    this.fightPropData = fightPropData
    this.healthBase = this.getStatProperty(1)
    this.healthFlat = this.getStatProperty(2)
    this.healthPercent = this.getStatProperty(3)
    this.attackBase = this.getStatProperty(4)
    this.attackFlat = this.getStatProperty(5)
    this.attackPercent = this.getStatProperty(6)
    this.defenseBase = this.getStatProperty(7)
    this.defenseFlat = this.getStatProperty(8)
    this.defensePercent = this.getStatProperty(9)
    this.speedBase = this.getStatProperty(10)
    this.speedPercent = this.getStatProperty(11)
    this.critRate = this.getStatProperty(20)
    this.critDamage = this.getStatProperty(22)
    this.chargeEfficiency = this.getStatProperty(23)
    this.healAdd = this.getStatProperty(26)
    this.healedAdd = this.getStatProperty(27)
    this.elementMastery = this.getStatProperty(28)
    this.physicalRes = this.getStatProperty(29)
    this.physicalDamage = this.getStatProperty(30)
    this.pyroDamage = this.getStatProperty(40)
    this.electroDamage = this.getStatProperty(41)
    this.hydroDamage = this.getStatProperty(42)
    this.dendroDamage = this.getStatProperty(43)
    this.anemoDamage = this.getStatProperty(44)
    this.geoDamage = this.getStatProperty(45)
    this.cryoDamage = this.getStatProperty(46)
    this.pyroRes = this.getStatProperty(50)
    this.electroRes = this.getStatProperty(51)
    this.hydroRes = this.getStatProperty(52)
    this.dendroRes = this.getStatProperty(53)
    this.anemoRes = this.getStatProperty(54)
    this.geoRes = this.getStatProperty(55)
    this.cryoRes = this.getStatProperty(56)

    this.sortedDamageBonus = Object.freeze(
      [
        this.pyroDamage,
        this.electroDamage,
        this.hydroDamage,
        this.dendroDamage,
        this.anemoDamage,
        this.geoDamage,
        this.cryoDamage,
        this.physicalDamage,
      ].sort((a, b) => b.value - a.value),
    )

    this.pyroEnergyCost = this.fightPropData[70] ?? 0
    this.electroEnergyCost = this.fightPropData[71] ?? 0
    this.hydroEnergyCost = this.fightPropData[72] ?? 0
    this.dendroEnergyCost = this.fightPropData[73] ?? 0
    this.anemoEnergyCost = this.fightPropData[74] ?? 0
    this.cryoEnergyCost = this.fightPropData[75] ?? 0
    this.geoEnergyCost = this.fightPropData[76] ?? 0

    this.energyCost = Math.max(
      this.pyroEnergyCost,
      this.electroEnergyCost,
      this.hydroEnergyCost,
      this.dendroEnergyCost,
      this.anemoEnergyCost,
      this.cryoEnergyCost,
      this.geoEnergyCost,
    )

    this.cooldownReduction = this.getStatProperty(80)
    this.shieldStrength = this.getStatProperty(81)

    this.currentPyroEnergy = this.fightPropData[1000] ?? 0
    this.currentElectroEnergy = this.fightPropData[1001] ?? 0
    this.currentHydroEnergy = this.fightPropData[1002] ?? 0
    this.currentDendroEnergy = this.fightPropData[1003] ?? 0
    this.currentAnemoEnergy = this.fightPropData[1004] ?? 0
    this.currentCryoEnergy = this.fightPropData[1005] ?? 0
    this.currentGeoEnergy = this.fightPropData[1006] ?? 0

    this.currentEnergy = Math.max(
      this.currentPyroEnergy,
      this.currentElectroEnergy,
      this.currentHydroEnergy,
      this.currentDendroEnergy,
      this.currentAnemoEnergy,
      this.currentCryoEnergy,
      this.currentGeoEnergy,
    )

    this.currentHealth = this.getStatProperty(1010)

    this.maxHealth = this.getStatProperty(2000)

    this.attack = this.getStatProperty(2001)
    this.defense = this.getStatProperty(2002)
    this.speed = this.getStatProperty(2003)

    this.statProperties = Object.freeze(
      Object.values(this).filter(
        (value): value is StatProperty => value instanceof StatProperty,
      ),
    )
  }

  /**
   * Get StatProperty from fightPropData
   * @param id - fightProp ID
   * @param defaultValue - default value if fightPropData[ID] is undefined
   * @returns StatProperty
   * @throws AssetNotFoundError - when ManualTextMapConfigData for the given ID is not found
   */
  private getStatProperty(
    id: keyof typeof CharacterStatusManager.fightPropMap,
    defaultValue = 0,
  ): StatProperty {
    return new StatProperty(
      CharacterStatusManager.fightPropMap[id],
      this.fightPropData[id] ?? defaultValue,
    )
  }
}
