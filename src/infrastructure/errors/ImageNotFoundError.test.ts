import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/domain/errors/base/GenshinManagerError'
import { AssetError } from '@/infrastructure/errors/AssetError'
import { ImageNotFoundError } from '@/infrastructure/errors/ImageNotFoundError'

describe('ImageNotFoundError', () => {
  describe('constructor', () => {
    it('should create error with image path', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.assetPath).toBe('/path/to/image.png')
    })

    it('should set assetType to "image"', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.assetType).toBe('image')
    })

    it('should format message correctly', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.message).toBe('Image not found: /path/to/image.png')
    })

    it('should set errorCode to GmAssetsImageNotFound', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GmAssetsImageNotFound,
      )
    })

    it('should set name to ImageNotFoundError', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.name).toBe('ImageNotFoundError')
    })

    it('should be instance of AssetError', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error).toBeInstanceOf(AssetError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should accept context parameter with source info', () => {
      const error = new ImageNotFoundError('/path/to/image.png', {
        source: 'ImageAssets',
        recordId: 'character_icon',
      })
      expect(error.source).toBe('ImageAssets')
      expect(error.recordId).toBe('character_icon')
    })

    it('should include source in message when provided', () => {
      const error = new ImageNotFoundError('/path/to/image.png', {
        source: 'ImageAssets',
        recordId: 'character_icon',
      })
      expect(error.message).toContain('[ImageAssets#character_icon]')
    })

    it('should set operation in context', () => {
      const error = new ImageNotFoundError('/path/to/image.png', {
        operation: 'fetch',
      })
      expect(error.operation).toBe('fetch')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new ImageNotFoundError(
        '/path/to/image.png',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM2005')
      expect(detailed).toContain('Image not found')
    })

    it('should serialize to JSON', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      const json = error.toJSON()
      expect(json.name).toBe('ImageNotFoundError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GmAssetsImageNotFound)
    })
  })
})
