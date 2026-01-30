import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'
import { Character } from '@/character/Character'
import { CharacterAscension } from '@/character/CharacterAscension'
import { CharacterBaseStats } from '@/character/CharacterBaseStats'
import { CharacterConstellation } from '@/character/CharacterConstellation'
import { CharacterCostume } from '@/character/CharacterCostume'
import { CharacterInfo } from '@/character/CharacterInfo'
import { CharacterInherentSkill } from '@/character/CharacterInherentSkill'
import { CharacterProfile } from '@/character/CharacterProfile'
import { CharacterStory } from '@/character/CharacterStory'
import { StatProperty } from '@/common/StatProperty'
import { BodyType, FightProp, WeaponType } from '@/types/enums'
import { Element } from '@/types/types'

const BASE_URL = 'https://example.com'

function createMockIcon(name: string): ImageAssets {
  return new ImageAssets({ name, imageBaseURL: BASE_URL })
}

function createMockInfo(): CharacterInfo {
  return new CharacterInfo({
    id: 10000046,
    defaultCostumeId: 204601,
    name: 'Hu Tao',
    maxLevel: 90,
    depotId: 4601,
    element: Element.Pyro,
    skillOrder: [10461, 10462, 10465],
    inherentSkillOrder: [462101, 462201],
    constellationIds: [461, 462, 463, 464, 465, 466],
    proudMap: new Map([
      [10461, 4631],
      [10462, 4632],
      [10465, 4635],
    ]),
    rarity: 5,
    weaponType: WeaponType.WeaponPole,
    bodyType: BodyType.BodyGirl,
  })
}

function createMockBaseStats(): CharacterBaseStats {
  return new CharacterBaseStats({
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
    ],
  })
}

function createMockAscension(): CharacterAscension {
  return new CharacterAscension({
    id: 10000046,
    promoteLevel: 6,
    costItems: [{ id: 104163, count: 6 }],
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
}

describe('Character', () => {
  it('should create with all properties', () => {
    const info = createMockInfo()
    const baseStats = createMockBaseStats()
    const ascension = createMockAscension()
    const constellation = new CharacterConstellation({
      id: 461,
      name: 'Crimson Bouquet',
      description: 'Test',
      icon: createMockIcon('UI_Talent_S_Hutao_01'),
      locked: false,
    })
    const inherentSkill = new CharacterInherentSkill({
      id: 462101,
      name: 'Flutter By',
      description: 'Test',
      icon: createMockIcon('UI_Talent_S_Hutao_07'),
      addProps: [],
    })
    const profile = new CharacterProfile({
      characterId: 10000046,
      fetterId: 1046,
      birthDate: new Date(2000, 6, 15),
      native: 'Liyue',
      vision: 'Pyro',
      constellation: 'Papilio Charontis',
      title: '77th Director',
      detail: 'Test detail',
      assocType: 'ASSOC_TYPE_LIYUE',
      cv: {
        JP: 'Rie Takahashi',
        CN: '陶典',
        EN: 'Brianna Knickerbocker',
        KR: '김하루',
      },
    })
    const story = new CharacterStory({
      fetterId: 10461,
      characterId: 10000046,
      title: 'Story 1',
      content: 'Content',
      tips: [],
    })
    const costume = new CharacterCostume({
      id: 204601,
      characterId: 10000046,
      name: 'Default',
      description: '',
      quality: 0,
      sideIcon: createMockIcon('UI_AvatarIcon_Side_Hutao'),
      icon: createMockIcon('UI_AvatarIcon_Hutao'),
      art: createMockIcon('UI_Gacha_AvatarImg_Hutao'),
      card: createMockIcon('UI_AvatarIcon_Hutao_Card'),
    })

    const character = new Character({
      info,
      baseStats,
      ascension,
      constellations: [constellation],
      inherentSkills: [inherentSkill],
      profile,
      stories: [story],
      costumes: [costume],
      constellationLevel: 1,
      allAscensionMaterials: [{ id: 104163, count: 6 }],
    })

    expect(character.info).toBe(info)
    expect(character.baseStats).toBe(baseStats)
    expect(character.ascension).toBe(ascension)
    expect(character.constellations).toHaveLength(1)
    expect(character.inherentSkills).toHaveLength(1)
    expect(character.profile).toBe(profile)
    expect(character.stories).toHaveLength(1)
    expect(character.costumes).toHaveLength(1)
    expect(character.constellationLevel).toBe(1)
    expect(character.allAscensionMaterials).toHaveLength(1)
  })

  it('should provide id shortcut from info', () => {
    const character = new Character({
      info: createMockInfo(),
      baseStats: createMockBaseStats(),
      ascension: createMockAscension(),
      constellations: [],
      inherentSkills: [],
      profile: undefined,
      stories: [],
      costumes: [],
      constellationLevel: 0,
      allAscensionMaterials: [],
    })

    expect(character.id).toBe(10000046)
  })

  it('should provide name shortcut from info', () => {
    const character = new Character({
      info: createMockInfo(),
      baseStats: createMockBaseStats(),
      ascension: createMockAscension(),
      constellations: [],
      inherentSkills: [],
      profile: undefined,
      stories: [],
      costumes: [],
      constellationLevel: 0,
      allAscensionMaterials: [],
    })

    expect(character.name).toBe('Hu Tao')
  })

  it('should provide level shortcut from baseStats', () => {
    const character = new Character({
      info: createMockInfo(),
      baseStats: createMockBaseStats(),
      ascension: createMockAscension(),
      constellations: [],
      inherentSkills: [],
      profile: undefined,
      stories: [],
      costumes: [],
      constellationLevel: 0,
      allAscensionMaterials: [],
    })

    expect(character.level).toBe(90)
  })

  it('should return false for isCanAscend when at max level', () => {
    const character = new Character({
      info: createMockInfo(),
      baseStats: createMockBaseStats(),
      ascension: createMockAscension(),
      constellations: [],
      inherentSkills: [],
      profile: undefined,
      stories: [],
      costumes: [],
      constellationLevel: 0,
      allAscensionMaterials: [],
    })

    expect(character.isCanAscend).toBe(false)
  })

  it('should return true for isCanAscend when below max level', () => {
    const lowBaseStats = new CharacterBaseStats({
      id: 10000046,
      level: 40,
      promoteLevel: 1,
      isAscended: false,
      stats: [],
    })
    const character = new Character({
      info: createMockInfo(),
      baseStats: lowBaseStats,
      ascension: createMockAscension(),
      constellations: [],
      inherentSkills: [],
      profile: undefined,
      stories: [],
      costumes: [],
      constellationLevel: 0,
      allAscensionMaterials: [],
    })

    expect(character.isCanAscend).toBe(true)
  })

  it('should handle undefined profile', () => {
    const character = new Character({
      info: createMockInfo(),
      baseStats: createMockBaseStats(),
      ascension: createMockAscension(),
      constellations: [],
      inherentSkills: [],
      profile: undefined,
      stories: [],
      costumes: [],
      constellationLevel: 0,
      allAscensionMaterials: [],
    })

    expect(character.profile).toBeUndefined()
  })
})
