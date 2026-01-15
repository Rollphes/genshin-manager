import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { PatternMismatchError } from '@/errors/decoding/PatternMismatchError'

describe('PatternMismatchError', () => {
  describe('constructor', () => {
    it('should create error with sourceFile and confidence', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error.message).toContain('data.json')
      expect(error.message).toContain('30.0%')
    })

    it('should format message correctly', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error.message).toBe(
        'Pattern mismatch in data.json. Confidence level: 30.0%',
      )
    })

    it('should format message with higher confidence', () => {
      const error = new PatternMismatchError('config.json', 0.45)
      expect(error.message).toBe(
        'Pattern mismatch in config.json. Confidence level: 45.0%',
      )
    })

    it('should set errorCode to GM_DECODE_PATTERN_MISMATCH', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_DECODE_PATTERN_MISMATCH,
      )
    })

    it('should set name to PatternMismatchError', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error.name).toBe('PatternMismatchError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set sourceData in context', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error.context?.sourceData).toBe('data.json')
    })

    it('should set operation in context', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error.context?.operation).toBe('pattern matching')
    })

    it('should set actualValue in context', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error.context?.actualValue).toBe(0.3)
    })

    it('should set expectedValue in context', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      expect(error.context?.expectedValue).toBe('confidence > 0.5')
    })

    it('should accept context parameter', () => {
      const context = { attempt: 1 }
      const error = new PatternMismatchError('data.json', 0.3, context)
      expect(error.context?.attempt).toBe(1)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM3002')
      expect(detailed).toContain('Pattern mismatch')
    })

    it('should serialize to JSON', () => {
      const error = new PatternMismatchError('data.json', 0.3)
      const json = error.toJSON()
      expect(json.name).toBe('PatternMismatchError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_DECODE_PATTERN_MISMATCH,
      )
    })
  })
})
