import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterConstellation } from '@/models/character/CharacterConstellation'

describe('CharacterConstellation', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all constellation IDs', () => {
      const ids = CharacterConstellation.allConstellationIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toContain(21)
    })
  })

  describe('Static Methods', () => {
    it('should get constellation IDs by character ID', () => {
      const ids =
        CharacterConstellation.getConstellationIdsByCharacterId(10000002)
      expect(ids).toEqual([21, 22, 23, 24, 25, 26])
    })

    it('should get constellation IDs for traveler with skill depot ID', () => {
      const ids = CharacterConstellation.getConstellationIdsByCharacterId(
        10000005,
        504,
      )
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBe(6)
    })
  })

  describe('Constructor', () => {
    it('should create CharacterConstellation with default locked=false', () => {
      const constellation = new CharacterConstellation(21)
      expect(constellation).toBeDefined()
      expect(constellation.id).toBe(21)
      expect(constellation.locked).toBe(false)
    })

    it('should create CharacterConstellation with locked=true', () => {
      const constellation = new CharacterConstellation(21, true)
      expect(constellation).toBeDefined()
      expect(constellation.locked).toBe(true)
    })
  })

  describe('Instance Properties (Ayaka C1)', () => {
    let constellation: CharacterConstellation

    beforeAll(() => {
      constellation = new CharacterConstellation(21, false)
    })

    it('should have correct id', () => {
      expect(constellation.id).toBe(21)
    })

    it('should have correct name', () => {
      expect(constellation.name).toBe('Snowswept Sakura')
    })

    it('should have non-empty description', () => {
      expect(constellation.description).toBeDefined()
      expect(constellation.description.length).toBeGreaterThan(0)
      expect(constellation.description).toContain('Cryo DMG')
    })

    it('should have correct icon', () => {
      expect(constellation.icon).toBeInstanceOf(ImageAssets)
      expect(constellation.icon.name).toBe('UI_Talent_S_Ayaka_01')
    })

    it('should have correct locked status', () => {
      expect(constellation.locked).toBe(false)
    })
  })

  describe('All Ayaka Constellations', () => {
    it('should have 6 constellations with valid data', () => {
      const constellationIds = [21, 22, 23, 24, 25, 26]

      for (const id of constellationIds) {
        const constellation = new CharacterConstellation(id)
        expect(constellation.id).toBe(id)
        expect(constellation.name).toBeDefined()
        expect(constellation.name.length).toBeGreaterThan(0)
        expect(constellation.description.length).toBeGreaterThan(0)
        expect(constellation.icon).toBeInstanceOf(ImageAssets)
      }
    })
  })
})
