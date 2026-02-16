import type { RestClient } from '@genshin-manager/core'
import { BodyNotFoundError, GeneralError, LogLevel } from '@genshin-manager/core'
import {
  AssetFormatError,
  AssetNotFoundError,
  FileLocation,
} from '@genshin-manager/data'
import fs from 'fs'
import { Writable } from 'stream'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AssetDownloader } from '@/download/AssetDownloader'
import type { GitLabApiRoutes } from '@/types/api/gitlab/routes'

vi.mock('fs')
vi.mock('@/download/FileLockManager', () => {
  return {
    FileLockManager: class {
      public async withLock<T>(
        _location: FileLocation,
        fn: () => Promise<T>,
      ): Promise<T> {
        return fn()
      }
    },
  }
})
const mockShouldLog = vi.hoisted(() => vi.fn().mockReturnValue(false))
const mockLoggerWarn = vi.hoisted(() => vi.fn())
vi.mock('@genshin-manager/core', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    logger: {
      shouldLog: mockShouldLog,
      warn: mockLoggerWarn,
    },
  }
})

describe('AssetDownloader', () => {
  beforeEach(() => {
    FileLocation.deploy({ assetCacheFolderPath: '/test-cache' })
  })
  let mockFetchRaw: ReturnType<typeof vi.fn>

  function createMockRestClient(): RestClient<GitLabApiRoutes> {
    mockFetchRaw = vi.fn()
    return {
      fetchRaw: mockFetchRaw,
    } as unknown as RestClient<GitLabApiRoutes>
  }

  function createMockReadableStream(data: string): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder()
    const uint8Array = encoder.encode(data)

    return new ReadableStream({
      start(controller): void {
        controller.enqueue(uint8Array)
        controller.close()
      },
    })
  }

  function createMockResponse(
    body: ReadableStream<Uint8Array> | null,
  ): Response {
    return {
      body,
      url: 'https://example.com/test.json',
    } as unknown as Response
  }

  beforeEach(() => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.mkdirSync).mockImplementation(() => undefined)
    vi.mocked(fs.rmSync).mockImplementation(() => undefined)
    vi.mocked(fs.statSync).mockReturnValue({ size: 100 } as fs.Stats)
    vi.mocked(fs.readFileSync).mockReturnValue('{"valid": "json"}')
    vi.mocked(fs.unlinkSync).mockImplementation(() => undefined)

    // Create proper mock WriteStream using Writable
    vi.mocked(fs.createWriteStream).mockImplementation(() => {
      const writable = new Writable({
        write(_chunk, _encoding, callback): void {
          callback()
        },
      })
      // Add fd property
      Object.defineProperty(writable, 'fd', {
        value: 1,
        writable: false,
      })
      return writable as unknown as fs.WriteStream
    })

    vi.mocked(fs.fsync).mockImplementation(
      (_fd: number, cb: (err: NodeJS.ErrnoException | null) => void) => {
        cb(null)
      },
    )
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('constructor', () => {
    it('should create instance with options', () => {
      const restClient = createMockRestClient()
      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })

      expect(downloader).toBeDefined()
      expect(downloader.commitId).toBe('')
      expect(downloader.textHashes.size).toBe(0)
    })
  })

  describe('downloadFolder', () => {
    it('should download files to folder', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false)

      expect(fs.mkdirSync).toHaveBeenCalled()
      expect(mockFetchRaw).toHaveBeenCalled()
    })

    it('should handle retry mode', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )
      // In retry mode, folder may not exist but file will exist after download
      vi.mocked(fs.existsSync).mockImplementation((path: fs.PathLike) => {
        const pathStr = String(path)
        // Return false for folder check (to trigger mkdirSync), true for file check
        if (pathStr.endsWith('ExcelBinOutput')) return false
        return true
      })

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await downloader.downloadFolder('ExcelBinOutput', ['file1.json'], true)

      expect(fs.mkdirSync).toHaveBeenCalled()
    })

    it('should show progress bar when logging enabled', async () => {
      mockShouldLog.mockReturnValue(true)
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false)

      expect(mockShouldLog).toHaveBeenCalledWith(LogLevel.INFO)
    })

    it('should download multiple files in chunks', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      const files = ['file1.json', 'file2.json', 'file3.json', 'file4.json']
      await downloader.downloadFolder('ExcelBinOutput', files, false)

      expect(mockFetchRaw).toHaveBeenCalledTimes(4)
    })

    it('should retry on download failure', async () => {
      const restClient = createMockRestClient()
      let callCount = 0
      mockFetchRaw.mockImplementation(() => {
        callCount++
        if (callCount === 1) return Promise.reject(new Error('Network error'))

        return Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        )
      })

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false)

      expect(mockFetchRaw).toHaveBeenCalledTimes(2)
    })

    it('should throw after max retries', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockRejectedValue(new Error('Network error'))

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await expect(
        downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false),
      ).rejects.toThrow(GeneralError)

      // Each file gets 3 retries, and allSettled collects the final error
      expect(mockFetchRaw).toHaveBeenCalledTimes(3)
    })
  })

  describe('error handling', () => {
    it('should throw GeneralError when response has no body', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockResolvedValue(createMockResponse(null))

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      // allSettled collects errors, then throws GeneralError with the original as cause
      await expect(
        downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false),
      ).rejects.toThrow(GeneralError)
    })

    it('should throw GeneralError when file does not exist after download', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )
      vi.mocked(fs.existsSync).mockImplementation((path: fs.PathLike) => {
        if (String(path).includes('file1.json')) return false
        return true
      })

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await expect(
        downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false),
      ).rejects.toThrow(GeneralError)
    })

    it('should throw GeneralError when file is empty', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )
      vi.mocked(fs.statSync).mockReturnValue({ size: 0 } as fs.Stats)

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await expect(
        downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false),
      ).rejects.toThrow(GeneralError)
    })

    it('should throw GeneralError when JSON is invalid', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )
      vi.mocked(fs.readFileSync).mockReturnValue('invalid json {{{')

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await expect(
        downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false),
      ).rejects.toThrow(GeneralError)
    })

    it('should throw GeneralError when content is too short', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )
      vi.mocked(fs.readFileSync).mockReturnValue('{}')

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await expect(
        downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false),
      ).rejects.toThrow(GeneralError)
    })

    it('should throw GeneralError when content is empty string', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )
      vi.mocked(fs.readFileSync).mockReturnValue('   ')

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await expect(
        downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false),
      ).rejects.toThrow(GeneralError)
    })

    it('should handle statSync ENOENT error', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )

      const enoentError = new Error('ENOENT') as NodeJS.ErrnoException
      enoentError.code = 'ENOENT'
      vi.mocked(fs.statSync).mockImplementation(() => {
        throw enoentError
      })

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await expect(
        downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false),
      ).rejects.toThrow(GeneralError)
    })

    it('should rethrow non-ENOENT statSync errors as GeneralError', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )

      const otherError = new Error('Permission denied') as NodeJS.ErrnoException
      otherError.code = 'EACCES'
      vi.mocked(fs.statSync).mockImplementation(() => {
        throw otherError
      })

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await expect(
        downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false),
      ).rejects.toThrow(GeneralError)
    })
  })

  describe('TextMap handling', () => {
    it('should apply TextMapTransform for TextMap files', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"123": "test value"}')),
        ),
      )
      vi.mocked(fs.readFileSync).mockReturnValue('{"123": "test value"}')

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'
      downloader.textHashes = new Set([123])

      await downloader.downloadFolder('TextMap', ['TextMapEN.json'], false)

      expect(mockFetchRaw).toHaveBeenCalled()
    })

    it('should handle TextMap file with split suffix', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"456": "another"}')),
        ),
      )
      vi.mocked(fs.readFileSync).mockReturnValue('{"456": "another value"}')

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'
      downloader.textHashes = new Set([456])

      await downloader.downloadFolder('TextMap', ['TextMapJP_0.json'], false)

      expect(mockFetchRaw).toHaveBeenCalled()
    })

    it('should handle non-TextMap json file', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(
            createMockReadableStream('{"id": 1, "name": "test"}'),
          ),
        ),
      )
      vi.mocked(fs.readFileSync).mockReturnValue('{"id": 1, "name": "test"}')

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await downloader.downloadFolder(
        'ExcelBinOutput',
        ['AvatarExcelConfigData.json'],
        false,
      )

      expect(mockFetchRaw).toHaveBeenCalled()
    })
  })

  describe('cleanup', () => {
    it('should cleanup failed downloads silently', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockRejectedValue(new Error('Network error'))
      vi.mocked(fs.unlinkSync).mockImplementation(() => {
        throw new Error('Cleanup failed')
      })

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      // With allSettled, errors are collected and thrown as GeneralError
      await expect(
        downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false),
      ).rejects.toThrow(GeneralError)

      // Should not throw cleanup error
    })

    it('should cleanup existing file on retry', async () => {
      const restClient = createMockRestClient()
      let callCount = 0
      mockFetchRaw.mockImplementation(() => {
        callCount++
        if (callCount === 1) return Promise.reject(new Error('Network error'))

        return Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        )
      })
      vi.mocked(fs.existsSync).mockReturnValue(true)

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false)

      expect(fs.unlinkSync).toHaveBeenCalled()
    })
  })

  describe('stream handling', () => {
    it('should handle WriteStream with null fd', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"test": "data"}')),
        ),
      )

      vi.mocked(fs.createWriteStream).mockImplementation(() => {
        const writable = new Writable({
          write(_chunk, _encoding, callback): void {
            callback()
          },
        })
        Object.defineProperty(writable, 'fd', {
          value: null,
          writable: false,
        })
        return writable as unknown as fs.WriteStream
      })

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      await downloader.downloadFolder('ExcelBinOutput', ['file1.json'], false)

      expect(mockFetchRaw).toHaveBeenCalled()
    })
  })

  describe('getLanguageFromFileName', () => {
    it('should extract language from standard TextMap filename', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"789": "value"}')),
        ),
      )
      vi.mocked(fs.readFileSync).mockReturnValue('{"789": "translated"}')

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'
      downloader.textHashes = new Set([789])

      // Test various language codes
      await downloader.downloadFolder('TextMap', ['TextMapCHS.json'], false)

      expect(mockFetchRaw).toHaveBeenCalled()
    })

    it('should handle filename without valid language', async () => {
      const restClient = createMockRestClient()
      mockFetchRaw.mockImplementation(() =>
        Promise.resolve(
          createMockResponse(createMockReadableStream('{"id": 1}')),
        ),
      )
      vi.mocked(fs.readFileSync).mockReturnValue('{"id": 1, "valid": "json"}')

      const downloader = new AssetDownloader({
        restClient,
        projectId: 12345,
      })
      downloader.commitId = 'abc123'

      // ExcelBinOutput directory, so language extraction won't be used
      await downloader.downloadFolder(
        'ExcelBinOutput',
        ['SomeFile.json'],
        false,
      )

      expect(mockFetchRaw).toHaveBeenCalled()
    })
  })
})
