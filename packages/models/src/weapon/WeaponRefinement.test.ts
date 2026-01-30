import { describe, expect, it } from 'vitest'

import { StatProperty } from '@/common/StatProperty'
import { FightProp } from '@/types/enums'
import { WeaponRefinement } from '@/weapon/WeaponRefinement'

describe('WeaponRefinement', () => {
  it('should create at refinementRank 1', () => {
    const refinement = new WeaponRefinement({
      id: 13501,
      refinementRank: 1,
      skillName: 'Reckless Cinnabar',
      skillDescription: 'HP increased by 20%.',
      addProps: [
        new StatProperty({
          type: FightProp.FightPropHPPercent,
          name: 'HP%',
          value: 0.2,
        }),
      ],
    })

    expect(refinement.id).toBe(13501)
    expect(refinement.refinementRank).toBe(1)
    expect(refinement.skillName).toBe('Reckless Cinnabar')
    expect(refinement.skillDescription).toContain('20%')
    expect(refinement.addProps).toHaveLength(1)
  })

  it('should create at refinementRank 5', () => {
    const refinement = new WeaponRefinement({
      id: 13501,
      refinementRank: 5,
      skillName: 'Reckless Cinnabar',
      skillDescription: 'HP increased by 40%.',
      addProps: [
        new StatProperty({
          type: FightProp.FightPropHPPercent,
          name: 'HP%',
          value: 0.4,
        }),
      ],
    })

    expect(refinement.refinementRank).toBe(5)
    expect(refinement.addProps[0].value).toBe(0.4)
  })

  it('should handle weapon without skill (1-star)', () => {
    const refinement = new WeaponRefinement({
      id: 11101,
      refinementRank: 1,
      skillName: undefined,
      skillDescription: undefined,
      addProps: [],
    })

    expect(refinement.skillName).toBeUndefined()
    expect(refinement.skillDescription).toBeUndefined()
    expect(refinement.addProps).toHaveLength(0)
  })
})
