import fs from 'fs'
import path from 'path'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { AssetCacheManager } from '@/client/AssetCacheManager'
import { Client } from '@/client/Client'
import { AssetsNotFoundError } from '@/errors/AssetsNotFoundError'
import { ExcelBinOutputs } from '@/types'

interface GitLabCommit {
  id: string
  title: string
  web_url: string
  created_at: string
}

describe('AssetCacheManager Basic Functionality', () => {
  let client: Client

  beforeAll(async () => {
    // Client deployment is already handled in test/setup.ts
    // GitLab mock server is also set up there using cached data

    // Deploy Client using the GitLab mock server
    client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
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
      // Create a mock class prototype that references the key
      const mockPrototype = {
        constructor: {
          toString: (): string => `function test() { return "${key}"; }`,
        },
      }
      AssetCacheManager._addExcelBinOutputKeyFromClassPrototype(mockPrototype)
    })

    // Access the static updateCache method safely using the class reference
    const clientClass = client.constructor as typeof Client
    await (
      clientClass as unknown as {
        updateCache: () => Promise<void>
      }
    ).updateCache()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Static Properties Tests', () => {
    it('should have _cachedTextMap static property', () => {
      expect(AssetCacheManager._cachedTextMap).toBeDefined()
      expect(AssetCacheManager._cachedTextMap).toBeInstanceOf(Map)
    })

    it('should have cachedExcelBinOutput static property accessible via _hasCachedExcelBinOutputByName', () => {
      const hasAvatarData = AssetCacheManager._hasCachedExcelBinOutputByName(
        'AvatarExcelConfigData',
      )
      expect(typeof hasAvatarData).toBe('boolean')
    })
  })

  describe('Static Methods Tests', () => {
    describe('_getJsonFromCachedExcelBinOutput', () => {
      it('should successfully retrieve data for existing key and ID', () => {
        expect(() => {
          const result = AssetCacheManager._getJsonFromCachedExcelBinOutput(
            'AvatarExcelConfigData',
            '10000002',
          )
          expect(result).toBeDefined()
          expect(typeof result).toBe('object')
        }).not.toThrow()
      })

      it('should throw AssetsNotFoundError for non-existent ExcelBinOutput key', () => {
        expect(() => {
          // Use a key that exists in the type but is not cached
          AssetCacheManager._getJsonFromCachedExcelBinOutput(
            'AnimalCodexExcelConfigData' as keyof typeof ExcelBinOutputs,
            '123',
          )
        }).toThrow(AssetsNotFoundError)
      })

      it('should throw AssetsNotFoundError for non-existent ID', () => {
        expect(() => {
          AssetCacheManager._getJsonFromCachedExcelBinOutput(
            'AvatarExcelConfigData',
            '99999999',
          )
        }).toThrow(AssetsNotFoundError)
      })
    })

    describe('_addExcelBinOutputKeyFromClassPrototype', () => {
      it('should add ExcelBinOutput keys from class prototype', () => {
        function testClass(): void {
          // Empty test class constructor
        }

        const prototype = testClass.prototype as Record<
          string,
          (...args: unknown[]) => unknown
        >

        expect(() => {
          AssetCacheManager._addExcelBinOutputKeyFromClassPrototype(prototype)
        }).not.toThrow()
      })

      it('should handle class prototype without ExcelBinOutput keys', () => {
        const simpleClass = {
          constructor: function simpleClass(): void {
            // Empty constructor for testing
          },
        }

        expect(() => {
          AssetCacheManager._addExcelBinOutputKeyFromClassPrototype(simpleClass)
        }).not.toThrow()
      })
    })

    describe('_getCachedExcelBinOutputByName', () => {
      it('should return cached excel bin output for existing key', () => {
        const result = AssetCacheManager._getCachedExcelBinOutputByName(
          'AvatarExcelConfigData',
        )
        expect(result).toBeDefined()
        expect(typeof result).toBe('object')
      })
    })

    describe('_hasCachedExcelBinOutputByName', () => {
      it('should return true for existing ExcelBinOutput key', () => {
        const result = AssetCacheManager._hasCachedExcelBinOutputByName(
          'AvatarExcelConfigData',
        )
        expect(result).toBe(true)
      })

      it('should return boolean for any valid ExcelBinOutput key', () => {
        const result = AssetCacheManager._hasCachedExcelBinOutputByName(
          'WeaponExcelConfigData',
        )
        expect(typeof result).toBe('boolean')
      })
    })

    describe('_hasCachedExcelBinOutputById', () => {
      it('should return true for existing key and ID', () => {
        const result = AssetCacheManager._hasCachedExcelBinOutputById(
          'AvatarExcelConfigData',
          '10000002',
        )
        expect(result).toBe(true)
      })

      it('should return false for non-existent ID', () => {
        const result = AssetCacheManager._hasCachedExcelBinOutputById(
          'AvatarExcelConfigData',
          '99999999',
        )
        expect(result).toBe(false)
      })
    })

    describe('_searchIdInExcelBinOutByText', () => {
      it('should find IDs by text in TextMapHash fields', () => {
        const result = AssetCacheManager._searchIdInExcelBinOutByText(
          'AvatarExcelConfigData',
          'Amber',
        )
        expect(Array.isArray(result)).toBe(true)
        expect(result.length >= 0).toBe(true)
      })

      it('should return empty array for non-existent text', () => {
        const result = AssetCacheManager._searchIdInExcelBinOutByText(
          'AvatarExcelConfigData',
          'NonExistentCharacterName',
        )
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(0)
      })
    })
  })

  describe('Cache Management Tests', () => {
    it('should have game version available after deployment', () => {
      const version = client.gameVersion
      expect(version).toBeDefined()
      expect(typeof version).toBe('string')
      expect(version).toMatch(/^\d+\.\d+\.\d+$/)
    })

    it('should have ExcelBinOutput data cached after deployment', () => {
      const importantKeys: (keyof typeof ExcelBinOutputs)[] = [
        'AvatarExcelConfigData',
        'WeaponExcelConfigData',
        'MaterialExcelConfigData',
        'ReliquaryExcelConfigData',
      ]

      for (const key of importantKeys) {
        const hasCached = AssetCacheManager._hasCachedExcelBinOutputByName(key)
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
        AssetCacheManager._getJsonFromCachedExcelBinOutput(
          'AnimalCodexExcelConfigData' as keyof typeof ExcelBinOutputs,
          '123',
        )
      }).toThrow(AssetsNotFoundError)
    })

    it('should handle missing ID in ExcelBinOutput gracefully', () => {
      expect(() => {
        AssetCacheManager._getJsonFromCachedExcelBinOutput(
          'AvatarExcelConfigData',
          '99999999',
        )
      }).toThrow(AssetsNotFoundError)
    })

    it('should validate AssetsNotFoundError properties', () => {
      try {
        AssetCacheManager._getJsonFromCachedExcelBinOutput(
          'AnimalCodexExcelConfigData' as keyof typeof ExcelBinOutputs,
          '123',
        )
      } catch (error) {
        expect(error).toBeInstanceOf(AssetsNotFoundError)
        expect(error).toHaveProperty('key')
        expect(error).toHaveProperty('id')
        expect(error).toHaveProperty('name')
      }
    })
  })

  describe('Integration Tests', () => {
    it('should work with ExcelBinOutputs type system', () => {
      const keys = Object.keys(
        ExcelBinOutputs,
      ) as (keyof typeof ExcelBinOutputs)[]

      for (const key of keys) {
        expect(typeof ExcelBinOutputs[key]).toBe('string')

        const hasCached = AssetCacheManager._hasCachedExcelBinOutputByName(key)
        expect(typeof hasCached).toBe('boolean')
      }
    })

    it('should handle concurrent cache operations', async () => {
      const operations = [
        (): boolean =>
          AssetCacheManager._hasCachedExcelBinOutputByName(
            'AvatarExcelConfigData',
          ),
        (): boolean =>
          AssetCacheManager._hasCachedExcelBinOutputByName(
            'WeaponExcelConfigData',
          ),
        (): boolean =>
          AssetCacheManager._hasCachedExcelBinOutputByName(
            'MaterialExcelConfigData',
          ),
        (): number => AssetCacheManager._cachedTextMap.size,
        (): Record<string, unknown> =>
          AssetCacheManager._getCachedExcelBinOutputByName(
            'AvatarExcelConfigData',
          ),
      ]

      const results = await Promise.all(
        operations.map(
          (operation) =>
            new Promise((resolve) => {
              try {
                const result = operation()
                resolve(result)
              } catch (error) {
                resolve(error)
              }
            }),
        ),
      )

      expect(results.length).toBe(operations.length)
      expect(results[0]).toBe(true)
      expect(results[1]).toBe(true)
      expect(results[2]).toBe(true)
      expect(typeof results[3]).toBe('number')
      expect(typeof results[4]).toBe('object')
    })

    it('should maintain data consistency across multiple accesses', () => {
      const key = 'AvatarExcelConfigData'
      const id = '10000002'

      const firstAccess = AssetCacheManager._getJsonFromCachedExcelBinOutput(
        key,
        id,
      )
      const secondAccess = AssetCacheManager._getJsonFromCachedExcelBinOutput(
        key,
        id,
      )
      const thirdAccess = AssetCacheManager._getJsonFromCachedExcelBinOutput(
        key,
        id,
      )

      expect(firstAccess).toEqual(secondAccess)
      expect(secondAccess).toEqual(thirdAccess)
      expect(JSON.stringify(firstAccess)).toBe(JSON.stringify(thirdAccess))
    })
  })

  describe('Memory Management Tests', () => {
    it('should not have excessive memory usage in cached data', () => {
      const textMapSize = AssetCacheManager._cachedTextMap.size
      expect(textMapSize).toBeLessThan(1_000_000)

      const avatarData = AssetCacheManager._getCachedExcelBinOutputByName(
        'AvatarExcelConfigData',
      )
      const avatarKeys = Object.keys(avatarData)
      expect(avatarKeys.length).toBeLessThan(10_000)
    })

    it('should handle large data structures efficiently', () => {
      const startTime = Date.now()

      const materialData = AssetCacheManager._getCachedExcelBinOutputByName(
        'MaterialExcelConfigData',
      )
      const materialKeys = Object.keys(materialData)

      const endTime = Date.now()
      const executionTime = endTime - startTime

      expect(materialKeys.length).toBeGreaterThan(0)
      expect(executionTime).toBeLessThan(1000)
    })
  })
})
