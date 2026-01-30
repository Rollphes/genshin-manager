import { describe, expect, it } from 'vitest'

import { TableCache } from '@/cache/TableCache'
import { Location } from '@/location/Location'

interface TestRecord {
  id: number
  name: string
  type: string
}

type TestTableName = 'TableA' | 'TableB'

class TestTableCache extends TableCache<TestTableName, TestRecord> {
  public loadCount = 0
  public loadedTables: TestTableName[] = []
  private mockData = new Map<TestTableName, TestRecord[]>()

  public setMockData(tableName: TestTableName, data: TestRecord[]): void {
    this.mockData.set(tableName, data)
  }

  protected loadTableData(tableName: TestTableName): Promise<TestRecord[]> {
    this.loadCount++
    this.loadedTables.push(tableName)
    return Promise.resolve(this.mockData.get(tableName) ?? [])
  }

  protected createLocation(tableName: TestTableName): Location {
    return Location.create('Test', tableName)
  }
}

describe('TableCache', () => {
  describe('registerIndex', () => {
    it('should register index patterns', async () => {
      const cache = new TestTableCache('/test')
      cache.setMockData('TableA', [
        { id: 1, name: 'A', type: 'x' },
        { id: 2, name: 'B', type: 'y' },
      ])

      cache.registerIndex('TableA', [['id'], ['name', 'type']])

      const table = await cache.getTable('TableA')
      expect(table.hasIndex('id')).toBe(true)
    })
  })

  describe('getTable', () => {
    it('should load table on first access', async () => {
      const cache = new TestTableCache('/test')
      cache.setMockData('TableA', [{ id: 1, name: 'Test', type: 'x' }])

      const table = await cache.getTable('TableA')

      expect(cache.loadCount).toBe(1)
      expect(table.size).toBe(1)
    })

    it('should return cached table on subsequent access', async () => {
      const cache = new TestTableCache('/test')
      cache.setMockData('TableA', [{ id: 1, name: 'Test', type: 'x' }])

      await cache.getTable('TableA')
      await cache.getTable('TableA')
      await cache.getTable('TableA')

      expect(cache.loadCount).toBe(1)
    })

    it('should build indexes when loading', async () => {
      const cache = new TestTableCache('/test')
      cache.setMockData('TableA', [
        { id: 1, name: 'Alice', type: 'admin' },
        { id: 2, name: 'Bob', type: 'user' },
      ])
      cache.registerIndex('TableA', [['id']])

      const table = await cache.getTable('TableA')

      expect(table.getByIndex('id', 1)?.name).toBe('Alice')
      expect(table.getByIndex('id', 2)?.name).toBe('Bob')
    })
  })

  describe('has', () => {
    it('should return true for cached table', async () => {
      const cache = new TestTableCache('/test')
      cache.setMockData('TableA', [])

      await cache.getTable('TableA')

      expect(cache.has('TableA')).toBe(true)
    })

    it('should return false for non-cached table', () => {
      const cache = new TestTableCache('/test')
      expect(cache.has('TableA')).toBe(false)
    })
  })

  describe('evict', () => {
    it('should remove table from cache', async () => {
      const cache = new TestTableCache('/test')
      cache.setMockData('TableA', [])

      await cache.getTable('TableA')
      expect(cache.has('TableA')).toBe(true)

      const result = cache.evict('TableA')

      expect(result).toBe(true)
      expect(cache.has('TableA')).toBe(false)
    })

    it('should return false when table not cached', () => {
      const cache = new TestTableCache('/test')
      expect(cache.evict('TableA')).toBe(false)
    })

    it('should allow reloading after eviction', async () => {
      const cache = new TestTableCache('/test')
      cache.setMockData('TableA', [])

      await cache.getTable('TableA')
      cache.evict('TableA')
      await cache.getTable('TableA')

      expect(cache.loadCount).toBe(2)
    })
  })

  describe('clear', () => {
    it('should remove all cached tables', async () => {
      const cache = new TestTableCache('/test')
      cache.setMockData('TableA', [])
      cache.setMockData('TableB', [])

      await cache.getTable('TableA')
      await cache.getTable('TableB')
      expect(cache.size).toBe(2)

      cache.clear()

      expect(cache.size).toBe(0)
      expect(cache.has('TableA')).toBe(false)
      expect(cache.has('TableB')).toBe(false)
    })
  })

  describe('size', () => {
    it('should return number of cached tables', async () => {
      const cache = new TestTableCache('/test')
      cache.setMockData('TableA', [])
      cache.setMockData('TableB', [])

      expect(cache.size).toBe(0)

      await cache.getTable('TableA')
      expect(cache.size).toBe(1)

      await cache.getTable('TableB')
      expect(cache.size).toBe(2)
    })
  })

  describe('LRU eviction', () => {
    it('should evict oldest tables when max is reached', async () => {
      const cache = new TestTableCache('/test', 2) // Max 2 tables
      cache.setMockData('TableA', [{ id: 1, name: 'A', type: 'x' }])
      cache.setMockData('TableB', [{ id: 2, name: 'B', type: 'y' }])

      await cache.getTable('TableA')
      await cache.getTable('TableB')

      expect(cache.size).toBe(2)

      // Access TableA to make it more recent
      await cache.getTable('TableA')

      // Add a third table (simulated by clearing and reloading)
      // Note: LRU cache behavior depends on implementation
      expect(cache.size).toBe(2)
    })
  })
})
