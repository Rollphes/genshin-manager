import { describe, expect, it } from 'vitest'

import { decodePropertyNames } from '@/matching/decodePropertyNames'
import type { JsonPropertyPath } from '@/types'

describe('decodePropertyNames', () => {
  it('should return null for null input', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    expect(decodePropertyNames(null, pathToOriginalNameMap)).toBe(null)
  })

  it('should return undefined for undefined input', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    expect(decodePropertyNames(undefined, pathToOriginalNameMap)).toBe(
      undefined,
    )
  })

  it('should return primitive values unchanged', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    expect(decodePropertyNames(42, pathToOriginalNameMap)).toBe(42)
    expect(decodePropertyNames('test', pathToOriginalNameMap)).toBe('test')
    expect(decodePropertyNames(true, pathToOriginalNameMap)).toBe(true)
  })

  it('should decode object keys using mappings', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    pathToOriginalNameMap.set(['encryptedKey'], 'originalKey')

    const result = decodePropertyNames(
      { encryptedKey: 'value' },
      pathToOriginalNameMap,
    )
    expect(result).toEqual({ originalKey: 'value' })
  })

  it('should preserve unmapped keys', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    pathToOriginalNameMap.set(['mappedKey'], 'newKey')

    const result = decodePropertyNames(
      { mappedKey: 'value1', unmappedKey: 'value2' },
      pathToOriginalNameMap,
    )
    expect(result).toEqual({ newKey: 'value1', unmappedKey: 'value2' })
  })

  it('should decode nested object keys', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    pathToOriginalNameMap.set(['parent'], 'newParent')
    pathToOriginalNameMap.set(['parent', 'child'], 'newChild')

    const result = decodePropertyNames(
      { parent: { child: 'value' } },
      pathToOriginalNameMap,
    )
    expect(result).toEqual({ newParent: { newChild: 'value' } })
  })

  it('should handle array elements', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    const result = decodePropertyNames([1, 2, 3], pathToOriginalNameMap)
    expect(result).toEqual([1, 2, 3])
  })

  it('should decode objects inside arrays', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    pathToOriginalNameMap.set([0, 'encKey'], 'decKey')

    const result = decodePropertyNames(
      [{ encKey: 'value' }],
      pathToOriginalNameMap,
    )
    expect(result).toEqual([{ decKey: 'value' }])
  })

  it('should handle deeply nested structures', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    pathToOriginalNameMap.set(['a', 'b', 'c'], 'decoded')

    const result = decodePropertyNames(
      { a: { b: { c: 'value' } } },
      pathToOriginalNameMap,
    )
    expect(result).toEqual({ a: { b: { decoded: 'value' } } })
  })

  it('should handle empty object', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    expect(decodePropertyNames({}, pathToOriginalNameMap)).toEqual({})
  })

  it('should handle empty array', () => {
    const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
    expect(decodePropertyNames([], pathToOriginalNameMap)).toEqual([])
  })
})
