import { describe, expect, it } from 'vitest'

import {
  excelBinOutputFolderPathForDevelop,
  generatedTypesFolderPath,
  handbookFolderPath,
  initImageFolderPath,
  masterFileFolderPath,
  packageFolderPath,
} from '@/utils/paths'

describe('paths/index', () => {
  describe('exported paths', () => {
    it('should export handbookFolderPath as string', () => {
      expect(typeof handbookFolderPath).toBe('string')
      expect(handbookFolderPath.length).toBeGreaterThan(0)
    })

    it('should export initImageFolderPath as string', () => {
      expect(typeof initImageFolderPath).toBe('string')
      expect(initImageFolderPath.length).toBeGreaterThan(0)
    })

    it('should export masterFileFolderPath as string', () => {
      expect(typeof masterFileFolderPath).toBe('string')
      expect(masterFileFolderPath.length).toBeGreaterThan(0)
    })

    it('should export excelBinOutputFolderPathForDevelop as string', () => {
      expect(typeof excelBinOutputFolderPathForDevelop).toBe('string')
      expect(excelBinOutputFolderPathForDevelop.length).toBeGreaterThan(0)
    })

    it('should export generatedTypesFolderPath as string', () => {
      expect(typeof generatedTypesFolderPath).toBe('string')
      expect(generatedTypesFolderPath.length).toBeGreaterThan(0)
    })

    it('should export packageFolderPath as string', () => {
      expect(typeof packageFolderPath).toBe('string')
      expect(packageFolderPath.length).toBeGreaterThan(0)
    })
  })

  describe('path structure', () => {
    it('handbookFolderPath should end with handbooks', () => {
      expect(handbookFolderPath).toMatch(/handbooks$/)
    })

    it('initImageFolderPath should end with initImages', () => {
      expect(initImageFolderPath).toMatch(/initImages$/)
    })

    it('masterFileFolderPath should end with masterFiles', () => {
      expect(masterFileFolderPath).toMatch(/masterFiles$/)
    })

    it('excelBinOutputFolderPathForDevelop should contain ExcelBinOutput', () => {
      expect(excelBinOutputFolderPathForDevelop).toContain('ExcelBinOutput')
    })

    it('generatedTypesFolderPath should contain generated', () => {
      expect(generatedTypesFolderPath).toContain('generated')
    })
  })
})
