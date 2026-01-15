import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { BodyNotFoundError } from '@/errors/content/BodyNotFoundError'

describe('BodyNotFoundError', () => {
  describe('constructor', () => {
    it('should create error with content type', () => {
      const error = new BodyNotFoundError('announcement')
      expect(error.contentType).toBe('announcement')
    })

    it('should format message correctly', () => {
      const error = new BodyNotFoundError('announcement')
      expect(error.message).toBe('Body content not found for: announcement')
    })

    it('should set errorCode to GM_CONTENT_BODY_NOT_FOUND', () => {
      const error = new BodyNotFoundError('announcement')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_CONTENT_BODY_NOT_FOUND,
      )
    })

    it('should set name to BodyNotFoundError', () => {
      const error = new BodyNotFoundError('announcement')
      expect(error.name).toBe('BodyNotFoundError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new BodyNotFoundError('announcement')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new BodyNotFoundError('announcement')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new BodyNotFoundError('announcement')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set propertyKey in context', () => {
      const error = new BodyNotFoundError('announcement')
      expect(error.context?.propertyKey).toBe('contentType')
    })

    it('should set actualValue in context', () => {
      const error = new BodyNotFoundError('announcement')
      expect(error.context?.actualValue).toBe('announcement')
    })

    it('should set operation in context', () => {
      const error = new BodyNotFoundError('announcement')
      expect(error.context?.operation).toBe('fetch body content')
    })

    it('should accept context parameter', () => {
      const context = { statusCode: 404 }
      const error = new BodyNotFoundError('announcement', context)
      expect(error.context?.statusCode).toBe(404)
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new BodyNotFoundError('announcement', undefined, cause)
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new BodyNotFoundError('announcement')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM6002')
      expect(detailed).toContain('Body content not found')
    })

    it('should serialize to JSON', () => {
      const error = new BodyNotFoundError('announcement')
      const json = error.toJSON()
      expect(json.name).toBe('BodyNotFoundError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_CONTENT_BODY_NOT_FOUND,
      )
    })
  })
})
