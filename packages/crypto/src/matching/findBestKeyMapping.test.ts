import { describe, expect, it } from 'vitest'

import { findBestKeyMapping } from '@/matching/findBestKeyMapping'
import { PatternCompiler } from '@/matching/PatternCompiler'
import type { RequiredDecodingOptions } from '@/types'

describe('findBestKeyMapping', () => {
  const defaultOptions: RequiredDecodingOptions = {
    matchStrategy: 'fuzzy',
    maxDepth: 10,
    enablePartialMatch: true,
  }

  it('should return empty result for empty data', () => {
    const compiler = new PatternCompiler()
    const pattern = compiler.compile({ key: 'value' })

    const result = findBestKeyMapping([], pattern, defaultOptions)
    expect(result.success).toBe(false)
    expect(result.keyMappings.size).toBe(0)
    expect(result.confidence).toBe(0)
  })

  it('should match identical structures', () => {
    const compiler = new PatternCompiler()
    const masterObj = { name: 'test', value: 42 }
    const pattern = compiler.compile(masterObj)

    const result = findBestKeyMapping([masterObj], pattern, defaultOptions)
    expect(result.success).toBe(true)
    expect(result.confidence).toBeGreaterThan(0)
  })

  it('should find key mappings for encrypted keys', () => {
    const compiler = new PatternCompiler()
    const pattern = compiler.compile({ originalKey: 'testValue' })

    const encryptedData = [{ encryptedKey: 'testValue' }]
    const result = findBestKeyMapping(encryptedData, pattern, defaultOptions)

    expect(result.success).toBe(true)
    expect(result.keyMappings.size).toBeGreaterThan(0)
  })

  it('should select best match from multiple objects', () => {
    const compiler = new PatternCompiler()
    const pattern = compiler.compile({ key: 'exactMatch' })

    const encryptedData = [
      { different: 'noMatch' },
      { other: 'exactMatch' },
      { another: 'almostMatch' },
    ]
    const result = findBestKeyMapping(encryptedData, pattern, defaultOptions)

    expect(result.success).toBe(true)
    expect(result.confidence).toBeGreaterThan(0)
  })

  it('should respect exact match strategy', () => {
    const compiler = new PatternCompiler()
    const pattern = compiler.compile({ key: 'Value' })

    const exactOptions: RequiredDecodingOptions = {
      matchStrategy: 'exact',
      maxDepth: 10,
      enablePartialMatch: true,
    }

    // Different case should not match with exact strategy
    const encryptedData = [{ enc: 'value' }]
    const result = findBestKeyMapping(encryptedData, pattern, exactOptions)

    // With 'exact' strategy, 'Value' !== 'value'
    expect(result.confidence).toBeLessThan(1)
  })

  it('should stop early with high confidence match', () => {
    const compiler = new PatternCompiler()
    const pattern = compiler.compile({ key: 'test' })

    // First object is perfect match
    const encryptedData = [
      { key: 'test' },
      { other: 'different' },
      { another: 'values' },
    ]
    const result = findBestKeyMapping(encryptedData, pattern, defaultOptions)

    expect(result.success).toBe(true)
    expect(result.confidence).toBeGreaterThanOrEqual(0.95)
  })

  it('should handle nested patterns', () => {
    const compiler = new PatternCompiler()
    const pattern = compiler.compile({ outer: { inner: 'value' } })

    const encryptedData = [{ enc1: { enc2: 'value' } }]
    const result = findBestKeyMapping(encryptedData, pattern, defaultOptions)

    expect(result.success).toBe(true)
  })

  it('should handle primitive patterns', () => {
    const compiler = new PatternCompiler()
    const pattern = compiler.compile(42)

    const result = findBestKeyMapping([{ value: 42 }], pattern, defaultOptions)
    // Primitive pattern against object should not match well
    expect(result.confidence).toBeLessThan(1)
  })

  it('should respect maxDepth option', () => {
    const compiler = new PatternCompiler()
    const pattern = compiler.compile({ a: { b: { c: { d: 'deep' } } } })

    const shallowOptions: RequiredDecodingOptions = {
      matchStrategy: 'fuzzy',
      maxDepth: 1,
      enablePartialMatch: true,
    }

    const encryptedData = [{ x: { y: { z: { w: 'deep' } } } }]
    const result = findBestKeyMapping(encryptedData, pattern, shallowOptions)

    // With maxDepth=1, deep nesting should not match fully
    expect(result.confidence).toBeLessThan(1)
  })
})
