import { FightPropType, StatProperty } from '@/models/StatProperty'

export class FightProp {
  public readonly healthBase: StatProperty
  public readonly healthFlat: StatProperty
  public readonly healthPercent: StatProperty
  public readonly attackBase: StatProperty
  public readonly attackFlat: StatProperty
  public readonly attackPercent: StatProperty
  public readonly defenseBase: StatProperty
  public readonly defenseFlat: StatProperty
  public readonly defensePercent: StatProperty
  public readonly speedBase: StatProperty
  public readonly speedPercent: StatProperty
  public readonly critRate: StatProperty
  public readonly critDamage: StatProperty
  public readonly chargeEfficiency: StatProperty
  public readonly healAdd: StatProperty
  public readonly healedAdd: StatProperty
  public readonly elementMastery: StatProperty
  public readonly physicalRes: StatProperty
  public readonly physicalDamage: StatProperty
  public readonly pyroDamage: StatProperty
  public readonly electroDamage: StatProperty
  public readonly hydroDamage: StatProperty
  public readonly dendroDamage: StatProperty
  public readonly anemoDamage: StatProperty
  public readonly geoDamage: StatProperty
  public readonly cryoDamage: StatProperty
  public readonly pyroRes: StatProperty
  public readonly electroRes: StatProperty
  public readonly hydroRes: StatProperty
  public readonly dendroRes: StatProperty
  public readonly anemoRes: StatProperty
  public readonly geoRes: StatProperty
  public readonly cryoRes: StatProperty
  public readonly sortedDamageBonus: StatProperty[]
  public readonly pyroEnergyCost: number
  public readonly electroEnergyCost: number
  public readonly hydroEnergyCost: number
  public readonly dendroEnergyCost: number
  public readonly anemoEnergyCost: number
  public readonly cryoEnergyCost: number
  public readonly geoEnergyCost: number
  public readonly energyCost: number
  public readonly cooldownReduction: StatProperty
  public readonly shieldStrength: StatProperty
  public readonly currentPyroEnergy: number
  public readonly currentElectroEnergy: number
  public readonly currentHydroEnergy: number
  public readonly currentDendroEnergy: number
  public readonly currentAnemoEnergy: number
  public readonly currentCryoEnergy: number
  public readonly currentGeoEnergy: number
  public readonly currentEnergy: number
  public readonly currentHealth: StatProperty
  public readonly maxHealth: StatProperty
  public readonly attack: StatProperty
  public readonly defense: StatProperty
  public readonly speed: StatProperty
  private readonly APIfightProp: { [key in number]: number }

  constructor(APIfightProp: { [key in number]: number }) {
    this.APIfightProp = APIfightProp
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

    this.sortedDamageBonus = [
      this.pyroDamage,
      this.electroDamage,
      this.hydroDamage,
      this.dendroDamage,
      this.anemoDamage,
      this.geoDamage,
      this.cryoDamage,
      this.physicalDamage,
    ].sort((a, b) => b.value - a.value)

    this.pyroEnergyCost = this.APIfightProp[70] ?? 0
    this.electroEnergyCost = this.APIfightProp[71] ?? 0
    this.hydroEnergyCost = this.APIfightProp[72] ?? 0
    this.dendroEnergyCost = this.APIfightProp[73] ?? 0
    this.anemoEnergyCost = this.APIfightProp[74] ?? 0
    this.cryoEnergyCost = this.APIfightProp[75] ?? 0
    this.geoEnergyCost = this.APIfightProp[76] ?? 0

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

    this.currentPyroEnergy = this.APIfightProp[1000] ?? 0
    this.currentElectroEnergy = this.APIfightProp[1001] ?? 0
    this.currentHydroEnergy = this.APIfightProp[1002] ?? 0
    this.currentDendroEnergy = this.APIfightProp[1003] ?? 0
    this.currentAnemoEnergy = this.APIfightProp[1004] ?? 0
    this.currentCryoEnergy = this.APIfightProp[1005] ?? 0
    this.currentGeoEnergy = this.APIfightProp[1006] ?? 0

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
  }

