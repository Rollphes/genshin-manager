import { AssetNotFoundError } from '@genshin-manager/core'
import { Language } from '@genshin-manager/core'
import fs from 'fs'
import { Readable } from 'stream'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { loadTextMapFiles } from '@/loader/loadTextMapFiles'

vi.mock('fs')
vi.mock('@genshin-manager/core', async () => {
  const actual = await vi.importActual('@genshin-manager/core')
  return {
    ...(actual as Record<string, unknown>),
    logger: {
      info: vi.fn(),
    },
  }
})
vi.mock('@/paths/Location', () => ({
  Location: {
    textMap: vi.fn(() => ({
      resolve: vi.fn(() => '/mocked/path/TextMap.json'),
    })),
    joinPath: vi.fn((...segments: string[]) => segments.join('/')),
    getFileName: vi.fn((filePath: string) => filePath.split('/').pop() ?? ''),
  },
}))

describe('loadTextMapFiles', () => {
  function createMockReadStream(content: string): fs.ReadStream {
    const readable = Readable.from([content])
    return readable as unknown as fs.ReadStream
  }

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('folder not found', () => {
    it('should return redownloadLanguage when autoFix is true and folder not found', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const result = await loadTextMapFiles('/test/TextMap', {
        autoFix: true,
        language: Language.En,
        textHashes: new Set([123, 456]),
      })

      expect(result).toEqual({
        success: false,
        redownloadLanguage: Language.En,
      })
    })

    it('should throw AssetNotFoundError when autoFix is false and folder not found', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      await expect(
        loadTextMapFiles('/test/TextMap', {
          autoFix: false,
          language: Language.En,
          textHashes: new Set([123]),
        }),
      ).rejects.toThrow(AssetNotFoundError)
    })
  })

  describe('no matching files', () => {
    it('should return redownloadLanguage when autoFix is true and no files found', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readdirSync).mockReturnValue(['OtherFile.json'] as never)

      const result = await loadTextMapFiles('/test/TextMap', {
        autoFix: true,
        language: Language.En,
        textHashes: new Set([123]),
      })

      expect(result).toEqual({
        success: false,
        redownloadLanguage: Language.En,
      })
    })

    it('should throw AssetNotFoundError when autoFix is false and no files found', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readdirSync).mockReturnValue(['OtherFile.json'] as never)

      await expect(
        loadTextMapFiles('/test/TextMap', {
          autoFix: false,
          language: Language.En,
          textHashes: new Set([123]),
        }),
      ).rejects.toThrow(AssetNotFoundError)
    })
  })

  describe('valid files', () => {
    it('should load single TextMap file successfully', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readdirSync).mockReturnValue(['TextMapEN.json'] as never)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('{\n"123": "Hello",\n"456": "World"\n}'),
      )

      const result = await loadTextMapFiles('/test/TextMap', {
        autoFix: false,
        language: Language.En,
        textHashes: new Set([123, 456]),
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.get(123)).toBe('Hello')
        expect(result.data.get(456)).toBe('World')
      }
    })

    it('should load multiple split TextMap files', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readdirSync).mockReturnValue([
        'TextMapEN.json',
        'TextMapEN_0.json',
        'TextMapEN_1.json',
      ] as never)

      let callCount = 0
      vi.mocked(fs.createReadStream).mockImplementation(() => {
        callCount++
        if (callCount === 1) return createMockReadStream('{\n"100": "First"\n}')
        else if (callCount === 2)
          return createMockReadStream('{\n"200": "Second"\n}')

        return createMockReadStream('{\n"300": "Third"\n}')
      })

      const result = await loadTextMapFiles('/test/TextMap', {
        autoFix: false,
        language: Language.En,
        textHashes: new Set([100, 200, 300]),
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.get(100)).toBe('First')
        expect(result.data.get(200)).toBe('Second')
        expect(result.data.get(300)).toBe('Third')
      }
    })

    it('should filter hashes correctly', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readdirSync).mockReturnValue(['TextMapEN.json'] as never)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('{\n"123": "Included",\n"789": "Excluded"\n}'),
      )

      const result = await loadTextMapFiles('/test/TextMap', {
        autoFix: false,
        language: Language.En,
        textHashes: new Set([123]),
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.get(123)).toBe('Included')
        expect(result.data.has(789)).toBe(false)
      }
    })
  })

  describe('different languages', () => {
    it('should handle Japanese TextMap files', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readdirSync).mockReturnValue(['TextMapJP.json'] as never)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('{\n"123": "こんにちは"\n}'),
      )

      const result = await loadTextMapFiles('/test/TextMap', {
        autoFix: false,
        language: Language.Ja,
        textHashes: new Set([123]),
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.get(123)).toBe('こんにちは')
    })

    it('should handle Chinese TextMap files', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readdirSync).mockReturnValue(['TextMapCHS.json'] as never)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('{\n"123": "你好"\n}'),
      )

      const result = await loadTextMapFiles('/test/TextMap', {
        autoFix: false,
        language: Language.ZhCn,
        textHashes: new Set([123]),
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data.get(123)).toBe('你好')
    })
  })

  describe('error handling', () => {
    it('should propagate stream errors', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readdirSync).mockReturnValue(['TextMapEN.json'] as never)

      const errorStream = new Readable({
        read(): void {
          this.destroy(new Error('Stream error'))
        },
      })
      vi.mocked(fs.createReadStream).mockReturnValue(
        errorStream as unknown as fs.ReadStream,
      )

      await expect(
        loadTextMapFiles('/test/TextMap', {
          autoFix: false,
          language: Language.En,
          textHashes: new Set([123]),
        }),
      ).rejects.toThrow('Stream error')
    })
  })

  describe('file pattern matching', () => {
    it('should match TextMap files with numeric suffixes', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readdirSync).mockReturnValue([
        'TextMapEN.json',
        'TextMapEN_0.json',
        'TextMapEN_1.json',
        'TextMapEN_10.json',
        'TextMapJP.json',
        'OtherFile.json',
      ] as never)
      vi.mocked(fs.createReadStream).mockImplementation(() =>
        createMockReadStream('{\n"1": "test"\n}'),
      )

      const result = await loadTextMapFiles('/test/TextMap', {
        autoFix: false,
        language: Language.En,
        textHashes: new Set([1]),
      })

      expect(result.success).toBe(true)
      // Should process 4 EN files
      expect(fs.createReadStream).toHaveBeenCalledTimes(4)
    })

    it('should sort files before processing', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readdirSync).mockReturnValue([
        'TextMapEN_1.json',
        'TextMapEN.json',
        'TextMapEN_0.json',
      ] as never)

      const processedFiles: string[] = []
      vi.mocked(fs.createReadStream).mockImplementation((filePath) => {
        processedFiles.push(String(filePath))
        return createMockReadStream('{\n"1": "test"\n}')
      })

      await loadTextMapFiles('/test/TextMap', {
        autoFix: false,
        language: Language.En,
        textHashes: new Set([1]),
      })

      // Files should be sorted alphabetically
      expect(processedFiles[0]).toContain('TextMapEN.json')
      expect(processedFiles[1]).toContain('TextMapEN_0.json')
      expect(processedFiles[2]).toContain('TextMapEN_1.json')
    })
  })
})
