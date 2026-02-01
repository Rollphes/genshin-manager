import { beforeAll, describe, expect, it } from 'vitest'

import { Location } from '@/paths/Location'

describe('Location', () => {
  beforeAll(() => {
    Location.deploy({ assetCacheFolderPath: '/test-cache' })
  })

  describe('excelBin', () => {
    it('should create Location with excelBinName', () => {
      const location = Location.excelBin('AvatarExcelConfigData')

      expect(location.excelBinName).toBe('AvatarExcelConfigData')
      expect(location.segments).toEqual([])
    })
  })

  describe('prop', () => {
    it('should add property segment', () => {
      const location = Location.excelBin('AvatarExcelConfigData').prop('id')

      expect(location.segments).toEqual([{ type: 'prop', propertyName: 'id' }])
    })

    it('should chain multiple props', () => {
      const location = Location.excelBin('FetterInfoExcelConfigData').prop(
        'avatarId',
      )

      expect(location.segments).toEqual([
        { type: 'prop', propertyName: 'avatarId' },
      ])
    })
  })

  describe('index', () => {
    it('should add index segment', () => {
      const location = Location.excelBin('AvatarExcelConfigData').index(0)

      expect(location.segments).toEqual([{ type: 'index', idx: 0 }])
    })
  })

  describe('filter', () => {
    it('should add filter segment with number value', () => {
      const location = Location.excelBin('AvatarExcelConfigData').filter(
        'id',
        10000002,
      )

      expect(location.segments).toEqual([
        { type: 'filter', propertyName: 'id', value: 10000002 },
      ])
    })

    it('should add filter segment with string value', () => {
      const location = Location.excelBin('MaterialExcelConfigData').filter(
        'materialType',
        'MATERIAL_EXCHANGE',
      )

      expect(location.segments).toEqual([
        {
          type: 'filter',
          propertyName: 'materialType',
          value: 'MATERIAL_EXCHANGE',
        },
      ])
    })
  })

  describe('formatJsonPath', () => {
    it('should return empty string for no segments', () => {
      const location = Location.excelBin('AvatarExcelConfigData')

      expect(location.formatJsonPath()).toBe('')
    })

    it('should format single prop', () => {
      const location = Location.excelBin('AvatarExcelConfigData').prop('id')

      expect(location.formatJsonPath()).toBe('id')
    })

    it('should format single index', () => {
      const location = Location.excelBin('AvatarExcelConfigData').index(0)

      expect(location.formatJsonPath()).toBe('[0]')
    })

    it('should format single filter', () => {
      const location = Location.excelBin('AvatarExcelConfigData').filter(
        'id',
        10000002,
      )

      expect(location.formatJsonPath()).toBe('[id=10000002]')
    })

    it('should format complex path', () => {
      const location = Location.excelBin('AvatarExcelConfigData')
        .filter('id', 10000002)
        .prop('nameTextMapHash')

      expect(location.formatJsonPath()).toBe('[id=10000002].nameTextMapHash')
    })

    it('should format path with index and prop', () => {
      const location = Location.excelBin('AvatarExcelConfigData')
        .index(0)
        .prop('id')

      expect(location.formatJsonPath()).toBe('[0].id')
    })
  })

  describe('resolve', () => {
    it('should resolve to full path without json path', () => {
      const location = Location.excelBin('AvatarExcelConfigData')
      const result = location.resolve()

      expect(result).toMatch(
        /[/\\]test-cache[/\\]ExcelBinOutput[/\\]AvatarExcelConfigData\.json$/,
      )
    })

    it('should resolve to full path with json path', () => {
      const location = Location.excelBin('AvatarExcelConfigData')
        .filter('id', 10000002)
        .prop('nameTextMapHash')
      const result = location.resolve()

      expect(result).toMatch(
        /[/\\]test-cache[/\\]ExcelBinOutput[/\\]AvatarExcelConfigData\.json#\[id=10000002\]\.nameTextMapHash$/,
      )
    })
  })

  describe('toString', () => {
    it('should return excelBinName only when no segments', () => {
      const location = Location.excelBin('AvatarExcelConfigData')

      expect(location.toString()).toBe('AvatarExcelConfigData')
    })

    it('should return excelBinName with json path', () => {
      const location = Location.excelBin('AvatarExcelConfigData')
        .filter('id', 10000002)
        .prop('nameTextMapHash')

      expect(location.toString()).toBe(
        'AvatarExcelConfigData#[id=10000002].nameTextMapHash',
      )
    })
  })

  describe('immutability', () => {
    it('should not modify original location when chaining', () => {
      const original = Location.excelBin('AvatarExcelConfigData')
      const withProp = original.prop('id')

      expect(original.segments).toEqual([])
      expect(withProp.segments).toEqual([{ type: 'prop', propertyName: 'id' }])
    })
  })

  describe('static getters', () => {
    it('should return masterFileFolderPath', () => {
      expect(Location.masterFileFolderPath).toMatch(/masterFiles$/)
    })

    it('should return handbookFolderPath', () => {
      expect(Location.handbookFolderPath).toMatch(/handbook$/)
    })

    it('should return generatedTypesFolderPath', () => {
      expect(Location.generatedTypesFolderPath).toMatch(/generated$/)
    })

    it('should return excelBinFolderPath after deploy', () => {
      expect(Location.excelBinFolderPath).toMatch(/ExcelBinOutput$/)
    })

    it('should return textMapFolderPath after deploy', () => {
      expect(Location.textMapFolderPath).toMatch(/TextMap$/)
    })
  })

  describe('factory methods', () => {
    it('should create masterFile Location', () => {
      const location = Location.masterFile('test.master.json')
      expect(location.resolve()).toMatch(/masterFiles[/\\]test\.master\.json$/)
    })

    it('should create initImage Location', () => {
      const location = Location.initImage('test.png')
      expect(location.resolve()).toMatch(/initImages[/\\]test\.png$/)
    })

    it('should create handbook Location', () => {
      const location = Location.handbook('handbook_EN.md')
      expect(location.resolve()).toMatch(/handbook[/\\]handbook_EN\.md$/)
    })

    it('should create image Location', () => {
      const location = Location.image('test.png')
      expect(location.resolve()).toMatch(/Images[/\\]test\.png$/)
    })

    it('should create audio Location with single segment', () => {
      const location = Location.audio('test.ogg')
      expect(location.resolve()).toMatch(/Audios[/\\]test\.ogg$/)
    })

    it('should create audio Location with multiple segments', () => {
      const location = Location.audio('JP', '10000002', 'test.ogg')
      expect(location.resolve()).toMatch(
        /Audios[/\\]JP[/\\]10000002[/\\]test\.ogg$/,
      )
    })

    it('should create commitFile Location', () => {
      const location = Location.commitFile()
      expect(location.resolve()).toMatch(/commits\.json$/)
    })
  })
})
