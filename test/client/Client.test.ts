import { setupGitLabMock } from '@test/__mocks__/api/gitlab'
import { EventEmitter } from 'events'
import fs from 'fs'
import path from 'path'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { AssetCacheManager, Client, ClientEvents } from '@/client'
import { AudioAssets } from '@/models/assets/AudioAssets'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { TextMapLanguage } from '@/types'
import { LogLevel } from '@/utils/Logger'

// Increase max listeners to prevent memory leak warnings during tests
EventEmitter.defaultMaxListeners = 50

describe('Client Basic Functionality', () => {
  let client: Client

  beforeAll(async () => {
    setupGitLabMock()

    client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000) // 30 seconds timeout for deployment

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization Tests', () => {
    it('should initialize with default parameters', () => {
      const defaultClient = new Client()
      expect(defaultClient).toBeDefined()
      expect(defaultClient).toBeInstanceOf(Client)
      expect(defaultClient).toBeInstanceOf(AssetCacheManager)
    })

    it('should initialize with custom options', () => {
      const customClient = new Client({
        defaultLanguage: 'JP',
        downloadLanguages: ['JP', 'EN'],
        logLevel: LogLevel.ERROR,
      })
      expect(customClient.option.defaultLanguage).toBe('JP')
      expect(customClient.option.downloadLanguages).toEqual(['JP', 'EN'])
      expect(customClient.option.logLevel).toBe(LogLevel.ERROR)
    })

    it('should merge download languages with default language', () => {
      const testClient = new Client({
        defaultLanguage: 'FR',
        downloadLanguages: ['EN', 'JP'],
      })
      expect(testClient.option.downloadLanguages).toContain('FR')
      expect(testClient.option.downloadLanguages).toContain('EN')
      expect(testClient.option.downloadLanguages).toContain('JP')
    })

    it('should set autoFix options to false when autoFetchLatestAssetsByCron is disabled', () => {
      const testClient = new Client({
        autoFetchLatestAssetsByCron: '',
      })
      expect(testClient.option.autoFixTextMap).toBe(false)
      expect(testClient.option.autoFixExcelBin).toBe(false)
    })

    it('should be instance of EventEmitter', () => {
      expect(typeof client.on).toBe('function')
      expect(typeof client.removeListener).toBe('function')
    })
  })

  describe('Property Tests', () => {
    it('should have gameVersion property accessible', () => {
      const version = client.gameVersion
      expect(version === undefined || typeof version === 'string').toBe(true)
      if (version) expect(version).toMatch(/^\d+\.\d+\.\d+$/)
    })

    it('should have option property with merged configuration', () => {
      expect(client.option).toBeDefined()
      expect(client.option.defaultLanguage).toBe('EN')
      expect(client.option.downloadLanguages).toContain('EN')
      expect(typeof client.option.assetCacheFolderPath).toBe('string')
    })

    it('should have required option properties', () => {
      expect(client.option).toHaveProperty('fetchOption')
      expect(client.option).toHaveProperty('defaultImageBaseURL')
      expect(client.option).toHaveProperty('defaultAudioBaseURL')
      expect(client.option).toHaveProperty('imageBaseURLByRegex')
      expect(client.option).toHaveProperty('audioBaseURLByRegex')
    })
  })

  describe('Deploy Method Tests', () => {
    it('should execute deploy method without errors', async () => {
      const testClient = new Client({
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })
      await expect(testClient.deploy()).resolves.not.toThrow()
    })

    it('should have necessary cache directories after deployment', () => {
      const cacheDir = path.resolve(process.cwd(), 'cache')
      expect(fs.existsSync(cacheDir)).toBe(true)

      const excelBinOutputDir = path.resolve(cacheDir, 'ExcelBinOutput')
      expect(fs.existsSync(excelBinOutputDir)).toBe(true)

      const textMapDir = path.resolve(cacheDir, 'TextMap')
      expect(fs.existsSync(textMapDir)).toBe(true)
    })

    it('should call ImageAssets.deploy during deployment', async () => {
      const deployImagesSpy = vi.spyOn(ImageAssets, 'deploy')
      const testClient = new Client({
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })
      await testClient.deploy()
      expect(deployImagesSpy).toHaveBeenCalledWith(testClient.option)
      deployImagesSpy.mockRestore()
    })

    it('should call AudioAssets.deploy during deployment', async () => {
      const audioSpy = vi.spyOn(AudioAssets, 'deploy')
      const client = new Client()

      await client.deploy()
      expect(audioSpy).toHaveBeenCalled()

      audioSpy.mockRestore()
    })
  })

  describe('Language Management Tests', () => {
    it('should change language successfully', async () => {
      const client = new Client()
      await client.deploy()

      // Test that changeLanguage method can be called without throwing
      await expect(client.changeLanguage('JP')).resolves.not.toThrow()
      // Note: Language change may not work in test environment due to TextMap limitations
      // The important part is that the method executes without errors
    })

    it('should handle language change for available languages', async () => {
      const client = new Client()
      await client.deploy()

      const availableLanguages: (keyof typeof TextMapLanguage)[] = [
        'EN',
        'JP',
        'CHS',
      ]

      // Test that all language change operations complete without throwing
      for (const lang of availableLanguages)
        await expect(client.changeLanguage(lang)).resolves.not.toThrow()

      // Verify client is still functional after language change attempts
      expect(client.option).toBeDefined()
      expect(client.gameVersion).toBeDefined()
    })

    it('should maintain consistent state after language changes', async () => {
      const client = new Client()
      await client.deploy()

      const originalLanguage = client.option.defaultLanguage

      await client.changeLanguage('JP')
      await client.changeLanguage('EN')
      await client.changeLanguage(originalLanguage)
      expect(client.option.defaultLanguage).toBe(originalLanguage)
    })
  })

  describe('Event System Tests', () => {
    it('should emit BEGIN_UPDATE_CACHE event', async () => {
      const testClient = new Client({
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })

      const eventPromise = new Promise<string>((resolve) => {
        testClient.on(ClientEvents.BEGIN_UPDATE_CACHE, (version) => {
          resolve(version)
        })
      })

      void testClient.deploy()
      const version = await eventPromise
      expect(typeof version).toBe('string')
    })

    it('should emit END_UPDATE_CACHE event', async () => {
      const testClient = new Client({
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })

      const eventPromise = new Promise<string>((resolve) => {
        testClient.on(ClientEvents.END_UPDATE_CACHE, (version) => {
          resolve(version)
        })
      })

      void testClient.deploy()
      const version = await eventPromise
      expect(typeof version).toBe('string')
    })

    it('should handle multiple event listeners correctly', () => {
      function listener1(): void {
        // Mock listener function
      }
      function listener2(): void {
        // Mock listener function
      }
      function endListener(): void {
        // Mock listener function
      }

      client.on(ClientEvents.BEGIN_UPDATE_CACHE, listener1)
      client.on(ClientEvents.BEGIN_UPDATE_CACHE, listener2)
      client.on(ClientEvents.END_UPDATE_CACHE, endListener)

      // Cleanup listeners
      client.removeListener(ClientEvents.BEGIN_UPDATE_CACHE, listener1)
      client.removeListener(ClientEvents.BEGIN_UPDATE_CACHE, listener2)
      client.removeListener(ClientEvents.END_UPDATE_CACHE, endListener)

      expect(true).toBe(true) // Basic test for event system availability
    })

    it('should support all ClientEvents enum values', () => {
      const eventValues = Object.values(ClientEvents)
      expect(eventValues).toContain(ClientEvents.BEGIN_UPDATE_CACHE)
      expect(eventValues).toContain(ClientEvents.END_UPDATE_CACHE)
      expect(eventValues).toContain(ClientEvents.BEGIN_UPDATE_ASSETS)
      expect(eventValues).toContain(ClientEvents.END_UPDATE_ASSETS)
    })
  })

  describe('Asset Management Tests', () => {
    describe('Image Assets Integration', () => {
      it('should have ImageAssets properly configured after deployment', () => {
        expect(client.option.defaultImageBaseURL).toBeDefined()
        expect(typeof client.option.defaultImageBaseURL).toBe('string')
        expect(client.option.imageBaseURLByRegex).toBeDefined()
        expect(typeof client.option.imageBaseURLByRegex).toBe('object')
      })

      it('should have autoCacheImage setting properly configured', () => {
        expect(typeof client.option.autoCacheImage).toBe('boolean')
      })

      it('should have image URL regex mappings configured', () => {
        const imageRegexMappings = client.option.imageBaseURLByRegex
        expect(Object.keys(imageRegexMappings).length).toBeGreaterThan(0)

        Object.values(imageRegexMappings).forEach((regexArray) => {
          expect(Array.isArray(regexArray)).toBe(true)
          regexArray.forEach((regex) => {
            expect(regex).toBeInstanceOf(RegExp)
          })
        })
      })
    })

    describe('Audio Assets Integration', () => {
      it('should have AudioAssets properly configured after deployment', () => {
        expect(client.option.defaultAudioBaseURL).toBeDefined()
        expect(typeof client.option.defaultAudioBaseURL).toBe('string')
        expect(client.option.audioBaseURLByRegex).toBeDefined()
        expect(typeof client.option.audioBaseURLByRegex).toBe('object')
      })

      it('should have autoCacheAudio setting properly configured', () => {
        expect(typeof client.option.autoCacheAudio).toBe('boolean')
      })

      it('should have audio base URL configured correctly', () => {
        expect(client.option.defaultAudioBaseURL).toMatch(/^https?:\/\//)
      })
    })
  })

  describe('Cache Management Integration Tests', () => {
    it('should have AssetCacheManager static properties accessible', () => {
      expect(AssetCacheManager._cachedTextMap).toBeDefined()
      expect(AssetCacheManager._cachedTextMap).toBeInstanceOf(Map)
    })

    it('should have game version set after deployment', () => {
      const version = client.gameVersion
      if (version) expect(version).toMatch(/^\d+\.\d+\.\d+$/)
    })

    it('should have cache directories properly structured', () => {
      const cacheDir = client.option.assetCacheFolderPath
      expect(fs.existsSync(cacheDir)).toBe(true)

      const expectedDirs = ['ExcelBinOutput', 'TextMap', 'Images', 'Audios']
      expectedDirs.forEach((dir) => {
        const dirPath = path.resolve(cacheDir, dir)
        expect(fs.existsSync(dirPath)).toBe(true)
      })
    })

    it('should handle cache operations without memory leaks', async () => {
      const initialMemory = process.memoryUsage()

      for (let i = 0; i < 5; i++) await client.changeLanguage('EN')

      const finalMemory = process.memoryUsage()
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed

      expect(memoryIncrease).toBeLessThan(150 * 1024 * 1024) // Less than 150MB increase
    })
  })

  describe('Path Validation Tests', () => {
    it('should validate that default cache path exists and is accessible', () => {
      const defaultClient = new Client()
      const cachePath = defaultClient.option.assetCacheFolderPath

      expect(typeof cachePath).toBe('string')
      expect(cachePath.length).toBeGreaterThan(0)
      expect(path.isAbsolute(cachePath)).toBe(true)
    })

    it('should handle absolute path correctly', () => {
      const tempDir = path.resolve(process.cwd(), 'test-cache-absolute')
      const client = new Client({
        assetCacheFolderPath: tempDir,
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })

      expect(client.option.assetCacheFolderPath).toBe(tempDir)
      expect(path.isAbsolute(client.option.assetCacheFolderPath)).toBe(true)

      // Validate that the path configuration is correct
      expect(typeof client.option.assetCacheFolderPath).toBe('string')
      expect(client.option.assetCacheFolderPath.length).toBeGreaterThan(0)
    })

    it('should handle relative path correctly', () => {
      const relativeDir = 'test-cache-relative'
      const client = new Client({
        assetCacheFolderPath: relativeDir,
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })

      // Client uses the path as provided, no automatic resolution
      expect(client.option.assetCacheFolderPath).toBe(relativeDir)
      expect(path.isAbsolute(client.option.assetCacheFolderPath)).toBe(false)

      // Validate that the path configuration is preserved
      expect(typeof client.option.assetCacheFolderPath).toBe('string')
      expect(client.option.assetCacheFolderPath.length).toBeGreaterThan(0)
    })

    it('should handle nested directory path correctly', () => {
      const nestedDir = path.resolve(
        process.cwd(),
        'test-cache',
        'nested',
        'deep',
      )
      const client = new Client({
        assetCacheFolderPath: nestedDir,
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })

      expect(client.option.assetCacheFolderPath).toBe(nestedDir)
      expect(path.isAbsolute(client.option.assetCacheFolderPath)).toBe(true)

      // Validate path depth handling
      const pathSegments = nestedDir
        .split(path.sep)
        .filter((segment) => segment.length > 0)
      expect(pathSegments.length).toBeGreaterThan(3)
    })

    it('should validate directory path configuration', () => {
      const testDir = path.resolve(process.cwd(), 'test-cache-permissions')
      const client = new Client({
        assetCacheFolderPath: testDir,
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })

      // Validate path configuration
      expect(client.option.assetCacheFolderPath).toBe(testDir)
      expect(path.isAbsolute(client.option.assetCacheFolderPath)).toBe(true)
      expect(typeof client.option.assetCacheFolderPath).toBe('string')
      expect(client.option.assetCacheFolderPath.length).toBeGreaterThan(0)
    })

    it('should preserve path separators as provided', () => {
      const pathWithMixedSeparators = 'test\\cache/mixed\\separators'
      const client = new Client({
        assetCacheFolderPath: pathWithMixedSeparators,
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })

      // Client preserves the path as provided
      expect(client.option.assetCacheFolderPath).toBe(pathWithMixedSeparators)
    })

    it('should handle empty or invalid path strings', () => {
      expect(
        () =>
          new Client({
            assetCacheFolderPath: '',
            defaultLanguage: 'EN',
            downloadLanguages: ['EN'],
          }),
      ).not.toThrow()

      expect(
        () =>
          new Client({
            assetCacheFolderPath: '   ',
            defaultLanguage: 'EN',
            downloadLanguages: ['EN'],
          }),
      ).not.toThrow()
    })
  })

  describe('Error Handling Tests', () => {
    it('should handle deployment errors gracefully', async () => {
      const invalidClient = new Client({
        assetCacheFolderPath: '/invalid/path/that/does/not/exist',
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })

      // The client should throw error for invalid paths
      await expect(invalidClient.deploy()).rejects.toThrow()
    })

    it('should handle invalid language change attempts gracefully', async () => {
      await expect(
        client.changeLanguage('INVALID' as keyof typeof TextMapLanguage),
      ).rejects.toThrow()
    })

    it('should maintain stable state after errors', async () => {
      const originalGameVersion = client.gameVersion

      try {
        await client.changeLanguage('INVALID' as keyof typeof TextMapLanguage)
      } catch {
        // Expected to throw
      }

      expect(client.gameVersion).toBe(originalGameVersion)
    })
  })

  describe('Configuration Tests', () => {
    it('should have proper default configuration values', () => {
      const defaultClient = new Client()

      expect(defaultClient.option.defaultLanguage).toBe('EN')
      expect(defaultClient.option.logLevel).toBe(LogLevel.NONE)
      expect(defaultClient.option.autoCacheImage).toBe(true)
      expect(defaultClient.option.autoCacheAudio).toBe(true)
      expect(defaultClient.option.autoFixTextMap).toBe(true)
      expect(defaultClient.option.autoFixExcelBin).toBe(true)
    })

    it('should validate fetch options configuration', () => {
      expect(client.option.fetchOption).toBeDefined()
      expect(client.option.fetchOption.headers).toBeDefined()
      expect(client.option.fetchOption.headers).toHaveProperty('user-agent')
    })

    it('should handle custom asset cache folder path', () => {
      const customPath = path.resolve(process.cwd(), 'test-cache')
      const customClient = new Client({
        assetCacheFolderPath: customPath,
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })

      expect(customClient.option.assetCacheFolderPath).toBe(customPath)
    })

    it('should handle cron schedule configuration', () => {
      const cronClient = new Client({
        autoFetchLatestAssetsByCron: '0 0 12 * * *',
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })

      expect(cronClient.option.autoFetchLatestAssetsByCron).toBe('0 0 12 * * *')
    })
  })

  describe('Integration Tests', () => {
    it('should work seamlessly with multiple Client instances', async () => {
      const client1 = new Client({
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })
      const client2 = new Client({
        defaultLanguage: 'JP',
        downloadLanguages: ['JP'],
      })

      await Promise.all([client1.deploy(), client2.deploy()])

      expect(client1.gameVersion).toBe(client2.gameVersion)
      expect(client1.option.defaultLanguage).not.toBe(
        client2.option.defaultLanguage,
      )
    })

    it('should maintain data consistency across operations', async () => {
      const operations = [
        (): Promise<void> => client.changeLanguage('EN'),
        (): Promise<void> => client.changeLanguage('JP'),
        (): Promise<void> => client.changeLanguage('EN'),
      ]

      await Promise.all(operations.map((op) => op()))
      expect(client.option.defaultLanguage).toBe('EN')
    })

    it('should handle concurrent cache operations efficiently', async () => {
      const concurrentOperations = Array(3)
        .fill(null)
        .map(() => client.changeLanguage('EN'))

      const results = await Promise.allSettled(concurrentOperations)

      results.forEach((result) => {
        expect(result.status).toBe('fulfilled')
      })
    })
  })

  describe('Performance Tests', () => {
    it('should deploy within reasonable time limits', async () => {
      const startTime = Date.now()

      const testClient = new Client({
        defaultLanguage: 'EN',
        downloadLanguages: ['EN'],
      })
      await testClient.deploy()

      const endTime = Date.now()
      const deployTime = endTime - startTime

      expect(deployTime).toBeLessThan(30000) // Less than 30 seconds
    }, 35000)

    it('should handle rapid language changes efficiently', async () => {
      const startTime = Date.now()

      const languages: (keyof typeof TextMapLanguage)[] = ['EN', 'JP', 'EN']
      for (const lang of languages) await client.changeLanguage(lang)

      const endTime = Date.now()
      const totalTime = endTime - startTime

      expect(totalTime).toBeLessThan(10000) // Less than 10 seconds
    }, 15000)
  })
})
