import { describe, expect, it, vi } from 'vitest'

import { Location } from '@/location/Location'
import { LocatedArray } from '@/value/LocatedArray'
import { LocatedValue } from '@/value/LocatedValue'
import type { TextMapProvider } from '@/value/types'

describe('LocatedArray', () => {
  const testLocation = Location.create('Test', 'Data').prop('items')

  describe('constructor', () => {
    it('should store value and location', () => {
      const arr = new LocatedArray([1, 2, 3], testLocation)
      expect(arr.value).toEqual([1, 2, 3])
      expect(arr.location.toString()).toBe('Test:Data.items')
    })
  })

  describe('length', () => {
    it('should return array length', () => {
      expect(new LocatedArray([1, 2, 3], testLocation).length).toBe(3)
      expect(new LocatedArray([], testLocation).length).toBe(0)
    })
  })

  describe('map', () => {
    it('should map primitive values with LocatedValue', () => {
      const arr = new LocatedArray([10, 20, 30], testLocation)
      const result = arr.map((item, idx) => {
        expect(item).toBeInstanceOf(LocatedValue)
        expect(item.location.toString()).toBe(`Test:Data.items[${String(idx)}]`)
        return item.value * 2
      })
      expect(result).toEqual([20, 40, 60])
    })

    it('should map object values with wrapped properties', () => {
      const arr = new LocatedArray(
        [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 },
        ],
        testLocation,
      )

      const result = arr.map((item, idx) => {
        expect(item.name).toBeInstanceOf(LocatedValue)
        expect(item.age).toBeInstanceOf(LocatedValue)
        expect(item.name.location.toString()).toBe(
          `Test:Data.items[${String(idx)}].name`,
        )
        expect(item.age.location.toString()).toBe(
          `Test:Data.items[${String(idx)}].age`,
        )
        const name = item.name.value
        const age = item.age.value
        return `${name}: ${String(age)}`
      })

      expect(result).toEqual(['Alice: 30', 'Bob: 25'])
    })

    it('should handle nested arrays in objects', () => {
      const arr = new LocatedArray(
        [{ tags: ['a', 'b'] }, { tags: ['c'] }],
        testLocation,
      )

      arr.map((item, idx) => {
        expect(item.tags).toBeInstanceOf(LocatedArray)
        expect(item.tags.location.toString()).toBe(
          `Test:Data.items[${String(idx)}].tags`,
        )
        return item.tags.length
      })
    })
  })

  describe('filter', () => {
    it('should filter elements with location tracking', () => {
      const arr = new LocatedArray([1, 2, 3, 4, 5], testLocation)
      const filtered = arr.filter((item) => item.value > 2)

      expect(filtered).toBeInstanceOf(LocatedArray)
      expect(filtered.toArray()).toEqual([3, 4, 5])
    })

    it('should filter objects with location tracking', () => {
      const arr = new LocatedArray(
        [
          { active: true, name: 'A' },
          { active: false, name: 'B' },
          { active: true, name: 'C' },
        ],
        testLocation,
      )

      const filtered = arr.filter((item) => item.active.value)
      expect(filtered.toArray()).toEqual([
        { active: true, name: 'A' },
        { active: true, name: 'C' },
      ])
    })
  })

  describe('find', () => {
    it('should find element with location tracking', () => {
      const arr = new LocatedArray([10, 20, 30], testLocation)
      const found = arr.find((item) => item.value === 20)

      expect(found).toBeInstanceOf(LocatedValue)
      expect(found).toBeDefined()
      if (found) {
        expect(found.value).toBe(20)
        expect(found.location.toString()).toBe('Test:Data.items[1]')
      }
    })

    it('should return undefined when not found', () => {
      const arr = new LocatedArray([1, 2, 3], testLocation)
      const found = arr.find((item) => item.value === 99)
      expect(found).toBeUndefined()
    })

    it('should find object with wrapped properties', () => {
      const arr = new LocatedArray(
        [
          { id: 1, name: 'A' },
          { id: 2, name: 'B' },
        ],
        testLocation,
      )

      const found = arr.find((item) => item.id.value === 2)
      expect(found).toBeDefined()
      expect(found?.name.value).toBe('B')
      expect(found?.name.location.toString()).toBe('Test:Data.items[1].name')
    })
  })

  describe('at', () => {
    it('should return element at index with location', () => {
      const arr = new LocatedArray(['a', 'b', 'c'], testLocation)
      const item = arr.at(1)

      expect(item).toBeInstanceOf(LocatedValue)
      expect(item).toBeDefined()
      if (item) {
        expect(item.value).toBe('b')
        expect(item.location.toString()).toBe('Test:Data.items[1]')
      }
    })

    it('should return undefined for out of bounds', () => {
      const arr = new LocatedArray([1, 2], testLocation)
      expect(arr.at(5)).toBeUndefined()
      expect(arr.at(-1)).toBeUndefined()
    })
  })

  describe('some', () => {
    it('should return true if any element matches', () => {
      const arr = new LocatedArray([1, 2, 3], testLocation)
      expect(arr.some((item) => item.value === 2)).toBe(true)
    })

    it('should return false if no element matches', () => {
      const arr = new LocatedArray([1, 2, 3], testLocation)
      expect(arr.some((item) => item.value === 99)).toBe(false)
    })
  })

  describe('every', () => {
    it('should return true if all elements match', () => {
      const arr = new LocatedArray([2, 4, 6], testLocation)
      expect(arr.every((item) => item.value % 2 === 0)).toBe(true)
    })

    it('should return false if any element does not match', () => {
      const arr = new LocatedArray([2, 3, 4], testLocation)
      expect(arr.every((item) => item.value % 2 === 0)).toBe(false)
    })
  })

  describe('toArray', () => {
    it('should return a copy of the raw array', () => {
      const original = [1, 2, 3]
      const arr = new LocatedArray(original, testLocation)
      const copy = arr.toArray()

      expect(copy).toEqual(original)
      expect(copy).not.toBe(original)
    })
  })

  describe('textMapProvider integration', () => {
    it('should pass textMapProvider to wrapped values', () => {
      const getTextSyncMock = vi.fn().mockReturnValue('translated')
      const mockProvider: TextMapProvider = {
        getTextSync: getTextSyncMock,
      }

      const arr = new LocatedArray(
        [{ hash: 12345 }, { hash: 67890 }],
        testLocation,
        mockProvider,
      )

      const result = arr.map((item) => item.hash.toText())

      expect(result).toEqual(['translated', 'translated'])
      expect(getTextSyncMock).toHaveBeenCalledWith(12345)
      expect(getTextSyncMock).toHaveBeenCalledWith(67890)
    })
  })
})
