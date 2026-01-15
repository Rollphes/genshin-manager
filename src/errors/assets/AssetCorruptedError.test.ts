import { describe, expect, it } from 'vitest'

import { AssetCorruptedError } from '@/errors/assets/AssetCorruptedError'
import { AssetError } from '@/errors/assets/AssetError'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

describe('AssetCorruptedError', () => {
  describe('constructor', () => {
    it('should create error with asset path and type', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error.assetPath).toBe('/path/to/asset.png')
      expect(error.assetType).toBe('image')
    })

    it('should format message without corruption details', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error.message).toBe('Image is corrupted: /path/to/asset.png')
    })

    it('should format message with corruption details', () => {
      const error = new AssetCorruptedError(
        '/path/to/asset.png',
        'image',
        'invalid header',
      )
      expect(error.message).toBe(
        'Image is corrupted: /path/to/asset.png (invalid header)',
      )
    })

    it('should set corruptionDetails property', () => {
      const error = new AssetCorruptedError(
        '/path/to/asset.png',
        'image',
        'checksum mismatch',
      )
      expect(error.corruptionDetails).toBe('checksum mismatch')
    })

    it('should have undefined corruptionDetails when not provided', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error.corruptionDetails).toBeUndefined()
    })

    it('should set errorCode to GM_ASSETS_CORRUPTED', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GM_ASSETS_CORRUPTED)
    })

    it('should set name to AssetCorruptedError', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error.name).toBe('AssetCorruptedError')
    })

    it('should be instance of AssetError', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error).toBeInstanceOf(AssetError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should accept context parameter', () => {
      const context = { statusCode: 500 }
      const error = new AssetCorruptedError(
        '/path/to/asset.png',
        'image',
        undefined,
        context,
      )
      expect(error.context?.statusCode).toBe(500)
    })

    it('should merge context with asset context', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error.context?.filePath).toBe('/path/to/asset.png')
      expect(error.context?.imageFile).toBe('/path/to/asset.png')
    })

    it('should set audioFile in context for audio type', () => {
      const error = new AssetCorruptedError('/path/to/audio.mp3', 'audio')
      expect(error.context?.audioFile).toBe('/path/to/audio.mp3')
    })

    it('should set operation in context', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'image')
      expect(error.context?.operation).toBe('load image')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new AssetCorruptedError(
        '/path/to/asset.png',
        'image',
        'invalid',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new AssetCorruptedError(
        '/path/to/asset.png',
        'image',
        'invalid header',
      )
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM2002')
      expect(detailed).toContain('Image is corrupted')
    })

    it('should serialize to JSON', () => {
      const error = new AssetCorruptedError(
        '/path/to/asset.png',
        'image',
        'checksum mismatch',
      )
      const json = error.toJSON()
      expect(json.name).toBe('AssetCorruptedError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GM_ASSETS_CORRUPTED)
    })
  })
})
