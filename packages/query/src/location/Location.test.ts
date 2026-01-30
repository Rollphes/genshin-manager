import { describe, expect, it } from 'vitest'

import { Location } from '@/location/Location'

describe('Location', () => {
  describe('create', () => {
    it('should create a root location', () => {
      const location = Location.create('ExcelBin', 'AvatarExcelConfigData')
      expect(location.toString()).toBe('ExcelBin:AvatarExcelConfigData')
    })
  })

  describe('prop', () => {
    it('should append property access', () => {
      const location = Location.create(
        'ExcelBin',
        'AvatarExcelConfigData',
      ).prop('nameTextMapHash')
      expect(location.toString()).toBe(
        'ExcelBin:AvatarExcelConfigData.nameTextMapHash',
      )
    })

    it('should chain multiple property accesses', () => {
      const location = Location.create('ExcelBin', 'AvatarExcelConfigData')
        .prop('skillDepot')
        .prop('skills')
      expect(location.toString()).toBe(
        'ExcelBin:AvatarExcelConfigData.skillDepot.skills',
      )
    })
  })

  describe('index', () => {
    it('should append array index access', () => {
      const location = Location.create('ExcelBin', 'AvatarExcelConfigData')
        .prop('addProps')
        .index(0)
      expect(location.toString()).toBe(
        'ExcelBin:AvatarExcelConfigData.addProps[0]',
      )
    })
  })

  describe('filter', () => {
    it('should append filter condition with string value', () => {
      const location = Location.create(
        'ExcelBin',
        'AvatarExcelConfigData',
      ).filter('id', 10000046)
      expect(location.toString()).toBe(
        'ExcelBin:AvatarExcelConfigData[id=10000046]',
      )
    })

    it('should append filter condition with number value', () => {
      const location = Location.create(
        'ExcelBin',
        'AvatarExcelConfigData',
      ).filter('name', 'Hutao')
      expect(location.toString()).toBe(
        'ExcelBin:AvatarExcelConfigData[name=Hutao]',
      )
    })
  })

  describe('complex paths', () => {
    it('should handle complex nested paths', () => {
      const location = Location.create(
        'ExcelBin',
        'AvatarPromoteExcelConfigData',
      )
        .filter('avatarPromoteId', 5001)
        .prop('addProps')
        .index(2)
        .prop('propType')
      expect(location.toString()).toBe(
        'ExcelBin:AvatarPromoteExcelConfigData[avatarPromoteId=5001].addProps[2].propType',
      )
    })
  })

  describe('getSegments', () => {
    it('should return immutable segments array', () => {
      const location = Location.create('ExcelBin', 'Test')
        .prop('field')
        .index(0)
      const segments = location.getSegments()

      expect(segments).toHaveLength(3)
      expect(segments[0]).toEqual({ type: 'root', value: 'ExcelBin:Test' })
      expect(segments[1]).toEqual({ type: 'prop', value: 'field' })
      expect(segments[2]).toEqual({ type: 'index', value: 0 })
    })
  })

  describe('immutability', () => {
    it('should not modify original location', () => {
      const original = Location.create('ExcelBin', 'Test')
      const withProp = original.prop('field')
      const withIndex = original.index(0)

      expect(original.toString()).toBe('ExcelBin:Test')
      expect(withProp.toString()).toBe('ExcelBin:Test.field')
      expect(withIndex.toString()).toBe('ExcelBin:Test[0]')
    })
  })
})
