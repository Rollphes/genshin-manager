import { describe, expect, it } from 'vitest'

import { CharacterAscension } from '@/character/CharacterAscension'
import { StatProperty } from '@/common/StatProperty'
import { FightProp } from '@/types/enums'

describe('CharacterAscension', () => {
  it('should create at promoteLevel 0', () => {
    const ascension = new CharacterAscension({
      id: 10000046,
      promoteLevel: 0,
      costItems: [],
      costMora: 0,
      addProps: [
        new StatProperty({
          type: FightProp.FightPropBaseHP,
          name: 'Base HP',
          value: 0,
        }),
        new StatProperty({
          type: FightProp.FightPropBaseAttack,
          name: 'Base ATK',
          value: 0,
        }),
        new StatProperty({
          type: FightProp.FightPropBaseDefense,
          name: 'Base DEF',
          value: 0,
        }),
        new StatProperty({
          type: FightProp.FightPropCriticalHurt,
          name: 'CRIT DMG',
          value: 0,
        }),
      ],
      unlockMaxLevel: 20,
    })

    expect(ascension.id).toBe(10000046)
    expect(ascension.promoteLevel).toBe(0)
    expect(ascension.costItems).toHaveLength(0)
    expect(ascension.costMora).toBe(0)
    expect(ascension.addProps).toHaveLength(4)
    expect(ascension.unlockMaxLevel).toBe(20)
  })

  it('should create at promoteLevel 1 with cost items', () => {
    const ascension = new CharacterAscension({
      id: 10000046,
      promoteLevel: 1,
      costItems: [
        { id: 104001, count: 1 },
        { id: 100055, count: 3 },
        { id: 112001, count: 3 },
      ],
      costMora: 20000,
      addProps: [
        new StatProperty({
          type: FightProp.FightPropCriticalHurt,
          name: 'CRIT DMG',
          value: 0,
        }),
      ],
      unlockMaxLevel: 40,
    })

    expect(ascension.promoteLevel).toBe(1)
    expect(ascension.costItems).toHaveLength(3)
    expect(ascension.costMora).toBe(20000)
    expect(ascension.unlockMaxLevel).toBe(40)
  })

  it('should create at promoteLevel 6 with max cost', () => {
    const ascension = new CharacterAscension({
      id: 10000046,
      promoteLevel: 6,
      costItems: [
        { id: 104163, count: 6 },
        { id: 100086, count: 20 },
        { id: 112009, count: 12 },
        { id: 104003, count: 6 },
      ],
      costMora: 120000,
      addProps: [
        new StatProperty({
          type: FightProp.FightPropCriticalHurt,
          name: 'CRIT DMG',
          value: 0.384,
        }),
      ],
      unlockMaxLevel: 90,
    })

    expect(ascension.promoteLevel).toBe(6)
    expect(ascension.costItems).toHaveLength(4)
    expect(ascension.costMora).toBe(120000)
    expect(ascension.unlockMaxLevel).toBe(90)
  })

  it('should filter costItems without id:0 or count:0', () => {
    const ascension = new CharacterAscension({
      id: 10000046,
      promoteLevel: 1,
      costItems: [
        { id: 104001, count: 1 },
        { id: 100055, count: 3 },
      ],
      costMora: 20000,
      addProps: [],
      unlockMaxLevel: 40,
    })

    expect(ascension.costItems.every((item) => item.id !== 0)).toBe(true)
    expect(ascension.costItems.every((item) => item.count !== 0)).toBe(true)
  })
})
