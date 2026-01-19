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

import { setupAssetMock } from '@/__test__/__mocks__/assets/mockAssetResponses'
import {
  corruptedOggData,
  invalidOggSignature,
  validOggData,
} from '@/__test__/__mocks__/assets/mockBinaryData'
import { AudioNotFoundError } from '@/errors/assets/AudioNotFoundError'
import { AudioAssets } from '@/models/assets/AudioAssets'
import { ClientOption, CVType } from '@/types/types'
import { LogLevel } from '@/utils/logger/Logger'

/**
 * AudioAssets test suite
 */
describe('AudioAssets', () => {
  const testCacheDir = path.resolve(process.cwd(), 'test-cache', 'Audios')
  const testOption: ClientOption = {
    defaultLanguage: 'en',
    downloadLanguages: ['en'],
    fetchOption: {},
    imageBaseURLByRegex: {},
    defaultImageBaseURL: 'https://image-cdn.example.com',
    autoCacheImage: false,
    assetCacheFolderPath: path.resolve(process.cwd(), 'test-cache'),
    audioBaseURLByRegex: {
      'https://test-audio-cdn.example.com': [/^VO_(.+)$/],
    },
    defaultAudioBaseURL: 'https://default-audio-cdn.example.com',
    autoCacheAudio: true,
    logLevel: LogLevel.NONE,
    autoFetchLatestAssetsByCron: undefined,
    autoFixTextMap: false,
    autoFixExcelBin: false,
  }

  beforeAll(() => {
    // Ensure test cache directory is clean
    if (fs.existsSync(testCacheDir))
      fs.rmSync(testCacheDir, { recursive: true, force: true })

    // Create the parent directory first
    fs.mkdirSync(path.dirname(testCacheDir), { recursive: true })

    // Deploy AudioAssets with test options
    AudioAssets.deploy(testOption)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    setupAssetMock()
  })

  afterAll(() => {
    if (fs.existsSync(testCacheDir))
      fs.rmSync(testCacheDir, { recursive: true, force: true })
  })

  describe('Constructor Tests', () => {
    it('should create AudioAssets with name only', () => {
      const audio = new AudioAssets('VO_TestAudio')

      expect(audio.name).toBe('VO_TestAudio')
      expect(audio.audioBaseURL).toBe('https://test-audio-cdn.example.com')
      expect(audio.url).toBe(
        'https://test-audio-cdn.example.com/VO_TestAudio.ogg',
      )
      expect(audio.cv).toBeUndefined()
      expect(audio.characterId).toBeUndefined()
      expect(audio.mihoyoURL).toBe(
        'https://upload-os-bbs.mihoyo.com/game_record/genshin/VO_TestAudio.ogg',
      )
    })

    it('should create AudioAssets with CV type', () => {
      const audio = new AudioAssets('TestAudio', 'ja')

      expect(audio.name).toBe('TestAudio')
      expect(audio.cv).toBe('ja')
      expect(audio.url).toBe(
        'https://default-audio-cdn.example.com/ja/TestAudio.ogg',
      )
      expect(audio.mihoyoURL).toBe(
        'https://upload-os-bbs.mihoyo.com/game_record/genshin/ja/TestAudio.ogg',
      )
    })

    it('should create AudioAssets with CV and character ID', () => {
      const audio = new AudioAssets('TestAudio', 'en', 10000002)

      expect(audio.name).toBe('TestAudio')
      expect(audio.cv).toBe('en')
      expect(audio.characterId).toBe(10000002)
      expect(audio.url).toBe(
        'https://default-audio-cdn.example.com/en/10000002/TestAudio.ogg',
      )
      expect(audio.mihoyoURL).toBe(
        'https://upload-os-bbs.mihoyo.com/game_record/genshin/en/10000002/TestAudio.ogg',
      )
    })

    it('should create AudioAssets with character ID only', () => {
      const audio = new AudioAssets('TestAudio', undefined, 10000002)

      expect(audio.name).toBe('TestAudio')
      expect(audio.cv).toBeUndefined()
      expect(audio.characterId).toBe(10000002)
      expect(audio.url).toBe(
        'https://default-audio-cdn.example.com/10000002/TestAudio.ogg',
      )
    })

    it('should handle empty name', () => {
      const audio = new AudioAssets('')

      expect(audio.name).toBe('')
      expect(audio.url).toBe('')
      expect(audio.mihoyoURL).toBe('')
    })

    it('should use default base URL for unknown patterns', () => {
      const audio = new AudioAssets('UnknownPattern')

      expect(audio.audioBaseURL).toBe('https://default-audio-cdn.example.com')
      expect(audio.url).toBe(
        'https://default-audio-cdn.example.com/UnknownPattern.ogg',
      )
    })

    it('should test all CV types', () => {
      const cvTypes: CVType[] = ['en', 'ja', 'zh-cn', 'ko']

      cvTypes.forEach((cv) => {
        const audio = new AudioAssets('TestCV', cv)
        expect(audio.cv).toBe(cv)
        expect(audio.url).toContain(`/${cv}/`)
      })
    })
  })

  describe('fetchBuffer Tests', () => {
    it('should fetch and return audio buffer', async () => {
      const audio = new AudioAssets('TestAudio')

      const buffer = await audio.fetchBuffer()

      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer.equals(validOggData)).toBe(true)
    })

    it('should throw AudioNotFoundError for empty URL', async () => {
      const audio = new AudioAssets('')

      await expect(audio.fetchBuffer()).rejects.toThrow(AudioNotFoundError)
    })

    it('should throw AudioNotFoundError for 404 response', async () => {
      setupAssetMock({
        testAudioNotFound: () =>
          new Response(null, { status: 404, statusText: 'Not Found' }),
      })

      const audio = new AudioAssets('testAudioNotFound')

      await expect(audio.fetchBuffer()).rejects.toThrow(AudioNotFoundError)
    })

    it('should throw AudioNotFoundError for response without body', async () => {
      setupAssetMock({
        testAudioNoBody: () =>
          new Response(null, { status: 200, statusText: 'OK' }),
      })

      const audio = new AudioAssets('testAudioNoBody')

      await expect(audio.fetchBuffer()).rejects.toThrow(AudioNotFoundError)
    })

    it('should cache audio when autoCacheAudio is enabled', async () => {
      const audio = new AudioAssets('TestCacheAudio')
      const cachePath = path.resolve(testCacheDir, 'TestCacheAudio.ogg')

      // Ensure cache file doesn't exist initially
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath)

      await audio.fetchBuffer()

      expect(fs.existsSync(cachePath)).toBe(true)

      // Second call should use cache
      const cachedBuffer = await audio.fetchBuffer()
      expect(cachedBuffer.equals(validOggData)).toBe(true)
    })

    it('should create nested directories for CV and character ID', async () => {
      const audio = new AudioAssets('TestNestedCache', 'ja', 10000002)
      const cachePath = path.resolve(
        testCacheDir,
        'ja',
        '10000002',
        'TestNestedCache.ogg',
      )

      await audio.fetchBuffer()

      expect(fs.existsSync(cachePath)).toBe(true)
      expect(fs.existsSync(path.dirname(cachePath))).toBe(true)
    })

    it('should re-fetch corrupted cached files', async () => {
      const audio = new AudioAssets('TestCorruptedAudioCache')
      const cachePath = path.resolve(
        testCacheDir,
        'TestCorruptedAudioCache.ogg',
      )

      // Create a corrupted cache file
      fs.mkdirSync(path.dirname(cachePath), { recursive: true })
      fs.writeFileSync(cachePath, corruptedOggData)

      const buffer = await audio.fetchBuffer()

      // Should fetch new data, not use corrupted cache
      expect(buffer.equals(validOggData)).toBe(true)
    })
  })

  describe('fetchStream Tests', () => {
    it('should fetch and return audio stream', async () => {
      const audio = new AudioAssets('TestStreamAudio')

      const stream = await audio.fetchStream()

      expect(stream).toBeDefined()
      expect(typeof stream.read).toBe('function')
    })

    it('should throw AudioNotFoundError for empty URL', async () => {
      const audio = new AudioAssets('')

      await expect(audio.fetchStream()).rejects.toThrow(AudioNotFoundError)
    })

    it('should use cached file for stream if available', async () => {
      const audio = new AudioAssets('TestStreamAudioCache')
      const cachePath = path.resolve(testCacheDir, 'TestStreamAudioCache.ogg')

      // First call should create cache
      await audio.fetchBuffer()
      expect(fs.existsSync(cachePath)).toBe(true)

      // Stream call should use cache
      const stream = await audio.fetchStream()
      expect(stream).toBeDefined()
    })

    it('should create cache directory for stream download', async () => {
      const audio = new AudioAssets('TestStreamCreateDir', 'en', 10000003)

      const stream = await audio.fetchStream()

      expect(stream).toBeDefined()
      const expectedDir = path.resolve(testCacheDir, 'en', '10000003')
      expect(fs.existsSync(expectedDir)).toBe(true)
    })

    it('should accept highWaterMark parameter', async () => {
      const audio = new AudioAssets('TestStreamHighWater')

      const stream = await audio.fetchStream(2048)

      expect(stream).toBeDefined()
    })
  })

  describe('OGG Corruption Detection', () => {
    it('should detect valid OGG files as not corrupted', () => {
      const audio = new AudioAssets('TestValidOGG')
      const validPath = path.resolve(testCacheDir, 'valid-test.ogg')

      fs.mkdirSync(path.dirname(validPath), { recursive: true })
      fs.writeFileSync(validPath, validOggData)

      // Use reflection to access private method for testing
      const isCorrupted = (
        audio as unknown as { isOGGCorrupted: (path: string) => boolean }
      ).isOGGCorrupted(validPath)
      expect(isCorrupted).toBe(false)

      fs.unlinkSync(validPath)
    })

    it('should detect corrupted OGG files with wrong header type', () => {
      const audio = new AudioAssets('TestCorruptedOGG')
      const corruptedPath = path.resolve(testCacheDir, 'corrupted-test.ogg')

      fs.mkdirSync(path.dirname(corruptedPath), { recursive: true })
      fs.writeFileSync(corruptedPath, corruptedOggData)

      const isCorrupted = (
        audio as unknown as { isOGGCorrupted: (path: string) => boolean }
      ).isOGGCorrupted(corruptedPath)
      expect(isCorrupted).toBe(true)

      fs.unlinkSync(corruptedPath)
    })

    it('should detect invalid OGG signature', () => {
      const audio = new AudioAssets('TestInvalidOGG')
      const invalidPath = path.resolve(testCacheDir, 'invalid-test.ogg')

      fs.mkdirSync(path.dirname(invalidPath), { recursive: true })
      fs.writeFileSync(invalidPath, invalidOggSignature)

      const isCorrupted = (
        audio as unknown as { isOGGCorrupted: (path: string) => boolean }
      ).isOGGCorrupted(invalidPath)
      expect(isCorrupted).toBe(true)

      fs.unlinkSync(invalidPath)
    })

    it('should handle files without OggS signature', () => {
      const audio = new AudioAssets('TestNoOggS')
      const noOggSPath = path.resolve(testCacheDir, 'no-oggs-test.ogg')

      fs.mkdirSync(path.dirname(noOggSPath), { recursive: true })
      // Create a buffer with sufficient size to avoid range errors
      const randomData = Buffer.alloc(50, 0)
      randomData.write('random data without OggS')
      fs.writeFileSync(noOggSPath, randomData)

      const isCorrupted = (
        audio as unknown as { isOGGCorrupted: (path: string) => boolean }
      ).isOGGCorrupted(noOggSPath)
      expect(isCorrupted).toBe(true)

      fs.unlinkSync(noOggSPath)
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      setupAssetMock({
        testAudioNetworkError: () =>
          new Response(null, {
            status: 500,
            statusText: 'Internal Server Error',
          }),
      })

      const audio = new AudioAssets('testAudioNetworkError')

      await expect(audio.fetchBuffer()).rejects.toThrow(AudioNotFoundError)
    })

    it('should handle fetch failures', async () => {
      setupAssetMock({
        testAudioFetchFail: () => {
          throw new Error('Network failure')
        },
      })

      const audio = new AudioAssets('testAudioFetchFail')

      await expect(audio.fetchBuffer()).rejects.toThrow()
    })
  })

  describe('Integration Tests', () => {
    it('should work end-to-end with character voice scenarios', async () => {
      // Test character voice with CV and ID
      const voiceJp = new AudioAssets('VO_Albedo_Hello', 'ja', 10000002)
      expect(voiceJp.cv).toBe('ja')
      expect(voiceJp.characterId).toBe(10000002)
      expect(voiceJp.url).toContain('/ja/10000002/')
      expect(voiceJp.mihoyoURL).toContain('/ja/10000002/')

      // Test successful fetch
      const buffer = await voiceJp.fetchBuffer()
      expect(buffer).toBeInstanceOf(Buffer)
    })

    it('should handle multiple concurrent audio requests', async () => {
      const audios = [
        new AudioAssets('ConcurrentAudio1', 'en'),
        new AudioAssets('ConcurrentAudio2', 'ja'),
        new AudioAssets('ConcurrentAudio3', 'zh-cn'),
      ]

      const buffers = await Promise.all(
        audios.map((audio) => audio.fetchBuffer()),
      )

      expect(buffers).toHaveLength(3)
      buffers.forEach((buffer) => {
        expect(buffer).toBeInstanceOf(Buffer)
      })
    })

    it('should handle different CV types correctly', async () => {
      const cvTypes: CVType[] = ['en', 'ja', 'zh-cn']
      const characterId = 10000005

      for (const cv of cvTypes) {
        const audio = new AudioAssets('TestCV', cv, characterId)

        expect(audio.cv).toBe(cv)
        expect(audio.url).toContain(`/${cv}/${characterId.toString()}/`)

        const buffer = await audio.fetchBuffer()
        expect(buffer).toBeInstanceOf(Buffer)

        // Verify cache path includes CV and character ID
        const expectedCachePath = path.resolve(
          testCacheDir,
          cv,
          characterId.toString(),
          'TestCV.ogg',
        )
        expect(fs.existsSync(expectedCachePath)).toBe(true)
      }
    })

    it('should work with complex URL patterns', () => {
      // Test pattern matching for VO_ prefix
      const voiceAudio = new AudioAssets('VO_Character_Skill')
      expect(voiceAudio.audioBaseURL).toBe('https://test-audio-cdn.example.com')

      // Test fallback to default for non-matching patterns
      const otherAudio = new AudioAssets('BGM_Battle_Theme')
      expect(otherAudio.audioBaseURL).toBe(
        'https://default-audio-cdn.example.com',
      )
    })
  })

  describe('Static Method Tests', () => {
    it('should deploy correctly and create audio directory', () => {
      expect(fs.existsSync(testCacheDir)).toBe(true)
    })

    it('should handle directory creation during deploy', () => {
      // Remove directory
      if (fs.existsSync(testCacheDir))
        fs.rmSync(testCacheDir, { recursive: true, force: true })

      // Re-deploy should recreate directory
      AudioAssets.deploy(testOption)
      expect(fs.existsSync(testCacheDir)).toBe(true)
    })
  })
})
