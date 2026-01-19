import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterInherentSkill } from '@/models/character/CharacterInherentSkill'

describe('CharacterInherentSkill', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'en',
      downloadLanguages: ['en'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all inherent skill IDs', () => {
      const ids = CharacterInherentSkill.allInherentSkillIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toContain(221)
    })
  })

  describe('Static Methods', () => {
    it('should get inherent skill order by character ID', () => {
      const skillOrder =
        CharacterInherentSkill.getInherentSkillOrderByCharacterId(10000002)
      expect(skillOrder).toEqual([221, 222, 223, 0, 0])
    })

    it('should get inherent skill order for traveler with skill depot ID', () => {
      const skillOrder =
        CharacterInherentSkill.getInherentSkillOrderByCharacterId(10000005, 504)
      expect(skillOrder).toBeDefined()
      expect(Array.isArray(skillOrder)).toBe(true)
      expect(skillOrder.length).toBeGreaterThan(0)
    })
  })

  describe('Constructor', () => {
    it('should create CharacterInherentSkill', () => {
      const skill = new CharacterInherentSkill(221)
      expect(skill).toBeDefined()
      expect(skill.id).toBe(221)
    })
  })

  describe('Instance Properties (Ayaka Passive 1 - Combat)', () => {
    let skill: CharacterInherentSkill

    beforeAll(() => {
      skill = new CharacterInherentSkill(221)
    })

    it('should have correct id', () => {
      expect(skill.id).toBe(221)
    })

    it('should have correct name', () => {
      expect(skill.name).toBe('Amatsumi Kunitsumi Sanctification')
    })

    it('should have non-empty description', () => {
      expect(skill.description).toBeDefined()
      expect(skill.description.length).toBeGreaterThan(0)
    })

    it('should have correct icon', () => {
      expect(skill.icon).toBeInstanceOf(ImageAssets)
      expect(skill.icon.name).toBe('UI_Talent_S_Ayaka_05')
    })

    it('should have empty addProps', () => {
      expect(skill.addProps).toEqual([])
    })
  })

  describe('Instance Properties (Ayaka Passive 2 - Combat)', () => {
    let skill: CharacterInherentSkill

    beforeAll(() => {
      skill = new CharacterInherentSkill(222)
    })

    it('should have correct id', () => {
      expect(skill.id).toBe(222)
    })

    it('should have correct name', () => {
      expect(skill.name).toBe('Kanten Senmyou Blessing')
    })

    it('should have correct icon', () => {
      expect(skill.icon).toBeInstanceOf(ImageAssets)
      expect(skill.icon.name).toBe('UI_Talent_S_Ayaka_06')
    })
  })

  describe('Instance Properties (Ayaka Passive 3 - Exploration)', () => {
    let skill: CharacterInherentSkill

    beforeAll(() => {
      skill = new CharacterInherentSkill(223)
    })

    it('should have correct id', () => {
      expect(skill.id).toBe(223)
    })

    it('should have correct name', () => {
      expect(skill.name).toBe('Fruits of Shinsa')
    })

    it('should have correct icon', () => {
      expect(skill.icon).toBeInstanceOf(ImageAssets)
      expect(skill.icon.name).toBe('UI_Talent_Combine_Weapon_Double')
    })
  })
})
