import { StatProperty } from '@/common/StatProperty'
import { FightProp } from '@/types/enums'

/**
 * Factory function type for resolving FightProp to stat name
 */
type StatNameResolver = (type: FightProp) => string

/**
 * Manages character combat statistics from Enka Network fight prop data.
 *
 * Requires a stat name resolver to look up localized names for each FightProp.
 * This is typically provided by the Repository/facade layer.
 */
export class CharacterStatusManager {
  /**
   * Maps numeric fight prop IDs to FightProp enum values
   */
  public static readonly fightPropMap: Readonly<Record<number, FightProp>> = {
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
    40: FightProp.FightPropFireAddHurt,
    41: FightProp.FightPropElecAddHurt,
    42: FightProp.FightPropWaterAddHurt,
    43: FightProp.FightPropGrassAddHurt,
    44: FightProp.FightPropWindAddHurt,
    45: FightProp.FightPropRockAddHurt,
    46: FightProp.FightPropIceAddHurt,
    50: FightProp.FightPropFireSubHurt,
    51: FightProp.FightPropElecSubHurt,
    52: FightProp.FightPropWaterSubHurt,
    53: FightProp.FightPropGrassSubHurt,
    54: FightProp.FightPropWindSubHurt,
    55: FightProp.FightPropRockSubHurt,
    56: FightProp.FightPropIceSubHurt,
    60: FightProp.FightPropEffectHit,
    61: FightProp.FightPropEffectResist,
    65: FightProp.FightPropFreezeShorten,
    67: FightProp.FightPropDizzyShorten,
    80: FightProp.FightPropSkillCDMinusRatio,
    81: FightProp.FightPropShieldCostMinusRatio,
    1010: FightProp.FightPropCurHP,
    2000: FightProp.FightPropMaxHP,
    2001: FightProp.FightPropCurAttack,
    2002: FightProp.FightPropCurDefense,
    2003: FightProp.FightPropCurSpeed,
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

  /**
   * Create a CharacterStatusManager
   * @param fightPropData - Fight prop data from Enka Network (numeric ID → value)
   * @param resolveName - Function to resolve FightProp to localized stat name
   */
  constructor(
    fightPropData: Readonly<Record<number, number | undefined>>,
    resolveName: StatNameResolver,
  ) {
    function get(id: number, defaultValue = 0): StatProperty {
      const fightProp = CharacterStatusManager.fightPropMap[id]
      return new StatProperty({
        type: fightProp,
        name: resolveName(fightProp),
        value: fightPropData[id] ?? defaultValue,
      })
    }

    this.healthBase = get(1)
    this.healthFlat = get(2)
    this.healthPercent = get(3)
    this.attackBase = get(4)
    this.attackFlat = get(5)
    this.attackPercent = get(6)
    this.defenseBase = get(7)
    this.defenseFlat = get(8)
    this.defensePercent = get(9)
    this.speedBase = get(10)
    this.speedPercent = get(11)
    this.critRate = get(20)
    this.critDamage = get(22)
    this.chargeEfficiency = get(23)
    this.healAdd = get(26)
    this.healedAdd = get(27)
    this.elementMastery = get(28)
    this.physicalRes = get(29)
    this.physicalDamage = get(30)
    this.pyroDamage = get(40)
    this.electroDamage = get(41)
    this.hydroDamage = get(42)
    this.dendroDamage = get(43)
    this.anemoDamage = get(44)
    this.geoDamage = get(45)
    this.cryoDamage = get(46)
    this.pyroRes = get(50)
    this.electroRes = get(51)
    this.hydroRes = get(52)
    this.dendroRes = get(53)
    this.anemoRes = get(54)
    this.geoRes = get(55)
    this.cryoRes = get(56)

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

    this.pyroEnergyCost = fightPropData[70] ?? 0
    this.electroEnergyCost = fightPropData[71] ?? 0
    this.hydroEnergyCost = fightPropData[72] ?? 0
    this.dendroEnergyCost = fightPropData[73] ?? 0
    this.anemoEnergyCost = fightPropData[74] ?? 0
    this.cryoEnergyCost = fightPropData[75] ?? 0
    this.geoEnergyCost = fightPropData[76] ?? 0

    this.energyCost = Math.max(
      this.pyroEnergyCost,
      this.electroEnergyCost,
      this.hydroEnergyCost,
      this.dendroEnergyCost,
      this.anemoEnergyCost,
      this.cryoEnergyCost,
      this.geoEnergyCost,
    )

    this.cooldownReduction = get(80)
    this.shieldStrength = get(81)

    this.currentPyroEnergy = fightPropData[1000] ?? 0
    this.currentElectroEnergy = fightPropData[1001] ?? 0
    this.currentHydroEnergy = fightPropData[1002] ?? 0
    this.currentDendroEnergy = fightPropData[1003] ?? 0
    this.currentAnemoEnergy = fightPropData[1004] ?? 0
    this.currentCryoEnergy = fightPropData[1005] ?? 0
    this.currentGeoEnergy = fightPropData[1006] ?? 0

    this.currentEnergy = Math.max(
      this.currentPyroEnergy,
      this.currentElectroEnergy,
      this.currentHydroEnergy,
      this.currentDendroEnergy,
      this.currentAnemoEnergy,
      this.currentCryoEnergy,
      this.currentGeoEnergy,
    )

    this.currentHealth = get(1010)
    this.maxHealth = get(2000)
    this.attack = get(2001)
    this.defense = get(2002)
    this.speed = get(2003)

    this.statProperties = Object.freeze(
      Object.values(this).filter(
        (value): value is StatProperty => value instanceof StatProperty,
      ),
    )
  }
}
