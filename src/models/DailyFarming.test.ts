import { beforeAll, describe, expect, it } from 'vitest'

import { Client } from '@/client/Client'
import { CharacterInfo } from '@/models/character/CharacterInfo'
import { DailyFarming } from '@/models/DailyFarming'

describe('DailyFarming', () => {
  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000)

  describe('Constructor', () => {
    it('should create DailyFarming for Monday', () => {
      const farming = new DailyFarming(1)
      expect(farming).toBeDefined()
      expect(farming.dayOfWeek).toBe(1)
    })

    it('should create DailyFarming for Sunday', () => {
      const farming = new DailyFarming(0)
      expect(farming).toBeDefined()
      expect(farming.dayOfWeek).toBe(0)
    })

    it('should throw error for invalid dayOfWeek (-1)', () => {
      expect(() => new DailyFarming(-1)).toThrow()
    })

    it('should throw error for invalid dayOfWeek (7)', () => {
      expect(() => new DailyFarming(7)).toThrow()
    })
  })

  describe('Instance Properties (Monday - dayOfWeek 1)', () => {
    let farming: DailyFarming

    beforeAll(() => {
      farming = new DailyFarming(1)
    })

    it('should have correct dayOfWeek', () => {
      expect(farming.dayOfWeek).toBe(1)
    })

    it('should have talentBookIds as non-empty array', () => {
      expect(farming.talentBookIds).toBeDefined()
      expect(Array.isArray(farming.talentBookIds)).toBe(true)
      expect(farming.talentBookIds.length).toBeGreaterThan(0)
    })

    it('should have weaponMaterialIds as non-empty array', () => {
      expect(farming.weaponMaterialIds).toBeDefined()
      expect(Array.isArray(farming.weaponMaterialIds)).toBe(true)
      expect(farming.weaponMaterialIds.length).toBeGreaterThan(0)
    })

    it('should have domains as non-empty array', () => {
      expect(farming.domains).toBeDefined()
      expect(Array.isArray(farming.domains)).toBe(true)
      expect(farming.domains.length).toBeGreaterThan(0)
    })
  })

  describe('Domain Data Structure (Monday)', () => {
    let farming: DailyFarming

    beforeAll(() => {
      farming = new DailyFarming(1)
    })

    it('should have domain with name', () => {
      const domain = farming.domains[0]
      expect(domain.name).toBeDefined()
      expect(typeof domain.name).toBe('string')
      expect(domain.name.length).toBeGreaterThan(0)
    })

    it('should have domain with description', () => {
      const domain = farming.domains[0]
      expect(domain.description).toBeDefined()
      expect(typeof domain.description).toBe('string')
    })

    it('should have domain with materialIds', () => {
      const domain = farming.domains[0]
      expect(domain.materialIds).toBeDefined()
      expect(Array.isArray(domain.materialIds)).toBe(true)
      expect(domain.materialIds.length).toBeGreaterThan(0)
    })

    it('should have domain with characterInfos as array', () => {
      const domain = farming.domains[0]
      expect(domain.characterInfos).toBeDefined()
      expect(Array.isArray(domain.characterInfos)).toBe(true)
    })

    it('should have domain with weaponIds as array', () => {
      const domain = farming.domains[0]
      expect(domain.weaponIds).toBeDefined()
      expect(Array.isArray(domain.weaponIds)).toBe(true)
    })

    it('should have first domain name as Cecilia Garden', () => {
      expect(farming.domains[0].name).toBe('Cecilia Garden')
    })

    it('should have first domain with correct materialIds', () => {
      const domain = farming.domains[0]
      expect(domain.materialIds).toContain(114001)
      expect(domain.materialIds).toContain(114002)
      expect(domain.materialIds).toContain(114003)
      expect(domain.materialIds).toContain(114004)
    })

    it('should have weapon domain with weaponIds', () => {
      const weaponDomain = farming.domains.find(
        (d) => d.weaponIds.length > 0 && d.characterInfos.length === 0,
      )
      expect(weaponDomain).toBeDefined()
      expect(weaponDomain?.weaponIds.length).toBeGreaterThan(0)
    })

    it('should have talent domain with characterInfos', () => {
      const talentDomain = farming.domains.find(
        (d) => d.characterInfos.length > 0,
      )
      expect(talentDomain).toBeDefined()
      expect(talentDomain?.characterInfos.length).toBeGreaterThan(0)
    })

    it('should have characterInfos as CharacterInfo instances', () => {
      const talentDomain = farming.domains.find(
        (d) => d.characterInfos.length > 0,
      )
      if (talentDomain && talentDomain.characterInfos.length > 0)
        expect(talentDomain.characterInfos[0]).toBeInstanceOf(CharacterInfo)
    })
  })

  describe('Sunday (dayOfWeek 0) - All Materials Available', () => {
    let sunday: DailyFarming
    let monday: DailyFarming

    beforeAll(() => {
      sunday = new DailyFarming(0)
      monday = new DailyFarming(1)
    })

    it('should have correct dayOfWeek', () => {
      expect(sunday.dayOfWeek).toBe(0)
    })

    it('should have more domains on Sunday than Monday', () => {
      expect(sunday.domains.length).toBeGreaterThan(monday.domains.length)
    })

    it('should have more talentBookIds on Sunday than Monday', () => {
      expect(sunday.talentBookIds.length).toBeGreaterThan(
        monday.talentBookIds.length,
      )
    })

    it('should have more weaponMaterialIds on Sunday than Monday', () => {
      expect(sunday.weaponMaterialIds.length).toBeGreaterThan(
        monday.weaponMaterialIds.length,
      )
    })
  })

  describe('Different Days of Week', () => {
    it('should create DailyFarming for Tuesday (2)', () => {
      const farming = new DailyFarming(2)
      expect(farming.dayOfWeek).toBe(2)
      expect(farming.domains.length).toBeGreaterThan(0)
    })

    it('should create DailyFarming for Wednesday (3)', () => {
      const farming = new DailyFarming(3)
      expect(farming.dayOfWeek).toBe(3)
      expect(farming.domains.length).toBeGreaterThan(0)
    })

    it('should create DailyFarming for Thursday (4)', () => {
      const farming = new DailyFarming(4)
      expect(farming.dayOfWeek).toBe(4)
      expect(farming.domains.length).toBeGreaterThan(0)
    })

    it('should create DailyFarming for Friday (5)', () => {
      const farming = new DailyFarming(5)
      expect(farming.dayOfWeek).toBe(5)
      expect(farming.domains.length).toBeGreaterThan(0)
    })

    it('should create DailyFarming for Saturday (6)', () => {
      const farming = new DailyFarming(6)
      expect(farming.dayOfWeek).toBe(6)
      expect(farming.domains.length).toBeGreaterThan(0)
    })

    it('should have same domain count for Mon/Thu (day 1 and 4)', () => {
      const monday = new DailyFarming(1)
      const thursday = new DailyFarming(4)
      expect(monday.domains.length).toBe(thursday.domains.length)
    })

    it('should have same domain count for Tue/Fri (day 2 and 5)', () => {
      const tuesday = new DailyFarming(2)
      const friday = new DailyFarming(5)
      expect(tuesday.domains.length).toBe(friday.domains.length)
    })

    it('should have same domain count for Wed/Sat (day 3 and 6)', () => {
      const wednesday = new DailyFarming(3)
      const saturday = new DailyFarming(6)
      expect(wednesday.domains.length).toBe(saturday.domains.length)
    })
  })
})
