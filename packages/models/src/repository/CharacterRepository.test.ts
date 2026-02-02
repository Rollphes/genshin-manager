/* eslint-disable func-style, @typescript-eslint/explicit-function-return-type */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CharacterRepository } from '@/repository/CharacterRepository'
import { BodyType, WeaponType } from '@/types/enums'
import { Element } from '@/types/types'

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

describe('CharacterRepository', () => {
  const mockExcelBinCache = {
    from: vi.fn(),
    fromWithTextMap: vi.fn(),
  }

  const mockTextMap = {
    getTextSync: vi.fn().mockReturnValue('Mock Text'),
  }

  const imageBaseURL = 'https://example.com'

  let repository: CharacterRepository

  beforeEach(() => {
    vi.clearAllMocks()
    repository = new CharacterRepository(
      {
        excelBinCache: mockExcelBinCache as never,
        textMap: mockTextMap as never,
      },
      imageBaseURL,
    )
  })

  describe('getAllCharacterIds', () => {
    it('should return all character IDs excluding blacklisted', async () => {
      const mockBuilder = createMockQueryBuilder([
        { id: lv(10000002) },
        { id: lv(10000046) },
        { id: lv(10000001) }, // blacklisted
        { id: lv(20000001) }, // > 11000000
      ])
      mockExcelBinCache.from.mockReturnValue(mockBuilder)

      const result = await repository.getAllCharacterIds()

      expect(mockExcelBinCache.from).toHaveBeenCalledWith(
        'AvatarExcelConfigData',
      )
      expect(result).toEqual([10000002, 10000046])
    })
  })

  describe('getCharacterInfo', () => {
    it('should build CharacterInfo DTO', async () => {
      // Mock AvatarExcelConfigData query
      const avatarBuilder = createMockQueryBuilder([], {
        id: lv(10000046),
        nameTextMapHash: th(1234567890, 'Hu Tao'),
        skillDepotId: lv(4601),
        qualityType: lv('QUALITY_ORANGE'),
        weaponType: ec('WEAPON_POLE', WeaponType.WeaponPole),
        bodyType: ec('BODY_GIRL', BodyType.BodyGirl),
        sideIconName: lv('UI_AvatarIcon_Side_Hutao'),
      })
      mockExcelBinCache.fromWithTextMap.mockReturnValue(avatarBuilder)

      // Mock AvatarCostumeExcelConfigData query
      const costumeBuilder = createMockQueryBuilder([], {
        characterId: lv(10000046),
        quality: lv(0),
        skinId: lv(204601),
      })
      mockExcelBinCache.from.mockReturnValueOnce(costumeBuilder)

      // Mock AvatarSkillDepotExcelConfigData query
      const depotBuilder = createMockQueryBuilder([], {
        id: lv(4601),
        energySkill: lv(10465),
        skills: { value: [10461, 10462, 0, 0, 0] },
        talents: { value: [461, 462, 463, 464, 465, 466] },
        inherentProudSkillOpens: {
          value: [{ proudSkillGroupId: 462101 }, { proudSkillGroupId: 462201 }],
        },
      })
      mockExcelBinCache.from.mockReturnValueOnce(depotBuilder)

      // Mock AvatarSkillExcelConfigData for element
      const skillBuilder = createMockQueryBuilder([], {
        id: lv(10465),
        costElemType: lv('Fire'),
      })
      mockExcelBinCache.from.mockReturnValueOnce(skillBuilder)

      // Mock AvatarSkillExcelConfigData for buildSkillData
      const skillDataBuilder = createMockQueryBuilder([
        { id: lv(10461), proudSkillGroupId: lv(4631) },
        { id: lv(10462), proudSkillGroupId: lv(4632) },
        { id: lv(10465), proudSkillGroupId: lv(4635) },
      ])
      mockExcelBinCache.from.mockReturnValueOnce(skillDataBuilder)

      // Mock ProudSkillExcelConfigData for buildSkillData
      const proudBuilder = createMockQueryBuilder([
        {
          proudSkillGroupId: lv(462101),
          level: lv(1),
          isHideLifeProudSkill: lv(false),
        },
        {
          proudSkillGroupId: lv(462201),
          level: lv(1),
          isHideLifeProudSkill: lv(false),
        },
      ])
      mockExcelBinCache.from.mockReturnValueOnce(proudBuilder)

      const result = await repository.getCharacterInfo(10000046)

      expect(result.id).toBe(10000046)
      expect(result.name).toBe('Hu Tao')
      expect(result.element).toBe(Element.Pyro)
      expect(result.rarity).toBe(5)
      expect(result.weaponType).toBe(WeaponType.WeaponPole)
      expect(result.bodyType).toBe(BodyType.BodyGirl)
      expect(result.defaultCostumeId).toBe(204601)
      expect(result.depotId).toBe(4601)
    })
  })

  describe('getCharacterBaseStats', () => {
    it('should build CharacterBaseStats DTO', async () => {
      // Mock AvatarExcelConfigData
      const avatarBuilder = createMockQueryBuilder([], {
        id: lv(10000046),
        avatarPromoteId: lv(46),
        hpBase: lv(1210.19),
        attackBase: lv(8.29),
        defenseBase: lv(68.21),
        critical: lv(0.05),
        criticalHurt: lv(0.5),
        propGrowCurves: [
          { type: lv('FIGHT_PROP_BASE_HP'), growCurve: lv('GROW_CURVE_HP_S5') },
          {
            type: lv('FIGHT_PROP_BASE_ATTACK'),
            growCurve: lv('GROW_CURVE_ATTACK_S5'),
          },
          {
            type: lv('FIGHT_PROP_BASE_DEFENSE'),
            growCurve: lv('GROW_CURVE_HP_S5'),
          },
        ],
      })
      mockExcelBinCache.from.mockReturnValueOnce(avatarBuilder)

      // Mock AvatarPromoteExcelConfigData
      const promoteBuilder = createMockQueryBuilder([
        {
          avatarPromoteId: lv(46),
          promoteLevel: lv(0),
          unlockMaxLevel: lv(20),
        },
        {
          avatarPromoteId: lv(46),
          promoteLevel: lv(1),
          unlockMaxLevel: lv(40),
        },
        {
          avatarPromoteId: lv(46),
          promoteLevel: lv(6),
          unlockMaxLevel: lv(90),
        },
      ])
      mockExcelBinCache.from.mockReturnValueOnce(promoteBuilder)

      // Mock getCharacterAscension
      const ascensionBuilder = createMockQueryBuilder([], {
        avatarPromoteId: lv(46),
      })
      mockExcelBinCache.from.mockReturnValueOnce(ascensionBuilder)

      const promoteDataBuilder = createMockQueryBuilder([], {
        avatarPromoteId: lv(46),
        promoteLevel: lv(6),
        costItems: [],
        scoinCost: lv(0),
        addProps: [],
        unlockMaxLevel: lv(90),
      })
      mockExcelBinCache.from.mockReturnValueOnce(promoteDataBuilder)

      // Mock AvatarCurveExcelConfigData
      const curveBuilder = createMockQueryBuilder([
        {
          level: lv(90),
          curveInfos: [
            { type: lv('GROW_CURVE_HP_S5'), value: lv(11.83) },
            { type: lv('GROW_CURVE_ATTACK_S5'), value: lv(11.83) },
          ],
        },
      ])
      mockExcelBinCache.from.mockReturnValueOnce(curveBuilder)

      const result = await repository.getCharacterBaseStats(10000046, 90, true)

      expect(result.id).toBe(10000046)
      expect(result.level).toBe(90)
      expect(result.promoteLevel).toBe(6)
      expect(result.isAscended).toBe(true)
      expect(result.stats.length).toBeGreaterThan(0)
    })
  })

  describe('getConstellations', () => {
    it('should build CharacterConstellation DTOs', async () => {
      const talentBuilder = createMockQueryBuilder([
        {
          talentId: lv(461),
          nameTextMapHash: th(111, 'Constellation 1'),
          descTextMapHash: th(112, 'Description 1'),
          icon: lv('UI_Talent_461'),
        },
        {
          talentId: lv(462),
          nameTextMapHash: th(121, 'Constellation 2'),
          descTextMapHash: th(122, 'Description 2'),
          icon: lv('UI_Talent_462'),
        },
      ])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(talentBuilder)

      const result = await repository.getConstellations([461, 462], 1)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(461)
      expect(result[0].name).toBe('Constellation 1')
      expect(result[0].locked).toBe(false)
      expect(result[1].locked).toBe(true)
    })
  })

  describe('getInherentSkills', () => {
    it('should build CharacterInherentSkill DTOs', async () => {
      const proudBuilder = createMockQueryBuilder([
        {
          proudSkillGroupId: lv(462101),
          level: lv(1),
          nameTextMapHash: th(201, 'Passive 1'),
          descTextMapHash: th(202, 'Description 1'),
          icon: lv('UI_Talent_Passive'),
          addProps: [],
        },
      ])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(proudBuilder)

      const result = await repository.getInherentSkills([462101])

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(462101)
      expect(result[0].name).toBe('Passive 1')
    })
  })

  describe('getCharacterProfile', () => {
    it('should build CharacterProfile DTO', async () => {
      const fetterBuilder = createMockQueryBuilder([
        {
          avatarId: lv(10000046),
          fetterId: lv(46001),
          avatarNativeTextMapHash: th(301, 'Liyue'),
          avatarVisionAfterTextMapHash: th(302, 'Pyro'),
          avatarVisionBeforTextMapHash: { value: 0, toText: () => '' },
          avatarConstellationAfterTextMapHash: th(303, 'Papilio Charontis'),
          avatarConstellationBeforTextMapHash: { value: 0, toText: () => '' },
          avatarTitleTextMapHash: th(304, '77th Director'),
          avatarDetailTextMapHash: th(305, 'Hu Tao is...'),
          cvChineseTextMapHash: th(306, 'CV Chinese'),
          cvJapaneseTextMapHash: th(307, 'Rie Takahashi'),
          cvEnglishTextMapHash: th(308, 'CV English'),
          cvKoreanTextMapHash: th(309, 'CV Korean'),
          infoBirthMonth: lv(7),
          infoBirthDay: lv(15),
          avatarAssocType: lv('ASSOC_TYPE_LIYUE'),
        },
      ])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(fetterBuilder)

      const result = await repository.getCharacterProfile(10000046)

      expect(result).toBeDefined()
      expect(result?.characterId).toBe(10000046)
      expect(result?.native).toBe('Liyue')
      expect(result?.vision).toBe('Pyro')
      expect(result?.cv.ja).toBe('Rie Takahashi')
    })

    it('should return undefined if profile not found', async () => {
      const fetterBuilder = createMockQueryBuilder([])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(fetterBuilder)

      const result = await repository.getCharacterProfile(99999999)

      expect(result).toBeUndefined()
    })
  })

  describe('getCharacterStories', () => {
    it('should build CharacterStory DTOs', async () => {
      const storyBuilder = createMockQueryBuilder([
        {
          avatarId: lv(10000046),
          fetterId: lv(46101),
          storyTitleTextMapHash: th(401, 'Story 1'),
          storyTitle2TextMapHash: { value: 0, toText: () => '' },
          storyContextTextMapHash: th(402, 'Story content'),
          storyContext2TextMapHash: { value: 0, toText: () => '' },
          tips: { value: [] },
        },
      ])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(storyBuilder)

      const result = await repository.getCharacterStories(10000046)

      expect(result).toHaveLength(1)
      expect(result[0].fetterId).toBe(46101)
      expect(result[0].title).toBe('Story 1')
    })
  })

  describe('getCharacterCostumes', () => {
    it('should build CharacterCostume DTOs', async () => {
      const costumeBuilder = createMockQueryBuilder([
        {
          characterId: lv(10000046),
          skinId: lv(204601),
          nameTextMapHash: th(501, 'Default'),
          descTextMapHash: th(502, 'Default costume'),
          quality: lv(0),
          sideIconName: lv('UI_AvatarIcon_Side_Hutao'),
        },
      ])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(costumeBuilder)

      const avatarBuilder = createMockQueryBuilder([], {
        id: lv(10000046),
        sideIconName: lv('UI_AvatarIcon_Side_Hutao'),
      })
      mockExcelBinCache.from.mockReturnValue(avatarBuilder)

      const result = await repository.getCharacterCostumes(10000046)

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe(204601)
      expect(result[0].characterId).toBe(10000046)
    })
  })

  describe('getCharacterSkill', () => {
    it('should build CharacterSkill DTO', async () => {
      const skillBuilder = createMockQueryBuilder([], {
        id: lv(10461),
        nameTextMapHash: th(601, 'Normal Attack'),
        descTextMapHash: th(602, 'Performs attacks'),
        skillIcon: lv('Skill_A_Pole'),
        proudSkillGroupId: lv(4631),
      })
      mockExcelBinCache.fromWithTextMap.mockReturnValue(skillBuilder)

      const proudBuilder = createMockQueryBuilder([], {
        proudSkillGroupId: lv(4631),
        level: lv(10),
        paramDescList: [
          th(603, 'DMG 100%'),
          th(604, 'DMG 200%'),
          { value: 0, toText: () => '' },
        ],
      })
      mockExcelBinCache.fromWithTextMap.mockReturnValueOnce(skillBuilder)
      mockExcelBinCache.fromWithTextMap.mockReturnValueOnce(proudBuilder)

      const result = await repository.getCharacterSkill(10461, 10, 0)

      expect(result.id).toBe(10461)
      expect(result.name).toBe('Normal Attack')
      expect(result.level).toBe(10)
    })
  })

  describe('getCharacterSkillAscension', () => {
    it('should build CharacterSkillAscension DTO', async () => {
      const proudBuilder = createMockQueryBuilder([], {
        proudSkillGroupId: lv(4631),
        level: lv(10),
        costItems: [
          { id: lv(104001), count: lv(3) },
          { id: lv(0), count: lv(0) },
        ],
        coinCost: lv(120000),
        addProps: [],
      })
      mockExcelBinCache.from.mockReturnValue(proudBuilder)

      const result = await repository.getCharacterSkillAscension(4631, 10)

      expect(result.id).toBe(4631)
      expect(result.level).toBe(10)
      expect(result.costMora).toBe(120000)
      expect(result.costItems).toHaveLength(1)
    })
  })

  describe('getCharacterVoices', () => {
    it('should build CharacterVoice DTOs', async () => {
      const voiceBuilder = createMockQueryBuilder([
        {
          avatarId: lv(10000046),
          fetterId: lv(46201),
          type: lv(1),
          voiceTitleTextMapHash: th(701, 'Hello'),
          voiceFileTextTextMapHash: th(702, 'Hello content'),
          voiceFile: lv('VO_hutao_hello'),
          voiceTitleLockedTextMapHash: { value: 0, toText: () => '' },
          tips: { value: [] },
          hideCostumeList: [],
          showCostumeList: [],
        },
      ])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(voiceBuilder)

      const result = await repository.getCharacterVoices(10000046, 'ja')

      expect(result).toHaveLength(1)
      expect(result[0].fetterId).toBe(46201)
      expect(result[0].cv).toBe('ja')
      expect(result[0].title).toBe('Hello')
    })
  })

  describe('getCharacterIdsByName', () => {
    it('should return character IDs matching name', async () => {
      const avatarBuilder = createMockQueryBuilder([
        { id: lv(10000046), nameTextMapHash: th(801, 'Hu Tao') },
        { id: lv(10000002), nameTextMapHash: th(802, 'Kamisato Ayaka') },
        { id: lv(10000001), nameTextMapHash: th(803, 'Kate') }, // blacklisted
        { id: lv(20000001), nameTextMapHash: th(804, 'Hutao Test') }, // > 11000000
      ])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(avatarBuilder)

      const result = await repository.getCharacterIdsByName('Hu')

      expect(result).toEqual([10000046])
    })

    it('should be case insensitive', async () => {
      const avatarBuilder = createMockQueryBuilder([
        { id: lv(10000046), nameTextMapHash: th(801, 'Hu Tao') },
      ])
      mockExcelBinCache.fromWithTextMap.mockReturnValue(avatarBuilder)

      const result = await repository.getCharacterIdsByName('hu tao')

      expect(result).toEqual([10000046])
    })
  })

  describe('getTravelerSkillDepotIds', () => {
    it('should return skill depot IDs for male traveler', async () => {
      const depotBuilder = createMockQueryBuilder([
        { id: lv(501), energySkill: lv(0) }, // no energy skill
        { id: lv(504), energySkill: lv(10504) }, // Anemo
        { id: lv(506), energySkill: lv(10506) }, // Geo
        { id: lv(507), energySkill: lv(10507) }, // Electro
        { id: lv(701), energySkill: lv(0) }, // female, different range
      ])
      mockExcelBinCache.from.mockReturnValue(depotBuilder)

      const result = await repository.getTravelerSkillDepotIds(10000005)

      expect(result).toEqual([504, 506, 507])
    })

    it('should return skill depot IDs for female traveler', async () => {
      const depotBuilder = createMockQueryBuilder([
        { id: lv(701), energySkill: lv(0) },
        { id: lv(704), energySkill: lv(10704) },
        { id: lv(706), energySkill: lv(10706) },
      ])
      mockExcelBinCache.from.mockReturnValue(depotBuilder)

      const result = await repository.getTravelerSkillDepotIds(10000007)

      expect(result).toEqual([704, 706])
    })

    it('should return empty array for non-traveler', async () => {
      const result = await repository.getTravelerSkillDepotIds(10000046)

      expect(result).toEqual([])
    })
  })
})
