import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { CharacterSkillAscension } from '@/models/character/CharacterSkillAscension'

describe('CharacterSkillAscension', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create CharacterSkillAscension with default level=1', () => {
      const asc = new CharacterSkillAscension(10024)
      expect(asc).toBeDefined()
      expect(asc.id).toBe(10024)
      expect(asc.level).toBe(1)
    })

    it('should create CharacterSkillAscension with specified level', () => {
      const asc = new CharacterSkillAscension(10024, 5)
      expect(asc.level).toBe(5)
    })
  })

  describe('Instance Properties (Ayaka Normal Attack Level 1)', () => {
    let asc: CharacterSkillAscension

    beforeAll(() => {
      asc = new CharacterSkillAscension(10024)
    })

    it('should have correct id', () => {
      expect(asc.id).toBe(10024)
    })

    it('should have correct level', () => {
      expect(asc.level).toBe(1)
    })

    it('should have empty costItems at level 1', () => {
      expect(asc.costItems).toEqual([])
    })

    it('should have zero costMora at level 1', () => {
      expect(asc.costMora).toBe(0)
    })

    it('should have empty addProps', () => {
      expect(asc.addProps).toEqual([])
    })
  })

  describe('Instance Properties (Ayaka Normal Attack Level 2)', () => {
    let asc: CharacterSkillAscension

    beforeAll(() => {
      asc = new CharacterSkillAscension(10024, 2)
    })

    it('should have correct level', () => {
      expect(asc.level).toBe(2)
    })

    it('should have correct costItems', () => {
      expect(asc.costItems).toEqual([
        { id: 104323, count: 3 },
        { id: 112044, count: 6 },
      ])
    })

    it('should have correct costMora', () => {
      expect(asc.costMora).toBe(12500)
    })
  })

  describe('Instance Properties (Ayaka Normal Attack Level 10)', () => {
    let asc: CharacterSkillAscension

    beforeAll(() => {
      asc = new CharacterSkillAscension(10024, 10)
    })

    it('should have correct level', () => {
      expect(asc.level).toBe(10)
    })

    it('should have correct costItems', () => {
      expect(asc.costItems).toEqual([
        { id: 104325, count: 16 },
        { id: 112046, count: 12 },
        { id: 113018, count: 2 },
        { id: 104319, count: 1 },
      ])
    })

    it('should have correct costMora', () => {
      expect(asc.costMora).toBe(700000)
    })

    it('should have empty addProps', () => {
      expect(asc.addProps).toEqual([])
    })
  })

  describe('Elemental Skill (10018)', () => {
    it('should have same costItems pattern at level 2', () => {
      const asc = new CharacterSkillAscension(10018, 2)
      expect(asc.costItems).toEqual([
        { id: 104323, count: 3 },
        { id: 112044, count: 6 },
      ])
      expect(asc.costMora).toBe(12500)
    })
  })

  describe('Error Cases', () => {
    it('should throw error for invalid level', () => {
      expect(() => new CharacterSkillAscension(10024, 16)).toThrow()
    })

    it('should throw error for level 0', () => {
      expect(() => new CharacterSkillAscension(10024, 0)).toThrow()
    })
  })

  describe('costItems filtering', () => {
    it('should not contain entries with id:0', () => {
      for (let level = 1; level <= 10; level++) {
        const asc = new CharacterSkillAscension(10024, level)
        const hasInvalidId = asc.costItems.some((item) => item.id === 0)
        expect(hasInvalidId).toBe(false)
      }
    })

    it('should not contain entries with count:0', () => {
      for (let level = 1; level <= 10; level++) {
        const asc = new CharacterSkillAscension(10024, level)
        const hasInvalidCount = asc.costItems.some((item) => item.count === 0)
        expect(hasInvalidCount).toBe(false)
      }
    })
  })
})
