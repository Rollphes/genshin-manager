import { describe, expect, it } from 'vitest'

import { AssetCorruptedError } from '@/errors/assets/AssetCorruptedError'
import { AssetDownloadFailedError } from '@/errors/assets/AssetDownloadFailedError'
import { AssetErrorFactory } from '@/errors/assets/AssetErrorFactory'
import { AssetNotFoundError } from '@/errors/assets/AssetNotFoundError'
import { AudioNotFoundError } from '@/errors/assets/AudioNotFoundError'
import { ImageNotFoundError } from '@/errors/assets/ImageNotFoundError'

describe('AssetErrorFactory', () => {
  describe('createFromFailure', () => {
    describe('not_found', () => {
      it('should create AssetNotFoundError', () => {
        const error = AssetErrorFactory.createFromFailure(
          '/path/to/asset',
          'config',
          'not_found',
        )
        expect(error).toBeInstanceOf(AssetNotFoundError)
      })

      it('should set assetPath', () => {
        const error = AssetErrorFactory.createFromFailure(
          '/path/to/asset',
          'config',
          'not_found',
        )
        expect(error.assetPath).toBe('/path/to/asset')
      })

      it('should set assetType', () => {
        const error = AssetErrorFactory.createFromFailure(
          '/path/to/asset',
          'config',
          'not_found',
        )
        expect(error.assetType).toBe('config')
      })

      it('should pass context', () => {
        const error = AssetErrorFactory.createFromFailure(
          '/path/to/asset',
          'config',
          'not_found',
          { context: { statusCode: 404 } },
        )
        expect(error.context?.statusCode).toBe(404)
      })

      it('should pass cause', () => {
        const cause = new Error('Original error')
        const error = AssetErrorFactory.createFromFailure(
          '/path/to/asset',
          'config',
          'not_found',
          { cause },
        )
        expect(error.cause).toBe(cause)
      })
    })

    describe('corrupted', () => {
      it('should create AssetCorruptedError', () => {
        const error = AssetErrorFactory.createFromFailure(
          '/path/to/asset',
          'data',
          'corrupted',
        )
        expect(error).toBeInstanceOf(AssetCorruptedError)
      })

      it('should pass corruptionDetails', () => {
        const error = AssetErrorFactory.createFromFailure(
          '/path/to/asset',
          'data',
          'corrupted',
          { corruptionDetails: 'invalid checksum' },
        ) as AssetCorruptedError
        expect(error.corruptionDetails).toBe('invalid checksum')
      })
    })

    describe('download_failed', () => {
      it('should create AssetDownloadFailedError', () => {
        const error = AssetErrorFactory.createFromFailure(
          '/path/to/asset',
          'data',
          'download_failed',
        )
        expect(error).toBeInstanceOf(AssetDownloadFailedError)
      })

      it('should pass downloadUrl', () => {
        const error = AssetErrorFactory.createFromFailure(
          '/path/to/asset',
          'data',
          'download_failed',
          { downloadUrl: 'https://example.com/asset' },
        ) as AssetDownloadFailedError
        expect(error.downloadUrl).toBe('https://example.com/asset')
      })

      it('should pass statusCode', () => {
        const error = AssetErrorFactory.createFromFailure(
          '/path/to/asset',
          'data',
          'download_failed',
          { statusCode: 503 },
        ) as AssetDownloadFailedError
        expect(error.statusCode).toBe(503)
      })
    })
  })

  describe('createImageError', () => {
    describe('not_found', () => {
      it('should create ImageNotFoundError', () => {
        const error = AssetErrorFactory.createImageError(
          '/path/to/image.png',
          'not_found',
        )
        expect(error).toBeInstanceOf(ImageNotFoundError)
      })

      it('should set assetType to image', () => {
        const error = AssetErrorFactory.createImageError(
          '/path/to/image.png',
          'not_found',
        )
        expect(error.assetType).toBe('image')
      })

      it('should pass context', () => {
        const error = AssetErrorFactory.createImageError(
          '/path/to/image.png',
          'not_found',
          { context: { operation: 'load' } },
        )
        expect(error.context?.filePath).toBe('/path/to/image.png')
      })

      it('should pass cause', () => {
        const cause = new Error('Original error')
        const error = AssetErrorFactory.createImageError(
          '/path/to/image.png',
          'not_found',
          { cause },
        )
        expect(error.cause).toBe(cause)
      })
    })

    describe('corrupted', () => {
      it('should create AssetCorruptedError with image type', () => {
        const error = AssetErrorFactory.createImageError(
          '/path/to/image.png',
          'corrupted',
        )
        expect(error).toBeInstanceOf(AssetCorruptedError)
        expect(error.assetType).toBe('image')
      })

      it('should pass corruptionDetails', () => {
        const error = AssetErrorFactory.createImageError(
          '/path/to/image.png',
          'corrupted',
          { corruptionDetails: 'invalid header' },
        ) as AssetCorruptedError
        expect(error.corruptionDetails).toBe('invalid header')
      })
    })

    describe('download_failed', () => {
      it('should create AssetDownloadFailedError with image type', () => {
        const error = AssetErrorFactory.createImageError(
          '/path/to/image.png',
          'download_failed',
        )
        expect(error).toBeInstanceOf(AssetDownloadFailedError)
        expect(error.assetType).toBe('image')
      })

      it('should pass downloadUrl and statusCode', () => {
        const error = AssetErrorFactory.createImageError(
          '/path/to/image.png',
          'download_failed',
          { downloadUrl: 'https://example.com/image.png', statusCode: 404 },
        ) as AssetDownloadFailedError
        expect(error.downloadUrl).toBe('https://example.com/image.png')
        expect(error.statusCode).toBe(404)
      })
    })
  })

  describe('createAudioError', () => {
    describe('not_found', () => {
      it('should create AudioNotFoundError', () => {
        const error = AssetErrorFactory.createAudioError(
          '/path/to/audio.mp3',
          'not_found',
        )
        expect(error).toBeInstanceOf(AudioNotFoundError)
      })

      it('should set assetType to audio', () => {
        const error = AssetErrorFactory.createAudioError(
          '/path/to/audio.mp3',
          'not_found',
        )
        expect(error.assetType).toBe('audio')
      })

      it('should pass context', () => {
        const error = AssetErrorFactory.createAudioError(
          '/path/to/audio.mp3',
          'not_found',
          { context: { operation: 'load' } },
        )
        expect(error.context?.filePath).toBe('/path/to/audio.mp3')
      })

      it('should pass cause', () => {
        const cause = new Error('Original error')
        const error = AssetErrorFactory.createAudioError(
          '/path/to/audio.mp3',
          'not_found',
          { cause },
        )
        expect(error.cause).toBe(cause)
      })
    })

    describe('corrupted', () => {
      it('should create AssetCorruptedError with audio type', () => {
        const error = AssetErrorFactory.createAudioError(
          '/path/to/audio.mp3',
          'corrupted',
        )
        expect(error).toBeInstanceOf(AssetCorruptedError)
        expect(error.assetType).toBe('audio')
      })

      it('should pass corruptionDetails', () => {
        const error = AssetErrorFactory.createAudioError(
          '/path/to/audio.mp3',
          'corrupted',
          { corruptionDetails: 'invalid format' },
        ) as AssetCorruptedError
        expect(error.corruptionDetails).toBe('invalid format')
      })
    })

    describe('download_failed', () => {
      it('should create AssetDownloadFailedError with audio type', () => {
        const error = AssetErrorFactory.createAudioError(
          '/path/to/audio.mp3',
          'download_failed',
        )
        expect(error).toBeInstanceOf(AssetDownloadFailedError)
        expect(error.assetType).toBe('audio')
      })

      it('should pass downloadUrl and statusCode', () => {
        const error = AssetErrorFactory.createAudioError(
          '/path/to/audio.mp3',
          'download_failed',
          { downloadUrl: 'https://example.com/audio.mp3', statusCode: 500 },
        ) as AssetDownloadFailedError
        expect(error.downloadUrl).toBe('https://example.com/audio.mp3')
        expect(error.statusCode).toBe(500)
      })
    })
  })
})
