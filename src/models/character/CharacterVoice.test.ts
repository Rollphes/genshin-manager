import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { AudioAssets } from '@/models/assets/AudioAssets'
import { CharacterVoice } from '@/models/character/CharacterVoice'

describe('CharacterVoice', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all fetter IDs', () => {
      const ids = CharacterVoice.allFetterIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toContain(3100)
    })
  })

  describe('Static Methods', () => {
    it('should get all fetter IDs by character ID', () => {
      const fetterIds = CharacterVoice.getAllFetterIdsByCharacterId(10000002)
      expect(fetterIds).toBeDefined()
      expect(Array.isArray(fetterIds)).toBe(true)
      expect(fetterIds.length).toBeGreaterThan(0)
      expect(fetterIds).toContain(3100)
    })
  })

  describe('Constructor', () => {
    it('should create CharacterVoice', () => {
      const voice = new CharacterVoice(3100, 'EN')
      expect(voice).toBeDefined()
      expect(voice.fetterId).toBe(3100)
    })
  })

  describe('Instance Properties (Ayaka Voice - Hello)', () => {
    let voice: CharacterVoice

    beforeAll(() => {
      voice = new CharacterVoice(3100, 'EN')
    })

    it('should have correct fetterId', () => {
      expect(voice.fetterId).toBe(3100)
    })

    it('should have correct cv', () => {
      expect(voice.cv).toBe('EN')
    })

    it('should have hideCostumeList as array', () => {
      expect(voice.hideCostumeList).toBeDefined()
      expect(Array.isArray(voice.hideCostumeList)).toBe(true)
    })

    it('should have showCostumeList as array', () => {
      expect(voice.showCostumeList).toBeDefined()
      expect(Array.isArray(voice.showCostumeList)).toBe(true)
    })

    it('should have correct characterId', () => {
      expect(voice.characterId).toBe(10000002)
    })

    it('should have correct type', () => {
      expect(voice.type).toBe(1)
    })

    it('should have correct title', () => {
      expect(voice.title).toBe('Hello')
    })

    it('should have non-empty content', () => {
      expect(voice.content).toBeDefined()
      expect(voice.content.length).toBeGreaterThan(0)
    })

    it('should have tips as array', () => {
      expect(voice.tips).toBeDefined()
      expect(Array.isArray(voice.tips)).toBe(true)
    })

    it('should have correct audio', () => {
      expect(voice.audio).toBeInstanceOf(AudioAssets)
    })
  })
})
