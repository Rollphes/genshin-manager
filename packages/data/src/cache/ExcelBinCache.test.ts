import { describe, expect, it, vi } from 'vitest'

import { ExcelBinCache } from '@/cache/ExcelBinCache'
import { ExcelBinNotLoadedError } from '@/errors/ExcelBinNotLoadedError'

vi.mock('@/loader/loadExcelBinFile', () => ({
  loadExcelBinFile: vi.fn().mockResolvedValue({
    success: true,
    data: [{ id: 1, name: 'Test', nameTextMapHash: 12345 }],
  }),
}))

vi.mock('@/decoder/EncryptedKeyDecoder', () => ({
  EncryptedKeyDecoder: vi.fn().mockImplementation(() => ({
    execute: vi.fn((data: unknown[]) => data),
  })),
}))

describe('@/cache/ExcelBinCache', () => {
  function createCache(): ExcelBinCache {
    return new ExcelBinCache({
      autoFix: false,
    })
  }

  describe('static allKeys', () => {
    it('should return set of all ExcelBinOutput keys', () => {
      const keys = ExcelBinCache.allKeys
      expect(keys).toBeInstanceOf(Set)
      expect(keys.size).toBeGreaterThan(0)
    })
  })

  describe('hasExcelBin', () => {
    it('should return false for unloaded excelBin', () => {
      const cache = createCache()
      expect(cache.hasExcelBin('AvatarExcelConfigData')).toBe(false)
    })
  })

  describe('getRecords', () => {
    it('should throw ExcelBinNotLoadedError for unloaded table', () => {
      const cache = createCache()
      expect(() => cache.getRecords('AvatarExcelConfigData')).toThrow(
        ExcelBinNotLoadedError,
      )
    })
  })

  describe('extractTextHashes', () => {
    it('should return empty set when no data loaded', () => {
      const cache = createCache()
      const hashes = cache.extractTextHashes()
      expect(hashes).toBeInstanceOf(Set)
      expect(hashes.size).toBe(0)
    })
  })

  describe('clear', () => {
    it('should clear all data', () => {
      const cache = createCache()
      cache.clear()
      expect(cache.hasExcelBin('AvatarExcelConfigData')).toBe(false)
    })
  })

  describe('load', () => {
    it('should return success for valid keys', async () => {
      const cache = createCache()
      const result = await cache.load(new Set(['AvatarExcelConfigData']))
      expect(result.success).toBe(true)
    })
  })
})
