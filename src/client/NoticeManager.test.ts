import { EventEmitter } from 'events'
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  vi,
} from 'vitest'

import { setupGitLabMock } from '@/__test__/__mocks__/api/gitlab'
import { createAnnContentResponse } from '@/__test__/__mocks__/api/notice-manager/createAnnContentResponse'
import { createAnnListResponse } from '@/__test__/__mocks__/api/notice-manager/createAnnListResponse'
import { createDetailedAnnContentResponse } from '@/__test__/__mocks__/api/notice-manager/createDetailedAnnContentResponse'
import { MockResponse } from '@/__test__/__mocks__/utils/MockResponse'
import { Client } from '@/client/Client'
import { NoticeManager, NoticeManagerEvents } from '@/client/NoticeManager'
import { AnnContentNotFoundError } from '@/errors/content/AnnContentNotFoundError'
import { ValidationError } from '@/errors/validation/ValidationError'

// Increase max listeners to prevent memory leak warnings during tests
EventEmitter.defaultMaxListeners = 50

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

describe('NoticeManager Basic Functionality', () => {
  let noticeManager: NoticeManager
  let mockFetch: MockedFunction<typeof fetch>

  beforeAll(async () => {
    setupGitLabMock()

    // Deploy Client using the GitLab mock server
    const client = new Client({
      defaultLanguage: 'EN',
      downloadLanguages: ['EN'],
    })
    await client.deploy()
  }, 30000) // 30 seconds timeout for deployment

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock fetch globally for NoticeManager tests
    global.fetch = vi.fn()
    mockFetch = fetch as MockedFunction<typeof fetch>
    noticeManager = new NoticeManager('en')
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

  describe('Event Functionality Tests', () => {
    beforeEach(() => {
      noticeManager = new NoticeManager('en')
    })

    it('should emit ADD_NOTICE event when new notice is added', async () => {
      const eventSpy = vi.fn()
      noticeManager.on(NoticeManagerEvents.ADD_NOTICE, eventSpy)

      // Use mock data generator for single notice
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

      await noticeManager.update()

      // Verify ADD_NOTICE event was fired
      expect(eventSpy).toHaveBeenCalledTimes(1)

      // Verify event data is correct
      const addedNotice = eventSpy.mock.calls[0]?.[0] as unknown
      expect(addedNotice).toBeDefined()
      if (
        typeof addedNotice === 'object' &&
        addedNotice !== null &&
        'id' in addedNotice &&
        'title' in addedNotice
      ) {
        expect(addedNotice.id).toBe(1001)
        expect(addedNotice.title).toBe('Test Notice 1001')
      }
    })

    it('should emit REMOVE_NOTICE event when notice is removed', async () => {
      const addEventSpy = vi.fn()
      const removeEventSpy = vi.fn()

      noticeManager.on(NoticeManagerEvents.ADD_NOTICE, addEventSpy)
      noticeManager.on(NoticeManagerEvents.REMOVE_NOTICE, removeEventSpy)

      // First update: Add notices 1001 and 1002
      const mockAnnContentResponse1 = createAnnContentResponse([1001, 1002])
      const mockEnAnnContentResponse1 = createAnnContentResponse(
        [1001, 1002],
        'en-us',
      )
      const mockAnnListResponse1 = createAnnListResponse([1001, 1002])

      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse1) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockEnAnnContentResponse1) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockAnnListResponse1) as unknown as Response,
        )

      await noticeManager.update()

      // Verify notices were added
      expect(addEventSpy).toHaveBeenCalledTimes(2)
      expect(removeEventSpy).not.toHaveBeenCalled()
      expect(noticeManager.notices.size).toBe(2)

      // Clear spies for second update
      vi.clearAllMocks()

      // Second update: Only notice 1001 remains (1002 should be removed)
      const mockAnnContentResponse2 = createAnnContentResponse([1001])
      const mockEnAnnContentResponse2 = createAnnContentResponse(
        [1001],
        'en-us',
      )
      const mockAnnListResponse2 = createAnnListResponse([1001])

      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse2) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockEnAnnContentResponse2) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockAnnListResponse2) as unknown as Response,
        )

      await noticeManager.update()

      // Verify REMOVE_NOTICE event was fired for notice 1002
      expect(removeEventSpy).toHaveBeenCalledTimes(1)
      expect(addEventSpy).not.toHaveBeenCalled() // No new notices added

      // Verify event data is correct
      const removedNotice = removeEventSpy.mock.calls[0]?.[0] as unknown
      expect(removedNotice).toBeDefined()
      if (
        typeof removedNotice === 'object' &&
        removedNotice !== null &&
        'id' in removedNotice &&
        'title' in removedNotice
      ) {
        expect(removedNotice.id).toBe(1002)
        expect(removedNotice.title).toBe('Test Notice 1002')
      }

      // Verify final state
      expect(noticeManager.notices.size).toBe(1)
      expect(noticeManager.notices.has(1001)).toBe(true)
      expect(noticeManager.notices.has(1002)).toBe(false)
    })

    it('should handle multiple event listeners correctly', async () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      const listener3 = vi.fn()

      // Add multiple listeners for the same event
      noticeManager.on(NoticeManagerEvents.ADD_NOTICE, listener1)
      noticeManager.on(NoticeManagerEvents.ADD_NOTICE, listener2)
      noticeManager.on(NoticeManagerEvents.REMOVE_NOTICE, listener3)

      // Use mock data generator for single notice
      const mockAnnContentResponse = createAnnContentResponse([1001])
      const mockEnAnnContentResponse = createAnnContentResponse([1001], 'en-us')
      const mockAnnListResponse = createAnnListResponse([1001])

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

      // Verify both ADD_NOTICE listeners were called
      expect(listener1).toHaveBeenCalledTimes(1)
      expect(listener2).toHaveBeenCalledTimes(1)
      expect(listener3).not.toHaveBeenCalled()

      // Verify both listeners received the same notice data
      const notice1 = listener1.mock.calls[0]?.[0] as unknown
      const notice2 = listener2.mock.calls[0]?.[0] as unknown
      if (
        typeof notice1 === 'object' &&
        notice1 !== null &&
        'id' in notice1 &&
        typeof notice2 === 'object' &&
        notice2 !== null &&
        'id' in notice2
      ) {
        expect(notice1.id).toBe(1001)
        expect(notice2.id).toBe(1001)
      }
    })

    it('should not emit events when no changes occur', async () => {
      const addEventSpy = vi.fn()
      const removeEventSpy = vi.fn()

      noticeManager.on(NoticeManagerEvents.ADD_NOTICE, addEventSpy)
      noticeManager.on(NoticeManagerEvents.REMOVE_NOTICE, removeEventSpy)

      // First update: Add notice 1001
      const mockAnnContentResponse = createAnnContentResponse([1001])
      const mockEnAnnContentResponse = createAnnContentResponse([1001], 'en-us')
      const mockAnnListResponse = createAnnListResponse([1001])

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

      // Verify notice was added
      expect(addEventSpy).toHaveBeenCalledTimes(1)
      expect(removeEventSpy).not.toHaveBeenCalled()

      // Clear spies for second update
      vi.clearAllMocks()

      // Second update: Same notice 1001 (no changes)
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

      // Verify no events were fired since no changes occurred
      expect(addEventSpy).not.toHaveBeenCalled()
      expect(removeEventSpy).not.toHaveBeenCalled()
      expect(noticeManager.notices.size).toBe(1)
    })
  })

  describe('Error handling Tests', () => {
    it('should throw NetworkError when AnnContent API request fails', async () => {
      // Mock failed API response for AnnContent
      const mockErrorResponse = new MockResponse(
        { error: 'API Error' },
        { status: 500, statusText: 'Internal Server Error' },
      )

      mockFetch.mockResolvedValueOnce(mockErrorResponse as unknown as Response)

      // Verify that NetworkError is thrown
      await expect(noticeManager.update()).rejects.toThrow('Network')

      // Reset mock for second test
      mockFetch.mockResolvedValueOnce(mockErrorResponse as unknown as Response)
      await expect(noticeManager.update()).rejects.toThrow(
        'Network is unavailable',
      )
    })

    it('should throw NetworkError when AnnList API request fails', async () => {
      const mockAnnContentResponse = createAnnContentResponse([1001])
      const mockEnAnnContentResponse = createAnnContentResponse([1001], 'en-us')
      const mockErrorResponse = new MockResponse(
        { error: 'API Error' },
        { status: 404, statusText: 'Not Found' },
      )

      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockEnAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(mockErrorResponse as unknown as Response)

      // Verify that NetworkError is thrown
      await expect(noticeManager.update()).rejects.toThrow('Network')

      // Reset mock for second test
      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockEnAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(mockErrorResponse as unknown as Response)
      await expect(noticeManager.update()).rejects.toThrow(
        'Network is unavailable',
      )
    })

    it('should throw NetworkError when English AnnContent API request fails', async () => {
      const mockAnnContentResponse = createAnnContentResponse([1001])
      const mockErrorResponse = new MockResponse(
        { error: 'API Error' },
        { status: 503, statusText: 'Service Unavailable' },
      )

      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(mockErrorResponse as unknown as Response)

      // Verify that NetworkError is thrown
      await expect(noticeManager.update()).rejects.toThrow('Network')

      // Reset mock for second test
      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(mockErrorResponse as unknown as Response)
      await expect(noticeManager.update()).rejects.toThrow(
        'Network is unavailable',
      )
    })

    it('should throw AnnContentNotFoundError when notice content is missing', async () => {
      // Create response with AnnList but missing corresponding AnnContent
      const mockAnnContentResponse = createAnnContentResponse([1001]) // Only ID 1001
      const mockEnAnnContentResponse = createAnnContentResponse([1001], 'en-us') // Only ID 1001
      const mockAnnListResponse = createAnnListResponse([1001, 1002]) // IDs 1001 and 1002

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

      // Verify that AnnContentNotFoundError is thrown for missing content (ID 1002)
      await expect(noticeManager.update()).rejects.toThrow(
        AnnContentNotFoundError,
      )

      // Reset mock for second test
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
      await expect(noticeManager.update()).rejects.toThrow(
        'Announcement content not found: 1002',
      )
    })

    it('should throw network error when fetch fails completely', async () => {
      // Mock network failure
      mockFetch.mockRejectedValueOnce(new Error('Network Error'))

      // Verify that network error is thrown
      await expect(noticeManager.update()).rejects.toThrow('Network Error')
    })

    it('should throw error when JSON parsing fails', async () => {
      // Mock response with invalid JSON
      const mockInvalidResponse = new MockResponse('Invalid JSON', {
        status: 200,
        statusText: 'OK',
      })

      mockFetch.mockResolvedValueOnce(
        mockInvalidResponse as unknown as Response,
      )

      // Verify that JSON parsing error is thrown
      await expect(noticeManager.update()).rejects.toThrow()
    })

    it('should preserve notice state when error occurs during update', async () => {
      // First, add some notices successfully
      const mockAnnContentResponse = createAnnContentResponse([1001])
      const mockEnAnnContentResponse = createAnnContentResponse([1001], 'en-us')
      const mockAnnListResponse = createAnnListResponse([1001])

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

      // Verify initial state
      expect(noticeManager.notices.size).toBe(1)
      expect(noticeManager.notices.has(1001)).toBe(true)

      // Now mock a failure in the second update
      mockFetch.mockRejectedValueOnce(new Error('Network Error'))

      // Verify error is thrown but state is preserved
      await expect(noticeManager.update()).rejects.toThrow('Network Error')
      expect(noticeManager.notices.size).toBe(1)
      expect(noticeManager.notices.has(1001)).toBe(true)
    })
  })

  describe('Cache Functionality Tests', () => {
    beforeEach(() => {
      noticeManager = new NoticeManager('en')
    })

    it('should cache notice data correctly after update', async () => {
      const mockAnnContentResponse = createAnnContentResponse([1001, 1002])
      const mockEnAnnContentResponse = createAnnContentResponse(
        [1001, 1002],
        'en-us',
      )
      const mockAnnListResponse = createAnnListResponse([1001, 1002])

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

      // Verify initial empty state
      expect(noticeManager.notices.size).toBe(0)

      // Update and verify data is cached
      await noticeManager.update()

      // Verify notices are cached in memory
      expect(noticeManager.notices.size).toBe(2)
      expect(noticeManager.notices.has(1001)).toBe(true)
      expect(noticeManager.notices.has(1002)).toBe(true)

      // Verify cached notice data structure
      const notice1001 = noticeManager.notices.get(1001)
      const notice1002 = noticeManager.notices.get(1002)

      expect(notice1001).toBeDefined()
      expect(notice1002).toBeDefined()

      if (notice1001 && notice1002) {
        expect(notice1001.id).toBe(1001)
        expect(notice1001.title).toBe('Test Notice 1001')
        expect(notice1002.id).toBe(1002)
        expect(notice1002.title).toBe('Test Notice 1002')
      }
    })

    it('should handle duplicate data correctly during updates', async () => {
      // First update: Add notices 1001 and 1002
      const mockAnnContentResponse1 = createAnnContentResponse([1001, 1002])
      const mockEnAnnContentResponse1 = createAnnContentResponse(
        [1001, 1002],
        'en-us',
      )
      const mockAnnListResponse1 = createAnnListResponse([1001, 1002])

      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse1) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockEnAnnContentResponse1) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockAnnListResponse1) as unknown as Response,
        )

      await noticeManager.update()

      // Verify initial state
      expect(noticeManager.notices.size).toBe(2)
      const initialNotice1001 = noticeManager.notices.get(1001)
      const initialNotice1002 = noticeManager.notices.get(1002)

      // Second update: Same data (should not duplicate)
      const mockAnnContentResponse2 = createAnnContentResponse([1001, 1002])
      const mockEnAnnContentResponse2 = createAnnContentResponse(
        [1001, 1002],
        'en-us',
      )
      const mockAnnListResponse2 = createAnnListResponse([1001, 1002])

      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse2) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockEnAnnContentResponse2) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockAnnListResponse2) as unknown as Response,
        )

      await noticeManager.update()

      // Verify no duplication occurred
      expect(noticeManager.notices.size).toBe(2)
      expect(noticeManager.notices.has(1001)).toBe(true)
      expect(noticeManager.notices.has(1002)).toBe(true)

      // Verify same instances are maintained (no recreation)
      const updatedNotice1001 = noticeManager.notices.get(1001)
      const updatedNotice1002 = noticeManager.notices.get(1002)

      expect(updatedNotice1001).toBe(initialNotice1001)
      expect(updatedNotice1002).toBe(initialNotice1002)
    })

    it('should respect minimum update interval constraint', () => {
      const minInterval = 60000 // 1 minute in milliseconds

      // Test valid interval (exactly minimum)
      expect(() => new NoticeManager('en', minInterval)).not.toThrow()

      // Test valid interval (above minimum)
      expect(() => new NoticeManager('en', minInterval * 2)).not.toThrow()

      // Test valid interval (undefined - should not throw)
      expect(() => new NoticeManager('en', undefined)).not.toThrow()

      // Test edge case: zero is actually valid due to falsy check in source
      expect(() => new NoticeManager('en', 0)).not.toThrow()

      // Test invalid interval (below minimum but positive)
      expect(() => new NoticeManager('en', minInterval - 1)).toThrow(
        ValidationError,
      )

      // Test invalid interval (small positive value)
      expect(() => new NoticeManager('en', 1)).toThrow(ValidationError)

      // Test invalid interval (negative)
      expect(() => new NoticeManager('en', -1000)).toThrow(ValidationError)

      // Test maximum boundary (should not throw)
      expect(() => new NoticeManager('en', 2147483647)).not.toThrow()

      // Test over maximum boundary (should throw)
      expect(() => new NoticeManager('en', 2147483648)).toThrow(ValidationError)
    })

    it('should handle expired cache updates properly', async () => {
      // Initial setup with notices 1001, 1002, 1003
      const mockAnnContentResponse1 = createAnnContentResponse([
        1001, 1002, 1003,
      ])
      const mockEnAnnContentResponse1 = createAnnContentResponse(
        [1001, 1002, 1003],
        'en-us',
      )
      const mockAnnListResponse1 = createAnnListResponse([1001, 1002, 1003])

      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse1) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockEnAnnContentResponse1) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockAnnListResponse1) as unknown as Response,
        )

      await noticeManager.update()

      // Verify initial cache state
      expect(noticeManager.notices.size).toBe(3)
      expect(noticeManager.notices.has(1001)).toBe(true)
      expect(noticeManager.notices.has(1002)).toBe(true)
      expect(noticeManager.notices.has(1003)).toBe(true)

      // Simulate expired cache scenario: only 1001 and 1003 remain
      const mockAnnContentResponse2 = createAnnContentResponse([1001, 1003])
      const mockEnAnnContentResponse2 = createAnnContentResponse(
        [1001, 1003],
        'en-us',
      )
      const mockAnnListResponse2 = createAnnListResponse([1001, 1003])

      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockAnnContentResponse2) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockEnAnnContentResponse2) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockAnnListResponse2) as unknown as Response,
        )

      await noticeManager.update()

      // Verify expired cache handling
      expect(noticeManager.notices.size).toBe(2)
      expect(noticeManager.notices.has(1001)).toBe(true)
      expect(noticeManager.notices.has(1002)).toBe(false) // Should be removed
      expect(noticeManager.notices.has(1003)).toBe(true)
    })

    it('should preserve cache integrity during partial failures', async () => {
      // Initial successful update
      const mockAnnContentResponse = createAnnContentResponse([1001])
      const mockEnAnnContentResponse = createAnnContentResponse([1001], 'en-us')
      const mockAnnListResponse = createAnnListResponse([1001])

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

      // Verify initial cache
      expect(noticeManager.notices.size).toBe(1)
      expect(noticeManager.notices.has(1001)).toBe(true)
      const originalNotice = noticeManager.notices.get(1001)

      // Attempt update with network failure
      mockFetch.mockRejectedValueOnce(new Error('Network failure'))

      // Verify failure throws error but cache remains intact
      await expect(noticeManager.update()).rejects.toThrow('Network failure')

      // Verify cache integrity preserved
      expect(noticeManager.notices.size).toBe(1)
      expect(noticeManager.notices.has(1001)).toBe(true)
      expect(noticeManager.notices.get(1001)).toBe(originalNotice)
    })

    it('should handle large cache updates efficiently', async () => {
      // Test with larger dataset to verify cache performance
      const largeIdArray = Array.from({ length: 50 }, (_, i) => 2000 + i)

      const mockAnnContentResponse = createAnnContentResponse(largeIdArray)
      const mockEnAnnContentResponse = createAnnContentResponse(
        largeIdArray,
        'en-us',
      )
      const mockAnnListResponse = createAnnListResponse(largeIdArray)

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

      const startTime = Date.now()
      await noticeManager.update()
      const endTime = Date.now()

      // Verify all notices are cached
      expect(noticeManager.notices.size).toBe(50)
      largeIdArray.forEach((id) => {
        expect(noticeManager.notices.has(id)).toBe(true)
      })

      // Verify reasonable performance (should complete within 1 second)
      expect(endTime - startTime).toBeLessThan(1000)
    })
  })
})
