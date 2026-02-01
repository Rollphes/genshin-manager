import { beforeAll, describe, expect, it } from 'vitest'

import { FileLocation } from '@/paths/FileLocation'

describe('FileLocation', () => {
  beforeAll(() => {
    FileLocation.deploy({ assetCacheFolderPath: '/test-cache' })
  })

  describe('excelBin', () => {
    it('should create Location with excelBinName', () => {
      const location = FileLocation.excelBin('AvatarExcelConfigData')

      expect(location.excelBinName).toBe('AvatarExcelConfigData')
      expect(location.sourceType).toBe('excelBin')
    })
  })

  describe('resolve', () => {
    it('should resolve excelBin to full path', () => {
      const location = FileLocation.excelBin('AvatarExcelConfigData')
      const result = location.resolve()

      expect(result).toMatch(
        /[/\\]test-cache[/\\]ExcelBinOutput[/\\]AvatarExcelConfigData\.json$/,
      )
    })
  })

  describe('basename', () => {
    it('should return file name from path', () => {
      const location = FileLocation.excelBin('AvatarExcelConfigData')

      expect(location.basename()).toBe('AvatarExcelConfigData.json')
    })
  })

  describe('folder methods', () => {
    it('should return masterFileFolder', () => {
      expect(FileLocation.masterFileFolder().resolve()).toMatch(/masterFiles$/)
    })

    it('should return generatedTypesFolder', () => {
      expect(FileLocation.generatedTypesFolder().resolve()).toMatch(
        /generated$/,
      )
    })

    it('should return excelBinFolder after deploy', () => {
      expect(FileLocation.excelBinFolder().resolve()).toMatch(/ExcelBinOutput$/)
    })

    it('should return textMapFolder after deploy', () => {
      expect(FileLocation.textMapFolder().resolve()).toMatch(/TextMap$/)
    })
  })

  describe('factory methods', () => {
    it('should create masterFile Location', () => {
      const location = FileLocation.masterFile('test.master.json')
      expect(location.resolve()).toMatch(/masterFiles[/\\]test\.master\.json$/)
    })

    it('should create initImage Location', () => {
      const location = FileLocation.initImage('test.png')
      expect(location.resolve()).toMatch(/initImages[/\\]test\.png$/)
    })

    it('should create image Location', () => {
      const location = FileLocation.image('test.png')
      expect(location.resolve()).toMatch(/Images[/\\]test\.png$/)
    })

    it('should create audio Location with single segment', () => {
      const location = FileLocation.audio('test.ogg')
      expect(location.resolve()).toMatch(/Audios[/\\]test\.ogg$/)
    })

    it('should create audio Location with multiple segments', () => {
      const location = FileLocation.audio('JP', '10000002', 'test.ogg')
      expect(location.resolve()).toMatch(
        /Audios[/\\]JP[/\\]10000002[/\\]test\.ogg$/,
      )
    })

    it('should create commitFile Location', () => {
      const location = FileLocation.commitFile()
      expect(location.resolve()).toMatch(/commits\.json$/)
    })
  })
})
