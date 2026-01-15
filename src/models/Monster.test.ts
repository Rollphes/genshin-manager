import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { Monster } from '@/models/Monster'
import { StatProperty } from '@/models/StatProperty'

describe('Monster', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Static Properties', () => {
    it('should return all monster IDs', () => {
      const ids = Monster.allMonsterIds
      expect(ids).toBeDefined()
      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
    })
  })

  describe('Static Methods', () => {
    it('should find monster ID by describe ID', () => {
      const monsterId = Monster.findMonsterIdByDescribeId(21104)
      expect(monsterId).toBe(22110403)
    })

    it('should convert describe ID to monster ID format', () => {
      const monsterId = Monster.findMonsterIdByDescribeId(10101)
      expect(monsterId).toBe(21010101)
    })
  })

  describe('Constructor', () => {
    it('should create Monster with default values', () => {
      const ids = Monster.allMonsterIds
      const monster = new Monster(ids[0])
      expect(monster).toBeDefined()
      expect(monster.id).toBe(ids[0])
      expect(monster.level).toBe(1)
      expect(monster.playerCount).toBe(1)
    })

    it('should create Monster with custom level', () => {
      const monster = new Monster(21010101, 50)
      expect(monster.level).toBe(50)
    })

    it('should create Monster with custom player count', () => {
      const monster = new Monster(21010101, 50, 4)
      expect(monster.playerCount).toBe(4)
    })

    it('should throw error for invalid level (0)', () => {
      expect(() => new Monster(21010101, 0)).toThrow()
    })

    it('should throw error for invalid level (201)', () => {
      expect(() => new Monster(21010101, 201)).toThrow()
    })

    it('should throw error for invalid player count (0)', () => {
      expect(() => new Monster(21010101, 50, 0)).toThrow()
    })

    it('should throw error for invalid player count (5)', () => {
      expect(() => new Monster(21010101, 50, 5)).toThrow()
    })
  })

  describe('Instance Properties (Hilichurl - 21010101 Lv50)', () => {
    let monster: Monster

    beforeAll(() => {
      monster = new Monster(21010101, 50, 1)
    })

    it('should have correct id', () => {
      expect(monster.id).toBe(21010101)
    })

    it('should have correct level', () => {
      expect(monster.level).toBe(50)
    })

    it('should have correct playerCount', () => {
      expect(monster.playerCount).toBe(1)
    })

    it('should have internalName as string', () => {
      expect(monster.internalName).toBeDefined()
      expect(typeof monster.internalName).toBe('string')
      expect(monster.internalName).toBe('Hili_None_01')
    })

    it('should have name as string', () => {
      expect(monster.name).toBeDefined()
      expect(typeof monster.name).toBe('string')
    })

    it('should have describeName as Hilichurl', () => {
      expect(monster.describeName).toBe('Hilichurl')
    })

    it('should have description as non-empty string', () => {
      expect(monster.description).toBeDefined()
      expect(typeof monster.description).toBe('string')
      expect(monster.description.length).toBeGreaterThan(0)
    })

    it('should have icon as ImageAssets', () => {
      expect(monster.icon).toBeInstanceOf(ImageAssets)
    })

    it('should have codexType', () => {
      expect(monster.codexType).toBe('CODEX_SUBTYPE_HILICHURL')
    })

    it('should have stats as array with 10 elements', () => {
      expect(monster.stats).toBeDefined()
      expect(Array.isArray(monster.stats)).toBe(true)
      expect(monster.stats.length).toBe(10)
    })

    it('should have stats as StatProperty instances', () => {
      expect(monster.stats[0]).toBeInstanceOf(StatProperty)
    })

    it('should have correct stat types', () => {
      const statTypes = monster.stats.map((s) => s.type)
      expect(statTypes).toContain('FIGHT_PROP_BASE_HP')
      expect(statTypes).toContain('FIGHT_PROP_BASE_ATTACK')
      expect(statTypes).toContain('FIGHT_PROP_BASE_DEFENSE')
      expect(statTypes).toContain('FIGHT_PROP_PHYSICAL_SUB_HURT')
      expect(statTypes).toContain('FIGHT_PROP_ELEC_SUB_HURT')
      expect(statTypes).toContain('FIGHT_PROP_WATER_SUB_HURT')
      expect(statTypes).toContain('FIGHT_PROP_GRASS_SUB_HURT')
      expect(statTypes).toContain('FIGHT_PROP_WIND_SUB_HURT')
      expect(statTypes).toContain('FIGHT_PROP_ROCK_SUB_HURT')
      expect(statTypes).toContain('FIGHT_PROP_ICE_SUB_HURT')
    })

    it('should have HP value close to expected', () => {
      const hpStat = monster.stats.find((s) => s.type === 'FIGHT_PROP_BASE_HP')
      expect(hpStat).toBeDefined()
      expect(hpStat?.value).toBeCloseTo(4996.48454, 2)
    })
  })

  describe('Co-op Scaling (4 Players)', () => {
    let singlePlayerMonster: Monster
    let coopMonster: Monster

    beforeAll(() => {
      singlePlayerMonster = new Monster(21010101, 50, 1)
      coopMonster = new Monster(21010101, 50, 4)
    })

    it('should have higher HP with more players', () => {
      const singleHp = singlePlayerMonster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_HP',
      )
      const coopHp = coopMonster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_HP',
      )
      expect(coopHp?.value).toBeGreaterThan(singleHp?.value ?? 0)
    })

    it('should have HP scaled by 2.5x for 4 players', () => {
      const singleHp = singlePlayerMonster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_HP',
      )
      const coopHp = coopMonster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_HP',
      )
      expect(coopHp?.value).toBeCloseTo((singleHp?.value ?? 0) * 2.5, 2)
    })

    it('should have 4-player HP close to expected value', () => {
      const coopHp = coopMonster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_HP',
      )
      expect(coopHp?.value).toBeCloseTo(12491.21135, 2)
    })

    it('should have higher ATK with more players', () => {
      const singleAtk = singlePlayerMonster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_ATTACK',
      )
      const coopAtk = coopMonster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_ATTACK',
      )
      expect(coopAtk?.value).toBeGreaterThan(singleAtk?.value ?? 0)
    })

    it('should have same DEF regardless of player count', () => {
      const singleDef = singlePlayerMonster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_DEFENSE',
      )
      const coopDef = coopMonster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_DEFENSE',
      )
      expect(coopDef?.value).toBe(singleDef?.value)
    })
  })

  describe('Different Levels', () => {
    it('should have lower HP at level 1', () => {
      const lv1Monster = new Monster(21010101, 1)
      const lv50Monster = new Monster(21010101, 50)
      const lv1Hp = lv1Monster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_HP',
      )
      const lv50Hp = lv50Monster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_HP',
      )
      expect(lv1Hp?.value).toBeLessThan(lv50Hp?.value ?? 0)
    })

    it('should have higher HP at level 100', () => {
      const lv50Monster = new Monster(21010101, 50)
      const lv100Monster = new Monster(21010101, 100)
      const lv50Hp = lv50Monster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_HP',
      )
      const lv100Hp = lv100Monster.stats.find(
        (s) => s.type === 'FIGHT_PROP_BASE_HP',
      )
      expect(lv100Hp?.value).toBeGreaterThan(lv50Hp?.value ?? 0)
    })
  })
})
