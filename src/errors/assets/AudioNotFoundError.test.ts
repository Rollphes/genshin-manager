import { describe, expect, it } from 'vitest'

import { AssetError } from '@/errors/assets/AssetError'
import { AudioNotFoundError } from '@/errors/assets/AudioNotFoundError'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

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

    it('should set errorCode to GM_ASSETS_AUDIO_NOT_FOUND', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_ASSETS_AUDIO_NOT_FOUND,
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

    it('should set audioFile in context', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.context?.audioFile).toBe('/path/to/audio.mp3')
    })

    it('should set filePath in context', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.context?.filePath).toBe('/path/to/audio.mp3')
    })

    it('should set operation in context', () => {
      const error = new AudioNotFoundError('/path/to/audio.mp3')
      expect(error.context?.operation).toBe('load audio')
    })

    it('should accept context parameter', () => {
      const context = { statusCode: 404 }
      const error = new AudioNotFoundError('/path/to/audio.mp3', context)
      expect(error.context?.statusCode).toBe(404)
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
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_ASSETS_AUDIO_NOT_FOUND,
      )
    })
  })
})
