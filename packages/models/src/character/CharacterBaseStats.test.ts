import { describe, expect, it } from 'vitest'

import { CharacterBaseStats } from '@/character/CharacterBaseStats'
import { StatProperty } from '@/common/StatProperty'
import { FightProp } from '@/types/enums'

describe('CharacterBaseStats', () => {
  it('should create at level 1', () => {
    const stats = new CharacterBaseStats({
      id: 10000046,
      level: 1,
      promoteLevel: 0,
      isAscended: false,
      stats: [
        new StatProperty({
          type: FightProp.FightPropBaseHP,
          name: 'Base HP',
          value: 1211,
        }),
        new StatProperty({
          type: FightProp.FightPropBaseAttack,
          name: 'Base ATK',
          value: 8,
        }),
        new StatProperty({
          type: FightProp.FightPropBaseDefense,
          name: 'Base DEF',
          value: 68,
        }),
        new StatProperty({
          type: FightProp.FightPropCritical,
          name: 'CRIT Rate',
          value: 0.05,
        }),
        new StatProperty({
          type: FightProp.FightPropCriticalHurt,
          name: 'CRIT DMG',
          value: 0.5,
        }),
      ],
    })

    expect(stats.id).toBe(10000046)
    expect(stats.level).toBe(1)
    expect(stats.promoteLevel).toBe(0)
    expect(stats.isAscended).toBe(false)
    expect(stats.stats).toHaveLength(5)
  })

  it('should create at level 90 with ascension', () => {
    const stats = new CharacterBaseStats({
      id: 10000046,
      level: 90,
      promoteLevel: 6,
      isAscended: true,
      stats: [
        new StatProperty({
          type: FightProp.FightPropBaseHP,
          name: 'Base HP',
          value: 15552,
        }),
        new StatProperty({
          type: FightProp.FightPropBaseAttack,
          name: 'Base ATK',
          value: 106,
        }),
        new StatProperty({
          type: FightProp.FightPropBaseDefense,
          name: 'Base DEF',
          value: 876,
        }),
        new StatProperty({
          type: FightProp.FightPropCritical,
          name: 'CRIT Rate',
          value: 0.05,
        }),
        new StatProperty({
          type: FightProp.FightPropCriticalHurt,
          name: 'CRIT DMG',
          value: 0.884,
        }),
      ],
    })

    expect(stats.level).toBe(90)
    expect(stats.promoteLevel).toBe(6)
    expect(stats.isAscended).toBe(true)
    expect(stats.stats).toHaveLength(5)
    expect(stats.stats[0].value).toBe(15552)
  })

  it('should handle ascension boundary level', () => {
    const stats = new CharacterBaseStats({
      id: 10000046,
      level: 40,
      promoteLevel: 1,
      isAscended: false,
      stats: [],
    })

    expect(stats.level).toBe(40)
    expect(stats.promoteLevel).toBe(1)
    expect(stats.isAscended).toBe(false)
  })

  it('should handle ascended at boundary level', () => {
    const stats = new CharacterBaseStats({
      id: 10000046,
      level: 40,
      promoteLevel: 2,
      isAscended: true,
      stats: [],
    })

    expect(stats.level).toBe(40)
    expect(stats.promoteLevel).toBe(2)
    expect(stats.isAscended).toBe(true)
  })
})
