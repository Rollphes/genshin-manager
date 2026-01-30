import { describe, expect, it } from 'vitest'

import { IndexRegistry } from '@/cache/IndexRegistry'

interface TestRecord {
  id: number
  name: string
  type: string
}

describe('IndexRegistry', () => {
  describe('register', () => {
    it('should register index patterns for a table', () => {
      const registry = new IndexRegistry<string, TestRecord>()
      registry.register('TestTable', [['id'], ['name', 'type']])

      expect(registry.has('TestTable')).toBe(true)
    })

    it('should overwrite existing patterns', () => {
      const registry = new IndexRegistry<string, TestRecord>()
      registry.register('TestTable', [['id']])
      registry.register('TestTable', [['name']])

      const patterns = registry.getPatterns('TestTable')
      expect(patterns).toEqual([['name']])
    })
  })

  describe('getPatterns', () => {
    it('should return registered patterns', () => {
      const registry = new IndexRegistry<string, TestRecord>()
      registry.register('TestTable', [['id'], ['name', 'type']])

      const patterns = registry.getPatterns('TestTable')
      expect(patterns).toEqual([['id'], ['name', 'type']])
    })

    it('should return undefined for unregistered table', () => {
      const registry = new IndexRegistry<string, TestRecord>()
      expect(registry.getPatterns('Unknown')).toBeUndefined()
    })
  })

  describe('has', () => {
    it('should return true for registered table', () => {
      const registry = new IndexRegistry<string, TestRecord>()
      registry.register('TestTable', [['id']])

      expect(registry.has('TestTable')).toBe(true)
    })

    it('should return false for unregistered table', () => {
      const registry = new IndexRegistry<string, TestRecord>()
      expect(registry.has('Unknown')).toBe(false)
    })
  })

  describe('clear', () => {
    it('should remove all registered patterns', () => {
      const registry = new IndexRegistry<string, TestRecord>()
      registry.register('Table1', [['id']])
      registry.register('Table2', [['name']])

      registry.clear()

      expect(registry.has('Table1')).toBe(false)
      expect(registry.has('Table2')).toBe(false)
    })
  })
})
