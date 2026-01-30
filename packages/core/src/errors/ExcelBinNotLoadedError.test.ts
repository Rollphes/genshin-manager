import { describe, expect, it } from 'vitest'

import { ErrorCode } from '@/errors/ErrorCodes'
import { ExcelBinNotLoadedError } from '@/errors/ExcelBinNotLoadedError'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

describe('ExcelBinNotLoadedError', () => {
  const testLocationPath = '/cache/ExcelBinOutput/AvatarExcelConfigData.json'

  it('should create error with file path location', () => {
    const error = new ExcelBinNotLoadedError(testLocationPath)

    expect(error).toBeInstanceOf(GenshinManagerError)
    expect(error.errorCode).toBe(ErrorCode.GmExcelBinNotLoaded)
    expect(error.locationPath).toBe(testLocationPath)
    expect(error.message).toContain('ExcelBinOutput is not loaded')
  })

  it('should support cause option for error chaining', () => {
    const originalError = new Error('Cache initialization failed')
    const error = new ExcelBinNotLoadedError(testLocationPath, {
      cause: originalError,
    })

    expect(error.cause).toBe(originalError)
  })

  it('should work without cause', () => {
    const error = new ExcelBinNotLoadedError(testLocationPath)
    expect(error.cause).toBeUndefined()
  })

  it('should have correct name property', () => {
    const error = new ExcelBinNotLoadedError(testLocationPath)
    expect(error.name).toBe('ExcelBinNotLoadedError')
  })

  it('should have stack trace', () => {
    const error = new ExcelBinNotLoadedError(testLocationPath)
    expect(error.stack).toBeDefined()
    expect(typeof error.stack).toBe('string')
  })
})
