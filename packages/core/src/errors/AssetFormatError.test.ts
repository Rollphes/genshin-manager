import { describe, expect, it } from 'vitest'

import { AssetFormatError } from '@/errors/AssetFormatError'
import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

describe('AssetFormatError', () => {
  const testLocationPath = '/test/path/file.json'

  it('should create error with locationPath and reason', () => {
    const reason = 'Invalid JSON structure'
    const error = new AssetFormatError(testLocationPath, reason)

    expect(error).toBeInstanceOf(GenshinManagerError)
    expect(error.errorCode).toBe(ErrorCode.GmAssetFormat)
    expect(error.locationPath).toBe(testLocationPath)
    expect(error.reason).toBe(reason)
    expect(error.message).toContain('Invalid asset format')
    expect(error.message).toContain(reason)
  })

  it('should support cause option for error chaining', () => {
    const originalError = new SyntaxError('Unexpected token')
    const error = new AssetFormatError(testLocationPath, 'JSON parse failed', {
      cause: originalError,
    })

    expect(error.cause).toBe(originalError)
  })

  it('should work without cause', () => {
    const error = new AssetFormatError(testLocationPath, 'test reason')
    expect(error.cause).toBeUndefined()
  })

  it('should have correct name property', () => {
    const error = new AssetFormatError(testLocationPath, 'test')
    expect(error.name).toBe('AssetFormatError')
  })

  it('should have stack trace', () => {
    const error = new AssetFormatError(testLocationPath, 'test')
    expect(error.stack).toBeDefined()
    expect(typeof error.stack).toBe('string')
  })
})
