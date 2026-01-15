import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { AnnContentNotFoundError } from '@/errors/content/AnnContentNotFoundError'

describe('AnnContentNotFoundError', () => {
  describe('constructor', () => {
    it('should create error with announcement ID', () => {
      const error = new AnnContentNotFoundError('12345')
      expect(error.announcementId).toBe('12345')
    })

    it('should format message correctly', () => {
      const error = new AnnContentNotFoundError('12345')
      expect(error.message).toBe('Announcement content not found: 12345')
    })

    it('should set errorCode to GM_CONTENT_ANN_NOT_FOUND', () => {
      const error = new AnnContentNotFoundError('12345')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_CONTENT_ANN_NOT_FOUND,
      )
    })

    it('should set name to AnnContentNotFoundError', () => {
      const error = new AnnContentNotFoundError('12345')
      expect(error.name).toBe('AnnContentNotFoundError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new AnnContentNotFoundError('12345')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new AnnContentNotFoundError('12345')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new AnnContentNotFoundError('12345')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set propertyKey in context', () => {
      const error = new AnnContentNotFoundError('12345')
      expect(error.context?.propertyKey).toBe('announcementId')
    })

    it('should set actualValue in context', () => {
      const error = new AnnContentNotFoundError('12345')
      expect(error.context?.actualValue).toBe('12345')
    })

    it('should set operation in context', () => {
      const error = new AnnContentNotFoundError('12345')
      expect(error.context?.operation).toBe('fetch announcement content')
    })

    it('should accept context parameter', () => {
      const context = { statusCode: 404 }
      const error = new AnnContentNotFoundError('12345', context)
      expect(error.context?.statusCode).toBe(404)
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new AnnContentNotFoundError('12345', undefined, cause)
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new AnnContentNotFoundError('12345')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM6001')
      expect(detailed).toContain('Announcement content not found')
    })

    it('should serialize to JSON', () => {
      const error = new AnnContentNotFoundError('12345')
      const json = error.toJSON()
      expect(json.name).toBe('AnnContentNotFoundError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_CONTENT_ANN_NOT_FOUND,
      )
    })
  })
})
