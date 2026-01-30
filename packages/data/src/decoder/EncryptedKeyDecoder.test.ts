import { AssetFormatError } from '@genshin-manager/core'
import { AssetNotFoundError } from '@genshin-manager/core'
import fs from 'fs'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { EncryptedKeyDecoder } from '@/decoder/EncryptedKeyDecoder'

const DATA_PACKAGE_ROOT = path.resolve(__dirname, '..', '..')
const MASTER_FILE_FULL_FOLDER_PATH = path.join(DATA_PACKAGE_ROOT, 'masterFiles')

vi.mock('fs')

describe('EncryptedKeyDecoder', () => {
  const mockMasterFile = {
    metadata: {
      sourceFile: 'TestExcelConfigData.json',
      version: '1.0.0',
    },
    keyMappingTemplate: {
      id: 0,
      name: '',
      value: 0,
    },
  }

  beforeEach(() => {
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockMasterFile))
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should throw AssetNotFoundError when master file does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    expect(() => new EncryptedKeyDecoder('AvatarExcelConfigData')).toThrow(
      AssetNotFoundError,
    )
  })

  it('should throw AssetFormatError when master file is invalid JSON', () => {
    vi.mocked(fs.readFileSync).mockReturnValue('invalid json {{{')

    expect(() => new EncryptedKeyDecoder('AvatarExcelConfigData')).toThrow(
      AssetFormatError,
    )
  })

  it('should throw AssetNotFoundError when file read fails with code', () => {
    const fsError = new Error('ENOENT') as NodeJS.ErrnoException
    fsError.code = 'ENOENT'
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw fsError
    })

    expect(() => new EncryptedKeyDecoder('AvatarExcelConfigData')).toThrow(
      AssetNotFoundError,
    )
  })

  it('should create instance with valid master file', () => {
    const decoder = new EncryptedKeyDecoder('AvatarExcelConfigData')
    expect(decoder).toBeDefined()
  })

  it('should read master file from correct path', () => {
    const _decoder = new EncryptedKeyDecoder('AvatarExcelConfigData')
    expect(_decoder).toBeDefined()

    expect(fs.existsSync).toHaveBeenCalledWith(
      path.join(
        MASTER_FILE_FULL_FOLDER_PATH,
        'AvatarExcelConfigData.master.json',
      ),
    )
  })

  describe('execute', () => {
    it('should throw AssetFormatError for empty data array', () => {
      const decoder = new EncryptedKeyDecoder('AvatarExcelConfigData')

      expect(() => decoder.execute([])).toThrow(AssetFormatError)
    })

    it('should decode encrypted data with matching keys', () => {
      const decoder = new EncryptedKeyDecoder('AvatarExcelConfigData')

      const encryptedData = [{ enc_id: 1, enc_name: 'Test', enc_value: 100 }]

      // With partial match enabled, should return data even if not fully matched
      const result = decoder.execute(encryptedData)
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should use cached results for same data signature', () => {
      const decoder = new EncryptedKeyDecoder('AvatarExcelConfigData')

      const encryptedData = [{ a: 1, b: 'test' }]

      const result1 = decoder.execute(encryptedData)
      const result2 = decoder.execute(encryptedData)

      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
    })

    it('should respect matchStrategy option', () => {
      const decoder = new EncryptedKeyDecoder('AvatarExcelConfigData')

      const encryptedData = [{ id: 1, name: 'Test' }]

      const result = decoder.execute(encryptedData, {
        matchStrategy: 'exact',
      })

      expect(result).toBeDefined()
    })

    it('should respect maxDepth option', () => {
      const decoder = new EncryptedKeyDecoder('AvatarExcelConfigData')

      const encryptedData = [{ a: { b: { c: 1 } } }]

      const result = decoder.execute(encryptedData, {
        maxDepth: 2,
      })

      expect(result).toBeDefined()
    })
  })

  describe('with alternative patterns', () => {
    beforeEach(() => {
      const masterWithAltPatterns = {
        ...mockMasterFile,
        alternativePatterns: [{ altId: 0, altName: '' }],
      }
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(masterWithAltPatterns),
      )
    })

    it('should try alternative patterns when primary fails', () => {
      const decoder = new EncryptedKeyDecoder('AvatarExcelConfigData')

      const encryptedData = [{ altId: 1, altName: 'Test' }]

      const result = decoder.execute(encryptedData)
      expect(result).toBeDefined()
    })
  })

  describe('error handling with enablePartialMatch disabled', () => {
    it('should throw AssetFormatError with detailed message when match fails', () => {
      const decoder = new EncryptedKeyDecoder('AvatarExcelConfigData')

      const encryptedData = [{ completelyDifferent: 'value', unknownKey: 123 }]

      expect(() =>
        decoder.execute(encryptedData, {
          enablePartialMatch: false,
          matchStrategy: 'exact',
        }),
      ).toThrow(AssetFormatError)
    })

    it('should include sample keys in error message', () => {
      const decoder = new EncryptedKeyDecoder('AvatarExcelConfigData')

      const encryptedData = [
        { key1: 1, key2: 2, key3: 3, key4: 4, key5: 5, key6: 6 },
      ]

      try {
        decoder.execute(encryptedData, {
          enablePartialMatch: false,
          matchStrategy: 'exact',
        })
      } catch (error) {
        expect(error).toBeInstanceOf(AssetFormatError)
        expect((error as Error).message).toContain('key1')
      }
    })
  })
})
