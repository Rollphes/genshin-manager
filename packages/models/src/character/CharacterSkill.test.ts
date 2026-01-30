import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'
import { CharacterSkill } from '@/character/CharacterSkill'

const BASE_URL = 'https://example.com'

describe('CharacterSkill', () => {
  it('should create normal attack skill', () => {
    const icon = new ImageAssets({ name: 'Skill_A_03', imageBaseURL: BASE_URL })
    const skill = new CharacterSkill({
      id: 10461,
      name: 'Secret Spear of Wangsheng',
      description: 'Normal Attack\nPerforms up to 6 consecutive spear strikes.',
      icon,
      level: 10,
      extraLevel: 0,
      paramDescriptions: [
        '1-Hit DMG|89.5%',
        '2-Hit DMG|87.2%',
        '3-Hit DMG|110.4%',
        '4-Hit DMG|118.3%',
        '5-Hit DMG|59.9%+62.4%',
        '6-Hit DMG|153.4%',
        'Charged Attack DMG|242.6%',
        'Plunge DMG|65.4%',
        'Low Plunge DMG|131%',
      ],
    })

    expect(skill.id).toBe(10461)
    expect(skill.name).toContain('Wangsheng')
    expect(skill.description).toContain('Normal Attack')
    expect(skill.icon.name).toBe('Skill_A_03')
    expect(skill.level).toBe(10)
    expect(skill.extraLevel).toBe(0)
    expect(skill.paramDescriptions).toHaveLength(9)
  })

  it('should create elemental skill', () => {
    const icon = new ImageAssets({
      name: 'Skill_S_Hutao_01',
      imageBaseURL: BASE_URL,
    })
    const skill = new CharacterSkill({
      id: 10462,
      name: 'Guide to Afterlife',
      description: 'Only an unwavering flame can cleanse the world.',
      icon,
      level: 10,
      extraLevel: 3,
      paramDescriptions: [
        'Activation Cost|30% Current HP',
        'Blood Blossom DMG|115.2%',
      ],
    })

    expect(skill.id).toBe(10462)
    expect(skill.level).toBe(10)
    expect(skill.extraLevel).toBe(3)
    expect(skill.paramDescriptions).toHaveLength(2)
  })

  it('should create elemental burst', () => {
    const icon = new ImageAssets({
      name: 'Skill_E_Hutao_01',
      imageBaseURL: BASE_URL,
    })
    const skill = new CharacterSkill({
      id: 10465,
      name: 'Spirit Soother',
      description: 'Commands the spirits to attack.',
      icon,
      level: 10,
      extraLevel: 3,
      paramDescriptions: [
        'Skill DMG|475.4%',
        'Low HP Skill DMG|594.3%',
        'Skill HP Regeneration|11.2% Max HP',
        'Low HP Skill Regeneration|14% Max HP',
      ],
    })

    expect(skill.id).toBe(10465)
    expect(skill.extraLevel).toBe(3)
    expect(skill.paramDescriptions).toHaveLength(4)
  })

  it('should handle skill with no extra level', () => {
    const skill = new CharacterSkill({
      id: 10461,
      name: 'Normal Attack',
      description: 'Test',
      icon: new ImageAssets({ name: 'Skill_A_03', imageBaseURL: BASE_URL }),
      level: 1,
      extraLevel: 0,
      paramDescriptions: [],
    })

    expect(skill.level).toBe(1)
    expect(skill.extraLevel).toBe(0)
    expect(skill.paramDescriptions).toHaveLength(0)
  })
})
