import { describe, expect, it } from 'vitest'

import { CharacterStatusManager } from '@/character/CharacterStatusManager'
import { FightProp } from '@/types/enums'

describe('CharacterStatusManager', () => {
  function mockResolver(type: FightProp): string {
    return type
  }

  it('should create with fight prop data', () => {
    const manager = new CharacterStatusManager(
      {
        1: 15552,
        4: 311,
        7: 876,
        20: 0.05,
        22: 0.5,
      },
      mockResolver,
    )

    expect(manager.healthBase.value).toBe(15552)
    expect(manager.attackBase.value).toBe(311)
    expect(manager.defenseBase.value).toBe(876)
    expect(manager.critRate.value).toBe(0.05)
    expect(manager.critDamage.value).toBe(0.5)
  })

  it('should default to 0 for missing props', () => {
    const manager = new CharacterStatusManager({}, mockResolver)

    expect(manager.healthBase.value).toBe(0)
    expect(manager.attackBase.value).toBe(0)
    expect(manager.energyCost).toBe(0)
  })

  it('should calculate energy cost as max', () => {
    const manager = new CharacterStatusManager(
      {
        70: 60,
        71: 80,
        72: 40,
      },
      mockResolver,
    )

    expect(manager.pyroEnergyCost).toBe(60)
    expect(manager.electroEnergyCost).toBe(80)
    expect(manager.energyCost).toBe(80)
  })

  it('should sort damage bonuses descending', () => {
    const manager = new CharacterStatusManager(
      {
        40: 0.466,
        41: 0.1,
        42: 0.0,
      },
      mockResolver,
    )

    expect(manager.sortedDamageBonus[0].value).toBe(0.466)
    expect(manager.sortedDamageBonus.length).toBe(8)
  })

  it('should collect all stat properties', () => {
    const manager = new CharacterStatusManager({ 1: 100, 4: 50 }, mockResolver)

    expect(manager.statProperties.length).toBeGreaterThan(0)
    expect(
      manager.statProperties.every((p) => typeof p.type === 'string'),
    ).toBe(true)
  })

  it('should expose FIGHT_PROP_MAP', () => {
    expect(CharacterStatusManager.fightPropMap[1]).toBe(
      FightProp.FightPropBaseHP,
    )
    expect(CharacterStatusManager.fightPropMap[2000]).toBe(
      FightProp.FightPropMaxHP,
    )
  })
})
