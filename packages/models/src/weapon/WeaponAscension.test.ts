import { describe, expect, it } from 'vitest'

import { StatProperty } from '@/common/StatProperty'
import { FightProp } from '@/types/enums'
import { WeaponAscension } from '@/weapon/WeaponAscension'

describe('WeaponAscension', () => {
  it('should create at promoteLevel 0', () => {
    const ascension = new WeaponAscension({
      id: 13501,
      promoteLevel: 0,
      costItems: [],
      costMora: 0,
      addProps: [
        new StatProperty({
          type: FightProp.FightPropBaseAttack,
          name: 'Base ATK',
          value: 0,
        }),
      ],
      unlockMaxLevel: 20,
    })

    expect(ascension.id).toBe(13501)
    expect(ascension.promoteLevel).toBe(0)
    expect(ascension.costItems).toHaveLength(0)
    expect(ascension.costMora).toBe(0)
    expect(ascension.addProps).toHaveLength(1)
    expect(ascension.unlockMaxLevel).toBe(20)
  })

  it('should create at promoteLevel 6 with materials', () => {
    const ascension = new WeaponAscension({
      id: 13501,
      promoteLevel: 6,
      costItems: [
        { id: 114033, count: 6 },
        { id: 112009, count: 12 },
        { id: 114003, count: 4 },
      ],
      costMora: 65000,
      addProps: [
        new StatProperty({
          type: FightProp.FightPropBaseAttack,
          name: 'Base ATK',
          value: 311.2,
        }),
      ],
      unlockMaxLevel: 90,
    })

    expect(ascension.promoteLevel).toBe(6)
    expect(ascension.costItems).toHaveLength(3)
    expect(ascension.costMora).toBe(65000)
    expect(ascension.unlockMaxLevel).toBe(90)
  })

  it('should handle low rarity weapon max promoteLevel', () => {
    const ascension = new WeaponAscension({
      id: 11101,
      promoteLevel: 4,
      costItems: [{ id: 114012, count: 2 }],
      costMora: 15000,
      addProps: [],
      unlockMaxLevel: 70,
    })

    expect(ascension.promoteLevel).toBe(4)
    expect(ascension.unlockMaxLevel).toBe(70)
  })
})
