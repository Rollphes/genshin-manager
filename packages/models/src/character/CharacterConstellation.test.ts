import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'
import { CharacterConstellation } from '@/character/CharacterConstellation'

const BASE_URL = 'https://example.com'

describe('CharacterConstellation', () => {
  it('should create with all properties', () => {
    const icon = new ImageAssets({
      name: 'UI_Talent_S_Hutao_01',
      imageBaseURL: BASE_URL,
    })
    const constellation = new CharacterConstellation({
      id: 461,
      name: 'Crimson Bouquet',
      description: 'While in a Paramita Papilio state...',
      icon,
      locked: false,
    })

    expect(constellation.id).toBe(461)
    expect(constellation.name).toBe('Crimson Bouquet')
    expect(constellation.description).toContain('Paramita Papilio')
    expect(constellation.icon).toBe(icon)
    expect(constellation.locked).toBe(false)
  })

  it('should create locked constellation', () => {
    const icon = new ImageAssets({
      name: 'UI_Talent_S_Hutao_02',
      imageBaseURL: BASE_URL,
    })
    const constellation = new CharacterConstellation({
      id: 462,
      name: 'Ominous Rainfall',
      description: 'Increases the Blood Blossom DMG',
      icon,
      locked: true,
    })

    expect(constellation.locked).toBe(true)
  })

  it('should create all 6 constellations', () => {
    const constellations = Array.from(
      { length: 6 },
      (_, i) =>
        new CharacterConstellation({
          id: 461 + i,
          name: `Constellation ${String(i + 1)}`,
          description: `C${String(i + 1)} description`,
          icon: new ImageAssets({
            name: `UI_Talent_S_Hutao_0${String(i + 1)}`,
            imageBaseURL: BASE_URL,
          }),
          locked: i >= 3,
        }),
    )

    expect(constellations).toHaveLength(6)
    expect(constellations[0].locked).toBe(false)
    expect(constellations[3].locked).toBe(true)
    expect(constellations[5].locked).toBe(true)
  })
})
