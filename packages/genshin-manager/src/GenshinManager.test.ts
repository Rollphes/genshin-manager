/* eslint-disable @typescript-eslint/naming-convention */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GenshinManager } from '@/GenshinManager'
import { GenshinManagerEvents } from '@/types'

// Mock the repositories from @genshin-manager/models
vi.mock('@genshin-manager/models', () => ({
  CharacterRepository: vi.fn().mockImplementation(() => ({
    getCharacterInfo: vi
      .fn()
      .mockResolvedValue({ id: 10000046, name: 'Hu Tao' }),
    getCharacterBaseStats: vi
      .fn()
      .mockResolvedValue({ id: 10000046, level: 90 }),
    getCharacterAscension: vi
      .fn()
      .mockResolvedValue({ id: 10000046, promoteLevel: 6 }),
    getAllCharacterIds: vi.fn().mockResolvedValue([10000046, 10000002]),
    getConstellations: vi.fn().mockResolvedValue([]),
    getInherentSkills: vi.fn().mockResolvedValue([]),
    getCharacterProfile: vi.fn().mockResolvedValue({ characterId: 10000046 }),
    getCharacterStories: vi.fn().mockResolvedValue([]),
    getCharacterCostumes: vi.fn().mockResolvedValue([]),
    getCharacterSkill: vi.fn().mockResolvedValue({ id: 10461 }),
    getCharacterSkillAscension: vi.fn().mockResolvedValue({ id: 4631 }),
    getCharacterVoices: vi.fn().mockResolvedValue([]),
    getCharacterIdsByName: vi.fn().mockResolvedValue([10000046]),
    getTravelerSkillDepotIds: vi.fn().mockResolvedValue([504, 506, 507]),
  })),
  WeaponRepository: vi.fn().mockImplementation(() => ({
    getWeaponInfo: vi.fn().mockResolvedValue({ id: 11509 }),
    getWeaponAscension: vi
      .fn()
      .mockResolvedValue({ id: 11509, promoteLevel: 6 }),
    getWeaponRefinement: vi
      .fn()
      .mockResolvedValue({ id: 11509, refinementRank: 5 }),
    getAllWeaponIds: vi.fn().mockResolvedValue([11509, 11501]),
  })),
  ArtifactRepository: vi.fn().mockImplementation(() => ({
    getArtifact: vi.fn().mockResolvedValue({ id: 75540 }),
    getAllArtifactIds: vi.fn().mockResolvedValue([75540, 75541]),
    buildSetBonus: vi.fn().mockReturnValue({
      oneSetBonus: [],
      twoSetBonus: [],
      fourSetBonus: [],
    }),
    getMaxLevel: vi.fn().mockReturnValue(20),
  })),
  MaterialRepository: vi.fn().mockImplementation(() => ({
    getMaterial: vi.fn().mockResolvedValue({ id: 104001 }),
    getAllMaterialIds: vi.fn().mockResolvedValue([104001, 104002]),
  })),
  MonsterRepository: vi.fn().mockImplementation(() => ({
    getMonster: vi.fn().mockResolvedValue({ id: 21010101 }),
    getAllMonsterIds: vi.fn().mockResolvedValue([21010101]),
  })),
  ProfilePictureRepository: vi.fn().mockImplementation(() => ({
    getProfilePicture: vi.fn().mockResolvedValue({ id: 1 }),
    getAllProfilePictureIds: vi.fn().mockResolvedValue([1, 2]),
  })),
  DailyFarmingRepository: vi.fn().mockImplementation(() => ({
    getDailyFarming: vi.fn().mockResolvedValue({ dayOfWeek: 1 }),
  })),
}))

