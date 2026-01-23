import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/domain/errors/base/GenshinManagerError'
import { AssetError } from '@/infrastructure/errors/AssetError'
import { AssetNotFoundError } from '@/infrastructure/errors/AssetNotFoundError'

describe('AssetNotFoundError', () => {
  describe('constructor', () => {
    it('should create error with asset path', () => {
      const error = new AssetNotFoundError('/path/to/asset.png')
      expect(error.assetPath).toBe('/path/to/asset.png')
    })

    it('should set default assetType to "asset"', () => {
      const error = new AssetNotFoundError('/path/to/asset.png')
      expect(error.assetType).toBe('asset')
    })

    it('should set custom assetType', () => {
      const error = new AssetNotFoundError('/path/to/file.json', 'config')
      expect(error.assetType).toBe('config')
    })

    it('should format message with capitalized asset type', () => {
      const error = new AssetNotFoundError('/path/to/asset.png', 'image')
      expect(error.message).toBe('Image not found: /path/to/asset.png')
    })

    it('should format message with default asset type', () => {
      const error = new AssetNotFoundError('/path/to/asset.png')
      expect(error.message).toBe('Asset not found: /path/to/asset.png')
    })

    it('should set errorCode to GmAssetsNotFound', () => {
      const error = new AssetNotFoundError('/path/to/asset.png')
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GmAssetsNotFound)
    })

    it('should set name to AssetNotFoundError', () => {
      const error = new AssetNotFoundError('/path/to/asset.png')
      expect(error.name).toBe('AssetNotFoundError')
    })

    it('should be instance of AssetError', () => {
      const error = new AssetNotFoundError('/path/to/asset.png')
      expect(error).toBeInstanceOf(AssetError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new AssetNotFoundError('/path/to/asset.png')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new AssetNotFoundError('/path/to/asset.png')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new AssetNotFoundError('/path/to/asset.png')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should accept context parameter with source info', () => {
      const error = new AssetNotFoundError('/path/to/asset.png', 'image', {
        source: 'ImageAssets',
        recordId: 404,
      })
      expect(error.source).toBe('ImageAssets')
      expect(error.recordId).toBe(404)
    })

    it('should include source in message when provided', () => {
      const error = new AssetNotFoundError('/path/to/asset.png', 'image', {
        source: 'ImageAssets',
        recordId: 404,
      })
      expect(error.message).toContain('[ImageAssets#404]')
    })

    it('should set operation in context', () => {
      const error = new AssetNotFoundError('/path/to/asset.png', 'image', {
        operation: 'load',
      })
      expect(error.operation).toBe('load')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new AssetNotFoundError(
        '/path/to/asset.png',
        'image',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new AssetNotFoundError('/path/to/asset.png', 'image')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM2001')
      expect(detailed).toContain('Image not found')
    })

    it('should serialize to JSON', () => {
      const error = new AssetNotFoundError('/path/to/asset.png', 'image')
      const json = error.toJSON()
      expect(json.name).toBe('AssetNotFoundError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GmAssetsNotFound)
    })
  })
})
