import { describe, expect, it } from 'vitest'

import { ErrorContextFactory } from '@/errors/base/ErrorContext'

describe('ErrorContextFactory', () => {
  describe('createFileContext', () => {
    it('should create context with file path', () => {
      const context = ErrorContextFactory.createFileContext('/test/path')
      expect(context.filePath).toBe('/test/path')
      expect(context.timestamp).toBeInstanceOf(Date)
    })

    it('should create context with file path and operation', () => {
      const context = ErrorContextFactory.createFileContext(
        '/test/path',
        'read',
      )
      expect(context.filePath).toBe('/test/path')
      expect(context.operation).toBe('read')
    })
  })

  describe('createNetworkContext', () => {
    it('should create context with URL', () => {
      const context = ErrorContextFactory.createNetworkContext(
        'https://example.com',
      )
      expect(context.url).toBe('https://example.com')
      expect(context.requestMethod).toBe('GET')
      expect(context.timestamp).toBeInstanceOf(Date)
    })

    it('should create context with all parameters', () => {
      const context = ErrorContextFactory.createNetworkContext(
        'https://example.com',
        'POST',
        404,
        { 'Content-Type': 'application/json' },
      )
      expect(context.url).toBe('https://example.com')
      expect(context.requestMethod).toBe('POST')
      expect(context.statusCode).toBe(404)
      expect(context.responseHeaders).toEqual({
        'Content-Type': 'application/json',
      })
    })
  })

  describe('createValidationContext', () => {
    it('should create context with validation info', () => {
      const context = ErrorContextFactory.createValidationContext(
        'username',
        'expected',
        'actual',
      )
      expect(context.propertyKey).toBe('username')
      expect(context.expectedValue).toBe('expected')
      expect(context.actualValue).toBe('actual')
      expect(context.timestamp).toBeInstanceOf(Date)
    })

    it('should create context with validation path', () => {
      const context = ErrorContextFactory.createValidationContext(
        'field',
        'expected',
        'actual',
        'root.field',
      )
      expect(context.validationPath).toBe('root.field')
    })
  })

  describe('createDecodingContext', () => {
    it('should create context with source data', () => {
      const context = ErrorContextFactory.createDecodingContext('source')
      expect(context.sourceData).toBe('source')
      expect(context.timestamp).toBeInstanceOf(Date)
    })

    it('should create context with all parameters', () => {
      const context = ErrorContextFactory.createDecodingContext(
        'source',
        'target',
        'decode',
      )
      expect(context.sourceData).toBe('source')
      expect(context.targetData).toBe('target')
      expect(context.operation).toBe('decode')
    })
  })

  describe('createAssetContext', () => {
    it('should create context with file path', () => {
      const context = ErrorContextFactory.createAssetContext('/asset/path')
      expect(context.filePath).toBe('/asset/path')
      expect(context.timestamp).toBeInstanceOf(Date)
    })

    it('should create context with all parameters', () => {
      const context = ErrorContextFactory.createAssetContext(
        '/path',
        '/image.png',
        '/audio.mp3',
        'download',
      )
      expect(context.filePath).toBe('/path')
      expect(context.imageFile).toBe('/image.png')
      expect(context.audioFile).toBe('/audio.mp3')
      expect(context.operation).toBe('download')
    })
  })

  describe('createConfigContext', () => {
    it('should create context with property key', () => {
      const context = ErrorContextFactory.createConfigContext('configKey')
      expect(context.propertyKey).toBe('configKey')
      expect(context.timestamp).toBeInstanceOf(Date)
    })

    it('should create context with all parameters', () => {
      const context = ErrorContextFactory.createConfigContext(
        'configKey',
        '/config.json',
        'expected',
        'actual',
      )
      expect(context.propertyKey).toBe('configKey')
      expect(context.jsonFile).toBe('/config.json')
      expect(context.expectedValue).toBe('expected')
      expect(context.actualValue).toBe('actual')
    })
  })

  describe('merge', () => {
    it('should merge multiple contexts', () => {
      const context1 = { filePath: '/path1' }
      const context2 = { operation: 'test' }
      const result = ErrorContextFactory.merge(context1, context2)

      expect(result.filePath).toBe('/path1')
      expect(result.operation).toBe('test')
      expect(result.timestamp).toBeInstanceOf(Date)
    })

    it('should override earlier values with later ones', () => {
      const context1 = { operation: 'original' }
      const context2 = { operation: 'override' }
      const result = ErrorContextFactory.merge(context1, context2)

      expect(result.operation).toBe('override')
    })

    it('should handle undefined contexts', () => {
      const context1 = { filePath: '/path' }
      const result = ErrorContextFactory.merge(context1, undefined, {
        operation: 'test',
      })

      expect(result.filePath).toBe('/path')
      expect(result.operation).toBe('test')
    })

    it('should create new timestamp', () => {
      const result = ErrorContextFactory.merge()
      expect(result.timestamp).toBeInstanceOf(Date)
    })
  })
})
