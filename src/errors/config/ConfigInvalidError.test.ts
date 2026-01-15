import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { ConfigInvalidError } from '@/errors/config/ConfigInvalidError'

describe('ConfigInvalidError', () => {
  describe('constructor', () => {
    it('should create error with config property and values', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error.configProperty).toBe('timeout')
    })

    it('should format message with expected and actual values', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error.message).toBe(
        "Invalid configuration for 'timeout': expected number, got string",
      )
    })

    it('should format message with numeric values', () => {
      const error = new ConfigInvalidError('maxRetries', 5, 10)
      expect(error.message).toBe(
        "Invalid configuration for 'maxRetries': expected 5, got 10",
      )
    })

    it('should set configFile property when provided', () => {
      const error = new ConfigInvalidError(
        'timeout',
        'number',
        'string',
        '/config.json',
      )
      expect(error.configFile).toBe('/config.json')
    })

    it('should have undefined configFile when not provided', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error.configFile).toBeUndefined()
    })

    it('should set errorCode to GM_CONFIG_INVALID', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GM_CONFIG_INVALID)
    })

    it('should set name to ConfigInvalidError', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error.name).toBe('ConfigInvalidError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set propertyKey in context', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error.context?.propertyKey).toBe('timeout')
    })

    it('should set expectedValue in context', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error.context?.expectedValue).toBe('number')
    })

    it('should set actualValue in context', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      expect(error.context?.actualValue).toBe('string')
    })

    it('should set jsonFile in context when configFile provided', () => {
      const error = new ConfigInvalidError(
        'timeout',
        'number',
        'string',
        '/config.json',
      )
      expect(error.context?.jsonFile).toBe('/config.json')
    })

    it('should accept context parameter', () => {
      const context = { operation: 'load' }
      const error = new ConfigInvalidError(
        'timeout',
        'number',
        'string',
        undefined,
        context,
      )
      expect(error.context?.propertyKey).toBe('timeout')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new ConfigInvalidError(
        'timeout',
        'number',
        'string',
        undefined,
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new ConfigInvalidError('timeout', 'number', 'string')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM5001')
      expect(detailed).toContain('Invalid configuration')
    })

    it('should serialize to JSON', () => {
      const error = new ConfigInvalidError(
        'timeout',
        'number',
        'string',
        '/config.json',
      )
      const json = error.toJSON()
      expect(json.name).toBe('ConfigInvalidError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GM_CONFIG_INVALID)
    })
  })
})
