import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { NetworkError } from '@/errors/NetworkError'
import { RestClient } from '@/http/RestClient'

// Mock fetch globally
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

/* eslint-disable @typescript-eslint/naming-convention */
interface TestApiRoutes {
  '/api/users/:id': {
    params: { id: number }
    response: { id: number; name: string }
  }
  '/api/posts': {
    query: { page: number; limit: number }
    response: { id: number; title: string }[]
  }
  '/api/simple': {
    response: { success: boolean }
  }
}
/* eslint-enable @typescript-eslint/naming-convention */

describe('RestClient', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create instance with origin URL', () => {
    const client = new RestClient<TestApiRoutes>('https://api.example.com')
    expect(client).toBeDefined()
  })

  it('should create instance with URL object', () => {
    const client = new RestClient<TestApiRoutes>(
      new URL('https://api.example.com'),
    )
    expect(client).toBeDefined()
  })

  it('should create instance with empty origin for raw URLs', () => {
    const client = new RestClient<TestApiRoutes>('')
    expect(client).toBeDefined()
  })

  describe('fetch', () => {
    it('should fetch JSON data with path params', async () => {
      const responseData = { id: 1, name: 'Test User' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseData),
      })

      const client = new RestClient<TestApiRoutes>('https://api.example.com')
      const result = await client.fetch('/api/users/:id', { params: { id: 1 } })

      expect(result).toEqual(responseData)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/api/users/1',
        expect.any(Object),
      )
    })

    it('should fetch JSON data with query params', async () => {
      const responseData = [{ id: 1, title: 'Post 1' }]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseData),
      })

      const client = new RestClient<TestApiRoutes>('https://api.example.com')
      const result = await client.fetch('/api/posts', {
        query: { page: 1, limit: 10 },
      })

      expect(result).toEqual(responseData)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1'),
        expect.any(Object),
      )
    })

    it('should fetch without options when not required', async () => {
      const responseData = { success: true }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseData),
      })

      const client = new RestClient<TestApiRoutes>('https://api.example.com')
      const result = await client.fetch('/api/simple')

      expect(result).toEqual(responseData)
    })

    it('should throw NetworkError on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      const client = new RestClient<TestApiRoutes>('https://api.example.com')

      await expect(client.fetch('/api/simple')).rejects.toThrow(NetworkError)
    })

    it('should apply default headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      const client = new RestClient<TestApiRoutes>('https://api.example.com', {
        headers: { Authorization: 'Bearer token' },
      })
      await client.fetch('/api/simple')

      const calledWith = mockFetch.mock.calls[0] as [string, RequestInit]
      const headers = calledWith[1].headers as Record<string, string>
      expect(headers.authorization).toBe('Bearer token')
    })
  })

  describe('fetchRaw', () => {
    it('should fetch raw response for full URL', async () => {
      const mockResponse = { ok: true }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const client = new RestClient<TestApiRoutes>('')
      const result = await client.fetchRaw('https://cdn.example.com/file.bin')

      expect(result).toBe(mockResponse)
    })

    it('should fetch raw response for route path', async () => {
      const mockResponse = { ok: true }
      mockFetch.mockResolvedValueOnce(mockResponse)

      const client = new RestClient<TestApiRoutes>('https://api.example.com')
      const result = await client.fetchRaw('/api/simple')

      expect(result).toBe(mockResponse)
    })
  })

  describe('retry logic', () => {
    it('should retry on failure', async () => {
      // TypeError is what fetch throws for network failures (e.g., DNS, connection refused)
      mockFetch
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })

      const client = new RestClient<TestApiRoutes>('https://api.example.com', {
        retry: 1,
        retryDelay: 10,
      })

      const result = await client.fetch('/api/simple')
      expect(result).toEqual({ success: true })
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should throw after all retries exhausted', async () => {
      // TypeError is what fetch throws for network failures
      mockFetch.mockRejectedValue(new TypeError('Network error'))

      const client = new RestClient<TestApiRoutes>('https://api.example.com', {
        retry: 2,
        retryDelay: 10,
      })

      await expect(client.fetch('/api/simple')).rejects.toThrow()
      expect(mockFetch).toHaveBeenCalledTimes(3) // initial + 2 retries
    })

    it('should not retry on JSON parse errors', async () => {
      // JSON parse errors should NOT be retried (they are not transient)
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new SyntaxError('Invalid JSON')),
      })

      const client = new RestClient<TestApiRoutes>('https://api.example.com', {
        retry: 2,
        retryDelay: 10,
      })

      await expect(client.fetch('/api/simple')).rejects.toThrow(SyntaxError)
      expect(mockFetch).toHaveBeenCalledTimes(1) // no retries
    })
  })

  describe('URL building', () => {
    it('should encode path parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })

      const client = new RestClient<TestApiRoutes>('https://api.example.com')
      await client.fetch('/api/users/:id', { params: { id: 123 } })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/api/users/123',
        expect.any(Object),
      )
    })
  })
})