// Mock @genshin-manager/data
vi.mock('@genshin-manager/data', () => ({
  ExcelBinCache: Object.assign(
    vi.fn().mockImplementation(() => ({
      load: vi.fn().mockResolvedValue({ redownloadRequired: false }),
      extractTextHashes: vi.fn().mockReturnValue(new Set([1234567890])),
    })),
    { allKeys: new Set(['AvatarExcelConfigData']) },
  ),
  ExcelBinOutputs: {},
  TextMapIndex: vi.fn().mockImplementation(() => ({
    currentLanguage: 'en',
    buildIndex: vi.fn().mockResolvedValue(undefined),
    batchLoad: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  })),
  FileLocation: {
    deploy: vi.fn(),
    defaultCacheFolder: vi
      .fn()
      .mockReturnValue({ resolve: () => '/tmp/cache' }),
    excelBinFolder: vi
      .fn()
      .mockReturnValue({ resolve: () => '/tmp/cache/ExcelBinOutput' }),
    textMapFolder: vi
      .fn()
      .mockReturnValue({ resolve: () => '/tmp/cache/TextMap' }),
  },
}))

// Mock @genshin-manager/sync
vi.mock('@genshin-manager/sync', () => ({
  AssetDownloader: vi.fn().mockImplementation(() => ({
    downloadFolder: vi.fn().mockResolvedValue(undefined),
  })),
  VersionChecker: vi.fn().mockImplementation(() => ({
    checkForUpdate: vi.fn().mockResolvedValue(null),
    getGameVersion: vi.fn().mockReturnValue('5.0.0'),
    commitId: 'abc123',
  })),
  getTextMapFileNamesFromGitLab: vi
    .fn()
    .mockResolvedValue(new Map([['en', ['TextMapEN.json']]])),
}))

// Mock fs
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn(),
  },
}))

// Mock node-cron
vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn().mockReturnValue({ stop: vi.fn() }),
  },
}))

