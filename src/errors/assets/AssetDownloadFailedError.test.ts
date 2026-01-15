import { describe, expect, it } from 'vitest'

import { AssetDownloadFailedError } from '@/errors/assets/AssetDownloadFailedError'
import { AssetError } from '@/errors/assets/AssetError'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

describe('AssetDownloadFailedError', () => {
  describe('constructor', () => {
    it('should create error with asset path and type', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error.assetPath).toBe('/path/to/asset.png')
      expect(error.assetType).toBe('image')
    })

    it('should format message without download URL and status code', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error.message).toBe('Failed to download image: /path/to/asset.png')
    })

    it('should format message with download URL', () => {
      const error = new AssetDownloadFailedError(
        '/path/to/asset.png',
        'image',
        'https://example.com/asset.png',
      )
      expect(error.message).toBe(
        'Failed to download image: https://example.com/asset.png',
      )
    })

    it('should format message with status code', () => {
      const error = new AssetDownloadFailedError(
        '/path/to/asset.png',
        'image',
        'https://example.com/asset.png',
        404,
      )
      expect(error.message).toBe(
        'Failed to download image: https://example.com/asset.png (HTTP 404)',
      )
    })

    it('should format message with status code and no download URL', () => {
      const error = new AssetDownloadFailedError(
        '/path/to/asset.png',
        'image',
        undefined,
        500,
      )
      expect(error.message).toBe(
        'Failed to download image: /path/to/asset.png (HTTP 500)',
      )
    })

    it('should set downloadUrl property', () => {
      const error = new AssetDownloadFailedError(
        '/path/to/asset.png',
        'image',
        'https://example.com/asset.png',
      )
      expect(error.downloadUrl).toBe('https://example.com/asset.png')
    })

    it('should have undefined downloadUrl when not provided', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error.downloadUrl).toBeUndefined()
    })

    it('should set statusCode property', () => {
      const error = new AssetDownloadFailedError(
        '/path/to/asset.png',
        'image',
        'https://example.com/asset.png',
        404,
      )
      expect(error.statusCode).toBe(404)
    })

    it('should have undefined statusCode when not provided', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error.statusCode).toBeUndefined()
    })

    it('should set errorCode to GM_ASSETS_DOWNLOAD_FAILED', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_ASSETS_DOWNLOAD_FAILED,
      )
    })

    it('should set name to AssetDownloadFailedError', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error.name).toBe('AssetDownloadFailedError')
    })

    it('should be instance of AssetError', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error).toBeInstanceOf(AssetError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should accept context parameter', () => {
      const context = { operation: 'download' }
      const error = new AssetDownloadFailedError(
        '/path/to/asset.png',
        'image',
        undefined,
        undefined,
        context,
      )
      expect(error.context?.filePath).toBe('/path/to/asset.png')
    })

    it('should merge context with network context when downloadUrl provided', () => {
      const error = new AssetDownloadFailedError(
        '/path/to/asset.png',
        'image',
        'https://example.com/asset.png',
        404,
      )
      expect(error.context?.url).toBe('https://example.com/asset.png')
      expect(error.context?.statusCode).toBe(404)
      expect(error.context?.requestMethod).toBe('GET')
    })

    it('should merge context with asset context', () => {
      const error = new AssetDownloadFailedError('/path/to/asset.png', 'image')
      expect(error.context?.filePath).toBe('/path/to/asset.png')
      expect(error.context?.imageFile).toBe('/path/to/asset.png')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Network error')
      const error = new AssetDownloadFailedError(
        '/path/to/asset.png',
        'image',
        undefined,
        undefined,
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new AssetDownloadFailedError(
        '/path/to/asset.png',
        'image',
        'https://example.com/asset.png',
        404,
      )
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM2003')
      expect(detailed).toContain('Failed to download')
    })

    it('should serialize to JSON', () => {
      const error = new AssetDownloadFailedError(
        '/path/to/asset.png',
        'image',
        'https://example.com/asset.png',
        404,
      )
      const json = error.toJSON()
      expect(json.name).toBe('AssetDownloadFailedError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_ASSETS_DOWNLOAD_FAILED,
      )
    })
  })
})
