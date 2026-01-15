import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { EnkaNetworkStatusError } from '@/errors/network/EnkaNetworkStatusError'
import { NetworkError } from '@/errors/network/NetworkError'

describe('EnkaNetworkStatusError', () => {
  describe('constructor', () => {
    it('should create error with message and statusType', () => {
      const error = new EnkaNetworkStatusError(
        'Service unavailable',
        'unavailable',
      )
      expect(error.message).toBe('Service unavailable')
      expect(error.statusType).toBe('unavailable')
    })

    it('should set statusType to maintenance', () => {
      const error = new EnkaNetworkStatusError('Maintenance', 'maintenance')
      expect(error.statusType).toBe('maintenance')
    })

    it('should set statusType to rate_limit', () => {
      const error = new EnkaNetworkStatusError('Rate limited', 'rate_limit')
      expect(error.statusType).toBe('rate_limit')
    })

    it('should set url property', () => {
      const error = new EnkaNetworkStatusError(
        'Service unavailable',
        'unavailable',
        'https://enka.network/api',
      )
      expect(error.url).toBe('https://enka.network/api')
    })

    it('should set statusCode property', () => {
      const error = new EnkaNetworkStatusError(
        'Service unavailable',
        'unavailable',
        undefined,
        503,
      )
      expect(error.statusCode).toBe(503)
    })

    it('should set retryAfter property', () => {
      const error = new EnkaNetworkStatusError(
        'Rate limited',
        'rate_limit',
        undefined,
        429,
        60,
      )
      expect(error.retryAfter).toBe(60)
    })

    it('should set errorCode to GM_NETWORK_ENKA_STATUS_ERROR', () => {
      const error = new EnkaNetworkStatusError('Error', 'unavailable')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_NETWORK_ENKA_STATUS_ERROR,
      )
    })

    it('should set name to EnkaNetworkStatusError', () => {
      const error = new EnkaNetworkStatusError('Error', 'unavailable')
      expect(error.name).toBe('EnkaNetworkStatusError')
    })

    it('should be instance of NetworkError', () => {
      const error = new EnkaNetworkStatusError('Error', 'unavailable')
      expect(error).toBeInstanceOf(NetworkError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new EnkaNetworkStatusError('Error', 'unavailable')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new EnkaNetworkStatusError('Error', 'unavailable')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new EnkaNetworkStatusError('Error', 'unavailable')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should accept context parameter', () => {
      const context = { metadata: { attempt: 1 } }
      const error = new EnkaNetworkStatusError(
        'Error',
        'unavailable',
        undefined,
        undefined,
        undefined,
        context,
      )
      expect(error.context?.metadata?.attempt).toBe(1)
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new EnkaNetworkStatusError(
        'Error',
        'unavailable',
        undefined,
        undefined,
        undefined,
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('createRateLimitError', () => {
    it('should create rate limit error with retryAfter', () => {
      const error = EnkaNetworkStatusError.createRateLimitError(60)
      expect(error.statusType).toBe('rate_limit')
      expect(error.retryAfter).toBe(60)
      expect(error.statusCode).toBe(429)
    })

    it('should format message with retry time', () => {
      const error = EnkaNetworkStatusError.createRateLimitError(30)
      expect(error.message).toContain('30')
      expect(error.message).toContain('seconds')
    })

    it('should set url when provided', () => {
      const error = EnkaNetworkStatusError.createRateLimitError(
        60,
        'https://enka.network/api',
      )
      expect(error.url).toBe('https://enka.network/api')
    })

    it('should accept context parameter', () => {
      const context = { metadata: { attempt: 3 } }
      const error = EnkaNetworkStatusError.createRateLimitError(
        60,
        undefined,
        context,
      )
      expect(error.context?.metadata?.attempt).toBe(3)
    })
  })

  describe('createMaintenanceError', () => {
    it('should create maintenance error', () => {
      const error = EnkaNetworkStatusError.createMaintenanceError()
      expect(error.statusType).toBe('maintenance')
      expect(error.statusCode).toBe(503)
    })

    it('should format message correctly', () => {
      const error = EnkaNetworkStatusError.createMaintenanceError()
      expect(error.message).toContain('maintenance')
    })

    it('should set url when provided', () => {
      const error = EnkaNetworkStatusError.createMaintenanceError(
        'https://enka.network/api',
      )
      expect(error.url).toBe('https://enka.network/api')
    })

    it('should accept context parameter', () => {
      const context = { metadata: { attempt: 1 } }
      const error = EnkaNetworkStatusError.createMaintenanceError(
        undefined,
        context,
      )
      expect(error.context?.metadata?.attempt).toBe(1)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new EnkaNetworkStatusError('Error', 'unavailable')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM4004')
      expect(detailed).toContain('Error')
    })

    it('should serialize to JSON', () => {
      const error = new EnkaNetworkStatusError('Error', 'unavailable')
      const json = error.toJSON()
      expect(json.name).toBe('EnkaNetworkStatusError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_NETWORK_ENKA_STATUS_ERROR,
      )
    })
  })
})