  private getStatProperty(id: number, defaultValue = 0): StatProperty {
    return new StatProperty(
      fightProps[id],
      this.APIfightProp[id] ?? defaultValue,
    )
  }
}
const fightProps: { [key in number]: FightPropType } = {
  1: 'FIGHT_PROP_BASE_HP',
  2: 'FIGHT_PROP_HP',
  3: 'FIGHT_PROP_HP_PERCENT',
  4: 'FIGHT_PROP_BASE_ATTACK',
  5: 'FIGHT_PROP_ATTACK',
  6: 'FIGHT_PROP_ATTACK_PERCENT',
  7: 'FIGHT_PROP_BASE_DEFENSE',
  8: 'FIGHT_PROP_DEFENSE',
  9: 'FIGHT_PROP_DEFENSE_PERCENT',
  10: 'FIGHT_PROP_BASE_SPEED',
  11: 'FIGHT_PROP_SPEED_PERCENT',
  20: 'FIGHT_PROP_CRITICAL',
  22: 'FIGHT_PROP_CRITICAL_HURT',
  23: 'FIGHT_PROP_CHARGE_EFFICIENCY',
  26: 'FIGHT_PROP_HEAL_ADD',
  27: 'FIGHT_PROP_HEALED_ADD',
  28: 'FIGHT_PROP_ELEMENT_MASTERY',
  29: 'FIGHT_PROP_PHYSICAL_SUB_HURT',
  30: 'FIGHT_PROP_PHYSICAL_ADD_HURT',
  40: 'FIGHT_PROP_FIRE_ADD_HURT',
  41: 'FIGHT_PROP_ELEC_ADD_HURT',
  42: 'FIGHT_PROP_WATER_ADD_HURT',
  43: 'FIGHT_PROP_GRASS_ADD_HURT',
  44: 'FIGHT_PROP_WIND_ADD_HURT',
  45: 'FIGHT_PROP_ROCK_ADD_HURT',
  46: 'FIGHT_PROP_ICE_ADD_HURT',
  50: 'FIGHT_PROP_FIRE_SUB_HURT',
  51: 'FIGHT_PROP_ELEC_SUB_HURT',
  52: 'FIGHT_PROP_WATER_SUB_HURT',
  53: 'FIGHT_PROP_GRASS_SUB_HURT',
  54: 'FIGHT_PROP_WIND_SUB_HURT',
  55: 'FIGHT_PROP_ROCK_SUB_HURT',
  56: 'FIGHT_PROP_ICE_SUB_HURT',
  // 70: "", // Pyro Energy Cost
  // 71: "", // Electro Energy Cost
  // 72: "", // Hydro Energy Cost
  // 73: "", // Dendro Energy Cost
  // 74: "", // Anemo Energy Cost
  // 75: "", // Cryo Energy Cost
  // 76: "", // Geo Energy Cost
  80: 'FIGHT_PROP_SKILL_CD_MINUS_RATIO',
  81: 'FIGHT_PROP_SHIELD_COST_MINUS_RATIO',
  // 1000: "", // Current Pyro Energy
  // 1001: "", // Current Electro Energy
  // 1002: "", // Current Hydro Energy
  // 1003: "", // Current Dendro Energy
  // 1004: "", // Current Anemo Energy
  // 1005: "", // Current Cryo Energy
  // 1006: "", // Current Geo Energy
  1010: 'FIGHT_PROP_CUR_HP',
  2000: 'FIGHT_PROP_MAX_HP',
  2001: 'FIGHT_PROP_CUR_ATTACK',
  2002: 'FIGHT_PROP_CUR_DEFENSE',
  2003: 'FIGHT_PROP_CUR_SPEED',
}
