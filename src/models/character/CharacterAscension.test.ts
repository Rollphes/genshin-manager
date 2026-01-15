import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { CharacterAscension } from '@/models/character/CharacterAscension'
import { StatProperty } from '@/models/StatProperty'

describe('CharacterAscension', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Methods', () => {
    it('should get max promote level by character ID', () => {
      const maxLevel =
        CharacterAscension.getMaxPromoteLevelByCharacterId(10000002)
      expect(maxLevel).toBe(6)
    })
  })

  describe('Constructor', () => {
    it('should create CharacterAscension with default promoteLevel=0', () => {
      const ascension = new CharacterAscension(10000002)
      expect(ascension).toBeDefined()
      expect(ascension.id).toBe(10000002)
      expect(ascension.promoteLevel).toBe(0)
    })

    it('should create CharacterAscension with specified promoteLevel', () => {
      const ascension = new CharacterAscension(10000002, 3)
      expect(ascension).toBeDefined()
      expect(ascension.promoteLevel).toBe(3)
    })
  })

  describe('Instance Properties (Ayaka promoteLevel 0)', () => {
    let ascension: CharacterAscension

    beforeAll(() => {
      ascension = new CharacterAscension(10000002, 0)
    })

    it('should have correct id', () => {
      expect(ascension.id).toBe(10000002)
    })

    it('should have correct promoteLevel', () => {
      expect(ascension.promoteLevel).toBe(0)
    })

    it('should have empty costItems at promoteLevel 0', () => {
      expect(ascension.costItems).toEqual([])
    })

    it('should have zero costMora at promoteLevel 0', () => {
      expect(ascension.costMora).toBe(0)
    })

    it('should have 4 addProps', () => {
      expect(ascension.addProps).toHaveLength(4)
      expect(ascension.addProps[0]).toBeInstanceOf(StatProperty)
    })

    it('should have correct addProps types', () => {
      const propTypes = ascension.addProps.map((prop) => prop.type)
      expect(propTypes).toContain('FIGHT_PROP_BASE_HP')
      expect(propTypes).toContain('FIGHT_PROP_BASE_DEFENSE')
      expect(propTypes).toContain('FIGHT_PROP_BASE_ATTACK')
      expect(propTypes).toContain('FIGHT_PROP_CRITICAL_HURT')
    })

    it('should have correct unlockMaxLevel', () => {
      expect(ascension.unlockMaxLevel).toBe(20)
    })
  })

  describe('Instance Properties (Ayaka promoteLevel 1)', () => {
    let ascension: CharacterAscension

    beforeAll(() => {
      ascension = new CharacterAscension(10000002, 1)
    })

    it('should have correct costItems', () => {
      expect(ascension.costItems).toEqual([
        { id: 104161, count: 1 },
        { id: 101202, count: 3 },
        { id: 112044, count: 3 },
      ])
    })

    it('should have correct costMora', () => {
      expect(ascension.costMora).toBe(20000)
    })

    it('should have 4 addProps', () => {
      expect(ascension.addProps).toHaveLength(4)
    })

    it('should have correct unlockMaxLevel', () => {
      expect(ascension.unlockMaxLevel).toBe(40)
    })
  })

  describe('Instance Properties (Ayaka promoteLevel 6 - max)', () => {
    let ascension: CharacterAscension

    beforeAll(() => {
      ascension = new CharacterAscension(10000002, 6)
    })

    it('should have correct costItems', () => {
      expect(ascension.costItems).toEqual([
        { id: 104164, count: 6 },
        { id: 113023, count: 20 },
        { id: 101202, count: 60 },
        { id: 112046, count: 24 },
      ])
    })

    it('should have correct costMora', () => {
      expect(ascension.costMora).toBe(120000)
    })

    it('should have 4 addProps', () => {
      expect(ascension.addProps).toHaveLength(4)
    })

    it('should have correct unlockMaxLevel', () => {
      expect(ascension.unlockMaxLevel).toBe(90)
    })
  })

  describe('costItems filtering', () => {
    it('should not contain entries with id:0', () => {
      for (let level = 0; level <= 6; level++) {
        const ascension = new CharacterAscension(10000002, level)
        const hasInvalidId = ascension.costItems.some((item) => item.id === 0)
        expect(hasInvalidId).toBe(false)
      }
    })

    it('should not contain entries with count:0', () => {
      for (let level = 0; level <= 6; level++) {
        const ascension = new CharacterAscension(10000002, level)
        const hasInvalidCount = ascension.costItems.some(
          (item) => item.count === 0,
        )
        expect(hasInvalidCount).toBe(false)
      }
    })
  })
})
