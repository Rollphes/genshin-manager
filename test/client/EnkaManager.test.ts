import {
  createEnkaAccountResponse,
  createEnkaDataResponse,
  createEnkaStatusResponse,
  createGenshinAccountsResponse,
} from '@test/__mocks__/api/enka-manager'
import { setupGitLabMock } from '@test/__mocks__/api/gitlab'
import { MockResponse } from '@test/__mocks__/utils'
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

import { Client } from '@/client/Client'
import { EnkaManager, EnkaManagerEvents } from '@/client/EnkaManager'
import {
  EnkaNetworkError,
  EnkaNetworkStatusError,
  GeneralError,
} from '@/errors'

// Increase max listeners to prevent memory leak warnings during tests
EventEmitter.defaultMaxListeners = 50

describe('EnkaManager Basic Functionality', () => {
  let enkaManager: EnkaManager
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
    // Mock fetch for EnkaManager API calls only
    global.fetch = vi.fn()
    mockFetch = fetch as MockedFunction<typeof fetch>
    enkaManager = new EnkaManager()
  })

  describe('Initialization Tests', () => {
    it('should initialize with default parameters', () => {
      expect(enkaManager).toBeInstanceOf(EnkaManager)
    })

    it('should be an instance of EventEmitter', () => {
      expect(typeof enkaManager.on).toBe('function')
      expect(typeof enkaManager.off).toBe('function')
    })

    it('should have clearCacheOverNextShowCaseDate method', () => {
      expect(typeof enkaManager.clearCacheOverNextShowCaseDate).toBe('function')
    })
  })

  describe('Data Retrieval Tests', () => {
    it('should successfully fetch all data for valid UID', async () => {
      const uid = 123456789
      const mockResponse = createEnkaDataResponse(uid, true, 60)

      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse) as unknown as Response,
      )

      const result = await enkaManager.fetchAll(uid)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://enka.network/api/uid/123456789',
        expect.objectContaining({
          headers: expect.objectContaining({
            'user-agent': expect.stringContaining('genshin-manager') as string,
          }) as Record<string, string>,
        }) as RequestInit,
      )

      expect(result).toBeDefined()
      expect(result.uid).toBe(uid)
      expect(result.playerDetail).toBeDefined()
      expect(result.characterDetails).toBeInstanceOf(Array)
      expect(result.nextShowCaseDate).toBeInstanceOf(Date)
    })

    it('should successfully fetch player detail only', async () => {
      const uid = 123456789
      const mockResponse = createEnkaDataResponse(uid, false, 60)

      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse) as unknown as Response,
      )

      const result = await enkaManager.fetchPlayerDetail(uid)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://enka.network/api/uid/123456789/?info',
        expect.objectContaining({
          headers: expect.objectContaining({
            'user-agent': expect.stringContaining('genshin-manager') as string,
          }) as Record<string, string>,
        }) as RequestInit,
      )

      expect(result).toBeDefined()
      expect(result.nickname).toBe('Player123456789')
      expect(result.level).toBe(60)
    })

    it('should successfully fetch Enka status', async () => {
      const username = 'testuser'
      const mockEnkaAccountResponse = createEnkaAccountResponse(username)

      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockEnkaAccountResponse) as unknown as Response,
      )

      const result = await enkaManager.fetchEnkaAccount(username)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://enka.network/api/profile/testuser',
        expect.objectContaining({
          headers: expect.objectContaining({
            'user-agent': expect.stringContaining('genshin-manager') as string,
          }) as Record<string, string>,
        }) as RequestInit,
      )

      expect(result).toBeDefined()
      expect(result.username).toBe(username)
    })

    it('should successfully fetch Enka network status', async () => {
      const mockStatusResponse = createEnkaStatusResponse()

      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockStatusResponse) as unknown as Response,
      )

      const result = await enkaManager.fetchNowStatus()

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(result).toBeDefined()
      expect(result.now).toBe('2025-08-12T15:06')
      expect(result.gi).toBeDefined()
      expect(result.hsr).toBeDefined()
    })

    it('should successfully fetch all status data', async () => {
      const mockAllStatusResponse = {
        '2025-08-12T15:00': createEnkaStatusResponse(),
        '2025-08-12T15:30': createEnkaStatusResponse(),
        '2025-08-12T16:00': createEnkaStatusResponse(),
      }

      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockAllStatusResponse) as unknown as Response,
      )

      const result = await enkaManager.fetchAllStatus()

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'http://status.enka.network/api/status',
        expect.objectContaining({
          headers: {
            'user-agent': expect.stringContaining('genshin-manager') as string,
          },
        }),
      )
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
      expect(Object.keys(result)).toHaveLength(3)
      expect(result['2025-08-12T15:00']).toBeDefined()
      expect(result['2025-08-12T15:00'].now).toBe('2025-08-12T15:06')
    })

    it('should successfully fetch GenshinAccounts', async () => {
      const username = 'testuser'
      const mockGameAccountsResponse = createGenshinAccountsResponse()
      const mockBuildsResponse = { character1: [], character2: [] }

      // Mock the game accounts API call
      mockFetch
        .mockResolvedValueOnce(
          new MockResponse(mockGameAccountsResponse) as unknown as Response,
        )
        // Mock the builds API calls for each account
        .mockResolvedValueOnce(
          new MockResponse(mockBuildsResponse) as unknown as Response,
        )
        .mockResolvedValueOnce(
          new MockResponse(mockBuildsResponse) as unknown as Response,
        )

      const result = await enkaManager.fetchGenshinAccounts(username)

      expect(mockFetch).toHaveBeenCalledTimes(3) // 1 for accounts + 2 for builds
      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(2)
      expect(result[0]?.uid).toBe(123456789)
      expect(result[1]?.uid).toBe(987654321)
    })
  })

  describe('Cache Functionality Tests', () => {
    it('should cache data after successful fetch', async () => {
      const uid = 123456789
      const mockResponse = createEnkaDataResponse(uid, true, 60)

      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse) as unknown as Response,
      )

      const result = await enkaManager.fetchAll(uid)

      expect(result).toBeDefined()
      expect(result.uid).toBe(uid)
    })

    it('should return cached data when TTL has not expired', async () => {
      const uid = 123456789
      const mockResponse = createEnkaDataResponse(uid, true, 3600) // 1 hour TTL

      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse) as unknown as Response,
      )

      // First call - should fetch from API
      const firstResult = await enkaManager.fetchAll(uid)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Second call - should return cached data
      const secondResult = await enkaManager.fetchAll(uid)
      expect(mockFetch).toHaveBeenCalledTimes(1) // No additional API call

      expect(firstResult).toBe(secondResult) // Same object reference
    })

    it('should clear expired cache correctly with clearCacheOverNextShowCaseDate', () => {
      // Test that clearCacheOverNextShowCaseDate method exists and can be called
      expect(typeof enkaManager.clearCacheOverNextShowCaseDate).toBe('function')

      // Call the method to ensure it doesn't throw
      expect(() => {
        enkaManager.clearCacheOverNextShowCaseDate()
      }).not.toThrow()
    })

    it('should handle cache operations without errors', async () => {
      const uid1 = 123456789
      const uid2 = 987654321

      const mockResponse1 = createEnkaDataResponse(uid1, true, 60)
      const mockResponse2 = createEnkaDataResponse(uid2, true, 60)

      // Add some data to cache by fetching
      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse1) as unknown as Response,
      )
      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse2) as unknown as Response,
      )

      await enkaManager.fetchAll(uid1)
      await enkaManager.fetchAll(uid2)

      // Clear cache and ensure no errors
      expect(() => {
        enkaManager.clearCacheOverNextShowCaseDate()
      }).not.toThrow()
    })

    it('should fetch new data after clearing cache', async () => {
      const uid = 123456789
      const mockResponse = createEnkaDataResponse(uid, true, 1) // Short TTL of 1 second

      // First fetch
      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse) as unknown as Response,
      )

      await enkaManager.fetchAll(uid)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      // Wait for TTL to expire, then clear cache
      await new Promise((resolve) => setTimeout(resolve, 1100)) // Wait 1.1 seconds
      enkaManager.clearCacheOverNextShowCaseDate()

      // Second fetch should make new API call
      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse) as unknown as Response,
      )

      await enkaManager.fetchAll(uid)
      expect(mockFetch).toHaveBeenCalledTimes(2) // New API call made
    })
  })

  describe('Event Functionality Tests', () => {
    it('should emit GET_NEW_ENKA_DATA event when new data is cached', async () => {
      const uid = 123456789
      const mockResponse = createEnkaDataResponse(uid, true, 60)
      const eventSpy = vi.fn()

      enkaManager.on(EnkaManagerEvents.GET_NEW_ENKA_DATA, eventSpy)

      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse) as unknown as Response,
      )

      await enkaManager.fetchAll(uid)

      expect(eventSpy).toHaveBeenCalledTimes(1)
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          uid,
          nextShowCaseDate: expect.any(Date) as Date,
          url: `https://enka.network/u/${uid.toString()}`,
        }),
      )
    })

    it('should not emit event when returning cached data', async () => {
      const uid = 123456789
      const mockResponse = createEnkaDataResponse(uid, true, 3600)
      const eventSpy = vi.fn()

      enkaManager.on(EnkaManagerEvents.GET_NEW_ENKA_DATA, eventSpy)

      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse) as unknown as Response,
      )

      // First call - should emit event
      await enkaManager.fetchAll(uid)
      expect(eventSpy).toHaveBeenCalledTimes(1)

      // Second call - should not emit event (cached data)
      await enkaManager.fetchAll(uid)
      expect(eventSpy).toHaveBeenCalledTimes(1) // No additional event
    })

    it('should handle multiple event listeners correctly', async () => {
      const uid = 123456789
      const mockResponse = createEnkaDataResponse(uid, true, 60)
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      enkaManager.on(EnkaManagerEvents.GET_NEW_ENKA_DATA, listener1)
      enkaManager.on(EnkaManagerEvents.GET_NEW_ENKA_DATA, listener2)

      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse) as unknown as Response,
      )

      await enkaManager.fetchAll(uid)

      expect(listener1).toHaveBeenCalledTimes(1)
      expect(listener2).toHaveBeenCalledTimes(1)

      // Both listeners should receive the same data
      expect(listener1.mock.calls[0]?.[0]).toEqual(listener2.mock.calls[0]?.[0])
    })
  })

  describe('Error Handling Tests', () => {
    it('should throw GeneralError for invalid UID format', async () => {
      const invalidUID = 123 // Too short

      await expect(enkaManager.fetchAll(invalidUID)).rejects.toThrow(
        GeneralError,
      )
      await expect(enkaManager.fetchAll(invalidUID)).rejects.toThrow(
        'The UID format is not correct(123)',
      )
    })

    it('should throw EnkaNetworkError when API request fails', async () => {
      const uid = 123456789
      const mockErrorResponse = new MockResponse(
        { error: 'Player not found' },
        { status: 404, statusText: 'Not Found' },
      )

      mockFetch.mockResolvedValueOnce(mockErrorResponse as unknown as Response)

      await expect(enkaManager.fetchAll(uid)).rejects.toThrow(EnkaNetworkError)
    })

    it('should throw EnkaNetworkError for EnkaAccount API failure', async () => {
      const username = 'nonexistentuser'
      const mockErrorResponse = new MockResponse(
        { error: 'User not found' },
        { status: 404, statusText: 'Not Found' },
      )

      mockFetch.mockResolvedValueOnce(mockErrorResponse as unknown as Response)

      await expect(enkaManager.fetchEnkaAccount(username)).rejects.toThrow(
        EnkaNetworkError,
      )
    })

    it('should throw EnkaNetworkError for GenshinAccounts API failure', async () => {
      const username = 'nonexistentuser'
      const mockErrorResponse = new MockResponse(
        { error: 'User not found' },
        { status: 404, statusText: 'Not Found' },
      )

      mockFetch.mockResolvedValueOnce(mockErrorResponse as unknown as Response)

      await expect(enkaManager.fetchGenshinAccounts(username)).rejects.toThrow(
        EnkaNetworkError,
      )
    })

    it('should throw EnkaNetworkStatusError for status API failure', async () => {
      const mockErrorResponse = new MockResponse(
        { error: 'Service unavailable' },
        { status: 503, statusText: 'Service Unavailable' },
      )

      mockFetch.mockResolvedValueOnce(mockErrorResponse as unknown as Response)

      await expect(enkaManager.fetchNowStatus()).rejects.toThrow(
        EnkaNetworkStatusError,
      )
    })

    it('should throw EnkaNetworkStatusError for all status API failure', async () => {
      const mockErrorResponse = new MockResponse(
        { error: 'Service unavailable' },
        { status: 503, statusText: 'Service Unavailable' },
      )

      mockFetch.mockResolvedValueOnce(mockErrorResponse as unknown as Response)

      await expect(enkaManager.fetchAllStatus()).rejects.toThrow(
        EnkaNetworkStatusError,
      )
    })

    it('should throw network error when fetch fails completely', async () => {
      const uid = 123456789
      mockFetch.mockRejectedValueOnce(new Error('Network Error'))

      await expect(enkaManager.fetchAll(uid)).rejects.toThrow('Network Error')
    })

    it('should preserve cache state when error occurs', async () => {
      const uid1 = 123456789
      const uid2 = 987654321

      // First, add valid data to cache
      const mockResponse1 = createEnkaDataResponse(uid1, true, 60)
      mockFetch.mockResolvedValueOnce(
        new MockResponse(mockResponse1) as unknown as Response,
      )

      await enkaManager.fetchAll(uid1)

      // Then, attempt to fetch invalid UID
      mockFetch.mockRejectedValueOnce(new Error('Network Error'))

      await expect(enkaManager.fetchAll(uid2)).rejects.toThrow('Network Error')

      // Verify that the first UID data is still cached by testing repeated calls
      const secondResponse = createEnkaDataResponse(uid1, true, 60)
      mockFetch.mockResolvedValueOnce(
        new MockResponse(secondResponse) as unknown as Response,
      )

      const previousCallCount = mockFetch.mock.calls.length
      await enkaManager.fetchAll(uid1) // Should return cached data

      // If cached, no new API call should be made for uid1
      expect(mockFetch.mock.calls.length).toBe(previousCallCount)
    })

    it('should handle JSON parsing errors gracefully', async () => {
      const uid = 123456789
      const mockInvalidResponse = new MockResponse('Invalid JSON', {
        status: 200,
        statusText: 'OK',
      })

      mockFetch.mockResolvedValueOnce(
        mockInvalidResponse as unknown as Response,
      )

      await expect(enkaManager.fetchAll(uid)).rejects.toThrow()
    })
  })
})
