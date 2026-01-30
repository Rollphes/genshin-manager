import { describe, expect, it } from 'vitest'

import { DailyFarming } from '@/common/DailyFarming'

describe('DailyFarming', () => {
  it('should create with domains', () => {
    const farming = new DailyFarming({
      dayOfWeek: 1,
      talentBookIds: [104301, 104302, 104303],
      weaponMaterialIds: [114001, 114002, 114003],
      domains: [
        {
          name: 'Forsaken Rift',
          description: '',
          materialIds: [104301, 104302, 104303],
          characterIds: [],
          weaponIds: [11501, 12501],
        },
      ],
    })

    expect(farming.dayOfWeek).toBe(1)
    expect(farming.talentBookIds).toHaveLength(3)
    expect(farming.weaponMaterialIds).toHaveLength(3)
    expect(farming.domains).toHaveLength(1)
    expect(farming.domains[0].name).toBe('Forsaken Rift')
  })

  it('should handle Sunday with empty domains', () => {
    const farming = new DailyFarming({
      dayOfWeek: 0,
      talentBookIds: [],
      weaponMaterialIds: [],
      domains: [],
    })

    expect(farming.dayOfWeek).toBe(0)
    expect(farming.domains).toHaveLength(0)
  })
})
