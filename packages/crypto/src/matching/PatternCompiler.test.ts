import { describe, expect, it } from 'vitest'

import { PatternCompiler } from '@/matching/PatternCompiler'

describe('PatternCompiler', () => {
  it('should compile null value to primitive pattern', () => {
    const compiler = new PatternCompiler()
    const result = compiler.compile(null)
    expect(result.type).toBe('primitive')
    if (result.type === 'primitive') expect(result.value).toBe(null)
  })

  it('should compile number to primitive pattern', () => {
    const compiler = new PatternCompiler()
    const result = compiler.compile(42)
    expect(result.type).toBe('primitive')
    if (result.type === 'primitive') expect(result.value).toBe(42)
  })

  it('should compile string to primitive pattern', () => {
    const compiler = new PatternCompiler()
    const result = compiler.compile('test')
    expect(result.type).toBe('primitive')
    if (result.type === 'primitive') expect(result.value).toBe('test')
  })

  it('should compile boolean to primitive pattern', () => {
    const compiler = new PatternCompiler()
    const result = compiler.compile(true)
    expect(result.type).toBe('primitive')
    if (result.type === 'primitive') expect(result.value).toBe(true)
  })

  it('should compile array to array pattern', () => {
    const compiler = new PatternCompiler()
    const result = compiler.compile([1, 2, 3])
    expect(result.type).toBe('array')
    if (result.type === 'array') expect(result.elements).toHaveLength(3)
  })

  it('should compile nested array elements', () => {
    const compiler = new PatternCompiler()
    const result = compiler.compile([{ key: 'value' }])
    expect(result.type).toBe('array')
    if (result.type === 'array') expect(result.elements[0].type).toBe('object')
  })

  it('should compile object to object pattern', () => {
    const compiler = new PatternCompiler()
    const result = compiler.compile({ key: 'value' })
    expect(result.type).toBe('object')
    if (result.type === 'object') {
      expect(result.properties.has('key')).toBe(true)
      expect(result.keyPaths.has('key')).toBe(true)
    }
  })

  it('should compile nested object properties', () => {
    const compiler = new PatternCompiler()
    const result = compiler.compile({ nested: { deep: 'value' } })
    expect(result.type).toBe('object')
    if (result.type === 'object') {
      const nestedPattern = result.properties.get('nested')
      expect(nestedPattern?.type).toBe('object')
    }
  })

  it('should cache compiled patterns', () => {
    const compiler = new PatternCompiler()
    const input = { key: 'value' }
    const result1 = compiler.compile(input)
    const result2 = compiler.compile(input)
    expect(result1).toBe(result2)
  })

  it('should clear cache', () => {
    const compiler = new PatternCompiler()
    compiler.compile({ key: 'value' })
    compiler.clearCache()
    // After clearing, next compile should create new pattern
    const result = compiler.compile({ key: 'value' })
    expect(result.type).toBe('object')
  })

  it('should track key paths correctly', () => {
    const compiler = new PatternCompiler()
    const result = compiler.compile({ a: { b: 1 } })
    if (result.type === 'object') {
      const keyPath = result.keyPaths.get('a')
      expect(keyPath).toEqual(['a'])
    }
  })
})
