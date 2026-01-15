import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterCostume } from '@/models/character/CharacterCostume'

describe('CharacterCostume', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all costume IDs', () => {
      const ids = CharacterCostume.allCostumeIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toContain(200201)
    })
  })

  describe('Constructor', () => {
    it('should create CharacterCostume', () => {
      const costume = new CharacterCostume(200201)
      expect(costume).toBeDefined()
      expect(costume.id).toBe(200201)
    })
  })

  describe('Instance Properties (Ayaka Alternate Costume)', () => {
    let costume: CharacterCostume

    beforeAll(() => {
      costume = new CharacterCostume(200201)
    })

    it('should have correct id', () => {
      expect(costume.id).toBe(200201)
    })

    it('should have correct characterId', () => {
      expect(costume.characterId).toBe(10000002)
    })

    it('should have correct name', () => {
      expect(costume.name).toBe('Springbloom Missive')
    })

    it('should have non-empty description', () => {
      expect(costume.description).toBeDefined()
      expect(costume.description.length).toBeGreaterThan(0)
    })

    it('should have correct quality', () => {
      expect(costume.quality).toBe(4)
    })

    it('should have correct sideIcon', () => {
      expect(costume.sideIcon).toBeInstanceOf(ImageAssets)
      expect(costume.sideIcon.name).toBe(
        'UI_AvatarIcon_Side_AyakaCostumeFruhling',
      )
    })

    it('should have correct icon', () => {
      expect(costume.icon).toBeInstanceOf(ImageAssets)
      expect(costume.icon.name).toBe('UI_AvatarIcon_AyakaCostumeFruhling')
    })

    it('should have correct art', () => {
      expect(costume.art).toBeInstanceOf(ImageAssets)
      expect(costume.art.name).toBe('UI_Costume_AyakaCostumeFruhling')
    })

    it('should have correct card', () => {
      expect(costume.card).toBeInstanceOf(ImageAssets)
      expect(costume.card.name).toBe('UI_AvatarIcon_AyakaCostumeFruhling_Card')
    })
  })
})
