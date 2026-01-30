import { describe, expect, it } from 'vitest'

import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import { TextMapHashNotFoundError } from '@/errors/TextMapHashNotFoundError'
import { Language } from '@/types'

describe('TextMapHashNotFoundError', () => {
  const textMapPath = '/cache/TextMap/TextMapEN.json'
  const excelBinPath = 'AvatarExcelConfigData#[id=10000002].nameTextMapHash'

  it('should create error with language, paths and hash', () => {
    const hash = '123456789'
    const error = new TextMapHashNotFoundError(
      Language.En,
      textMapPath,
      excelBinPath,
      hash,
    )

    expect(error).toBeInstanceOf(GenshinManagerError)
    expect(error.errorCode).toBe(ErrorCode.GmTextMapHashNotFound)
    expect(error.language).toBe(Language.En)
    expect(error.textMapPath).toBe(textMapPath)
    expect(error.excelBinPath).toBe(excelBinPath)
    expect(error.hash).toBe(hash)
    expect(error.message).toContain('123456789')
    expect(error.message).toContain('en')
  })

  it('should support cause option for error chaining', () => {
    const originalError = new Error('Cache miss')
    const error = new TextMapHashNotFoundError(
      Language.Ja,
      textMapPath,
      excelBinPath,
      '111',
      { cause: originalError },
    )

    expect(error.cause).toBe(originalError)
  })

  it('should work without cause', () => {
    const error = new TextMapHashNotFoundError(
      Language.En,
      textMapPath,
      excelBinPath,
      '222',
    )
    expect(error.cause).toBeUndefined()
  })

  it('should have correct name property', () => {
    const error = new TextMapHashNotFoundError(
      Language.En,
      textMapPath,
      excelBinPath,
      '123',
    )
    expect(error.name).toBe('TextMapHashNotFoundError')
  })

  it('should have stack trace', () => {
    const error = new TextMapHashNotFoundError(
      Language.En,
      textMapPath,
      excelBinPath,
      '123',
    )
    expect(error.stack).toBeDefined()
    expect(typeof error.stack).toBe('string')
  })
})
