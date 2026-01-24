import { describe, expect, it } from 'vitest'

import { AssetError } from '@/adapter/input/errors/AssetError'
import { AudioNotFoundError } from '@/adapter/input/errors/AudioNotFoundError'
import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/domain/errors/base/GenshinManagerError'

describe('AudioNotFoundError', () => {
  describe('constructor', () => {
    it('should create error with audio path', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.assetPath).toBe('/path/to/audio.mp3')
    })

    it('should set assetType to "audio"', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.assetType).toBe('audio')
    })

    it('should format message correctly', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.message).toBe('Audio not found: /path/to/audio.mp3')
    })

    it('should set errorCode to GmAssetsAudioNotFound', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GmAssetsAudioNotFound,
      )
    })

    it('should set name to AudioNotFoundError', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.name).toBe('AudioNotFoundError')
    })

    it('should be instance of AssetError', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error).toBeInstanceOf(AssetError)
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should accept context parameter with source info', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3', {
        source: 'AudioAssets',
        recordId: 'voice_line',
      })
      expect(error.source).toBe('AudioAssets')
      expect(error.recordId).toBe('voice_line')
    })

    it('should include source in message when provided', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3', {
        source: 'AudioAssets',
        recordId: 'voice_line',
      })
      expect(error.message).toContain('[AudioAssets#voice_line]')
    })

    it('should set operation in context', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3', {
        operation: 'fetch',
      })
      expect(error.operation).toBe('fetch')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new AudioNotFoundError(
        '/path/to/audio.mp3',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM2004')
      expect(detailed).toContain('Audio not found')
    })

    it('should serialize to JSON', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      const json = error.toJSON()
      expect(json.name).toBe('AudioNotFoundError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GmAssetsAudioNotFound)
    })
  })
})
