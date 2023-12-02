import { FightProps, StatProperty } from '@/models/StatProperty'

/**
 * Class of Character's Combat Properties
 */
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
  private readonly fightPropData: { [key in number]: number | undefined }

  /**
   * Create a FightProp
   * @param fightPropData FightPropMap from EnkaNetwork and other sources
   */
  constructor(fightPropData: { [key in number]: number | undefined }) {
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
  }

  /**
   * Get StatProperty from fightPropData
   * @param id FightPropId
   * @param defaultValue Default value if fightPropData[id] is undefined
   * @returns StatProperty
   */
  private getStatProperty(
    id: keyof typeof FightProps,
    defaultValue = 0,
  ): StatProperty {
    return new StatProperty(
      FightProps[id],
      this.fightPropData[id] ?? defaultValue,
    )
  }
}
