import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { CharacterSkill } from '@/models/character/CharacterSkill'

describe('CharacterSkill', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all skill IDs', () => {
      const ids = CharacterSkill.allSkillIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids).toContain(10024)
    })
  })

  describe('Static Methods', () => {
    it('should get skill order by character ID', () => {
      const skillOrder = CharacterSkill.getSkillOrderByCharacterId(10000002)
      expect(skillOrder).toEqual([10024, 10018, 10019])
    })

    it('should get skill order for traveler with skill depot ID', () => {
      const skillOrder = CharacterSkill.getSkillOrderByCharacterId(
        10000005,
        504,
      )
      expect(skillOrder).toBeDefined()
      expect(Array.isArray(skillOrder)).toBe(true)
      expect(skillOrder.length).toBe(3)
    })
  })

  describe('Constructor', () => {
    it('should create CharacterSkill with default level=1 and extraLevel=0', () => {
      const skill = new CharacterSkill(10024)
      expect(skill).toBeDefined()
      expect(skill.id).toBe(10024)
      expect(skill.level).toBe(1)
      expect(skill.extraLevel).toBe(0)
    })

    it('should create CharacterSkill with specified level', () => {
      const skill = new CharacterSkill(10024, 10)
      expect(skill.level).toBe(10)
      expect(skill.extraLevel).toBe(0)
    })

    it('should create CharacterSkill with extraLevel', () => {
      const skill = new CharacterSkill(10024, 10, 3)
      expect(skill.level).toBe(13)
      expect(skill.extraLevel).toBe(3)
    })
  })

  describe('Instance Properties (Ayaka Normal Attack)', () => {
    let skill: CharacterSkill

    beforeAll(() => {
      skill = new CharacterSkill(10024)
    })

    it('should have correct id', () => {
      expect(skill.id).toBe(10024)
    })

    it('should have correct name', () => {
      expect(skill.name).toBe('Kamisato Art: Kabuki')
    })

    it('should have non-empty description', () => {
      expect(skill.description).toBeDefined()
      expect(skill.description.length).toBeGreaterThan(0)
    })

    it('should have correct icon', () => {
      expect(skill.icon).toBeInstanceOf(ImageAssets)
      expect(skill.icon.name).toBe('Skill_A_01')
    })

    it('should have correct level', () => {
      expect(skill.level).toBe(1)
    })

    it('should have correct extraLevel', () => {
      expect(skill.extraLevel).toBe(0)
    })

    it('should have paramDescriptions', () => {
      expect(skill.paramDescriptions).toBeDefined()
      expect(Array.isArray(skill.paramDescriptions)).toBe(true)
      expect(skill.paramDescriptions.length).toBe(9)
    })
  })

  describe('Instance Properties (Ayaka Elemental Skill)', () => {
    let skill: CharacterSkill

    beforeAll(() => {
      skill = new CharacterSkill(10018)
    })

    it('should have correct id', () => {
      expect(skill.id).toBe(10018)
    })

    it('should have correct name', () => {
      expect(skill.name).toBe('Kamisato Art: Hyouka')
    })

    it('should have correct icon', () => {
      expect(skill.icon).toBeInstanceOf(ImageAssets)
      expect(skill.icon.name).toBe('Skill_S_Ayaka_01')
    })

    it('should have paramDescriptions', () => {
      expect(skill.paramDescriptions.length).toBe(2)
    })
  })

  describe('Instance Properties (Ayaka Elemental Burst)', () => {
    let skill: CharacterSkill

    beforeAll(() => {
      skill = new CharacterSkill(10019)
    })

    it('should have correct id', () => {
      expect(skill.id).toBe(10019)
    })

    it('should have correct name', () => {
      expect(skill.name).toBe('Kamisato Art: Soumetsu')
    })

    it('should have correct icon', () => {
      expect(skill.icon).toBeInstanceOf(ImageAssets)
      expect(skill.icon.name).toBe('Skill_E_Ayaka')
    })
  })

  describe('Level Calculation', () => {
    it('should calculate level correctly with extraLevel', () => {
      const skill = new CharacterSkill(10024, 10, 3)
      expect(skill.level).toBe(13)
      expect(skill.extraLevel).toBe(3)
    })

    it('should have different paramDescriptions at different levels', () => {
      const skill1 = new CharacterSkill(10024, 1)
      const skill10 = new CharacterSkill(10024, 10)
      expect(skill1.paramDescriptions).not.toEqual(skill10.paramDescriptions)
    })
  })
})
