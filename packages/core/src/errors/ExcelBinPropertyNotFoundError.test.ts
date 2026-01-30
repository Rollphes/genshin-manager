import { describe, expect, it } from 'vitest'

import { ErrorCode } from '@/errors/ErrorCodes'
import { ExcelBinPropertyNotFoundError } from '@/errors/ExcelBinPropertyNotFoundError'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

describe('ExcelBinPropertyNotFoundError', () => {
  const testLocationPath = 'AvatarExcelConfigData#[id=10000002].property'

  it('should create error with location and search value (number)', () => {
    const searchValue = 12345
    const error = new ExcelBinPropertyNotFoundError(
      testLocationPath,
      searchValue,
    )

    expect(error).toBeInstanceOf(GenshinManagerError)
    expect(error.errorCode).toBe(ErrorCode.GmExcelBinPropertyNotFound)
    expect(error.locationPath).toBe(testLocationPath)
    expect(error.searchValue).toBe(searchValue)
    expect(error.message).toContain('Property not found')
    expect(error.message).toContain('12345')
  })

  it('should create error with location and search value (string)', () => {
    const searchValue = 'test_id'
    const error = new ExcelBinPropertyNotFoundError(
      testLocationPath,
      searchValue,
    )

    expect(error.searchValue).toBe(searchValue)
    expect(error.message).toContain('test_id')
  })

  it('should create error with location and search value (boolean)', () => {
    const searchValue = true
    const error = new ExcelBinPropertyNotFoundError(
      testLocationPath,
      searchValue,
    )

    expect(error.searchValue).toBe(searchValue)
    expect(error.message).toContain('true')
  })

  it('should support cause option for error chaining', () => {
    const originalError = new Error('Index lookup failed')
    const error = new ExcelBinPropertyNotFoundError(testLocationPath, 999, {
      cause: originalError,
    })

    expect(error.cause).toBe(originalError)
  })

  it('should work without cause', () => {
    const error = new ExcelBinPropertyNotFoundError(testLocationPath, 'test')
    expect(error.cause).toBeUndefined()
  })

  it('should have correct name property', () => {
    const error = new ExcelBinPropertyNotFoundError(testLocationPath, 1)
    expect(error.name).toBe('ExcelBinPropertyNotFoundError')
  })

  it('should have stack trace', () => {
    const error = new ExcelBinPropertyNotFoundError(testLocationPath, 1)
    expect(error.stack).toBeDefined()
    expect(typeof error.stack).toBe('string')
  })
})
