import { describe, expect, it } from 'vitest'

import { StatProperty } from '@/common/StatProperty'
import { FightProp } from '@/types/enums'

describe('StatProperty', () => {
  it('should create with correct values', () => {
    const stat = new StatProperty({
      type: FightProp.FightPropBaseHP,
      name: 'Base HP',
      value: 15552,
    })

    expect(stat.type).toBe(FightProp.FightPropBaseHP)
    expect(stat.name).toBe('Base HP')
    expect(stat.value).toBe(15552)
    expect(stat.isPercent).toBe(false)
  })

  it('should detect percent stats', () => {
    const stat = new StatProperty({
      type: FightProp.FightPropCritical,
      name: 'CRIT Rate',
      value: 0.05,
    })

    expect(stat.isPercent).toBe(true)
  })

  it('should detect percent for HEAL stats', () => {
    const stat = new StatProperty({
      type: FightProp.FightPropHealAdd,
      name: 'Healing Bonus',
      value: 0.15,
    })

    expect(stat.isPercent).toBe(true)
  })

  it('should format flat value text', () => {
    const stat = new StatProperty({
      type: FightProp.FightPropBaseHP,
      name: 'Base HP',
      value: 15552,
    })

    expect(stat.valueText).toMatch(/15,552/)
    expect(stat.valueText).not.toContain('%')
  })

  it('should format percent value text', () => {
    const stat = new StatProperty({
      type: FightProp.FightPropCritical,
      name: 'CRIT Rate',
      value: 0.05,
    })

    expect(stat.valueText).toContain('%')
    expect(stat.multipliedValue).toBe(5)
  })

  it('should clean IEEE 754 rounding', () => {
    const stat = new StatProperty({
      type: FightProp.FightPropBaseAttack,
      name: 'Base ATK',
      value: 0.1 + 0.2,
    })

    expect(stat.value).toBe(0.3)
  })

  it('should handle zero value', () => {
    const stat = new StatProperty({
      type: FightProp.FightPropBaseHP,
      name: 'Base HP',
      value: 0,
    })

    expect(stat.value).toBe(0)
    expect(stat.multipliedValue).toBe(0)
    expect(stat.valueText).toMatch(/^0/)
  })
})
