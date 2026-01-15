import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { MasterFileConfigurationError } from '@/errors/decoding/MasterFileConfigurationError'

describe('MasterFileConfigurationError', () => {
  describe('constructor', () => {
    it('should create error with masterFilePath', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      expect(error.message).toContain('/path/to/master.json')
    })

    it('should format message correctly', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      expect(error.message).toBe(
        'Failed to load or parse master file: /path/to/master.json',
      )
    })

    it('should set errorCode to GM_DECODE_MASTER_NOT_FOUND', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_DECODE_MASTER_NOT_FOUND,
      )
    })

    it('should set name to MasterFileConfigurationError', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      expect(error.name).toBe('MasterFileConfigurationError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set filePath in context', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      expect(error.context?.filePath).toBe('/path/to/master.json')
    })

    it('should set operation in context', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      expect(error.context?.operation).toBe('load master file')
    })

    it('should accept context parameter', () => {
      const context = { metadata: { attempt: 1 } }
      const error = new MasterFileConfigurationError(
        '/path/to/master.json',
        context,
      )
      expect(error.context?.metadata?.attempt).toBe(1)
    })

    it('should accept cause parameter', () => {
      const cause = new Error('File not found')
      const error = new MasterFileConfigurationError(
        '/path/to/master.json',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM3001')
      expect(detailed).toContain('Failed to load or parse master file')
    })

    it('should serialize to JSON', () => {
      const error = new MasterFileConfigurationError('/path/to/master.json')
      const json = error.toJSON()
      expect(json.name).toBe('MasterFileConfigurationError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_DECODE_MASTER_NOT_FOUND,
      )
    })
  })
})
