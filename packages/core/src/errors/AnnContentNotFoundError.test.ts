import { describe, expect, it } from 'vitest'

import { AnnContentNotFoundError } from '@/errors/AnnContentNotFoundError'
import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

describe('AnnContentNotFoundError', () => {
  describe('Basic properties', () => {
    it('should have GmAnnNotFound error code', () => {
      const error = new AnnContentNotFoundError('ann123')
      expect(error.errorCode).toBe(ErrorCode.GmAnnNotFound)
    })

    it('should be an instance of GenshinManagerError', () => {
      const error = new AnnContentNotFoundError('ann123')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should have correct name', () => {
      const error = new AnnContentNotFoundError('ann123')
      expect(error.name).toBe('AnnContentNotFoundError')
    })

    it('should have announcementId property', () => {
      const error = new AnnContentNotFoundError('ann123')
      expect(error.announcementId).toBe('ann123')
    })

    it('should have correct message format', () => {
      const error = new AnnContentNotFoundError('ann123')
      expect(error.message).toBe('Announcement content not found: ann123')
    })
  })

  describe('Error chaining', () => {
    it('should support cause option', () => {
      const cause = new Error('original')
      const error = new AnnContentNotFoundError('ann123', { cause })
      expect(error.cause).toBe(cause)
    })
  })
})
