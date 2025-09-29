import {
  corruptedPngData,
  invalidPngSignature,
  setupAssetMock,
  validPngData,
} from '@test/__mocks__/assets'
import fs from 'fs'
import path from 'path'
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { ImageNotFoundError } from '@/errors'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ClientOption } from '@/types'
import { LogLevel } from '@/utils/Logger'

/**
 * ImageAssets test suite
 */
describe('ImageAssets', () => {
  const testCacheDir = path.resolve(process.cwd(), 'test-cache', 'Images')
  const testOption: ClientOption = {
    defaultLanguage: 'EN',
    downloadLanguages: ['EN'],
    fetchOption: {},
    imageBaseURLByRegex: {
      'https://test-cdn.example.com': [/^UI_AvatarIcon_(.+)$/],
    },
    defaultImageBaseURL: 'https://default-cdn.example.com',
    autoCacheImage: true,
    assetCacheFolderPath: path.resolve(process.cwd(), 'test-cache'),
    audioBaseURLByRegex: {},
    defaultAudioBaseURL: 'https://audio-cdn.example.com',
    autoCacheAudio: false,
    logLevel: LogLevel.NONE,
    autoFetchLatestAssetsByCron: undefined,
    autoFixTextMap: false,
    autoFixExcelBin: false,
  }

  beforeAll(() => {
    // Ensure test cache directory is clean
    if (fs.existsSync(testCacheDir))
      fs.rmSync(testCacheDir, { recursive: true, force: true })

    fs.mkdirSync(testCacheDir, { recursive: true })

    // Deploy ImageAssets with test options
    ImageAssets.deploy(testOption)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    setupAssetMock()
  })

  afterAll(() => {
    // Clean up test cache directory
    if (fs.existsSync(testCacheDir))
      fs.rmSync(testCacheDir, { recursive: true, force: true })
  })

  describe('Constructor Tests', () => {
    it('should create ImageAssets with name only', () => {
      const image = new ImageAssets('UI_AvatarIcon_Test')

      expect(image.name).toBe('UI_AvatarIcon_Test')
      expect(image.imageBaseURL).toBe('https://test-cdn.example.com')
      expect(image.url).toBe(
        'https://test-cdn.example.com/UI_AvatarIcon_Test.png',
      )
      expect(image.imageType).toBe('character_icon')
      expect(image.mihoyoURL).toBe(
        'https://upload-os-bbs.mihoyo.com/game_record/genshin/UI_AvatarIcon_Test.png',
      )
    })

    it('should create ImageAssets with custom URL', () => {
      const customUrl = 'https://custom.example.com/test.png'
      const image = new ImageAssets('CustomImage', customUrl)

      expect(image.name).toBe('CustomImage')
      expect(image.url).toBe(customUrl)
    })

    it('should handle empty name', () => {
      const image = new ImageAssets('')

      expect(image.name).toBe('')
      expect(image.url).toBe('')
      expect(image.mihoyoURL).toBe('')
      expect(image.imageType).toBeNull()
    })

    it('should use default base URL for unknown patterns', () => {
      const image = new ImageAssets('UnknownPattern')

      expect(image.imageBaseURL).toBe('https://default-cdn.example.com')
      expect(image.url).toBe(
        'https://default-cdn.example.com/UnknownPattern.png',
      )
    })

    it('should detect character side icon type', () => {
      const image = new ImageAssets('UI_AvatarIcon_Side_Albedo')

      expect(image.imageType).toBe('character_side_icon')
    })

    it('should detect equip type for weapons', () => {
      const image = new ImageAssets('UI_EquipIcon_Sword_Dull')

      expect(image.imageType).toBe('equip')
    })

    it('should detect equip type for relics', () => {
      const image = new ImageAssets('UI_RelicIcon_15001_4')

      expect(image.imageType).toBe('equip')
    })
  })

  describe('Static Methods', () => {
    it('should create ImageAssets from URL', () => {
      const url = 'https://example.com/UI_AvatarIcon_Albedo.png'
      const image = ImageAssets.fromURL(url)

      expect(image.name).toBe('UI_AvatarIcon_Albedo')
      expect(image.url).toBe(url)
    })

    it('should deploy with options correctly', () => {
      // Test that deploy sets up the static properties
      expect(fs.existsSync(testCacheDir)).toBe(true)
    })
  })

  describe('fetchBuffer Tests', () => {
    it('should fetch and return image buffer', async () => {
      const image = new ImageAssets('TestImage')

      const buffer = await image.fetchBuffer()

      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer.equals(validPngData)).toBe(true)
    })

    it('should throw ImageNotFoundError for empty URL', async () => {
      const image = new ImageAssets('')

      await expect(image.fetchBuffer()).rejects.toThrow(ImageNotFoundError)
    })

    it('should throw ImageNotFoundError for 404 response', async () => {
      setupAssetMock({
        testNotFound: () =>
          new Response(null, { status: 404, statusText: 'Not Found' }),
      })

      const image = new ImageAssets('testNotFound')

      await expect(image.fetchBuffer()).rejects.toThrow(ImageNotFoundError)
    })

    it('should throw ImageNotFoundError for response without body', async () => {
      setupAssetMock({
        testNoBody: () => new Response(null, { status: 200, statusText: 'OK' }),
      })

      const image = new ImageAssets('testNoBody')

      await expect(image.fetchBuffer()).rejects.toThrow(ImageNotFoundError)
    })

    it('should cache image when autoCacheImage is enabled', async () => {
      const image = new ImageAssets('TestCacheImage')
      const cachePath = path.resolve(testCacheDir, 'TestCacheImage.png')

      // Ensure cache file doesn't exist initially
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath)

      await image.fetchBuffer()

      expect(fs.existsSync(cachePath)).toBe(true)

      // Second call should use cache
      const cachedBuffer = await image.fetchBuffer()
      expect(cachedBuffer.equals(validPngData)).toBe(true)
    })

    it('should re-fetch corrupted cached files', async () => {
      const image = new ImageAssets('TestCorruptedCache')
      const cachePath = path.resolve(testCacheDir, 'TestCorruptedCache.png')

      // Create a corrupted cache file
      fs.writeFileSync(cachePath, corruptedPngData)

      const buffer = await image.fetchBuffer()

      // Should fetch new data, not use corrupted cache
      expect(Buffer.isBuffer(buffer) && buffer.equals(validPngData)).toBe(true)
    })
  })

  describe('fetchStream Tests', () => {
    it('should fetch and return image stream', async () => {
      const image = new ImageAssets('TestStreamImage')

      const stream = await image.fetchStream()

      expect(stream).toBeDefined()
      expect(typeof stream.read).toBe('function')
    })

    it('should throw ImageNotFoundError for empty URL', async () => {
      const image = new ImageAssets('')

      await expect(image.fetchStream()).rejects.toThrow(ImageNotFoundError)
    })

    it('should use cached file for stream if available', async () => {
      const image = new ImageAssets('TestStreamCache')
      const cachePath = path.resolve(testCacheDir, 'TestStreamCache.png')

      // First call should create cache
      await image.fetchBuffer()
      expect(fs.existsSync(cachePath)).toBe(true)

      // Stream call should use cache
      const stream = await image.fetchStream()
      expect(stream).toBeDefined()
    })

    it('should accept highWaterMark parameter', async () => {
      const image = new ImageAssets('TestStreamHighWater')

      const stream = await image.fetchStream(1024)

      expect(stream).toBeDefined()
    })
  })

  describe('PNG Corruption Detection', () => {
    it('should detect valid PNG files as not corrupted', () => {
      const image = new ImageAssets('TestValidPNG')
      const validPath = path.resolve(testCacheDir, 'valid-test.png')

      fs.writeFileSync(validPath, validPngData)

      // Use reflection to access private method for testing
      const isCorrupted = (
        image as unknown as { isPNGCorrupted: (path: string) => boolean }
      ).isPNGCorrupted(validPath)
      expect(isCorrupted).toBe(false)

      fs.unlinkSync(validPath)
    })

    it('should detect corrupted PNG files missing IEND', () => {
      const image = new ImageAssets('TestCorruptedPNG')
      const corruptedPath = path.resolve(testCacheDir, 'corrupted-test.png')

      fs.writeFileSync(corruptedPath, corruptedPngData)

      const isCorrupted = (
        image as unknown as { isPNGCorrupted: (path: string) => boolean }
      ).isPNGCorrupted(corruptedPath)
      expect(isCorrupted).toBe(true)

      fs.unlinkSync(corruptedPath)
    })

    it('should detect invalid PNG signature', () => {
      const image = new ImageAssets('TestInvalidPNG')
      const invalidPath = path.resolve(testCacheDir, 'invalid-test.png')

      fs.writeFileSync(invalidPath, invalidPngSignature)

      const isCorrupted = (
        image as unknown as { isPNGCorrupted: (path: string) => boolean }
      ).isPNGCorrupted(invalidPath)
      expect(isCorrupted).toBe(true)

      fs.unlinkSync(invalidPath)
    })

    it('should detect too small files as corrupted', () => {
      const image = new ImageAssets('TestSmallPNG')
      const smallPath = path.resolve(testCacheDir, 'small-test.png')

      fs.writeFileSync(smallPath, Buffer.from([1, 2, 3])) // Too small

      const isCorrupted = (
        image as unknown as { isPNGCorrupted: (path: string) => boolean }
      ).isPNGCorrupted(smallPath)
      expect(isCorrupted).toBe(true)

      fs.unlinkSync(smallPath)
    })

    it('should handle file system errors gracefully', () => {
      const image = new ImageAssets('TestNonExistentPNG')
      const nonExistentPath = path.resolve(testCacheDir, 'non-existent.png')

      const isCorrupted = (
        image as unknown as { isPNGCorrupted: (path: string) => boolean }
      ).isPNGCorrupted(nonExistentPath)
      expect(isCorrupted).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      setupAssetMock({
        testNetworkError: () =>
          new Response(null, {
            status: 500,
            statusText: 'Internal Server Error',
          }),
      })

      const image = new ImageAssets('testNetworkError')

      await expect(image.fetchBuffer()).rejects.toThrow(ImageNotFoundError)
    })

    it('should handle fetch failures', async () => {
      setupAssetMock({
        testFetchFail: () => {
          throw new Error('Network failure')
        },
      })

      const image = new ImageAssets('testFetchFail')

      await expect(image.fetchBuffer()).rejects.toThrow()
    })
  })

  describe('Integration Tests', () => {
    it('should work end-to-end with real-like scenarios', async () => {
      // Test character icon
      const characterIcon = new ImageAssets('UI_AvatarIcon_Albedo')
      expect(characterIcon.imageType).toBe('character_icon')
      expect(characterIcon.mihoyoURL).toContain('UI_AvatarIcon_Albedo.png')

      // Test weapon icon
      const weaponIcon = new ImageAssets('UI_EquipIcon_Sword_Dull_Awaken')
      expect(weaponIcon.imageType).toBe('equip')

      // Test successful fetch
      const buffer = await characterIcon.fetchBuffer()
      expect(buffer).toBeInstanceOf(Buffer)
    })

    it('should handle multiple concurrent requests', async () => {
      const images = [
        new ImageAssets('ConcurrentTest1'),
        new ImageAssets('ConcurrentTest2'),
        new ImageAssets('ConcurrentTest3'),
      ]

      const buffers = await Promise.all(images.map((img) => img.fetchBuffer()))

      expect(buffers).toHaveLength(3)
      buffers.forEach((buffer) => {
        expect(buffer).toBeInstanceOf(Buffer)
      })
    })
  })
})