describe('GenshinManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should construct with default options', () => {
      const manager = new GenshinManager()
      expect(manager).toBeInstanceOf(GenshinManager)
      expect(manager.option.defaultLanguage).toBe('en')
    })

    it('should construct with custom options', () => {
      const manager = new GenshinManager({
        defaultLanguage: 'ja' as never,
      })
      expect(manager.option.defaultLanguage).toBe('ja')
    })

    it('should merge download languages with default language', () => {
      const manager = new GenshinManager({
        defaultLanguage: 'ja' as never,
        downloadLanguages: ['en' as never],
      })
      expect(manager.option.downloadLanguages).toContain('ja')
      expect(manager.option.downloadLanguages).toContain('en')
    })

    it('should disable autoFix when autoFetchLatestAssetsByCron is false', () => {
      const manager = new GenshinManager({
        autoFetchLatestAssetsByCron: false,
      })
      expect(manager.option.autoFixTextMap).toBe(false)
      expect(manager.option.autoFixExcelBin).toBe(false)
    })
  })

  describe('getters', () => {
    it('should return gameVersion from versionChecker', () => {
      const manager = new GenshinManager()
      expect(manager.gameVersion).toBe('5.0.0')
    })

    it('should return currentLanguage from textMapIndex or default', () => {
      const manager = new GenshinManager()
      expect(manager.currentLanguage).toBe('en')
    })
  })

  describe('public managers', () => {
    it('should expose enka and notices managers', () => {
      const manager = new GenshinManager()
      expect(manager.enka).toBeDefined()
      expect(manager.notices).toBeDefined()
    })
  })

  describe('event handling', () => {
    it('should support event listener registration', () => {
      const manager = new GenshinManager()
      const listener = vi.fn()
      manager.on(GenshinManagerEvents.BeginUpdateCache, listener)
      manager.off(GenshinManagerEvents.BeginUpdateCache, listener)
    })
  })

  describe('lifecycle', () => {
    it('should destroy without error', async () => {
      const manager = new GenshinManager()
      await manager.destroy()
      // double destroy is safe
      await manager.destroy()
    })

    it('should deploy and setup cron when autoFetchLatestAssetsByCron is set', async () => {
      const manager = new GenshinManager()
      await manager.deploy()
      await manager.destroy()
    })

    it('should changeLanguage and reload textMap', async () => {
      const manager = new GenshinManager()
      await manager.changeLanguage('ja' as never)
    })
  })

  describe('Character API', () => {
    it('should fetchCharacterInfo', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterInfo(10000046)
      expect(result).toEqual({ id: 10000046, name: 'Hu Tao' })
    })

    it('should fetchCharacterInfo with skillDepotId', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterInfo(10000005, 504)
      expect(result).toEqual({ id: 10000046, name: 'Hu Tao' })
    })

    it('should fetchCharacterBaseStats', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterBaseStats(10000046, 90, true)
      expect(result).toEqual({ id: 10000046, level: 90 })
    })

    it('should fetchCharacterAscension', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterAscension(10000046, 6)
      expect(result).toEqual({ id: 10000046, promoteLevel: 6 })
    })

    it('should fetchAllCharacterIds', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchAllCharacterIds()
      expect(result).toEqual([10000046, 10000002])
    })

    it('should fetchCharacterConstellations', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterConstellations(10000046, 6)
      expect(result).toEqual([])
    })

    it('should fetchCharacterConstellations with skillDepotId', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterConstellations(
        10000005,
        0,
        504,
      )
      expect(result).toEqual([])
    })

    it('should fetchCharacterInherentSkills', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterInherentSkills(10000046)
      expect(result).toEqual([])
    })

    it('should fetchCharacterInherentSkills with skillDepotId', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterInherentSkills(10000005, 504)
      expect(result).toEqual([])
    })

    it('should fetchCharacterProfile', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterProfile(10000046)
      expect(result).toEqual({ characterId: 10000046 })
    })

    it('should fetchCharacterStories', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterStories(10000046)
      expect(result).toEqual([])
    })

    it('should fetchCharacterCostumes', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterCostumes(10000046)
      expect(result).toEqual([])
    })

    it('should fetchCharacterSkill', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterSkill(10461)
      expect(result).toEqual({ id: 10461 })
    })

    it('should fetchCharacterSkill with level and extraLevel', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterSkill(10461, 10, 3)
      expect(result).toEqual({ id: 10461 })
    })

    it('should fetchCharacterSkillAscension', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterSkillAscension(4631, 10)
      expect(result).toEqual({ id: 4631 })
    })

    it('should fetchCharacterVoices', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterVoices(10000046, 'ja')
      expect(result).toEqual([])
    })

    it('should fetchCharacterIdsByName', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchCharacterIdsByName('Hu Tao')
      expect(result).toEqual([10000046])
    })

    it('should fetchTravelerSkillDepotIds', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchTravelerSkillDepotIds(10000005)
      expect(result).toEqual([504, 506, 507])
    })
  })

  describe('Weapon API', () => {
    it('should fetchWeaponInfo', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchWeaponInfo(11509)
      expect(result).toEqual({ id: 11509 })
    })

    it('should fetchWeaponInfo with all parameters', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchWeaponInfo(11509, 90, true, 5)
      expect(result).toEqual({ id: 11509 })
    })

    it('should fetchWeaponAscension', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchWeaponAscension(11509, 6)
      expect(result).toEqual({ id: 11509, promoteLevel: 6 })
    })

    it('should fetchWeaponRefinement', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchWeaponRefinement(11509, 5)
      expect(result).toEqual({ id: 11509, refinementRank: 5 })
    })

    it('should fetchAllWeaponIds', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchAllWeaponIds()
      expect(result).toEqual([11509, 11501])
    })
  })

  describe('Artifact API', () => {
    it('should fetchArtifact', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchArtifact(75540)
      expect(result).toEqual({ id: 75540 })
    })

    it('should fetchArtifact with all parameters', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchArtifact(75540, 10001, 20, [501234])
      expect(result).toEqual({ id: 75540 })
    })

    it('should fetchAllArtifactIds', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchAllArtifactIds()
      expect(result).toEqual([75540, 75541])
    })

    it('should buildSetBonus', () => {
      const manager = new GenshinManager()
      const result = manager.buildSetBonus([])
      expect(result).toEqual({
        oneSetBonus: [],
        twoSetBonus: [],
        fourSetBonus: [],
      })
    })

    it('should getArtifactMaxLevel', () => {
      const manager = new GenshinManager()
      const result = manager.getArtifactMaxLevel(5)
      expect(result).toBe(20)
    })
  })

  describe('Material API', () => {
    it('should fetchMaterial', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchMaterial(104001)
      expect(result).toEqual({ id: 104001 })
    })

    it('should fetchAllMaterialIds', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchAllMaterialIds()
      expect(result).toEqual([104001, 104002])
    })
  })

  describe('Monster API', () => {
    it('should fetchMonster', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchMonster(21010101)
      expect(result).toEqual({ id: 21010101 })
    })

    it('should fetchMonster with level and playerCount', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchMonster(21010101, 90, 4)
      expect(result).toEqual({ id: 21010101 })
    })

    it('should fetchAllMonsterIds', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchAllMonsterIds()
      expect(result).toEqual([21010101])
    })
  })

  describe('ProfilePicture API', () => {
    it('should fetchProfilePicture', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchProfilePicture(1)
      expect(result).toEqual({ id: 1 })
    })

    it('should fetchAllProfilePictureIds', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchAllProfilePictureIds()
      expect(result).toEqual([1, 2])
    })
  })

  describe('DailyFarming API', () => {
    it('should fetchDailyFarming', async () => {
      const manager = new GenshinManager()
      const result = await manager.fetchDailyFarming(1)
      expect(result).toEqual({ dayOfWeek: 1 })
    })
  })

  describe('method existence check', () => {
    it('should expose fetch methods for all entities', () => {
      const manager = new GenshinManager()
      // Character API
      expect(typeof manager.fetchCharacterInfo).toBe('function')
      expect(typeof manager.fetchCharacterBaseStats).toBe('function')
      expect(typeof manager.fetchCharacterAscension).toBe('function')
      expect(typeof manager.fetchCharacterConstellations).toBe('function')
      expect(typeof manager.fetchCharacterInherentSkills).toBe('function')
      expect(typeof manager.fetchCharacterProfile).toBe('function')
      expect(typeof manager.fetchCharacterStories).toBe('function')
      expect(typeof manager.fetchCharacterCostumes).toBe('function')
      expect(typeof manager.fetchAllCharacterIds).toBe('function')
      expect(typeof manager.fetchCharacterSkill).toBe('function')
      expect(typeof manager.fetchCharacterSkillAscension).toBe('function')
      expect(typeof manager.fetchCharacterVoices).toBe('function')
      expect(typeof manager.fetchCharacterIdsByName).toBe('function')
      expect(typeof manager.fetchTravelerSkillDepotIds).toBe('function')
      // Weapon API
      expect(typeof manager.fetchWeaponInfo).toBe('function')
      expect(typeof manager.fetchWeaponAscension).toBe('function')
      expect(typeof manager.fetchWeaponRefinement).toBe('function')
      expect(typeof manager.fetchAllWeaponIds).toBe('function')
      // Artifact API
      expect(typeof manager.fetchArtifact).toBe('function')
      expect(typeof manager.fetchAllArtifactIds).toBe('function')
      expect(typeof manager.buildSetBonus).toBe('function')
      expect(typeof manager.getArtifactMaxLevel).toBe('function')
      // Material API
      expect(typeof manager.fetchMaterial).toBe('function')
      expect(typeof manager.fetchAllMaterialIds).toBe('function')
      // Monster API
      expect(typeof manager.fetchMonster).toBe('function')
      expect(typeof manager.fetchAllMonsterIds).toBe('function')
      // ProfilePicture API
      expect(typeof manager.fetchProfilePicture).toBe('function')
      expect(typeof manager.fetchAllProfilePictureIds).toBe('function')
      // DailyFarming API
      expect(typeof manager.fetchDailyFarming).toBe('function')
    })
  })

  describe('deploy scenarios', () => {
    it('should handle new version and download assets', async () => {
      // Get mocked modules
      const { VersionChecker } = await import('@genshin-manager/sync')
      const { ExcelBinCache } = await import('@genshin-manager/data')
      const fs = await import('fs')

      // Mock VersionChecker to return new version
      vi.mocked(VersionChecker).mockImplementation(
        () =>
          ({
            checkForUpdate: vi.fn().mockResolvedValue('5.1.0'),
            getGameVersion: vi.fn().mockReturnValue('5.1.0'),
            commitId: 'newcommit123',
          }) as never,
      )

      // Mock ExcelBinCache
      vi.mocked(ExcelBinCache).mockImplementation(
        () =>
          ({
            load: vi.fn().mockResolvedValue({ redownloadRequired: false }),
            extractTextHashes: vi.fn().mockReturnValue(new Set([1234567890])),
          }) as never,
      )
      ;(ExcelBinCache as { allKeys: Set<string> }).allKeys = new Set([
        'AvatarExcelConfigData',
      ])

      // Mock fs.existsSync to return false (trigger folder creation)
      vi.mocked(fs.default.existsSync).mockReturnValue(false)

      const manager = new GenshinManager()
      await manager.deploy()
      await manager.destroy()

      expect(fs.default.mkdirSync).toHaveBeenCalled()
    })

    it('should skip update when gameVersion is undefined', async () => {
      const { VersionChecker } = await import('@genshin-manager/sync')

      // Mock VersionChecker to return undefined gameVersion
      vi.mocked(VersionChecker).mockImplementation(
        () =>
          ({
            checkForUpdate: vi.fn().mockResolvedValue(null),
            getGameVersion: vi.fn().mockReturnValue(undefined),
            commitId: 'abc123',
          }) as never,
      )

      const manager = new GenshinManager()
      await manager.deploy()
      await manager.destroy()
    })

    it('should handle ExcelBinCache retry on redownload required', async () => {
      const { ExcelBinCache } = await import('@genshin-manager/data')
      const { VersionChecker } = await import('@genshin-manager/sync')

      // Mock VersionChecker
      vi.mocked(VersionChecker).mockImplementation(
        () =>
          ({
            checkForUpdate: vi.fn().mockResolvedValue(null),
            getGameVersion: vi.fn().mockReturnValue('5.0.0'),
            commitId: 'abc123',
          }) as never,
      )

      // Create a load mock that returns redownloadRequired once, then false
      let callCount = 0
      const loadMock = vi.fn().mockImplementation(() => {
        callCount++
        if (callCount === 1)
          return Promise.resolve({ redownloadRequired: true })

        return Promise.resolve({ redownloadRequired: false })
      })

      vi.mocked(ExcelBinCache).mockImplementation(
        () =>
          ({
            load: loadMock,
            extractTextHashes: vi.fn().mockReturnValue(new Set([1234567890])),
          }) as never,
      )
      ;(ExcelBinCache as { allKeys: Set<string> }).allKeys = new Set([
        'AvatarExcelConfigData',
      ])

      const manager = new GenshinManager()
      await manager.deploy()
      await manager.destroy()

      expect(loadMock).toHaveBeenCalledTimes(2)
    })

    it('should handle TextMap retry on error', async () => {
      const { TextMapIndex } = await import('@genshin-manager/data')
      const { VersionChecker } = await import('@genshin-manager/sync')

      // Mock VersionChecker
      vi.mocked(VersionChecker).mockImplementation(
        () =>
          ({
            checkForUpdate: vi.fn().mockResolvedValue(null),
            getGameVersion: vi.fn().mockReturnValue('5.0.0'),
            commitId: 'abc123',
          }) as never,
      )

      // Create buildIndex that fails once then succeeds
      let buildIndexCallCount = 0
      const buildIndexMock = vi.fn().mockImplementation(() => {
        buildIndexCallCount++
        if (buildIndexCallCount === 1)
          return Promise.reject(new Error('TextMap load failed'))

        return Promise.resolve(undefined)
      })

      vi.mocked(TextMapIndex).mockImplementation(
        () =>
          ({
            currentLanguage: 'en',
            buildIndex: buildIndexMock,
            batchLoad: vi.fn().mockResolvedValue(undefined),
            close: vi.fn().mockResolvedValue(undefined),
          }) as never,
      )

      const manager = new GenshinManager()
      await manager.deploy()
      await manager.destroy()

      expect(buildIndexMock).toHaveBeenCalledTimes(2)
    })

    it('should deploy without cron when autoFetchLatestAssetsByCron is false', async () => {
      const cron = await import('node-cron')

      const manager = new GenshinManager({
        autoFetchLatestAssetsByCron: false,
      })
      await manager.deploy()
      await manager.destroy()

      expect(cron.default.schedule).not.toHaveBeenCalled()
    })
  })
})
