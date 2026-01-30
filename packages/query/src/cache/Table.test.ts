import { describe, expect, it } from 'vitest'

import { Table } from '@/cache/Table'

interface TestRecord {
  id: number
  name: string
  type: string
  value: number
}

describe('Table', () => {
  const testData: TestRecord[] = [
    { id: 1, name: 'Alice', type: 'admin', value: 100 },
    { id: 2, name: 'Bob', type: 'user', value: 50 },
    { id: 3, name: 'Charlie', type: 'user', value: 75 },
    { id: 4, name: 'Diana', type: 'admin', value: 200 },
  ]

  describe('constructor', () => {
    it('should store data', () => {
      const table = new Table(testData)
      expect(table.size).toBe(4)
    })
  })

  describe('createIndex', () => {
    it('should create primary index for single key', () => {
      const table = new Table(testData)
      table.createIndex(['id'])

      expect(table.hasIndex('id')).toBe(true)
    })

    it('should create composite index for multiple keys', () => {
      const table = new Table(testData)
      table.createIndex(['type', 'name'])

      // Composite indexes are verified via getByCompositeIndex
      const results = table.getByCompositeIndex(
        ['type', 'name'],
        ['admin', 'Alice'],
      )
      expect(results).toHaveLength(1)
    })
  })

  describe('getByIndex', () => {
    it('should find record by indexed key', () => {
      const table = new Table(testData)
      table.createIndex(['id'])

      const record = table.getByIndex('id', 2)
      expect(record).toEqual({ id: 2, name: 'Bob', type: 'user', value: 50 })
    })

    it('should return undefined for non-existent value', () => {
      const table = new Table(testData)
      table.createIndex(['id'])

      expect(table.getByIndex('id', 999)).toBeUndefined()
    })

    it('should return undefined for non-indexed key', () => {
      const table = new Table(testData)

      expect(table.getByIndex('id', 1)).toBeUndefined()
    })

    it('should work with string keys', () => {
      const table = new Table(testData)
      table.createIndex(['name'])

      const record = table.getByIndex('name', 'Charlie')
      expect(record?.id).toBe(3)
    })
  })

  describe('getByCompositeIndex', () => {
    it('should find records by composite key', () => {
      const table = new Table(testData)
      table.createIndex(['type', 'value'])

      const results = table.getByCompositeIndex(
        ['type', 'value'],
        ['admin', 100],
      )
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Alice')
    })

    it('should return multiple records for non-unique composite key', () => {
      const table = new Table([
        { id: 1, name: 'A', type: 'x', value: 10 },
        { id: 2, name: 'B', type: 'x', value: 10 },
        { id: 3, name: 'C', type: 'y', value: 10 },
      ])
      table.createIndex(['type', 'value'])

      const results = table.getByCompositeIndex(['type', 'value'], ['x', 10])
      expect(results).toHaveLength(2)
    })

    it('should return empty array for non-existent composite value', () => {
      const table = new Table(testData)
      table.createIndex(['type', 'name'])

      const results = table.getByCompositeIndex(
        ['type', 'name'],
        ['admin', 'Bob'],
      )
      expect(results).toHaveLength(0)
    })

    it('should return empty array for non-indexed composite key', () => {
      const table = new Table(testData)

      const results = table.getByCompositeIndex(
        ['type', 'name'],
        ['admin', 'Alice'],
      )
      expect(results).toHaveLength(0)
    })
  })

  describe('getAll', () => {
    it('should return all records', () => {
      const table = new Table(testData)
      expect(table.getAll()).toEqual(testData)
    })
  })

  describe('size', () => {
    it('should return record count', () => {
      expect(new Table(testData).size).toBe(4)
      expect(new Table([]).size).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should not recreate existing primary index', () => {
      const table = new Table(testData)
      table.createIndex(['id'])
      table.createIndex(['id']) // Should not throw or recreate

      expect(table.getByIndex('id', 1)).toBeDefined()
    })

    it('should handle empty pattern array', () => {
      const table = new Table(testData)
      table.createIndex([]) // Should not throw

      expect(table.getAll()).toEqual(testData)
    })

    it('should skip records with invalid index values', () => {
      const dataWithNulls = [
        { id: 1, name: 'A', type: 'x', value: 10 },
        { id: null as unknown as number, name: 'B', type: 'y', value: 20 },
        { id: 3, name: 'C', type: 'z', value: 30 },
      ]

      const table = new Table(dataWithNulls)
      table.createIndex(['id'])

      expect(table.getByIndex('id', 1)).toBeDefined()
      expect(table.getByIndex('id', 3)).toBeDefined()
      // null should not be indexed
    })
  })
})
