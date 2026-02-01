import fs from 'fs'
import { Readable } from 'stream'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AssetFormatError } from '@/errors/AssetFormatError'
import { AssetNotFoundError } from '@/errors/AssetNotFoundError'
import { loadExcelBinFile } from '@/loader/loadExcelBinFile'
import { Location } from '@/paths/Location'

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

  beforeEach(() => {
    Location.deploy({ assetCacheFolderPath: '/test-cache' })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('file not found', () => {
    it('should return redownloadRequired when autoFix is true', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const result = await loadExcelBinFile({
        autoFix: true,
        excelBinName: 'AvatarExcelConfigData',
      })

      expect(result).toEqual({ success: false, redownloadRequired: true })
    })

    it('should throw AssetNotFoundError when autoFix is false', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      await expect(
        loadExcelBinFile({
          autoFix: false,
          excelBinName: 'AvatarExcelConfigData',
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

      const result = await loadExcelBinFile<
        { id: number },
        'AvatarExcelConfigData'
      >({
        autoFix: false,
        excelBinName: 'AvatarExcelConfigData',
      })

      expect(result.success).toBe(true)
      if (result.success) expect(result.data).toEqual([{ id: 1 }, { id: 2 }])
    })

    it('should return success with empty array', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(createMockReadStream('[]'))

      const result = await loadExcelBinFile({
        autoFix: false,
        excelBinName: 'AvatarExcelConfigData',
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

      const result = await loadExcelBinFile({
        autoFix: true,
        excelBinName: 'AvatarExcelConfigData',
      })

      expect(result).toEqual({ success: false, redownloadRequired: true })
    })

    it('should throw SyntaxError when autoFix is false and JSON is invalid', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('invalid json'),
      )

      await expect(
        loadExcelBinFile({
          autoFix: false,
          excelBinName: 'AvatarExcelConfigData',
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

      const result = await loadExcelBinFile({
        autoFix: true,
        excelBinName: 'AvatarExcelConfigData',
      })

      expect(result).toEqual({ success: false, redownloadRequired: true })
    })

    it('should throw AssetFormatError when autoFix is false and data is not array', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('{"not": "array"}'),
      )

      await expect(
        loadExcelBinFile({
          autoFix: false,
          excelBinName: 'AvatarExcelConfigData',
        }),
      ).rejects.toThrow(AssetFormatError)
    })

    it('should throw AssetFormatError for null value', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('null'),
      )

      await expect(
        loadExcelBinFile({
          autoFix: false,
          excelBinName: 'AvatarExcelConfigData',
        }),
      ).rejects.toThrow(AssetFormatError)
    })

    it('should throw AssetFormatError for string value', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createMockReadStream('"just a string"'),
      )

      await expect(
        loadExcelBinFile({
          autoFix: false,
          excelBinName: 'AvatarExcelConfigData',
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
        loadExcelBinFile({
          autoFix: false,
          excelBinName: 'AvatarExcelConfigData',
        }),
      ).rejects.toThrow('Stream read error')
    })

    it('should propagate stream read errors even with autoFix', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.createReadStream).mockReturnValue(
        createErrorReadStream(new Error('IO Error')),
      )

      await expect(
        loadExcelBinFile({
          autoFix: true,
          excelBinName: 'AvatarExcelConfigData',
        }),
      ).rejects.toThrow('IO Error')
    })
  })
})
