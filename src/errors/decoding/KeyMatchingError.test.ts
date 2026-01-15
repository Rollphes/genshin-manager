import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { KeyMatchingError } from '@/errors/decoding/KeyMatchingError'

describe('KeyMatchingError', () => {
  describe('constructor', () => {
    it('should create error with sourceFile, failedKeys, and expectedKeys', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1', 'key2'],
        ['key1', 'key2', 'key3'],
      )
      expect(error.failedKeys).toEqual(['key1', 'key2'])
      expect(error.expectedKeys).toEqual(['key1', 'key2', 'key3'])
    })

    it('should format message correctly', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1', 'key2'],
        ['key1', 'key2', 'key3', 'key4'],
      )
      expect(error.message).toBe(
        'Key matching failed for data.json. Failed to match 2 out of 4 keys',
      )
    })

    it('should set errorCode to GM_DECODE_KEY_MATCHING_FAILED', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
      )
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_DECODE_KEY_MATCHING_FAILED,
      )
    })

    it('should set name to KeyMatchingError', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
      )
      expect(error.name).toBe('KeyMatchingError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
      )
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
      )
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
      )
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set sourceData in context based on sourceFile', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
      )
      expect(error.context?.sourceData).toBe('data.json')
    })

    it('should set operation in context', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
      )
      expect(error.context?.operation).toBe('key matching')
    })

    it('should set metadata with limited keys in context', () => {
      const failedKeys = Array.from(
        { length: 15 },
        (_, i) => `failed${String(i)}`,
      )
      const expectedKeys = Array.from(
        { length: 20 },
        (_, i) => `expected${String(i)}`,
      )
      const error = new KeyMatchingError('data.json', failedKeys, expectedKeys)
      const metadata = error.context?.metadata as {
        failedKeys: string[]
        expectedKeys: string[]
        totalFailedKeys: number
        totalExpectedKeys: number
      }
      expect(metadata.failedKeys).toHaveLength(10)
      expect(metadata.expectedKeys).toHaveLength(10)
      expect(metadata.totalFailedKeys).toBe(15)
      expect(metadata.totalExpectedKeys).toBe(20)
    })

    it('should accept context parameter', () => {
      const context = { statusCode: 500 }
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
        context,
      )
      expect(error.context?.statusCode).toBe(500)
    })
  })

  describe('getKeyMatchingDetails', () => {
    it('should return failedKeys and expectedKeys', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1', 'key2'],
        ['key1', 'key2', 'key3'],
      )
      const details = error.getKeyMatchingDetails()
      expect(details.failedKeys).toEqual(['key1', 'key2'])
      expect(details.expectedKeys).toEqual(['key1', 'key2', 'key3'])
    })

    it('should return unmatchedExpected keys', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1', 'key2'],
        ['key1', 'key2', 'key3', 'key4'],
      )
      const details = error.getKeyMatchingDetails()
      expect(details.unmatchedExpected).toEqual(['key3', 'key4'])
    })

    it('should calculate successRate correctly', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2', 'key3', 'key4'],
      )
      const details = error.getKeyMatchingDetails()
      expect(details.successRate).toBe(0.75)
    })

    it('should return 0 successRate when no expected keys', () => {
      const error = new KeyMatchingError('data.json', [], [])
      const details = error.getKeyMatchingDetails()
      expect(details.successRate).toBe(0)
    })

    it('should return 0 successRate when all keys failed', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1', 'key2'],
        ['key1', 'key2'],
      )
      const details = error.getKeyMatchingDetails()
      expect(details.successRate).toBe(0)
    })
  })

  describe('getTroubleshootingSuggestions', () => {
    it('should return suggestions for complete failure', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1', 'key2'],
        ['key1', 'key2'],
      )
      const suggestions = error.getTroubleshootingSuggestions()
      expect(suggestions).toContain(
        'Complete key matching failure - check if master file matches data structure',
      )
      expect(suggestions).toContain(
        'Consider regenerating the master file if data format has changed',
      )
    })

    it('should return suggestions for high failure rate', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1', 'key2', 'key3'],
        ['key1', 'key2', 'key3', 'key4'],
      )
      const suggestions = error.getTroubleshootingSuggestions()
      expect(suggestions).toContain(
        'High failure rate - verify master file compatibility',
      )
      expect(suggestions).toContain('Check if data source has been updated')
    })

    it('should return suggestions for partial failure', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2', 'key3', 'key4', 'key5'],
      )
      const suggestions = error.getTroubleshootingSuggestions()
      expect(suggestions).toContain(
        'Partial failure - some keys may have been renamed or removed',
      )
      expect(suggestions).toContain(
        'Consider using enablePartialMatch: true for partial decoding',
      )
    })

    it('should always include debug logging suggestion', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
      )
      const suggestions = error.getTroubleshootingSuggestions()
      expect(suggestions).toContain(
        'Enable debug logging to see detailed matching process',
      )
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
      )
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM3004')
      expect(detailed).toContain('Key matching failed')
    })

    it('should serialize to JSON', () => {
      const error = new KeyMatchingError(
        'data.json',
        ['key1'],
        ['key1', 'key2'],
      )
      const json = error.toJSON()
      expect(json.name).toBe('KeyMatchingError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_DECODE_KEY_MATCHING_FAILED,
      )
    })
  })
})
