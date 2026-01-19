import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { CharacterStatusManager } from '@/models/character/CharacterStatusManager'
import { StatProperty } from '@/models/StatProperty'

describe('CharacterStatusManager', () => {
  const mockFightPropData: Record<number, number | undefined> = {
    1: 12858.3564,
    2: 4780.0,
    3: 0.466,
    4: 342.0252,
    5: 311.0,
    6: 0.466,
    7: 784.14,
    8: 0.0,
    9: 0.0,
    10: 0.0,
    11: 0.0,
    20: 0.311,
    22: 1.972,
    23: 1.0,
    26: 0.0,
    27: 0.0,
    28: 0.0,
    29: 0.0,
    30: 0.0,
    40: 0.0,
    41: 0.0,
    42: 0.0,
    43: 0.0,
    44: 0.0,
    45: 0.0,
    46: 0.466,
    50: 0.0,
    51: 0.0,
    52: 0.0,
    53: 0.0,
    54: 0.0,
    55: 0.0,
    56: 0.0,
    70: 0.0,
    71: 0.0,
    72: 0.0,
    73: 0.0,
    74: 0.0,
    75: 80.0,
    76: 0.0,
    80: 0.0,
    81: 0.0,
    1000: 80.0,
    1001: 0.0,
    1002: 0.0,
    1003: 0.0,
    1004: 0.0,
    1005: 80.0,
    1006: 0.0,
    1010: 23766.0,
    2000: 23766.0,
    2001: 2140.0,
    2002: 784.0,
    2003: 0.0,
  }

  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create CharacterStatusManager', () => {
      const manager = new CharacterStatusManager(mockFightPropData)
      expect(manager).toBeDefined()
    })
  })

  describe('Health Properties', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have correct healthBase', () => {
      expect(manager.healthBase).toBeInstanceOf(StatProperty)
      expect(manager.healthBase.value).toBe(12858.3564)
    })

    it('should have correct healthFlat', () => {
      expect(manager.healthFlat).toBeInstanceOf(StatProperty)
      expect(manager.healthFlat.value).toBe(4780.0)
    })

    it('should have correct healthPercent', () => {
      expect(manager.healthPercent).toBeInstanceOf(StatProperty)
      expect(manager.healthPercent.value).toBe(0.466)
    })

    it('should have correct maxHealth', () => {
      expect(manager.maxHealth).toBeInstanceOf(StatProperty)
      expect(manager.maxHealth.value).toBe(23766.0)
    })

    it('should have correct currentHealth', () => {
      expect(manager.currentHealth).toBeInstanceOf(StatProperty)
      expect(manager.currentHealth.value).toBe(23766.0)
    })
  })

  describe('Attack Properties', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have correct attackBase', () => {
      expect(manager.attackBase).toBeInstanceOf(StatProperty)
      expect(manager.attackBase.value).toBe(342.0252)
    })

    it('should have correct attackFlat', () => {
      expect(manager.attackFlat).toBeInstanceOf(StatProperty)
      expect(manager.attackFlat.value).toBe(311.0)
    })

    it('should have correct attackPercent', () => {
      expect(manager.attackPercent).toBeInstanceOf(StatProperty)
      expect(manager.attackPercent.value).toBe(0.466)
    })

    it('should have correct attack', () => {
      expect(manager.attack).toBeInstanceOf(StatProperty)
      expect(manager.attack.value).toBe(2140.0)
    })
  })

  describe('Defense Properties', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have correct defenseBase', () => {
      expect(manager.defenseBase).toBeInstanceOf(StatProperty)
      expect(manager.defenseBase.value).toBe(784.14)
    })

    it('should have correct defenseFlat', () => {
      expect(manager.defenseFlat).toBeInstanceOf(StatProperty)
      expect(manager.defenseFlat.value).toBe(0.0)
    })

    it('should have correct defensePercent', () => {
      expect(manager.defensePercent).toBeInstanceOf(StatProperty)
      expect(manager.defensePercent.value).toBe(0.0)
    })

    it('should have correct defense', () => {
      expect(manager.defense).toBeInstanceOf(StatProperty)
      expect(manager.defense.value).toBe(784.0)
    })
  })

  describe('Speed Properties', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have correct speedBase', () => {
      expect(manager.speedBase).toBeInstanceOf(StatProperty)
      expect(manager.speedBase.value).toBe(0.0)
    })

    it('should have correct speedPercent', () => {
      expect(manager.speedPercent).toBeInstanceOf(StatProperty)
      expect(manager.speedPercent.value).toBe(0.0)
    })

    it('should have correct speed', () => {
      expect(manager.speed).toBeInstanceOf(StatProperty)
      expect(manager.speed.value).toBe(0.0)
    })
  })

  describe('Critical Properties', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have correct critRate', () => {
      expect(manager.critRate).toBeInstanceOf(StatProperty)
      expect(manager.critRate.value).toBe(0.311)
    })

    it('should have correct critDamage', () => {
      expect(manager.critDamage).toBeInstanceOf(StatProperty)
      expect(manager.critDamage.value).toBe(1.972)
    })
  })

  describe('Other Combat Properties', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have correct chargeEfficiency', () => {
      expect(manager.chargeEfficiency).toBeInstanceOf(StatProperty)
      expect(manager.chargeEfficiency.value).toBe(1.0)
    })

    it('should have correct healAdd', () => {
      expect(manager.healAdd).toBeInstanceOf(StatProperty)
      expect(manager.healAdd.value).toBe(0.0)
    })

    it('should have correct healedAdd', () => {
      expect(manager.healedAdd).toBeInstanceOf(StatProperty)
      expect(manager.healedAdd.value).toBe(0.0)
    })

    it('should have correct elementMastery', () => {
      expect(manager.elementMastery).toBeInstanceOf(StatProperty)
      expect(manager.elementMastery.value).toBe(0.0)
    })

    it('should have correct cooldownReduction', () => {
      expect(manager.cooldownReduction).toBeInstanceOf(StatProperty)
      expect(manager.cooldownReduction.value).toBe(0.0)
    })

    it('should have correct shieldStrength', () => {
      expect(manager.shieldStrength).toBeInstanceOf(StatProperty)
      expect(manager.shieldStrength.value).toBe(0.0)
    })
  })

  describe('Elemental Damage Properties', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have correct physicalDamage', () => {
      expect(manager.physicalDamage).toBeInstanceOf(StatProperty)
      expect(manager.physicalDamage.value).toBe(0.0)
    })

    it('should have correct pyroDamage', () => {
      expect(manager.pyroDamage).toBeInstanceOf(StatProperty)
      expect(manager.pyroDamage.value).toBe(0.0)
    })

    it('should have correct electroDamage', () => {
      expect(manager.electroDamage).toBeInstanceOf(StatProperty)
      expect(manager.electroDamage.value).toBe(0.0)
    })

    it('should have correct hydroDamage', () => {
      expect(manager.hydroDamage).toBeInstanceOf(StatProperty)
      expect(manager.hydroDamage.value).toBe(0.0)
    })

    it('should have correct dendroDamage', () => {
      expect(manager.dendroDamage).toBeInstanceOf(StatProperty)
      expect(manager.dendroDamage.value).toBe(0.0)
    })

    it('should have correct anemoDamage', () => {
      expect(manager.anemoDamage).toBeInstanceOf(StatProperty)
      expect(manager.anemoDamage.value).toBe(0.0)
    })

    it('should have correct geoDamage', () => {
      expect(manager.geoDamage).toBeInstanceOf(StatProperty)
      expect(manager.geoDamage.value).toBe(0.0)
    })

    it('should have correct cryoDamage', () => {
      expect(manager.cryoDamage).toBeInstanceOf(StatProperty)
      expect(manager.cryoDamage.value).toBe(0.466)
    })
  })

  describe('Elemental Resistance Properties', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have correct physicalRes', () => {
      expect(manager.physicalRes).toBeInstanceOf(StatProperty)
      expect(manager.physicalRes.value).toBe(0.0)
    })

    it('should have correct pyroRes', () => {
      expect(manager.pyroRes).toBeInstanceOf(StatProperty)
      expect(manager.pyroRes.value).toBe(0.0)
    })

    it('should have correct electroRes', () => {
      expect(manager.electroRes).toBeInstanceOf(StatProperty)
      expect(manager.electroRes.value).toBe(0.0)
    })

    it('should have correct hydroRes', () => {
      expect(manager.hydroRes).toBeInstanceOf(StatProperty)
      expect(manager.hydroRes.value).toBe(0.0)
    })

    it('should have correct dendroRes', () => {
      expect(manager.dendroRes).toBeInstanceOf(StatProperty)
      expect(manager.dendroRes.value).toBe(0.0)
    })

    it('should have correct anemoRes', () => {
      expect(manager.anemoRes).toBeInstanceOf(StatProperty)
      expect(manager.anemoRes.value).toBe(0.0)
    })

    it('should have correct geoRes', () => {
      expect(manager.geoRes).toBeInstanceOf(StatProperty)
      expect(manager.geoRes.value).toBe(0.0)
    })

    it('should have correct cryoRes', () => {
      expect(manager.cryoRes).toBeInstanceOf(StatProperty)
      expect(manager.cryoRes.value).toBe(0.0)
    })
  })

  describe('Energy Cost Properties', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have correct pyroEnergyCost', () => {
      expect(manager.pyroEnergyCost).toBe(0.0)
    })

    it('should have correct electroEnergyCost', () => {
      expect(manager.electroEnergyCost).toBe(0.0)
    })

    it('should have correct hydroEnergyCost', () => {
      expect(manager.hydroEnergyCost).toBe(0.0)
    })

    it('should have correct dendroEnergyCost', () => {
      expect(manager.dendroEnergyCost).toBe(0.0)
    })

    it('should have correct anemoEnergyCost', () => {
      expect(manager.anemoEnergyCost).toBe(0.0)
    })

    it('should have correct cryoEnergyCost', () => {
      expect(manager.cryoEnergyCost).toBe(80.0)
    })

    it('should have correct geoEnergyCost', () => {
      expect(manager.geoEnergyCost).toBe(0.0)
    })

    it('should have correct energyCost', () => {
      expect(manager.energyCost).toBe(80.0)
    })
  })

  describe('Current Energy Properties', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have correct currentPyroEnergy', () => {
      expect(manager.currentPyroEnergy).toBe(80.0)
    })

    it('should have correct currentElectroEnergy', () => {
      expect(manager.currentElectroEnergy).toBe(0.0)
    })

    it('should have correct currentHydroEnergy', () => {
      expect(manager.currentHydroEnergy).toBe(0.0)
    })

    it('should have correct currentDendroEnergy', () => {
      expect(manager.currentDendroEnergy).toBe(0.0)
    })

    it('should have correct currentAnemoEnergy', () => {
      expect(manager.currentAnemoEnergy).toBe(0.0)
    })

    it('should have correct currentCryoEnergy', () => {
      expect(manager.currentCryoEnergy).toBe(80.0)
    })

    it('should have correct currentGeoEnergy', () => {
      expect(manager.currentGeoEnergy).toBe(0.0)
    })

    it('should have correct currentEnergy', () => {
      expect(manager.currentEnergy).toBe(80.0)
    })
  })

  describe('Sorted Damage Bonus', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have sortedDamageBonus as array', () => {
      expect(manager.sortedDamageBonus).toBeDefined()
      expect(Array.isArray(manager.sortedDamageBonus)).toBe(true)
      expect(manager.sortedDamageBonus.length).toBe(8)
    })

    it('should have sortedDamageBonus sorted by value descending', () => {
      for (let i = 0; i < manager.sortedDamageBonus.length - 1; i++) {
        expect(manager.sortedDamageBonus[i].value).toBeGreaterThanOrEqual(
          manager.sortedDamageBonus[i + 1].value,
        )
      }
    })

    it('should have cryoDamage as highest damage bonus', () => {
      expect(manager.sortedDamageBonus[0].value).toBe(0.466)
    })
  })

  describe('Stat Properties Collection', () => {
    let manager: CharacterStatusManager

    beforeAll(() => {
      manager = new CharacterStatusManager(mockFightPropData)
    })

    it('should have statProperties as array', () => {
      expect(manager.statProperties).toBeDefined()
      expect(Array.isArray(manager.statProperties)).toBe(true)
    })

    it('should have statProperties containing StatProperty instances', () => {
      manager.statProperties.forEach((prop) => {
        expect(prop).toBeInstanceOf(StatProperty)
      })
    })

    it('should have statProperties with length greater than 0', () => {
      expect(manager.statProperties.length).toBeGreaterThan(0)
    })
  })

  describe('Default Values', () => {
    it('should use default value 0 for missing fightPropData', () => {
      const emptyManager = new CharacterStatusManager({})
      expect(emptyManager.healthBase.value).toBe(0)
      expect(emptyManager.attackBase.value).toBe(0)
      expect(emptyManager.defenseBase.value).toBe(0)
      expect(emptyManager.critRate.value).toBe(0)
      expect(emptyManager.critDamage.value).toBe(0)
    })
  })
})
