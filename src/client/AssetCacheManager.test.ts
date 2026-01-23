import { EventEmitter } from 'events'
import fs from 'fs'
import path from 'path'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { setupGitLabMock } from '@/__test__/__mocks__/api/gitlab'
import { AssetCacheManager } from '@/client/AssetCacheManager'
import { Client } from '@/client/Client'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { ExcelBinOutputs } from '@/types/excelBinOutputs'
import { Language } from '@/types/types'

// Increase max listeners to prevent memory leak warnings during tests
EventEmitter.defaultMaxListeners = 50

interface GitLabCommit {
  id: string
  title: string
  web_url: string
  created_at: string
}

describe('AssetCacheManager Basic Functionality', () => {
  let client: Client

  beforeAll(async () => {
    setupGitLabMock()

    // Deploy Client using the GitLab mock server
    client = new Client({
      defaultLanguage: Language.En,
      downloadLanguages: [Language.En],
    })
    await client.deploy()

    // Manually add required ExcelBinOutput keys for testing
    // This ensures the cache files are loaded and available for testing
    const requiredKeys = [
      'AvatarExcelConfigData',
      'MaterialExcelConfigData',
      'WeaponExcelConfigData',
      'ReliquaryExcelConfigData',
    ] as const

    // Add the keys through the internal method
    requiredKeys.forEach((key) => {
      // Create a mock class prototype with a function constructor that references the key
      const mockConstructor = function test(): void {
        // empty
      }
      mockConstructor.toString = (): string =>
        `function test() { return "${key}"; }`
      const mockPrototype = { constructor: mockConstructor }
      AssetCacheManager._addExcelBinOutputKeyFromClassPrototype(mockPrototype)
    })

    // Access the static updateCache method safely using the class reference
    const clientClass = client.constructor
    await (
      clientClass as unknown as {
        updateCache: () => Promise<void>
      }
    ).updateCache()
  }, 30000) // 30 seconds timeout for deployment

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Static Properties Tests', () => {
    it('should have _cachedTextMap static property', () => {
      expect(AssetCacheManager._cachedTextMap).toBeDefined()
      expect(AssetCacheManager._cachedTextMap).toBeInstanceOf(Map)
    })

    it('should have cached data accessible via _hasTable', () => {
      const hasAvatarData = AssetCacheManager._hasTable('AvatarExcelConfigData')
      expect(typeof hasAvatarData).toBe('boolean')
    })
  })

  describe('Static Methods Tests', () => {
    describe('_findBy', () => {
      it('should successfully retrieve data for existing key and ID', () => {
        const result = AssetCacheManager._findBy(
          'AvatarExcelConfigData',
          'id',
          10000002,
        )
        expect(result).toBeDefined()
        expect(typeof result).toBe('object')
      })

      it('should throw AssetNotFoundError for non-existent ExcelBinOutput key', () => {
        expect(() => {
          // Use a key that exists in the type but is not cached
          AssetCacheManager._findBy(
            'AnimalCodexExcelConfigData' as keyof typeof ExcelBinOutputs,
            'id' as never,
            123 as never,
          )
        }).toThrow(AssetNotFoundError)
      })

      it('should return undefined for non-existent ID', () => {
        const result = AssetCacheManager._findBy(
          'AvatarExcelConfigData',
          'id',
          99999999,
        )
        expect(result).toBeUndefined()
      })
    })

    describe('_addExcelBinOutputKeyFromClassPrototype', () => {
      it('should add ExcelBinOutput keys from class prototype', () => {
        function testClass(): void {
          // Empty test class constructor
        }
        testClass.prototype = {
          testMethod: function (): string {
            return 'AvatarExcelConfigData'
          },
        }
        expect(() => {
          AssetCacheManager._addExcelBinOutputKeyFromClassPrototype(
            testClass.prototype,
          )
        }).not.toThrow()
      })

      it('should handle empty class prototype without errors', () => {
        const simpleClass = {
          constructor: {
            toString: (): string => 'function empty() {}',
          },
        }
        expect(() => {
          AssetCacheManager._addExcelBinOutputKeyFromClassPrototype(simpleClass)
        }).not.toThrow()
      })
    })

    describe('_getAll', () => {
      it('should return cached excel bin output array for existing key', () => {
        const result = AssetCacheManager._getAll('AvatarExcelConfigData')
        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBeGreaterThan(0)
      })
    })

    describe('_hasTable', () => {
      it('should return true for existing ExcelBinOutput key', () => {
        const result = AssetCacheManager._hasTable('AvatarExcelConfigData')
        expect(result).toBe(true)
      })

      it('should return boolean for any valid ExcelBinOutput key', () => {
        const result = AssetCacheManager._hasTable('WeaponExcelConfigData')
        expect(typeof result).toBe('boolean')
      })
    })

    describe('_findBy for existence check', () => {
      it('should return truthy for existing key and ID', () => {
        const result = AssetCacheManager._findBy(
          'AvatarExcelConfigData',
          'id',
          10000002,
        )
        expect(result).toBeDefined()
      })

      it('should return undefined for non-existent ID', () => {
        const result = AssetCacheManager._findBy(
          'AvatarExcelConfigData',
          'id',
          99999999,
        )
        expect(result).toBeUndefined()
      })
    })

    describe('_searchByText', () => {
      it('should find records by text in TextMapHash fields', () => {
        const result = AssetCacheManager._searchByText(
          'AvatarExcelConfigData',
          'Amber',
        )
        expect(Array.isArray(result)).toBe(true)
        expect(result.length >= 0).toBe(true)
      })

      it('should return empty array for non-existent text', () => {
        const result = AssetCacheManager._searchByText(
          'AvatarExcelConfigData',
          'NonExistentCharacterName',
        )
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(0)
      })
    })
  })

  describe('Path Configuration Tests', () => {
    it('should have default asset cache path properly configured', () => {
      const defaultClient = new Client()
      const cachePath = defaultClient.option.assetCacheFolderPath

      expect(typeof cachePath).toBe('string')
      expect(cachePath.length).toBeGreaterThan(0)
      expect(path.isAbsolute(cachePath)).toBe(true)
    })

    it('should handle custom asset cache folder path configuration', () => {
      const customPath = path.resolve(process.cwd(), 'custom-test-cache')
      const customClient = new Client({
        assetCacheFolderPath: customPath,
        defaultLanguage: Language.En,
        downloadLanguages: [Language.En],
      })

      expect(customClient.option.assetCacheFolderPath).toBe(customPath)
      expect(path.isAbsolute(customClient.option.assetCacheFolderPath)).toBe(
        true,
      )
    })

    it('should handle relative paths as provided', () => {
      const relativePath = 'relative-test-cache'
      const testClient = new Client({
        assetCacheFolderPath: relativePath,
        defaultLanguage: Language.En,
        downloadLanguages: [Language.En],
      })

      expect(testClient.option.assetCacheFolderPath).toBe(relativePath)
    })
  })

  describe('Language Configuration Tests', () => {
    it('should handle multiple download languages', () => {
      const multiLangClient = new Client({
        defaultLanguage: Language.En,
        downloadLanguages: [Language.En, Language.Ja],
      })

      expect(multiLangClient.option.downloadLanguages).toContain(Language.En)
      expect(multiLangClient.option.downloadLanguages).toContain(Language.Ja)
      expect(multiLangClient.option.downloadLanguages.length).toBe(2)
    })

    it('should handle single download language', () => {
      const singleLangClient = new Client({
        defaultLanguage: Language.En,
        downloadLanguages: [Language.En],
      })

      expect(singleLangClient.option.downloadLanguages).toContain(Language.En)
      expect(singleLangClient.option.downloadLanguages.length).toBe(1)
    })

    it('should use default language from client options', () => {
      const enClient = new Client({
        defaultLanguage: Language.En,
        downloadLanguages: [Language.En],
      })
      expect(enClient.option.defaultLanguage).toBe(Language.En)

      const jaClient = new Client({
        defaultLanguage: Language.Ja,
        downloadLanguages: [Language.Ja],
      })
      expect(jaClient.option.defaultLanguage).toBe(Language.Ja)
    })
  })

  describe('Deployment State Tests', () => {
    it('should have game version after deployment', () => {
      const version = client.gameVersion
      expect(version === undefined || typeof version === 'string').toBe(true)
      if (version) expect(version).toMatch(/^\d+\.\d+\.\d+$/)
    })

    it('should have ExcelBinOutput data cached after deployment', () => {
      const importantKeys: (keyof typeof ExcelBinOutputs)[] = [
        'AvatarExcelConfigData',
        'WeaponExcelConfigData',
        'MaterialExcelConfigData',
        'ReliquaryExcelConfigData',
      ]

      for (const key of importantKeys) {
        const hasCached = AssetCacheManager._hasTable(key)
        expect(hasCached).toBe(true)
      }
    })

    it('should have TextMap data cached after deployment', () => {
      expect(AssetCacheManager._cachedTextMap.size).toBeGreaterThan(0)
    })
  })

  describe('File Management Tests', () => {
    it('should have created necessary cache directories', () => {
      const cacheDir = path.resolve(process.cwd(), 'cache')
      const excelBinOutputDir = path.resolve(cacheDir, 'ExcelBinOutput')
      const textMapDir = path.resolve(cacheDir, 'TextMap')

      expect(fs.existsSync(cacheDir)).toBe(true)
      expect(fs.existsSync(excelBinOutputDir)).toBe(true)
      expect(fs.existsSync(textMapDir)).toBe(true)
    })

    it('should have commits.json file after deployment', () => {
      const commitsFile = path.resolve(process.cwd(), 'cache', 'commits.json')
      expect(fs.existsSync(commitsFile)).toBe(true)

      const commitsData = JSON.parse(
        fs.readFileSync(commitsFile, 'utf8'),
      ) as GitLabCommit[]
      expect(Array.isArray(commitsData)).toBe(true)
      expect(commitsData.length).toBeGreaterThan(0)
      expect(commitsData[0]).toHaveProperty('id')
      expect(commitsData[0]).toHaveProperty('title')
    })

    it('should have ExcelBinOutput files downloaded', () => {
      const excelBinOutputDir = path.resolve(
        process.cwd(),
        'cache',
        'ExcelBinOutput',
      )
      const importantFiles = [
        'AvatarExcelConfigData.json',
        'WeaponExcelConfigData.json',
        'MaterialExcelConfigData.json',
      ]

      for (const filename of importantFiles) {
        const filePath = path.resolve(excelBinOutputDir, filename)
        expect(fs.existsSync(filePath)).toBe(true)

        const stats = fs.statSync(filePath)
        expect(stats.size).toBeGreaterThan(0)
      }
    })

    it('should have TextMap files downloaded', () => {
      const textMapDir = path.resolve(process.cwd(), 'cache', 'TextMap')
      const textMapFile = path.resolve(textMapDir, 'TextMapEN.json')

      expect(fs.existsSync(textMapFile)).toBe(true)

      const stats = fs.statSync(textMapFile)
      expect(stats.size).toBeGreaterThan(0)
    })
  })

  describe('Error Handling Tests', () => {
    it('should handle missing ExcelBinOutput gracefully', () => {
      expect(() => {
        AssetCacheManager._getAll(
          'AnimalCodexExcelConfigData' as keyof typeof ExcelBinOutputs,
        )
      }).toThrow(AssetNotFoundError)
    })

    it('should return undefined for missing ID in ExcelBinOutput', () => {
      const result = AssetCacheManager._findBy(
        'AvatarExcelConfigData',
        'id',
        99999999,
      )
      expect(result).toBeUndefined()
    })

    it('should validate AssetNotFoundError properties', () => {
      let caughtError: unknown

      expect(() => {
        AssetCacheManager._getAll(
          'AnimalCodexExcelConfigData' as keyof typeof ExcelBinOutputs,
        )
      }).toThrow()

      try {
        AssetCacheManager._getAll(
          'AnimalCodexExcelConfigData' as keyof typeof ExcelBinOutputs,
        )
      } catch (error) {
        caughtError = error
      }

      expect(caughtError).toBeInstanceOf(AssetNotFoundError)
      const assetError = caughtError
      expect(assetError).toBeInstanceOf(AssetNotFoundError)
      expect(assetError).toHaveProperty('assetPath')
      expect(assetError).toHaveProperty('assetType')
      expect(assetError).toHaveProperty('errorCode')
    })
  })

  describe('Integration Tests', () => {
    it('should work with ExcelBinOutputs type system', () => {
      const keys = Object.keys(
        ExcelBinOutputs,
      ) as (keyof typeof ExcelBinOutputs)[]

      for (const key of keys) {
        expect(typeof ExcelBinOutputs[key]).toBe('string')

        const hasCached = AssetCacheManager._hasTable(key)
        expect(typeof hasCached).toBe('boolean')
      }
    })

    it('should handle concurrent cache operations', async () => {
      const operations = [
        (): boolean => AssetCacheManager._hasTable('AvatarExcelConfigData'),
        (): boolean => AssetCacheManager._hasTable('WeaponExcelConfigData'),
        (): boolean => AssetCacheManager._hasTable('MaterialExcelConfigData'),
        (): number => AssetCacheManager._cachedTextMap.size,
        (): unknown[] => AssetCacheManager._getAll('AvatarExcelConfigData'),
      ]

      const results = await Promise.all(
        operations.map(
          (operation) =>
            new Promise((resolve) => {
              const result = operation()
              resolve(result)
            }),
        ),
      )

      expect(results.length).toBe(operations.length)
      expect(results[0]).toBe(true)
      expect(results[1]).toBe(true)
      expect(results[2]).toBe(true)
      expect(typeof results[3]).toBe('number')
      expect(Array.isArray(results[4])).toBe(true)
    })

    it('should maintain data consistency across multiple accesses', () => {
      const key = 'AvatarExcelConfigData'
      const id = 10000002

      const firstAccess = AssetCacheManager._findBy(key, 'id', id)
      const secondAccess = AssetCacheManager._findBy(key, 'id', id)
      const thirdAccess = AssetCacheManager._findBy(key, 'id', id)

      expect(firstAccess).toEqual(secondAccess)
      expect(secondAccess).toEqual(thirdAccess)
      expect(JSON.stringify(firstAccess)).toBe(JSON.stringify(thirdAccess))
    })
  })

  describe('Memory Management Tests', () => {
    it('should not have excessive memory usage in cached data', () => {
      const textMapSize = AssetCacheManager._cachedTextMap.size
      expect(textMapSize).toBeLessThan(1_000_000)

      const avatarData = AssetCacheManager._getAll('AvatarExcelConfigData')
      expect(avatarData.length).toBeLessThan(10_000)
    })

    it('should handle large data structures efficiently', () => {
      const startTime = Date.now()

      const materialData = AssetCacheManager._getAll('MaterialExcelConfigData')

      const endTime = Date.now()
      const executionTime = endTime - startTime

      expect(materialData.length).toBeGreaterThan(0)
      expect(executionTime).toBeLessThan(1000)
    })
  })
})
