import { beforeAll, describe, expect, it } from 'vitest'

import { StatProperty } from '@/adapter/output/StatProperty'
import { Client } from '@/application/client/Client'
import { FightProp } from '@/domain/types/enums'
import { Language } from '@/domain/types/types'

describe('StatProperty', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: Language.En,
      downloadLanguages: [Language.En],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create StatProperty with type and value', () => {
      const stat = new StatProperty(FightProp.FightPropHP, 15552)
      expect(stat).toBeDefined()
    })
  })

  describe('Non-Percent Stats (HP)', () => {
    let stat: StatProperty

    beforeAll(() => {
      stat = new StatProperty(FightProp.FightPropHP, 15552)
    })

    it('should have correct type', () => {
      expect(stat.type).toBe('FIGHT_PROP_HP')
    })

    it('should have correct name', () => {
      expect(stat.name).toBe('HP')
    })

    it('should have correct value', () => {
      expect(stat.value).toBe(15552)
    })

    it('should not be percent', () => {
      expect(stat.isPercent).toBe(false)
    })

    it('should have correct valueText', () => {
      expect(stat.valueText).toBe('15,552')
    })

    it('should have correct multipliedValue', () => {
      expect(stat.multipliedValue).toBe(15552)
    })
  })

  describe('Percent Stats (HP%)', () => {
    let stat: StatProperty

    beforeAll(() => {
      stat = new StatProperty(FightProp.FightPropHPPercent, 0.466)
    })

    it('should have correct type', () => {
      expect(stat.type).toBe('FIGHT_PROP_HP_PERCENT')
    })

    it('should have correct name', () => {
      expect(stat.name).toBe('HP')
    })

    it('should have correct value', () => {
      expect(stat.value).toBe(0.466)
    })

    it('should be percent', () => {
      expect(stat.isPercent).toBe(true)
    })

    it('should have correct valueText with % symbol', () => {
      expect(stat.valueText).toBe('46.6%')
    })

    it('should have correct multipliedValue', () => {
      expect(stat.multipliedValue).toBe(46.6)
    })
  })

  describe('ATK Stats', () => {
    let stat: StatProperty

    beforeAll(() => {
      stat = new StatProperty(FightProp.FightPropAttack, 311)
    })

    it('should have correct type', () => {
      expect(stat.type).toBe('FIGHT_PROP_ATTACK')
    })

    it('should have correct name', () => {
      expect(stat.name).toBe('ATK')
    })

    it('should not be percent', () => {
      expect(stat.isPercent).toBe(false)
    })
  })

  describe('CRIT Rate Stats', () => {
    let stat: StatProperty

    beforeAll(() => {
      stat = new StatProperty(FightProp.FightPropCritical, 0.311)
    })

    it('should have correct type', () => {
      expect(stat.type).toBe('FIGHT_PROP_CRITICAL')
    })

    it('should have correct name', () => {
      expect(stat.name).toBe('CRIT Rate')
    })

    it('should be percent', () => {
      expect(stat.isPercent).toBe(true)
    })

    it('should have correct valueText', () => {
      expect(stat.valueText).toBe('31.1%')
    })

    it('should have correct multipliedValue', () => {
      expect(stat.multipliedValue).toBe(31.1)
    })
  })

  describe('Elemental Mastery Stats', () => {
    let stat: StatProperty

    beforeAll(() => {
      stat = new StatProperty(FightProp.FightPropElementMastery, 187)
    })

    it('should have correct type', () => {
      expect(stat.type).toBe('FIGHT_PROP_ELEMENT_MASTERY')
    })

    it('should have correct name', () => {
      expect(stat.name).toBe('Elemental Mastery')
    })

    it('should not be percent', () => {
      expect(stat.isPercent).toBe(false)
    })
  })

  describe('Zero Value', () => {
    it('should handle zero value for non-percent', () => {
      const stat = new StatProperty(FightProp.FightPropHP, 0)
      expect(stat.value).toBe(0)
      expect(stat.valueText).toBe('0')
      expect(stat.multipliedValue).toBe(0)
    })

    it('should handle zero value for percent', () => {
      const stat = new StatProperty(FightProp.FightPropHPPercent, 0)
      expect(stat.value).toBe(0)
      expect(stat.valueText).toBe('0.0%')
      expect(stat.multipliedValue).toBe(0)
    })
  })

  describe('Various Percent Types', () => {
    it('should recognize ATK% as percent', () => {
      const stat = new StatProperty(FightProp.FightPropAttackPercent, 0.5)
      expect(stat.isPercent).toBe(true)
    })

    it('should recognize DEF% as percent', () => {
      const stat = new StatProperty(FightProp.FightPropDefensePercent, 0.5)
      expect(stat.isPercent).toBe(true)
    })

    it('should recognize CRIT DMG as percent', () => {
      const stat = new StatProperty(FightProp.FightPropCriticalHurt, 0.5)
      expect(stat.isPercent).toBe(true)
    })

    it('should recognize Energy Recharge as percent', () => {
      const stat = new StatProperty(FightProp.FightPropChargeEfficiency, 0.5)
      expect(stat.isPercent).toBe(true)
    })

    it('should recognize Heal Bonus as percent', () => {
      const stat = new StatProperty(FightProp.FightPropHealAdd, 0.5)
      expect(stat.isPercent).toBe(true)
    })

    it('should recognize Pyro DMG Bonus as percent', () => {
      const stat = new StatProperty(FightProp.FightPropFireAddHurt, 0.5)
      expect(stat.isPercent).toBe(true)
    })
  })

  describe('IEEE 754 Rounding', () => {
    it('should handle floating point precision', () => {
      const stat = new StatProperty(FightProp.FightPropHPPercent, 0.1 + 0.2)
      expect(stat.value).toBeCloseTo(0.3, 5)
    })
  })
})
