import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { JsonParseError } from '@/errors/decoding/JsonParseError'

describe('JsonParseError', () => {
  describe('constructor', () => {
    it('should create error with message and jsonFileName', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.message).toBe('Parse failed')
      expect(error.jsonFileName).toBe('AvatarExcelConfigData')
    })

    it('should set masterFilePath based on jsonFileName', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.masterFilePath).toBe(
        'masterFiles/AvatarExcelConfigData.master.json',
      )
    })

    it('should set cacheFilePath based on jsonFileName', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.cacheFilePath).toBe(
        'cache/ExcelBinOutput/AvatarExcelConfigData.json',
      )
    })

    it('should set errorCode to GM_DECODE_JSON_PARSE_FAILED', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_DECODE_JSON_PARSE_FAILED,
      )
    })

    it('should set name to JsonParseError', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.name).toBe('JsonParseError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set jsonFile in context', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.context?.jsonFile).toBe('AvatarExcelConfigData')
    })

    it('should set filePath in context', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.context?.filePath).toBe(
        'cache/ExcelBinOutput/AvatarExcelConfigData.json',
      )
    })

    it('should set operation in context', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.context?.operation).toBe('parse JSON data')
    })

    it('should set metadata in context', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      expect(error.context?.metadata).toEqual({
        masterFilePath: 'masterFiles/AvatarExcelConfigData.master.json',
        cacheFilePath: 'cache/ExcelBinOutput/AvatarExcelConfigData.json',
        jsonFileName: 'AvatarExcelConfigData',
      })
    })

    it('should accept context parameter', () => {
      const context = { statusCode: 500 }
      const error = new JsonParseError(
        'Parse failed',
        'AvatarExcelConfigData',
        context,
      )
      expect(error.context?.statusCode).toBe(500)
    })

    it('should accept cause parameter', () => {
      const cause = new Error('Original error')
      const error = new JsonParseError(
        'Parse failed',
        'AvatarExcelConfigData',
        undefined,
        cause,
      )
      expect(error.cause).toBe(cause)
    })
  })

  describe('fromError', () => {
    it('should create error from Error instance', () => {
      const originalError = new Error('Syntax error at position 0')
      const error = JsonParseError.fromError(
        originalError,
        'AvatarExcelConfigData',
      )
      expect(error.message).toBe('Syntax error at position 0')
      expect(error.cause).toBe(originalError)
    })

    it('should create error from non-Error value', () => {
      const error = JsonParseError.fromError(
        'string error',
        'AvatarExcelConfigData',
      )
      expect(error.message).toBe('Unknown JSON parse error')
      expect(error.cause).toBeUndefined()
    })

    it('should pass context to created error', () => {
      const originalError = new Error('Parse error')
      const context = { operation: 'load' }
      const error = JsonParseError.fromError(
        originalError,
        'AvatarExcelConfigData',
        context,
      )
      expect(error.jsonFileName).toBe('AvatarExcelConfigData')
    })
  })

  describe('getRelatedFiles', () => {
    it('should return all related file information', () => {
      const error = new JsonParseError('Parse failed', 'WeaponExcelConfigData')
      const files = error.getRelatedFiles()
      expect(files).toEqual({
        jsonFileName: 'WeaponExcelConfigData',
        masterFilePath: 'masterFiles/WeaponExcelConfigData.master.json',
        cacheFilePath: 'cache/ExcelBinOutput/WeaponExcelConfigData.json',
      })
    })
  })

  describe('getTroubleshootingSuggestions', () => {
    it('should return array of troubleshooting suggestions', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      const suggestions = error.getTroubleshootingSuggestions()
      expect(suggestions).toHaveLength(5)
      expect(suggestions[0]).toContain(
        'masterFiles/AvatarExcelConfigData.master.json',
      )
      expect(suggestions[1]).toContain(
        'cache/ExcelBinOutput/AvatarExcelConfigData.json',
      )
      expect(suggestions[2]).toContain('AvatarExcelConfigData')
    })
  })

  describe('getDetailedMessage', () => {
    it('should include base detailed message', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM3005')
      expect(detailed).toContain('Parse failed')
    })

    it('should include related files section', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('Related Files:')
      expect(detailed).toContain('JSON Name: AvatarExcelConfigData')
      expect(detailed).toContain(
        'Master File: masterFiles/AvatarExcelConfigData.master.json',
      )
      expect(detailed).toContain(
        'Cache File: cache/ExcelBinOutput/AvatarExcelConfigData.json',
      )
    })

    it('should include debug steps', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('Debug Steps:')
    })
  })

  describe('inherited methods', () => {
    it('should serialize to JSON', () => {
      const error = new JsonParseError('Parse failed', 'AvatarExcelConfigData')
      const json = error.toJSON()
      expect(json.name).toBe('JsonParseError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_DECODE_JSON_PARSE_FAILED,
      )
    })
  })
})
