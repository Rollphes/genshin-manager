import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'
import { CharacterInherentSkill } from '@/character/CharacterInherentSkill'
import { StatProperty } from '@/common/StatProperty'
import { FightProp } from '@/types/enums'

const BASE_URL = 'https://example.com'

describe('CharacterInherentSkill', () => {
  it('should create combat passive skill', () => {
    const icon = new ImageAssets({
      name: 'UI_Talent_S_Hutao_07',
      imageBaseURL: BASE_URL,
    })
    const skill = new CharacterInherentSkill({
      id: 462101,
      name: 'Flutter By',
      description: 'When a Paramita Papilio state ends...',
      icon,
      addProps: [],
    })

    expect(skill.id).toBe(462101)
    expect(skill.name).toBe('Flutter By')
    expect(skill.description).toContain('Paramita Papilio')
    expect(skill.icon.name).toBe('UI_Talent_S_Hutao_07')
    expect(skill.addProps).toHaveLength(0)
  })

  it('should create exploration passive skill', () => {
    const icon = new ImageAssets({
      name: 'UI_Talent_S_Hutao_05',
      imageBaseURL: BASE_URL,
    })
    const skill = new CharacterInherentSkill({
      id: 462201,
      name: 'The More the Merrier',
      description: 'When Hu Tao cooks a dish perfectly...',
      icon,
      addProps: [],
    })

    expect(skill.id).toBe(462201)
    expect(skill.name).toBe('The More the Merrier')
  })

  it('should handle addProps when present', () => {
    const skill = new CharacterInherentSkill({
      id: 999,
      name: 'Test Passive',
      description: 'Test',
      icon: new ImageAssets({ name: 'test', imageBaseURL: BASE_URL }),
      addProps: [
        new StatProperty({
          type: FightProp.FightPropCritical,
          name: 'CRIT Rate',
          value: 0.05,
        }),
      ],
    })

    expect(skill.addProps).toHaveLength(1)
    expect(skill.addProps[0].value).toBe(0.05)
  })
})
