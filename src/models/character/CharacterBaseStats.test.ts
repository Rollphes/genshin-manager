import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { CharacterBaseStats } from '@/models/character/CharacterBaseStats'
import { StatProperty } from '@/models/StatProperty'

describe('CharacterBaseStats', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create CharacterBaseStats with default level=1 and isAscended=false', () => {
      const stats = new CharacterBaseStats(10000002)
      expect(stats).toBeDefined()
      expect(stats.id).toBe(10000002)
      expect(stats.level).toBe(1)
      expect(stats.isAscended).toBe(false)
    })

    it('should create CharacterBaseStats with specified level', () => {
      const stats = new CharacterBaseStats(10000002, 50)
      expect(stats.level).toBe(50)
    })

    it('should create CharacterBaseStats with specified isAscended', () => {
      const stats = new CharacterBaseStats(10000002, 20, true)
      expect(stats.level).toBe(20)
      expect(stats.isAscended).toBe(true)
    })
  })

  describe('Instance Properties (Ayaka Level 1)', () => {
    let stats: CharacterBaseStats

    beforeAll(() => {
      stats = new CharacterBaseStats(10000002)
    })

    it('should have correct id', () => {
      expect(stats.id).toBe(10000002)
    })

    it('should have correct level', () => {
      expect(stats.level).toBe(1)
    })

    it('should have correct promoteLevel', () => {
      expect(stats.promoteLevel).toBe(0)
    })

    it('should have correct isAscended', () => {
      expect(stats.isAscended).toBe(false)
    })

    it('should have 5 stats', () => {
      expect(stats.stats).toHaveLength(5)
      expect(stats.stats[0]).toBeInstanceOf(StatProperty)
    })

    it('should have correct stat types', () => {
      const statTypes = stats.stats.map((stat) => stat.type)
      expect(statTypes).toContain('FIGHT_PROP_BASE_HP')
      expect(statTypes).toContain('FIGHT_PROP_BASE_ATTACK')
      expect(statTypes).toContain('FIGHT_PROP_BASE_DEFENSE')
      expect(statTypes).toContain('FIGHT_PROP_CRITICAL')
      expect(statTypes).toContain('FIGHT_PROP_CRITICAL_HURT')
    })

    it('should have correct base HP at level 1', () => {
      const hp = stats.stats.find((s) => s.type === 'FIGHT_PROP_BASE_HP')
      expect(hp?.value).toBeCloseTo(1000.986, 2)
    })

    it('should have correct base attack at level 1', () => {
      const atk = stats.stats.find((s) => s.type === 'FIGHT_PROP_BASE_ATTACK')
      expect(atk?.value).toBeCloseTo(26.6266, 2)
    })

    it('should have correct base defense at level 1', () => {
      const def = stats.stats.find((s) => s.type === 'FIGHT_PROP_BASE_DEFENSE')
      expect(def?.value).toBeCloseTo(61.0266, 2)
    })

    it('should have correct critical rate', () => {
      const crit = stats.stats.find((s) => s.type === 'FIGHT_PROP_CRITICAL')
      expect(crit?.value).toBe(0.05)
    })

    it('should have correct critical damage at level 1', () => {
      const critDmg = stats.stats.find(
        (s) => s.type === 'FIGHT_PROP_CRITICAL_HURT',
      )
      expect(critDmg?.value).toBe(0.5)
    })
  })

  describe('Ascension Behavior', () => {
    it('should have promoteLevel 0 at level 20 not ascended', () => {
      const stats = new CharacterBaseStats(10000002, 20, false)
      expect(stats.promoteLevel).toBe(0)
      expect(stats.isAscended).toBe(false)
    })

    it('should have promoteLevel 1 at level 20 ascended', () => {
      const stats = new CharacterBaseStats(10000002, 20, true)
      expect(stats.promoteLevel).toBe(1)
      expect(stats.isAscended).toBe(true)
    })

    it('should have promoteLevel 6 at level 90', () => {
      const stats = new CharacterBaseStats(10000002, 90)
      expect(stats.promoteLevel).toBe(6)
    })
  })

  describe('Instance Properties (Ayaka Level 90)', () => {
    let stats: CharacterBaseStats

    beforeAll(() => {
      stats = new CharacterBaseStats(10000002, 90)
    })

    it('should have correct level', () => {
      expect(stats.level).toBe(90)
    })

    it('should have correct promoteLevel', () => {
      expect(stats.promoteLevel).toBe(6)
    })

    it('should have 5 stats', () => {
      expect(stats.stats).toHaveLength(5)
    })

    it('should have correct base HP at level 90', () => {
      const hp = stats.stats.find((s) => s.type === 'FIGHT_PROP_BASE_HP')
      expect(hp?.value).toBeCloseTo(12858.206, 1)
    })

    it('should have correct base attack at level 90', () => {
      const atk = stats.stats.find((s) => s.type === 'FIGHT_PROP_BASE_ATTACK')
      expect(atk?.value).toBeCloseTo(342.025, 1)
    })

    it('should have correct base defense at level 90', () => {
      const def = stats.stats.find((s) => s.type === 'FIGHT_PROP_BASE_DEFENSE')
      expect(def?.value).toBeCloseTo(783.925, 1)
    })

    it('should have correct critical rate (unchanged)', () => {
      const crit = stats.stats.find((s) => s.type === 'FIGHT_PROP_CRITICAL')
      expect(crit?.value).toBe(0.05)
    })

    it('should have correct critical damage at level 90 (with ascension bonus)', () => {
      const critDmg = stats.stats.find(
        (s) => s.type === 'FIGHT_PROP_CRITICAL_HURT',
      )
      expect(critDmg?.value).toBeCloseTo(0.884, 2)
    })
  })
})
