import { describe, expect, it } from 'vitest'

import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import { LowConfidenceError } from '@/errors/decoding/LowConfidenceError'

describe('LowConfidenceError', () => {
  describe('constructor', () => {
    it('should create error with sourceFile and confidence', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error.message).toContain('data.json')
      expect(error.message).toContain('50.0%')
    })

    it('should format message with default threshold', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error.message).toBe(
        'Low confidence decoding for data.json. Got 50.0%, required 80.0%',
      )
    })

    it('should format message with custom threshold', () => {
      const error = new LowConfidenceError('data.json', 0.6, 0.9)
      expect(error.message).toBe(
        'Low confidence decoding for data.json. Got 60.0%, required 90.0%',
      )
    })

    it('should set errorCode to GM_DECODE_LOW_CONFIDENCE', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error.errorCode).toBe(
        GenshinManagerErrorCode.GM_DECODE_LOW_CONFIDENCE,
      )
    })

    it('should set name to LowConfidenceError', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error.name).toBe('LowConfidenceError')
    })

    it('should be instance of GenshinManagerError', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error).toBeInstanceOf(GenshinManagerError)
    })

    it('should set isGenshinManagerError to true', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error.isGenshinManagerError).toBe(true)
    })

    it('should set timestamp', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error.timestamp).toBeInstanceOf(Date)
    })

    it('should set sourceData in context', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error.context?.sourceData).toBe('data.json')
    })

    it('should set operation in context', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error.context?.operation).toBe('confidence check')
    })

    it('should set actualValue in context', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error.context?.actualValue).toBe(0.5)
    })

    it('should set expectedValue to threshold in context', () => {
      const error = new LowConfidenceError('data.json', 0.5, 0.9)
      expect(error.context?.expectedValue).toBe(0.9)
    })

    it('should use default threshold 0.8 for expectedValue', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      expect(error.context?.expectedValue).toBe(0.8)
    })

    it('should accept context parameter', () => {
      const context = { attempt: 1 }
      const error = new LowConfidenceError('data.json', 0.5, 0.8, context)
      expect(error.context?.attempt).toBe(1)
    })
  })

  describe('inherited methods', () => {
    it('should return detailed message with error code', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      const detailed = error.getDetailedMessage()
      expect(detailed).toContain('GM3003')
      expect(detailed).toContain('Low confidence decoding')
    })

    it('should serialize to JSON', () => {
      const error = new LowConfidenceError('data.json', 0.5)
      const json = error.toJSON()
      expect(json.name).toBe('LowConfidenceError')
      expect(json.errorCode).toBe(
        GenshinManagerErrorCode.GM_DECODE_LOW_CONFIDENCE,
      )
    })
  })
})
