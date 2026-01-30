import { describe, expect, it } from 'vitest'

import type { LocationLike, LocationPath } from '@/types/LocationLike'
import { locationToString } from '@/types/LocationLike'

describe('LocationLike', () => {
  describe('locationToString', () => {
    it('should return string as-is', () => {
      const path = '/path/to/file.json'
      const result = locationToString(path)
      expect(result).toBe(path)
    })

    it('should call toString on LocationLike object', () => {
      const mockLocation: LocationLike = {
        toString: () => 'ExcelBin:AvatarExcelConfigData[id=10000002].name',
      }

      const result = locationToString(mockLocation)
      expect(result).toBe('ExcelBin:AvatarExcelConfigData[id=10000002].name')
    })

    it('should work with LocationPath type', () => {
      const stringPath: LocationPath = '/some/path'
      const objectPath: LocationPath = {
        toString: () => 'SomeLocation',
      }

      expect(locationToString(stringPath)).toBe('/some/path')
      expect(locationToString(objectPath)).toBe('SomeLocation')
    })
  })
})
