import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { EnkaNetworkError } from '@/errors/network/EnkaNetworkError'
import { NetworkError } from '@/errors/network/NetworkError'

describe('EnkaNetworkError', () => {
  describe('constructor', () => {
    it('should create error with message', () => {
      const error = new EnkaNetworkError('API error')
      expect(error.message).toBe('API error')
    })

    it('should set url property', () => {
      const error = new EnkaNetworkError(
        'API error',
        'https://enka.network/api/uid/12345',
      )
      expect(error.url).toBe('https://enka.network/api/uid/12345')
    })

    it('should set statusCode property', () => {
      const error = new EnkaNetworkError('API error', undefined, 500)
      expect(error.statusCode).toBe(500)
    })

    it('should set enkaErrorCode property', () => {
      const error = new EnkaNetworkError(
        'API error',
        undefined,
        400,
        'INVALID_UID',
      )
      expect(error.enkaErrorCode).toBe('INVALID_UID')
    })

    it('should set method property with default GET', () => {
      const error = new EnkaNetworkError('API error')
      expect(error.method).toBe('GET')
    })

    it('should set custom method property', () => {
      const error = new EnkaNetworkError(
        'API error',
        'https://enka.network/api',
        200,
        undefined,
        'POST',
      )
      expect(error.method).toBe('POST')
    })

    it('should set errorCode to GM_NETWORK_ENKA_ERROR', () => {
      const error = new EnkaNetworkError('API error')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_NETWORK_ENKA_ERROR,
      )
    })

    it('should set name to EnkaNetworkError', () => {
      const error = new EnkaNetworkError('API error')
      expect(error.name).toBe('EnkaNetworkError')
    })

    it('should be instance of NetworkError', () => {
      const error = new EnkaNetworkError('API error')
      expect(error).toBeInstanceOf(NetworkError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new EnkaNetworkError('API error')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new EnkaNetworkError('API error')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new EnkaNetworkError('API error')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set url in context when provided', () => {
      const error = new EnkaNetworkError(
        'API error',
        'https://enka.network/api',
      )
      expect(error.context?.url).toBe('https://enka.network/api')
    })

    it('should accept context parameter', () => {
      const context = { attempt: 1 }
      const error = new EnkaNetworkError(
        'API error',
        'https://enka.network/api',
        500,
        undefined,
        'GET',
        context,
      )
      expect(error.context?.attempt).toBe(1)
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new EnkaNetworkError(
        'API error',
        undefined,
        undefined,
        undefined,
        'GET',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('fromResponse', () => {
    it('should create error from Response object', () => {
      const mockResponse = {
        url: 'https://enka.network/api/uid/12345',
        status: 404,
        statusText: 'Not Found',
      } as Response

      const error = EnkaNetworkError.fromResponse(mockResponse)
      expect(error.url).toBe('https://enka.network/api/uid/12345')
      expect(error.statusCode).toBe(404)
      expect(error.message).toContain('404')
      expect(error.message).toContain('Not Found')
    })

    it('should extract message from response body', () => {
      const mockResponse = {
        url: 'https://enka.network/api/uid/12345',
        status: 400,
        statusText: 'Bad Request',
      } as Response

      const responseBody = { message: 'Invalid UID format' }
      const error = EnkaNetworkError.fromResponse(mockResponse, responseBody)
      expect(error.message).toBe('Invalid UID format')
    })

    it('should extract enkaErrorCode from response body', () => {
      const mockResponse = {
        url: 'https://enka.network/api/uid/12345',
        status: 400,
        statusText: 'Bad Request',
      } as Response

      const responseBody = { error: 'INVALID_UID' }
      const error = EnkaNetworkError.fromResponse(mockResponse, responseBody)
      expect(error.enkaErrorCode).toBe('INVALID_UID')
    })

    it('should accept context parameter', () => {
      const mockResponse = {
        url: 'https://enka.network/api',
        status: 500,
        statusText: 'Internal Server Error',
      } as Response

      const context = { attempt: 3 }
      const error = EnkaNetworkError.fromResponse(
        mockResponse,
        undefined,
        context,
      )
      expect(error.context?.attempt).toBe(3)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new EnkaNetworkError(
        'API error',
        'https://enka.network/api',
      )
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM4003')
      expect(detailed).toContain('API error')
    })

    it('should serialize to JSON', () => {
      const error = new EnkaNetworkError('API error')
      const json = error.toJSON()
      expect(json.name).toBe('EnkaNetworkError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GM_NETWORK_ENKA_ERROR)
    })
  })
})
