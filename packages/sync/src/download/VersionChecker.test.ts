import type { RestClient } from '@genshin-manager/core'
import { AssetFormatError, FileLocation } from '@genshin-manager/data'
import fs from 'fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { VersionChecker } from '@/download/VersionChecker'
import type { CommitsResponse } from '@/types/api/gitlab/responses'
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
vi.mock('@genshin-manager/core', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    logger: {
      info: vi.fn(),
      error: vi.fn(),
    },
  }
})

describe('VersionChecker', () => {
  beforeEach(() => {
    FileLocation.deploy({ assetCacheFolderPath: '/test-cache' })
  })
  let mockFetch: ReturnType<typeof vi.fn>

  function createMockRestClient(): RestClient<GitLabApiRoutes> {
    mockFetch = vi.fn()
    return {
      fetch: mockFetch,
    } as unknown as RestClient<GitLabApiRoutes>
  }

  function createValidCommit(id: string, title: string): CommitsResponse {
    return {
      id,
      short_id: id.slice(0, 8),
      title,
      authored_date: '2024-01-01T00:00:00Z',
      committed_date: '2024-01-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      message: title,
      parent_ids: [],
      web_url: 'https://example.com',
    }
  }

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('constructor', () => {
    it('should create instance with options', () => {
      const restClient = createMockRestClient()
      const checker = new VersionChecker({
        projectId: 12345,
        restClient,
      })

      expect(checker).toBeDefined()
      expect(checker.commitId).toBe('')
    })
  })

  describe('getGameVersion', () => {
    it('should return undefined when file does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })

    it('should return undefined when file is empty', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('   ')

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })

    it('should return undefined when file contains invalid JSON', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('invalid json')

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })

    it('should return undefined when file contains empty array', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('[]')

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })

    it('should return undefined when file contains non-array', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('{"not": "array"}')

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })

    it('should return undefined when commit is invalid structure', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('[{"invalid": "commit"}]')

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })

    it('should extract version from valid commit title', () => {
      const commit = createValidCommit(
        'abc123',
        'OSRELWin5.1.0_20240101_abcdef',
      )
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify([commit]))

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBe('5.1.0')
    })

    it('should return ?.?.? when version not found in title', () => {
      const commit = createValidCommit('abc123', 'Some other commit title')
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify([commit]))

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBe('?.?.?')
    })
  })

  describe('checkForUpdate', () => {
    it('should return new version when commits differ', async () => {
      const oldCommit = createValidCommit(
        'old123',
        'OSRELWin5.0.0_20231201_old',
      )
      const newCommit = createValidCommit(
        'new456',
        'OSRELWin5.1.0_20240101_new',
      )

      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify([oldCommit]))
      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      const restClient = createMockRestClient()
      mockFetch.mockResolvedValue([newCommit])

      const checker = new VersionChecker({
        projectId: 12345,
        restClient,
      })

      const result = await checker.checkForUpdate()

      expect(result).toBe('5.1.0')
      expect(checker.commitId).toBe('new456')
    })

    it('should return undefined when commits are same', async () => {
      const commit = createValidCommit('same123', 'OSRELWin5.0.0_20231201_same')

      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify([commit]))
      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      const restClient = createMockRestClient()
      mockFetch.mockResolvedValue([commit])

      const checker = new VersionChecker({
        projectId: 12345,
        restClient,
      })

      const result = await checker.checkForUpdate()

      expect(result).toBeUndefined()
      expect(checker.commitId).toBe('same123')
    })

    it('should return new version when no cached commits', async () => {
      const newCommit = createValidCommit(
        'new123',
        'OSRELWin5.1.0_20240101_new',
      )

      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      const restClient = createMockRestClient()
      mockFetch.mockResolvedValue([newCommit])

      const checker = new VersionChecker({
        projectId: 12345,
        restClient,
      })

      const result = await checker.checkForUpdate()

      expect(result).toBe('5.1.0')
    })

    it('should throw AssetFormatError when response is empty', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      const restClient = createMockRestClient()
      mockFetch.mockResolvedValue([])

      const checker = new VersionChecker({
        projectId: 12345,
        restClient,
      })

      await expect(checker.checkForUpdate()).rejects.toThrow(AssetFormatError)
    })

    it('should throw AssetFormatError when response has invalid structure', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      const restClient = createMockRestClient()
      mockFetch.mockResolvedValue([
        { invalid: 'structure' } as unknown as CommitsResponse,
      ])

      const checker = new VersionChecker({
        projectId: 12345,
        restClient,
      })

      await expect(checker.checkForUpdate()).rejects.toThrow(AssetFormatError)
    })

    it('should handle cached file with parse error', async () => {
      const newCommit = createValidCommit(
        'new123',
        'OSRELWin5.1.0_20240101_new',
      )

      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('invalid json {{')
      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      const restClient = createMockRestClient()
      mockFetch.mockResolvedValue([newCommit])

      const checker = new VersionChecker({
        projectId: 12345,
        restClient,
      })

      const result = await checker.checkForUpdate()

      expect(result).toBe('5.1.0')
    })
  })

  describe('commitId getter', () => {
    it('should return empty string initially', () => {
      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.commitId).toBe('')
    })

    it('should return commit ID after checkForUpdate', async () => {
      const commit = createValidCommit('abc123def', 'OSRELWin5.0.0_test')

      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      const restClient = createMockRestClient()
      mockFetch.mockResolvedValue([commit])

      const checker = new VersionChecker({
        projectId: 12345,
        restClient,
      })

      await checker.checkForUpdate()

      expect(checker.commitId).toBe('abc123def')
    })
  })

  describe('isCommitsResponse type guard', () => {
    it('should reject null', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('[null]')

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })

    it('should reject primitive values', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('["string"]')

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })

    it('should reject object missing id', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue(
        '[{"title": "test", "short_id": "abc"}]',
      )

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })

    it('should reject object missing title', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue(
        '[{"id": "abc123", "short_id": "abc"}]',
      )

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })

    it('should reject object missing short_id', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue(
        '[{"id": "abc123", "title": "test"}]',
      )

      const checker = new VersionChecker({
        projectId: 12345,
        restClient: createMockRestClient(),
      })

      expect(checker.getGameVersion()).toBeUndefined()
    })
  })
})
