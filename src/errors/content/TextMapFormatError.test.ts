import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { TextMapFormatError } from '@/errors/content/TextMapFormatError'

describe('TextMapFormatError', () => {
  describe('constructor', () => {
    it('should create error with text map key and format', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error.textMapKey).toBe('key123')
      expect(error.expectedFormat).toBe('string')
    })

    it('should format message correctly', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error.message).toBe(
        "Invalid text map format for 'key123': expected string, got 123",
      )
    })

    it('should format message with object actual value', () => {
      const error = new TextMapFormatError('key123', 'string', {
        invalid: true,
      })
      expect(error.message).toBe(
        "Invalid text map format for 'key123': expected string, got [object Object]",
      )
    })

    it('should set errorCode to GM_CONTENT_TEXT_MAP_FORMAT', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_CONTENT_TEXT_MAP_FORMAT,
      )
    })

    it('should set name to TextMapFormatError', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error.name).toBe('TextMapFormatError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set propertyKey in context', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error.context?.propertyKey).toBe('key123')
    })

    it('should set expectedValue in context', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error.context?.expectedValue).toBe('string')
    })

    it('should set actualValue in context', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error.context?.actualValue).toBe(123)
    })

    it('should set operation in context', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      expect(error.context?.operation).toBe('parse text map')
    })

    it('should accept context parameter', () => {
      const context = { filePath: '/text-map.json' }
      const error = new TextMapFormatError('key123', 'string', 123, context)
      expect(error.context?.filePath).toBe('/text-map.json')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new TextMapFormatError(
        'key123',
        'string',
        123,
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM6003')
      expect(detailed).toContain('Invalid text map format')
    })

    it('should serialize to JSON', () => {
      const error = new TextMapFormatError('key123', 'string', 123)
      const json = error.toJSON()
      expect(json.name).toBe('TextMapFormatError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_CONTENT_TEXT_MAP_FORMAT,
      )
    })
  })
})
