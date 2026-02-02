/* eslint-disable func-style */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { WeaponRepository } from '@/repository/WeaponRepository'
import { WeaponType } from '@/types/enums'

// Mock query builder chain
const createMockQueryBuilder = (
  results: Record<string, unknown>[] = [],
  singleResult?: Record<string, unknown>,
): Record<string, unknown> => {
  const builder: Record<string, unknown> = {
    select: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue(results),
    executeTakeFirst: vi.fn().mockResolvedValue(singleResult ?? results[0]),
    executeTakeFirstOrThrow: vi
      .fn()
      .mockResolvedValue(singleResult ?? results[0]),
  }
  return builder
}

// Helper to create mock located value
const lv = <T>(value: T): { value: T } => ({ value })

// Helper to create mock text map hash with toText
const th = (
  hash: number,
  text: string,
): { value: number; toText: () => string } => ({
  value: hash,
  toText: () => text,
})

// Helper to create mock enum converter
const ec = <T>(
  value: string,
  enumVal: T,
): { value: string; toEnum: () => T } => ({
  value,
  toEnum: () => enumVal,
})

describe('WeaponRepository', () => {
  const mockExcelBinCache = {
    from: vi.fn(),
    fromWithTextMap: vi.fn(),
  }

  const mockTextMap = {
    getTextSync: vi.fn().mockReturnValue('Mock Text'),
  }

  const imageBaseURL = 'https://example.com'

  let repository: WeaponRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repository = new WeaponRepository(
      {
        excelBinCache: mockExcelBinCache as never,
        textMap: mockTextMap as never,
      },
      imageBaseURL,
    )
  })

  describe('getAllWeaponIds', () => {
    it('should return all weapon IDs excluding blacklisted', async () => {
      const mockBuilder = createMockQueryBuilder([
        { id: lv(11509) },
        { id: lv(11501) },
        { id: lv(10002) }, // blacklisted
        { id: lv(11411) }, // blacklisted
      ])
      mockExcelBinCache.from.mockReturnValue(mockBuilder)

      const result = await repository.getAllWeaponIds()

      expect(mockExcelBinCache.from).toHaveBeenCalledWith(
        'WeaponExcelConfigData',
      )
      expect(result).toEqual([11509, 11501])
    })
  })

  describe('getWeaponInfo', () => {
    it('should build WeaponInfo DTO', async () => {
      // Mock WeaponExcelConfigData query
      const weaponBuilder = createMockQueryBuilder([], {
        id: lv(11509),
        nameTextMapHash: th(1234567890, 'Mistsplitter Reforged'),
        descTextMapHash: th(1234567891, 'A sword description'),
        weaponType: ec('WEAPON_SWORD_ONE_HAND', WeaponType.WeaponSwordOneHand),
        rankLevel: lv(5),
        weaponPromoteId: lv(11509),
        skillAffix: [lv(115091)],
        weaponProp: [
          {
            propType: lv('FIGHT_PROP_BASE_ATTACK'),
            type: lv('GROW_CURVE_ATTACK_301'),
            initValue: lv(48),
          },
          {
            propType: lv('FIGHT_PROP_CRITICAL_HURT'),
            type: lv('GROW_CURVE_CRITICAL_301'),
            initValue: lv(0.096),
          },
        ],
        icon: lv('UI_EquipIcon_Sword_Narukami'),
        awakenIcon: lv('UI_EquipIcon_Sword_Narukami_Awaken'),
      })
      mockExcelBinCache.fromWithTextMap.mockReturnValue(weaponBuilder)

      // Mock WeaponPromoteExcelConfigData
      const promoteBuilder = createMockQueryBuilder([
        {
          weaponPromoteId: lv(11509),
          promoteLevel: lv(0),
          unlockMaxLevel: lv(20),
        },
        {
          weaponPromoteId: lv(11509),
          promoteLevel: lv(1),
          unlockMaxLevel: lv(40),
        },
        {
          weaponPromoteId: lv(11509),
          promoteLevel: lv(6),
          unlockMaxLevel: lv(90),
        },
      ])
      mockExcelBinCache.from.mockReturnValueOnce(promoteBuilder)

      // Mock getWeaponAscension (internal call)
      const weaponAscBuilder = createMockQueryBuilder([], {
        id: lv(11509),
        weaponPromoteId: lv(11509),
      })
      mockExcelBinCache.from.mockReturnValueOnce(weaponAscBuilder)

      const promoteDataBuilder = createMockQueryBuilder([], {
        weaponPromoteId: lv(11509),
        promoteLevel: lv(0),
        costItems: [],
        coinCost: lv(0),
        addProps: [],
        unlockMaxLevel: lv(20),
      })
      mockExcelBinCache.from.mockReturnValueOnce(promoteDataBuilder)

      // Mock WeaponCurveExcelConfigData
      const curveBuilder = createMockQueryBuilder([
        {
          level: lv(1),
          curveInfos: [
            { type: lv('GROW_CURVE_ATTACK_301'), value: lv(1) },
            { type: lv('GROW_CURVE_CRITICAL_301'), value: lv(1) },
          ],
        },
      ])
      mockExcelBinCache.from.mockReturnValueOnce(curveBuilder)

      // Mock getWeaponRefinement (internal call)
      const weaponRefBuilder = createMockQueryBuilder([], {
        id: lv(11509),
        skillAffix: [lv(115091)],
      })
      mockExcelBinCache.from.mockReturnValueOnce(weaponRefBuilder)

      const affixBuilder = createMockQueryBuilder([
        {
          id: lv(115091),
          level: lv(0),
          nameTextMapHash: th(2001, 'Haran Geppaku Futsu'),
          descTextMapHash: th(2002, 'Increases DMG...'),
          addProps: [],
        },
      ])
      mockExcelBinCache.fromWithTextMap.mockReturnValueOnce(weaponBuilder)
      mockExcelBinCache.fromWithTextMap.mockReturnValueOnce(affixBuilder)

      const result = await repository.getWeaponInfo(11509, 1, false, 1)

      expect(result.id).toBe(11509)
      expect(result.name).toBe('Mistsplitter Reforged')
      expect(result.type).toBe(WeaponType.WeaponSwordOneHand)
      expect(result.rarity).toBe(5)
      expect(result.level).toBe(1)
      expect(result.maxLevel).toBe(90)
    })
  })

  describe('getWeaponAscension', () => {
    it('should build WeaponAscension DTO', async () => {
      // Mock WeaponExcelConfigData
      const weaponBuilder = createMockQueryBuilder([], {
        id: lv(11509),
        weaponPromoteId: lv(11509),
      })
      mockExcelBinCache.from.mockReturnValueOnce(weaponBuilder)

      // Mock WeaponPromoteExcelConfigData
      const promoteBuilder = createMockQueryBuilder([], {
        weaponPromoteId: lv(11509),
        promoteLevel: lv(6),
        costItems: [
          { id: lv(104001), count: lv(6) },
          { id: lv(0), count: lv(0) },
        ],
        coinCost: lv(150000),
        addProps: [
          {
            propType: ec('FIGHT_PROP_BASE_ATTACK', 'FIGHT_PROP_BASE_ATTACK'),
            value: lv(108.4),
          },
        ],
        unlockMaxLevel: lv(90),
      })
      mockExcelBinCache.from.mockReturnValueOnce(promoteBuilder)

      const result = await repository.getWeaponAscension(11509, 6)

      expect(result.id).toBe(11509)
      expect(result.promoteLevel).toBe(6)
      expect(result.costMora).toBe(150000)
      expect(result.unlockMaxLevel).toBe(90)
      expect(result.costItems).toHaveLength(1)
    })
  })

  describe('getWeaponRefinement', () => {
    it('should build WeaponRefinement DTO with skill', async () => {
      // Mock WeaponExcelConfigData
      const weaponBuilder = createMockQueryBuilder([], {
        id: lv(11509),
        skillAffix: [lv(115091)],
      })
      mockExcelBinCache.from.mockReturnValue(weaponBuilder)

      // Mock EquipAffixExcelConfigData
      const affixBuilder = createMockQueryBuilder([
        {
          id: lv(115091),
          level: lv(0),
          nameTextMapHash: th(3001, 'Wavecutter'),
          descTextMapHash: th(3002, 'Increases Element DMG'),
          addProps: [
            {
              propType: ec(
                'FIGHT_PROP_ELEMENT_MASTERY',
                'FIGHT_PROP_ELEMENT_MASTERY',
              ),
              value: lv(12),
            },
          ],
        },
        {
          id: lv(115091),
          level: lv(4),
          nameTextMapHash: th(3001, 'Wavecutter'),
          descTextMapHash: th(3003, 'Increases Element DMG Max'),
          addProps: [
            {
              propType: ec(
                'FIGHT_PROP_ELEMENT_MASTERY',
                'FIGHT_PROP_ELEMENT_MASTERY',
              ),
              value: lv(24),
            },
          ],
        },
      ])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(affixBuilder)

      const result = await repository.getWeaponRefinement(11509, 5)

      expect(result.id).toBe(11509)
      expect(result.refinementRank).toBe(5)
      expect(result.skillName).toBe('Wavecutter')
    })

    it('should return empty refinement for weapons without skill', async () => {
      // Mock WeaponExcelConfigData with no skill affix
      const weaponBuilder = createMockQueryBuilder([], {
        id: lv(11101),
        skillAffix: [lv(0)],
      })
      mockExcelBinCache.from.mockReturnValue(weaponBuilder)

      const result = await repository.getWeaponRefinement(11101, 1)

      expect(result.id).toBe(11101)
      expect(result.refinementRank).toBe(1)
      expect(result.skillName).toBeUndefined()
      expect(result.skillDescription).toBeUndefined()
      expect(result.addProps).toHaveLength(0)
    })

    it('should return empty refinement when affix not found', async () => {
      const weaponBuilder = createMockQueryBuilder([], {
        id: lv(11509),
        skillAffix: [lv(999999)],
      })
      mockExcelBinCache.from.mockReturnValue(weaponBuilder)

      const affixBuilder = createMockQueryBuilder([])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(affixBuilder)

      const result = await repository.getWeaponRefinement(11509, 1)

      expect(result.skillName).toBeUndefined()
    })
  })
})
