/* eslint-disable @typescript-eslint/no-unsafe-return -- Test file uses partial mock data */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ExcelBinCache } from '@/cache/ExcelBinCache'
import { ExcelBinJoinQuery } from '@/query/ExcelBinJoinQuery'
import { ExcelBinQuery } from '@/query/ExcelBinQuery'
import type { MasterFileMap } from '@/types/generated/MasterFileMap'

// Mock record types
type AvatarRecord = MasterFileMap['AvatarExcelConfigData'][number]
type SkillDepotRecord = MasterFileMap['AvatarSkillDepotExcelConfigData'][number]

// Mock data
const avatarMockRecords = [
  {
    id: 10000002,
    skillDepotId: 201,
    nameTextMapHash: 1000,
  },
  {
    id: 10000003,
    skillDepotId: 301,
    nameTextMapHash: 1001,
  },
  {
    id: 10000046,
    skillDepotId: 4601,
    nameTextMapHash: 1046,
  },
] as never as AvatarRecord[]

const skillDepotMockRecords = [
  {
    id: 201,
    energySkill: 10201,
    skills: [10211, 10212],
  },
  {
    id: 301,
    energySkill: 10301,
    skills: [10311, 10312],
  },
  // Note: id 4601 is missing to test LEFT JOIN behavior
] as never as SkillDepotRecord[]

// Mock ExcelBinCache
function createMockCache(): ExcelBinCache {
  return {
    getRecords: vi.fn((tableName: string) => {
      if (tableName === 'AvatarExcelConfigData') return avatarMockRecords
      if (tableName === 'AvatarSkillDepotExcelConfigData')
        return skillDepotMockRecords
      return []
    }),
    // Mock returns false - no index available in test mock, falls back to linear scan
    hasIndex: vi.fn(() => false),
  } as unknown as ExcelBinCache
}

