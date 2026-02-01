import { GeneralError } from '@genshin-manager/core'
import { describe, expect, it, vi } from 'vitest'

import { QueryLocation } from '@/location/QueryLocation'
import { LocatedValue } from '@/value/LocatedValue'
import type { TextMapProvider } from '@/value/types'

describe('LocatedValue', () => {
  const testLocation = QueryLocation.create('Test', 'Data').prop('field')

  describe('constructor', () => {
    it('should store value and location', () => {
      const value = new LocatedValue(42, testLocation)
      expect(value.value).toBe(42)
      expect(value.location.toString()).toBe('Test:Data.field')
    })
  })

  describe('toEnum', () => {
    const testEnum = {
      A: 'value_a',
      B: 'value_b',
      C: 1,
    } as const

    it('should convert valid string value to enum', () => {
      const value = new LocatedValue('value_a', testLocation)
      const result = value.toEnum(testEnum)
      expect(result).toBe('value_a')
    })

    it('should convert valid number value to enum', () => {
      const value = new LocatedValue(1, testLocation)
      const result = value.toEnum(testEnum)
      expect(result).toBe(1)
    })

    it('should throw GeneralError for invalid enum value', () => {
      const value = new LocatedValue('invalid', testLocation)
      expect(() => value.toEnum(testEnum)).toThrow(GeneralError)
      expect(() => value.toEnum(testEnum)).toThrow(/Invalid enum value/)
      expect(() => value.toEnum(testEnum)).toThrow(/Test:Data.field/)
    })

    it('should throw GeneralError for non-string/number value', () => {
      const value = new LocatedValue({ foo: 'bar' }, testLocation)
      expect(() =>
        value.toEnum(testEnum as Record<string, string | number>),
      ).toThrow(GeneralError)
      expect(() =>
        value.toEnum(testEnum as Record<string, string | number>),
      ).toThrow(/requires string or number/)
    })
  })

  describe('toText', () => {
    it('should call textMapProvider with hash', () => {
      const getTextSyncMock = vi.fn().mockReturnValue('Hello World')
      const mockProvider: TextMapProvider = {
        getTextSync: getTextSyncMock,
      }
      const value = new LocatedValue(12345, testLocation, mockProvider)

      const result = value.toText()

      expect(result).toBe('Hello World')
      expect(getTextSyncMock).toHaveBeenCalledWith(12345)
    })

    it('should throw GeneralError when textMapProvider is not available', () => {
      const value = new LocatedValue(12345, testLocation)
      expect(() => value.toText()).toThrow(GeneralError)
      expect(() => value.toText()).toThrow(/TextMapProvider not available/)
    })

    it('should throw GeneralError when value is not a number', () => {
      const mockProvider: TextMapProvider = {
        getTextSync: vi.fn(),
      }
      const value = new LocatedValue('not-a-hash', testLocation, mockProvider)
      expect(() => value.toText()).toThrow(GeneralError)
      expect(() => value.toText()).toThrow(/requires number/)
    })
  })

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(new LocatedValue(0, testLocation).isDefined()).toBe(true)
      expect(new LocatedValue('', testLocation).isDefined()).toBe(true)
      expect(new LocatedValue(false, testLocation).isDefined()).toBe(true)
      expect(new LocatedValue({}, testLocation).isDefined()).toBe(true)
    })

    it('should return false for undefined', () => {
      expect(new LocatedValue(undefined, testLocation).isDefined()).toBe(false)
    })

    it('should return false for null', () => {
      expect(new LocatedValue(null, testLocation).isDefined()).toBe(false)
    })
  })

  describe('map', () => {
    it('should transform value while preserving location', () => {
      const value = new LocatedValue(5, testLocation)
      const mapped = value.map((v) => v * 2)

      expect(mapped.value).toBe(10)
      expect(mapped.location.toString()).toBe(testLocation.toString())
    })

    it('should preserve textMapProvider', () => {
      const mockProvider: TextMapProvider = {
        getTextSync: vi.fn().mockReturnValue('text'),
      }
      const value = new LocatedValue(123, testLocation, mockProvider)
      const mapped = value.map((v) => v)

      expect(mapped.toText()).toBe('text')
    })
  })

  describe('orDefault', () => {
    it('should return value when defined', () => {
      const value = new LocatedValue(42, testLocation)
      expect(value.orDefault(0)).toBe(42)
    })

    it('should return default when undefined', () => {
      const value = new LocatedValue(undefined, testLocation)
      expect(value.orDefault(99)).toBe(99)
    })

    it('should return default when null', () => {
      const value = new LocatedValue(null, testLocation)
      expect(value.orDefault('default')).toBe('default')
    })
  })
})
