import { describe, expect, it } from 'vitest'

import { AssetError } from '@/errors/assets/AssetError'
import { ImageNotFoundError } from '@/errors/assets/ImageNotFoundError'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

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

    it('should set errorCode to GM_ASSETS_IMAGE_NOT_FOUND', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_ASSETS_IMAGE_NOT_FOUND,
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

    it('should set imageFile in context', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.context?.imageFile).toBe('/path/to/image.png')
    })

    it('should set filePath in context', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.context?.filePath).toBe('/path/to/image.png')
    })

    it('should set operation in context', () => {
      const error = new ImageNotFoundError('/path/to/image.png')
      expect(error.context?.operation).toBe('load image')
    })

    it('should accept context parameter', () => {
      const context = { statusCode: 404 }
      const error = new ImageNotFoundError('/path/to/image.png', context)
      expect(error.context?.statusCode).toBe(404)
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
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_ASSETS_IMAGE_NOT_FOUND,
      )
    })
  })
})