describe('ExcelBinJoinQuery', () => {
  let mockCache: ExcelBinCache

  beforeEach(() => {
    mockCache = createMockCache()
  })

  describe('innerJoin', () => {
    it('should join records with matching keys', async () => {
      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', mockCache)
      const joinQuery = baseQuery.innerJoin(
        'AvatarSkillDepotExcelConfigData',
        'skillDepotId',
        'id',
      )

      const results = await joinQuery.execute()

      // Only 2 records should match (10000046 has no matching skillDepot)
      expect(results).toHaveLength(2)
    })

    it('should include properties from both tables', async () => {
      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', mockCache)
      const joinQuery = baseQuery
        .innerJoin('AvatarSkillDepotExcelConfigData', 'skillDepotId', 'id')
        // Use select to avoid id property conflict between tables
        .select(['skillDepotId', 'nameTextMapHash'], ['energySkill'])

      const results = await joinQuery.execute()

      // First result should have properties from both tables
      const first = results[0]
      expect(first).toBeDefined()

      // Base table properties (id not selected to avoid conflict)
      expect(first.skillDepotId.value).toBe(201)
      expect(first.nameTextMapHash.value).toBe(1000)

      // Join table properties
      expect(first.energySkill.value).toBe(10201)
    })

    it('should exclude records without matching join key', async () => {
      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', mockCache)
      const joinQuery = baseQuery
        .innerJoin('AvatarSkillDepotExcelConfigData', 'skillDepotId', 'id')
        .select(['skillDepotId'], ['energySkill'])

      const results = await joinQuery.execute()

      // 10000046 with skillDepotId 4601 should not be included (no matching record)
      const hasHuTao = results.some((r) => r.skillDepotId.value === 4601)
      expect(hasHuTao).toBe(false)
    })
  })

  describe('leftJoin', () => {
    it('should include all base records even without matches', async () => {
      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', mockCache)
      const joinQuery = baseQuery
        .leftJoin('AvatarSkillDepotExcelConfigData', 'skillDepotId', 'id')
        .select(['skillDepotId'], ['energySkill'])

      const results = await joinQuery.execute()

      // All 3 base records should be included
      expect(results).toHaveLength(3)
    })

    it('should have undefined for unmatched join properties', async () => {
      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', mockCache)
      const joinQuery = baseQuery
        .leftJoin('AvatarSkillDepotExcelConfigData', 'skillDepotId', 'id')
        .select(['skillDepotId', 'nameTextMapHash'], ['energySkill'])

      const results = await joinQuery.execute()

      // Find the record without a match (HuTao with skillDepotId 4601)
      const huTao = results.find((r) => r.skillDepotId.value === 4601)
      expect(huTao).toBeDefined()
      expect(huTao?.nameTextMapHash.value).toBe(1046)
      // Join table properties should be undefined
      expect(huTao?.energySkill.value).toBeUndefined()
    })
  })

  describe('select', () => {
    it('should select specific properties from both tables', async () => {
      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', mockCache)
      const joinQuery = baseQuery
        .innerJoin('AvatarSkillDepotExcelConfigData', 'skillDepotId', 'id')
        .select(['skillDepotId', 'nameTextMapHash'], ['energySkill'])

      const results = await joinQuery.execute()

      const first = results[0]
      expect(first.skillDepotId.value).toBe(201)
      expect(first.nameTextMapHash.value).toBe(1000)
      expect(first.energySkill.value).toBe(10201)

      // Check that only selected properties are present
      expect(Object.keys(first)).toContain('skillDepotId')
      expect(Object.keys(first)).toContain('nameTextMapHash')
      expect(Object.keys(first)).toContain('energySkill')
    })
  })

  describe('executeTakeFirst', () => {
    it('should return the first joined record', async () => {
      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', mockCache)
      const joinQuery = baseQuery
        .innerJoin('AvatarSkillDepotExcelConfigData', 'skillDepotId', 'id')
        .select(['skillDepotId', 'nameTextMapHash'], ['energySkill'])

      const result = await joinQuery.executeTakeFirst()

      expect(result).toBeDefined()
      expect(result?.skillDepotId.value).toBe(201)
    })

    it('should return undefined when no records match', async () => {
      // Create cache with no matching records
      const emptyCache = {
        getRecords: vi.fn(() => []),
        hasIndex: vi.fn(() => false),
      } as unknown as ExcelBinCache

      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', emptyCache)
      const joinQuery = baseQuery.innerJoin(
        'AvatarSkillDepotExcelConfigData',
        'skillDepotId',
        'id',
      )

      const result = await joinQuery.executeTakeFirst()

      expect(result).toBeUndefined()
    })
  })

  describe('executeTakeFirstOrThrow', () => {
    it('should return the first joined record', async () => {
      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', mockCache)
      const joinQuery = baseQuery
        .innerJoin('AvatarSkillDepotExcelConfigData', 'skillDepotId', 'id')
        .select(['skillDepotId', 'nameTextMapHash'], ['energySkill'])

      const result = await joinQuery.executeTakeFirstOrThrow()

      expect(result.skillDepotId.value).toBe(201)
    })

    it('should throw when no records match', async () => {
      const emptyCache = {
        getRecords: vi.fn(() => []),
        hasIndex: vi.fn(() => false),
      } as unknown as ExcelBinCache

      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', emptyCache)
      const joinQuery = baseQuery.innerJoin(
        'AvatarSkillDepotExcelConfigData',
        'skillDepotId',
        'id',
      )

      await expect(joinQuery.executeTakeFirstOrThrow()).rejects.toThrow()
    })
  })

  describe('ExcelBinJoinQuery direct construction', () => {
    it('should work when constructed directly', async () => {
      const baseQuery = new ExcelBinQuery('AvatarExcelConfigData', mockCache)
      const joinQuery = new ExcelBinJoinQuery(
        baseQuery,
        mockCache,
        'AvatarExcelConfigData',
        'AvatarSkillDepotExcelConfigData',
        'skillDepotId',
        'id',
        'inner',
      )

      const results = await joinQuery.execute()

      expect(results).toHaveLength(2)
    })
  })
})
