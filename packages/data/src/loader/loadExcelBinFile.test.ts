import { AssetFormatError } from '@genshin-manager/core'
import { AssetNotFoundError } from '@genshin-manager/core'
import fs from 'fs'
import { Readable } from 'stream'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { loadExcelBinFile } from '@/loader/loadExcelBinFile'

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

describe('loadExcelBinFile', () => {
  function createMockReadStream(content: string): fs.ReadStream {
    const readable = Readable.from([content])
    return readable as unknown as fs.ReadStream
  }

  function createErrorReadStream(error: Error): fs.ReadStream {
    const readable = new Readable({
      read(): void {
        this.destroy(error)
      },
    })
    return readable as unknown as fs.ReadStream
  }

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('file not found', () => {
    it('should return redownloadRequired when autoFix is true', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const result = await loadExcelBinFile('/test/file.json', {
        autoFix: true,
        fileName: 'TestFile.json',
      })

      expect(result).toEqual({ success: false, redownloadRequired: true })
    })

    it('should throw AssetNotFoundError when autoFix is false', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      await expect(
        loadExcelBinFile('/test/file.json', {
          autoFix: false,
          fileName: 'TestFile.json',
        }),
      ).rejects.toThrow(AssetNotFoundError)
    })
  })

  describe('valid file', () => {
    it('should return success with data for valid JSON array', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('[{"id": 1}, {"id": 2}]'),
      )

      const result = await loadExcelBinFile<{ id: number }>('/test/file.json', {
        autoFix: false,
        fileName: 'TestFile.json',
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data).toEqual([{ id: 1 }, { id: 2 }])
    })

    it('should return success with empty array', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(createMockReadStream('[]'))

      const result = await loadExcelBinFile('/test/file.json', {
        autoFix: false,
        fileName: 'TestFile.json',
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data).toEqual([])
    })
  })

  describe('invalid JSON format', () => {
    it('should return redownloadRequired when autoFix is true and JSON is invalid', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('invalid json {{{'),
      )

      const result = await loadExcelBinFile('/test/file.json', {
        autoFix: true,
        fileName: 'TestFile.json',
      })

      expect(result).toEqual({ success: false, redownloadRequired: true })
    })

    it('should throw SyntaxError when autoFix is false and JSON is invalid', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('invalid json'),
      )

      await expect(
        loadExcelBinFile('/test/file.json', {
          autoFix: false,
          fileName: 'TestFile.json',
        }),
      ).rejects.toThrow(SyntaxError)
    })
  })

  describe('non-array JSON', () => {
    it('should return redownloadRequired when autoFix is true and data is not array', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('{"not": "array"}'),
      )

      const result = await loadExcelBinFile('/test/file.json', {
        autoFix: true,
        fileName: 'TestFile.json',
      })

      expect(result).toEqual({ success: false, redownloadRequired: true })
    })

    it('should throw AssetFormatError when autoFix is false and data is not array', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('{"not": "array"}'),
      )

      await expect(
        loadExcelBinFile('/test/file.json', {
          autoFix: false,
          fileName: 'TestFile.json',
        }),
      ).rejects.toThrow(AssetFormatError)
    })

    it('should throw AssetFormatError for null value', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('null'),
      )

      await expect(
        loadExcelBinFile('/test/file.json', {
          autoFix: false,
          fileName: 'TestFile.json',
        }),
      ).rejects.toThrow(AssetFormatError)
    })

    it('should throw AssetFormatError for string value', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('"just a string"'),
      )

      await expect(
        loadExcelBinFile('/test/file.json', {
          autoFix: false,
          fileName: 'TestFile.json',
        }),
      ).rejects.toThrow(AssetFormatError)
    })
  })

  describe('stream errors', () => {
    it('should propagate stream read errors', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createErrorReadStream(new Error('Stream read error')),
      )

      await expect(
        loadExcelBinFile('/test/file.json', {
          autoFix: false,
          fileName: 'TestFile.json',
        }),
      ).rejects.toThrow('Stream read error')
    })

    it('should propagate stream read errors even with autoFix', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createErrorReadStream(new Error('IO Error')),
      )

      await expect(
        loadExcelBinFile('/test/file.json', {
          autoFix: true,
          fileName: 'TestFile.json',
        }),
      ).rejects.toThrow('IO Error')
    })
  })
})
