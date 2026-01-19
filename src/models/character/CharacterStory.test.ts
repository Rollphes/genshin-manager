import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { CharacterStory } from '@/models/character/CharacterStory'

describe('CharacterStory', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all fetter IDs', () => {
      const ids = CharacterStory.allFetterIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toContain(3201)
    })
  })

  describe('Static Methods', () => {
    it('should get all fetter IDs by character ID', () => {
      const fetterIds = CharacterStory.getAllFetterIdsByCharacterId(10000002)
      expect(fetterIds).toBeDefined()
      expect(Array.isArray(fetterIds)).toBe(true)
      expect(fetterIds.length).toBeGreaterThan(0)
      expect(fetterIds).toContain(3201)
    })

    it('should return Ayaka fetter IDs', () => {
      const fetterIds = CharacterStory.getAllFetterIdsByCharacterId(10000002)
      expect(fetterIds).toEqual([
        3201, 3202, 3203, 3204, 3205, 3206, 3207, 3208,
      ])
    })
  })

  describe('Constructor', () => {
    it('should create CharacterStory', () => {
      const story = new CharacterStory(3201)
      expect(story).toBeDefined()
      expect(story.fetterId).toBe(3201)
    })
  })

  describe('Instance Properties (Ayaka Story 1)', () => {
    let story: CharacterStory

    beforeAll(() => {
      story = new CharacterStory(3201)
    })

    it('should have correct fetterId', () => {
      expect(story.fetterId).toBe(3201)
    })

    it('should have correct characterId', () => {
      expect(story.characterId).toBe(10000002)
    })

    it('should have correct title', () => {
      expect(story.title).toBe('Character Details')
    })

    it('should have non-empty content', () => {
      expect(story.content).toBeDefined()
      expect(story.content.length).toBeGreaterThan(0)
    })

    it('should have tips as array', () => {
      expect(story.tips).toBeDefined()
      expect(Array.isArray(story.tips)).toBe(true)
    })
  })
})
