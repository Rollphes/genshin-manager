import { describe, expect, it } from 'vitest'

import { AssetNotFoundError } from '@/errors/AssetNotFoundError'
import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

describe('AssetNotFoundError', () => {
  const testLocationPath = '/test/path/file.json'

  it('should create error with file path location', () => {
    const error = new AssetNotFoundError(testLocationPath)

    expect(error).toBeInstanceOf(GenshinManagerError)
    expect(error.errorCode).toBe(ErrorCode.GmAssetNotFound)
    expect(error.locationPath).toBe(testLocationPath)
    expect(error.message).toContain('Asset not found')
  })

  it('should support cause option for error chaining', () => {
    const originalError = new Error('File system error')
    const error = new AssetNotFoundError(testLocationPath, {
      cause: originalError,
    })

    expect(error.cause).toBe(originalError)
  })

  it('should work without cause', () => {
    const error = new AssetNotFoundError(testLocationPath)
    expect(error.cause).toBeUndefined()
  })

  it('should have correct name property', () => {
    const error = new AssetNotFoundError(testLocationPath)
    expect(error.name).toBe('AssetNotFoundError')
  })

  it('should have stack trace', () => {
    const error = new AssetNotFoundError(testLocationPath)
    expect(error.stack).toBeDefined()
    expect(typeof error.stack).toBe('string')
  })
})
