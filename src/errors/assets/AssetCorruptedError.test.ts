import { describe, expect, it } from 'vitest'

import { AssetCorruptedError } from '@/errors/assets/AssetCorruptedError'
import { AssetError } from '@/errors/assets/AssetError'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

describe('AssetCorruptedError', () => {
  describe('constructor', () => {
    it('should create error with asset path', () => {
      const error = new AssetCorruptedError('/path/to/asset.png')
      expect(error.assetPath).toBe('/path/to/asset.png')
      expect(error.assetType).toBe('corrupted')
    })

    it('should format message without corruption details', () => {
      const error = new AssetCorruptedError('/path/to/asset.png')
      expect(error.message).toBe('Asset is corrupted: /path/to/asset.png')
    })

    it('should format message with corruption details', () => {
      const error = new AssetCorruptedError(
        '/path/to/asset.png',
        'invalid header',
      )
      expect(error.message).toBe(
        'Asset is corrupted: /path/to/asset.png (invalid header)',
      )
    })

    it('should set corruptionDetails property', () => {
      const error = new AssetCorruptedError(
        '/path/to/asset.png',
        'checksum mismatch',
      )
      expect(error.corruptionDetails).toBe('checksum mismatch')
    })

    it('should have undefined corruptionDetails when not provided', () => {
      const error = new AssetCorruptedError('/path/to/asset.png')
      expect(error.corruptionDetails).toBeUndefined()
    })

    it('should set errorCode to GmAssetsCorrupted', () => {
      const error = new AssetCorruptedError('/path/to/asset.png')
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GmAssetsCorrupted)
    })

    it('should set name to AssetCorruptedError', () => {
      const error = new AssetCorruptedError('/path/to/asset.png')
      expect(error.name).toBe('AssetCorruptedError')
    })

    it('should be instance of AssetError', () => {
      const error = new AssetCorruptedError('/path/to/asset.png')
      expect(error).toBeInstanceOf(AssetError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new AssetCorruptedError('/path/to/asset.png')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new AssetCorruptedError('/path/to/asset.png')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new AssetCorruptedError('/path/to/asset.png')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should accept context parameter with source info', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'invalid', {
        source: 'ExcelBinOutput',
        recordId: 123,
      })
      expect(error.source).toBe('ExcelBinOutput')
      expect(error.recordId).toBe(123)
    })

    it('should include source in message when provided', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', undefined, {
        source: 'ExcelBinOutput',
        recordId: 123,
      })
      expect(error.message).toContain('[ExcelBinOutput#123]')
    })

    it('should set operation in context', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', undefined, {
        operation: 'parse',
      })
      expect(error.operation).toBe('parse')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new AssetCorruptedError(
        '/path/to/asset.png',
        'invalid',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new AssetCorruptedError('/path/to/asset.png', 'invalid')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM2002')
      expect(detailed).toContain('corrupted')
    })

    it('should serialize to JSON', () => {
      const error = new AssetCorruptedError(
        '/path/to/asset.png',
        'checksum mismatch',
      )
      const json = error.toJSON()
      expect(json.name).toBe('AssetCorruptedError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GmAssetsCorrupted)
    })
  })
})
