import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { NetworkError } from '@/errors/network/NetworkError'
import { NetworkUnavailableError } from '@/errors/network/NetworkUnavailableError'

describe('NetworkUnavailableError', () => {
  describe('constructor', () => {
    it('should create error without url', () => {
      const error = new NetworkUnavailableError()
      expect(error.message).toBe('Network is unavailable')
    })

    it('should create error with url', () => {
      const error = new NetworkUnavailableError('https://example.com/api')
      expect(error.message).toBe(
        'Network is unavailable: https://example.com/api',
      )
    })

    it('should set url property', () => {
      const error = new NetworkUnavailableError('https://example.com/api')
      expect(error.url).toBe('https://example.com/api')
    })

    it('should set method property with default GET', () => {
      const error = new NetworkUnavailableError()
      expect(error.method).toBe('GET')
    })

    it('should set custom method property', () => {
      const error = new NetworkUnavailableError(
        'https://example.com/api',
        'POST',
      )
      expect(error.method).toBe('POST')
    })

    it('should set errorCode to GM_NETWORK_UNAVAILABLE', () => {
      const error = new NetworkUnavailableError()
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_NETWORK_UNAVAILABLE,
      )
    })

    it('should set name to NetworkUnavailableError', () => {
      const error = new NetworkUnavailableError()
      expect(error.name).toBe('NetworkUnavailableError')
    })

    it('should be instance of NetworkError', () => {
      const error = new NetworkUnavailableError()
      expect(error).toBeInstanceOf(NetworkError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new NetworkUnavailableError()
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new NetworkUnavailableError()
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new NetworkUnavailableError()
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set url in context when provided', () => {
      const error = new NetworkUnavailableError('https://example.com/api')
      expect(error.context?.url).toBe('https://example.com/api')
    })

    it('should accept context parameter', () => {
      const context = { metadata: { attempt: 3 } }
      const error = new NetworkUnavailableError(
        'https://example.com/api',
        'GET',
        context,
      )
      expect(error.context?.metadata?.attempt).toBe(3)
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original network error')
      const error = new NetworkUnavailableError(
        undefined,
        'GET',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new NetworkUnavailableError()
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM4002')
      expect(detailed).toContain('unavailable')
    })

    it('should serialize to JSON', () => {
      const error = new NetworkUnavailableError()
      const json = error.toJSON()
      expect(json.name).toBe('NetworkUnavailableError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_NETWORK_UNAVAILABLE,
      )
    })
  })
})
