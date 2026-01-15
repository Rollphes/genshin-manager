import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { ConfigMissingError } from '@/errors/config/ConfigMissingError'

describe('ConfigMissingError', () => {
  describe('constructor', () => {
    it('should create error with config property', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error.configProperty).toBe('apiKey')
    })

    it('should format message without config file', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error.message).toBe("Missing required configuration: 'apiKey'")
    })

    it('should format message with config file', () => {
      const error = new ConfigMissingError('apiKey', '/config.json')
      expect(error.message).toBe(
        "Missing required configuration: 'apiKey' in /config.json",
      )
    })

    it('should set configFile property when provided', () => {
      const error = new ConfigMissingError('apiKey', '/config.json')
      expect(error.configFile).toBe('/config.json')
    })

    it('should have undefined configFile when not provided', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error.configFile).toBeUndefined()
    })

    it('should set errorCode to GM_CONFIG_MISSING', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error.errorCode).toBe(GenshinManagerErrorCode.GM_CONFIG_MISSING)
    })

    it('should set name to ConfigMissingError', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error.name).toBe('ConfigMissingError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set propertyKey in context', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error.context?.propertyKey).toBe('apiKey')
    })

    it('should set expectedValue to "required value" in context', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error.context?.expectedValue).toBe('required value')
    })

    it('should set actualValue to "undefined" in context', () => {
      const error = new ConfigMissingError('apiKey')
      expect(error.context?.actualValue).toBe('undefined')
    })

    it('should set jsonFile in context when configFile provided', () => {
      const error = new ConfigMissingError('apiKey', '/config.json')
      expect(error.context?.jsonFile).toBe('/config.json')
    })

    it('should accept context parameter', () => {
      const context = { operation: 'load' }
      const error = new ConfigMissingError('apiKey', undefined, context)
      expect(error.context?.propertyKey).toBe('apiKey')
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new ConfigMissingError(
        'apiKey',
        undefined,
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new ConfigMissingError('apiKey')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM5002')
      expect(detailed).toContain('Missing required configuration')
    })

    it('should serialize to JSON', () => {
      const error = new ConfigMissingError('apiKey', '/config.json')
      const json = error.toJSON()
      expect(json.name).toBe('ConfigMissingError')
      expect(json.errorCode).toBe(GenshinManagerErrorCode.GM_CONFIG_MISSING)
    })
  })
})
