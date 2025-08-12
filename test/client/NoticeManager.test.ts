import {
  createAnnContentResponse,
  createAnnListResponse,
  createDetailedAnnContentResponse,
} from '@test/__mocks__/api/notice-manager'
import { MockResponse } from '@test/__mocks__/utils'
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  vi,
} from 'vitest'

import { Client } from '@/client/Client'
import { NoticeManager } from '@/client/NoticeManager'
import { NoticeLanguage } from '@/types/sg-hk4e-api'
const supportedLanguages: (keyof typeof NoticeLanguage)[] = [
  'en',
  'ru',
  'vi',
  'th',
  'pt',
  'ko',
  'ja',
  'id',
  'fr',
  'es',
  'de',
  'zh-tw',
  'zh-cn',
]

// Mock AssetCacheManager to avoid API calls during testing
vi.mock('@/client/AssetCacheManager', async () => {
  const mockModule = await import(
    '@test/__mocks__/client/MockAssetCacheManager.js'
  )
  return {
    AssetCacheManager: mockModule.AssetCacheManager,
  }
})

// Mock fetch globally for NoticeManager tests
global.fetch = vi.fn()
const mockFetch = fetch as MockedFunction<typeof fetch>

describe('NoticeManager Basic Functionality', () => {
  let noticeManager: NoticeManager

  beforeAll(async () => {
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization Tests', () => {
    it('should initialize with default parameters', () => {
      noticeManager = new NoticeManager('en')

      expect(noticeManager.language).toBe('en')
      expect(noticeManager.updateInterval).toBeUndefined()
      expect(noticeManager.notices.size).toBe(0)
    })

    it('should initialize with custom update interval', () => {
      const customInterval = 120000 // 2 minutes
      noticeManager = new NoticeManager('en', customInterval)

      expect(noticeManager.updateInterval).toBe(customInterval)
    })

    it('should initialize with custom URL parameters', () => {
      const customParams = {
        region: 'os_usa' as const,
        level: '90',
        uid: '123456789',
      }
      noticeManager = new NoticeManager('en', undefined, customParams)

      expect(noticeManager.language).toBe('en')
      // URL params are private, so we can't directly test them
      // but we can verify the manager was created successfully
      expect(noticeManager).toBeInstanceOf(NoticeManager)
    })

    it('should initialize with custom language setting', () => {
      supportedLanguages.forEach((lang) => {
        noticeManager = new NoticeManager(lang)

        expect(() => new NoticeManager(lang)).not.toThrow()
      })
    })

    it('should validate supported languages', () => {
      supportedLanguages.forEach((lang) => {
        expect(() => new NoticeManager(lang)).not.toThrow()
      })
    })
  })

  describe('Notice Retrieval Tests', () => {
    beforeEach(() => {
      noticeManager = new NoticeManager('en')
    })

    it('should successfully execute update method', async () => {
      // Use mock data generator for clean test data
      const mockAnnContentResponse = createAnnContentResponse([1001])
      const mockEnAnnContentResponse = createAnnContentResponse([1001], 'en-us')
      const mockAnnListResponse = createAnnListResponse([1001])

      // Setup fetch mocks in correct order: AnnContent -> En AnnContent -> AnnList
      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockEnAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockAnnListResponse) as unknown as Response,
        )

      await expect(noticeManager.update()).resolves.not.toThrow()

      expect(mockFetch).toHaveBeenCalledTimes(3) // AnnContent + English AnnContent + AnnList
    })

    it('should retrieve notice list correctly', async () => {
      // Use mock data generator for multiple notices
      const mockAnnContentResponse = createAnnContentResponse([1001, 1002])
      const mockEnAnnContentResponse = createAnnContentResponse(
        [1001, 1002],
        'en-us',
      )
      const mockAnnListResponse = createAnnListResponse([1001, 1002])

      // Setup fetch mocks in correct order: AnnContent -> En AnnContent -> AnnList
      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockEnAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockAnnListResponse) as unknown as Response,
        )

      await noticeManager.update()

      expect(noticeManager.notices.size).toBe(2)
      expect(noticeManager.notices.has(1001)).toBe(true)
      expect(noticeManager.notices.has(1002)).toBe(true)
    })

    it('should retrieve notice details correctly', async () => {
      // Use detailed mock data generator for custom content
      const mockAnnContentResponse = createDetailedAnnContentResponse(
        1001,
        'Detailed Test Notice',
        'Detailed Test Subtitle with\nline break',
        '<div><h1>Event Details</h1><p>This is a detailed event description with <strong>formatting</strong>.</p></div>',
      )
      const mockAnnListResponse = createAnnListResponse([1001])

      // Setup fetch mocks in correct order: AnnContent -> En AnnContent -> AnnList
      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse) as unknown as Response,
        ) // English content
        .mockResolvedValueOnce(
          new MockResponse(mockAnnListResponse) as unknown as Response,
        )

      await noticeManager.update()

      const notice = noticeManager.notices.get(1001)
      expect(notice).toBeDefined()
      if (notice) {
        expect(notice.id).toBe(1001)
        expect(notice.title).toBe('Detailed Test Notice')
        expect(notice.subtitle).toBe('Detailed Test Subtitle with\nline break')
        expect(notice.type).toBe(1)
        expect(notice.typeLabel).toBe('Event')
        expect(notice.tag).toBe(1) // From mock data generator default
        expect(notice.version).toBe(1) // From mock data generator default
        expect(notice.lang).toBe('en-us')
      }
    })
  })
})
