import { describe, expect, it } from 'vitest'

import { ImageAssets } from '@/assets/ImageAssets'
import { CharacterCostume } from '@/character/CharacterCostume'

const BASE_URL = 'https://example.com'

function createMockIcon(name: string): ImageAssets {
  return new ImageAssets({ name, imageBaseURL: BASE_URL })
}

describe('CharacterCostume', () => {
  it('should create with all properties', () => {
    const costume = new CharacterCostume({
      id: 204601,
      characterId: 10000046,
      name: 'Hu Tao Default',
      description: 'Default costume',
      quality: 0,
      sideIcon: createMockIcon('UI_AvatarIcon_Side_Hutao'),
      icon: createMockIcon('UI_AvatarIcon_Hutao'),
      art: createMockIcon('UI_Gacha_AvatarImg_Hutao'),
      card: createMockIcon('UI_AvatarIcon_Hutao_Card'),
    })

    expect(costume.id).toBe(204601)
    expect(costume.characterId).toBe(10000046)
    expect(costume.name).toBe('Hu Tao Default')
    expect(costume.description).toBe('Default costume')
    expect(costume.quality).toBe(0)
    expect(costume.sideIcon.name).toBe('UI_AvatarIcon_Side_Hutao')
    expect(costume.icon.name).toBe('UI_AvatarIcon_Hutao')
    expect(costume.art.name).toBe('UI_Gacha_AvatarImg_Hutao')
    expect(costume.card.name).toBe('UI_AvatarIcon_Hutao_Card')
  })

  it('should handle high quality costume', () => {
    const costume = new CharacterCostume({
      id: 200301,
      characterId: 10000003,
      name: 'Sea Breeze Dandelion',
      description: "Jean's summer outfit",
      quality: 4,
      sideIcon: createMockIcon('UI_AvatarIcon_Side_Qin_Summertime'),
      icon: createMockIcon('UI_AvatarIcon_Qin_Summertime'),
      art: createMockIcon('UI_Gacha_AvatarImg_Qin_Summertime'),
      card: createMockIcon('UI_AvatarIcon_Qin_Summertime_Card'),
    })

    expect(costume.quality).toBe(4)
    expect(costume.characterId).toBe(10000003)
  })

  it('should have correct ImageAssets for all icon types', () => {
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

    expect(costume.sideIcon).toBeInstanceOf(ImageAssets)
    expect(costume.icon).toBeInstanceOf(ImageAssets)
    expect(costume.art).toBeInstanceOf(ImageAssets)
    expect(costume.card).toBeInstanceOf(ImageAssets)
  })
})
