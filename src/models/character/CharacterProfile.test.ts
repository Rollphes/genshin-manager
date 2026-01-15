import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { CharacterProfile } from '@/models/character/CharacterProfile'

describe('CharacterProfile', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all character IDs', () => {
      const ids = CharacterProfile.allCharacterIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toContain(10000002)
    })
  })

  describe('Constructor', () => {
    it('should create CharacterProfile', () => {
      const profile = new CharacterProfile(10000002)
      expect(profile).toBeDefined()
      expect(profile.characterId).toBe(10000002)
    })
  })

  describe('Instance Properties (Ayaka)', () => {
    let profile: CharacterProfile

    beforeAll(() => {
      profile = new CharacterProfile(10000002)
    })

    it('should have correct characterId', () => {
      expect(profile.characterId).toBe(10000002)
    })

    it('should have correct fetterId', () => {
      expect(profile.fetterId).toBe(101)
    })

    it('should have correct birthDate', () => {
      expect(profile.birthDate).toBeDefined()
      expect(profile.birthDate).toBeInstanceOf(Date)
      expect(profile.birthDate?.getMonth()).toBe(8) // September (0-indexed)
      expect(profile.birthDate?.getDate()).toBe(28)
    })

    it('should have correct native', () => {
      expect(profile.native).toBe('Yashiro Commission')
    })

    it('should have correct vision', () => {
      expect(profile.vision).toBe('Cryo')
    })

    it('should have correct constellation', () => {
      expect(profile.constellation).toBe('Grus Nivis')
    })

    it('should have correct title', () => {
      expect(profile.title).toBe('Frostflake Heron')
    })

    it('should have non-empty detail', () => {
      expect(profile.detail).toBeDefined()
      expect(profile.detail.length).toBeGreaterThan(0)
    })

    it('should have correct assocType', () => {
      expect(profile.assocType).toBe('ASSOC_TYPE_INAZUMA')
    })

    it('should have cv with 4 languages', () => {
      expect(profile.cv).toBeDefined()
      expect(profile.cv).toHaveProperty('CHS')
      expect(profile.cv).toHaveProperty('JP')
      expect(profile.cv).toHaveProperty('EN')
      expect(profile.cv).toHaveProperty('KR')
    })

    it('should have correct EN cv', () => {
      expect(profile.cv.EN).toBe('Erica Mendez')
    })

    it('should have correct JP cv', () => {
      expect(profile.cv.JP).toBe('早見沙織')
    })
  })
})
