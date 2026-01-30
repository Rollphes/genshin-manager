import { describe, expect, it } from 'vitest'

import { ErrorCode } from '@/errors/ErrorCodes'

describe('ErrorCode', () => {
  describe('Validation errors', () => {
    it('should have GmValidation error code', () => {
      expect(ErrorCode.GmValidation).toBe('GM1001')
    })
  })

  describe('Asset errors', () => {
    it('should have GmAssetNotFound error code', () => {
      expect(ErrorCode.GmAssetNotFound).toBe('GM2001')
    })

    it('should have GmAssetFormat error code', () => {
      expect(ErrorCode.GmAssetFormat).toBe('GM2002')
    })
  })

  describe('TextMap errors', () => {
    it('should have GmTextMapFormat error code', () => {
      expect(ErrorCode.GmTextMapFormat).toBe('GM3001')
    })

    it('should have GmTextMapHashNotFound error code', () => {
      expect(ErrorCode.GmTextMapHashNotFound).toBe('GM3002')
    })
  })

  describe('Network errors', () => {
    it('should have GmNetwork error code', () => {
      expect(ErrorCode.GmNetwork).toBe('GM4001')
    })

    it('should have GmNetworkBodyNotFound error code', () => {
      expect(ErrorCode.GmNetworkBodyNotFound).toBe('GM4002')
    })
  })

  describe('ExcelBin errors', () => {
    it('should have GmExcelBinNotLoaded error code', () => {
      expect(ErrorCode.GmExcelBinNotLoaded).toBe('GM5001')
    })

    it('should have GmExcelBinPropertyNotFound error code', () => {
      expect(ErrorCode.GmExcelBinPropertyNotFound).toBe('GM5002')
    })
  })

  describe('Content errors', () => {
    it('should have GmAnnNotFound error code', () => {
      expect(ErrorCode.GmAnnNotFound).toBe('GM6001')
    })

    it('should have GmDataConsistency error code', () => {
      expect(ErrorCode.GmDataConsistency).toBe('GM6002')
    })
  })

  describe('General errors', () => {
    it('should have GmGeneral error code', () => {
      expect(ErrorCode.GmGeneral).toBe('GM9001')
    })
  })

  describe('Error code format', () => {
    it('should have all error codes starting with GM', () => {
      const errorCodes = Object.values(ErrorCode)
      for (const code of errorCodes) expect(code).toMatch(/^GM\d{4}$/)
    })

    it('should have unique error codes', () => {
      const errorCodes = Object.values(ErrorCode)
      const uniqueCodes = new Set(errorCodes)
      expect(uniqueCodes.size).toBe(errorCodes.length)
    })
  })
})
