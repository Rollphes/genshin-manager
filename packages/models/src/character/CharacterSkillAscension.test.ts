import { describe, expect, it } from 'vitest'

import { CharacterSkillAscension } from '@/character/CharacterSkillAscension'
import { StatProperty } from '@/common/StatProperty'
import { FightProp } from '@/types/enums'

describe('CharacterSkillAscension', () => {
  it('should create at level 1 with no cost', () => {
    const skillAsc = new CharacterSkillAscension({
      id: 4631,
      level: 1,
      costItems: [],
      costMora: 0,
      addProps: [],
    })

    expect(skillAsc.id).toBe(4631)
    expect(skillAsc.level).toBe(1)
    expect(skillAsc.costItems).toHaveLength(0)
    expect(skillAsc.costMora).toBe(0)
    expect(skillAsc.addProps).toHaveLength(0)
  })

  it('should create at level 2 with cost', () => {
    const skillAsc = new CharacterSkillAscension({
      id: 4631,
      level: 2,
      costItems: [
        { id: 104301, count: 3 },
        { id: 112001, count: 6 },
      ],
      costMora: 12500,
      addProps: [],
    })

    expect(skillAsc.level).toBe(2)
    expect(skillAsc.costItems).toHaveLength(2)
    expect(skillAsc.costMora).toBe(12500)
  })

  it('should create at level 10 with max cost', () => {
    const skillAsc = new CharacterSkillAscension({
      id: 4631,
      level: 10,
      costItems: [
        { id: 104303, count: 4 },
        { id: 112009, count: 6 },
        { id: 113018, count: 1 },
        { id: 104003, count: 3 },
      ],
      costMora: 700000,
      addProps: [],
    })

    expect(skillAsc.level).toBe(10)
    expect(skillAsc.costItems).toHaveLength(4)
    expect(skillAsc.costMora).toBe(700000)
    expect(skillAsc.addProps).toHaveLength(0)
  })

  it('should handle addProps when present', () => {
    const skillAsc = new CharacterSkillAscension({
      id: 4631,
      level: 5,
      costItems: [],
      costMora: 0,
      addProps: [
        new StatProperty({
          type: FightProp.FightPropBaseAttack,
          name: 'Base ATK',
          value: 10,
        }),
      ],
    })

    expect(skillAsc.addProps).toHaveLength(1)
    expect(skillAsc.addProps[0].value).toBe(10)
  })

  it('should filter costItems without id:0 or count:0', () => {
    const skillAsc = new CharacterSkillAscension({
      id: 4631,
      level: 2,
      costItems: [
        { id: 104301, count: 3 },
        { id: 112001, count: 6 },
      ],
      costMora: 12500,
      addProps: [],
    })

    expect(skillAsc.costItems.every((item) => item.id !== 0)).toBe(true)
    expect(skillAsc.costItems.every((item) => item.count !== 0)).toBe(true)
  })
})
