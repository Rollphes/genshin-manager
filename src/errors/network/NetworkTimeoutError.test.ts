import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { NetworkError } from '@/errors/network/NetworkError'
import { NetworkTimeoutError } from '@/errors/network/NetworkTimeoutError'

describe('NetworkTimeoutError', () => {
  describe('constructor', () => {
    it('should create error with url and timeout', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      expect(error.url).toBe('https://example.com/api')
      expect(error.timeout).toBe(5000)
    })

    it('should format message correctly', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      expect(error.message).toBe(
        'Network request timed out after 5000ms: https://example.com/api',
      )
    })

    it('should set method property with default GET', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      expect(error.method).toBe('GET')
    })

    it('should set custom method property', () => {
      const error = new NetworkTimeoutError(
        'https://example.com/api',
        5000,
        'POST',
      )
      expect(error.method).toBe('POST')
    })

    it('should set errorCode to GM_NETWORK_TIMEOUT', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GM_NETWORK_TIMEOUT)
    })

    it('should set name to NetworkTimeoutError', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      expect(error.name).toBe('NetworkTimeoutError')
    })

    it('should be instance of NetworkError', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      expect(error).toBeInstanceOf(NetworkError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set url in context', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      expect(error.context?.url).toBe('https://example.com/api')
    })

    it('should accept context parameter', () => {
      const context = { attempt: 3 }
      const error = new NetworkTimeoutError(
        'https://example.com/api',
        5000,
        'GET',
        context,
      )
      expect(error.context?.attempt).toBe(3)
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original timeout error')
      const error = new NetworkTimeoutError(
        'https://example.com/api',
        5000,
        'GET',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM4001')
      expect(detailed).toContain('timed out')
    })

    it('should serialize to JSON', () => {
      const error = new NetworkTimeoutError('https://example.com/api', 5000)
      const json = error.toJSON()
      expect(json.name).toBe('NetworkTimeoutError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GM_NETWORK_TIMEOUT)
    })
  })
})
