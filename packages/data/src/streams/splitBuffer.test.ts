import { describe, expect, it } from 'vitest'

import { splitBuffer } from '@/streams/splitBuffer'

describe('splitBuffer', () => {
  it('should split buffer by single byte separator', () => {
    const buffer = Buffer.from('a,b,c')
    const separator = Buffer.from(',')
    const result = splitBuffer(buffer, separator)
    expect(result.map((b) => b.toString())).toEqual(['a', 'b', 'c'])
  })

  it('should split buffer by newline separator', () => {
    const buffer = Buffer.from('line1\nline2\nline3')
    const separator = Buffer.from('\n')
    const result = splitBuffer(buffer, separator)
    expect(result.map((b) => b.toString())).toEqual(['line1', 'line2', 'line3'])
  })

  it('should return single element for buffer without separator', () => {
    const buffer = Buffer.from('noseparator')
    const separator = Buffer.from(',')
    const result = splitBuffer(buffer, separator)
    expect(result).toHaveLength(1)
    expect(result[0].toString()).toBe('noseparator')
  })

  it('should handle empty buffer', () => {
    const buffer = Buffer.from('')
    const separator = Buffer.from(',')
    const result = splitBuffer(buffer, separator)
    expect(result).toHaveLength(1)
    expect(result[0].toString()).toBe('')
  })

  it('should handle multi-byte separator', () => {
    const buffer = Buffer.from('a::b::c')
    const separator = Buffer.from('::')
    const result = splitBuffer(buffer, separator)
    expect(result.map((b) => b.toString())).toEqual(['a', 'b', 'c'])
  })

  it('should handle separator at start of buffer', () => {
    const buffer = Buffer.from(',a,b')
    const separator = Buffer.from(',')
    const result = splitBuffer(buffer, separator)
    expect(result.map((b) => b.toString())).toEqual(['', 'a', 'b'])
  })

  it('should handle separator at end of buffer', () => {
    const buffer = Buffer.from('a,b,')
    const separator = Buffer.from(',')
    const result = splitBuffer(buffer, separator)
    expect(result.map((b) => b.toString())).toEqual(['a', 'b', ''])
  })

  it('should handle consecutive separators', () => {
    const buffer = Buffer.from('a,,b')
    const separator = Buffer.from(',')
    const result = splitBuffer(buffer, separator)
    expect(result.map((b) => b.toString())).toEqual(['a', '', 'b'])
  })

  it('should handle CRLF line endings', () => {
    const buffer = Buffer.from('line1\r\nline2\r\nline3')
    const separator = Buffer.from('\r\n')
    const result = splitBuffer(buffer, separator)
    expect(result.map((b) => b.toString())).toEqual(['line1', 'line2', 'line3'])
  })

  it('should return Buffer instances', () => {
    const buffer = Buffer.from('a,b')
    const separator = Buffer.from(',')
    const result = splitBuffer(buffer, separator)
    expect(result.every((r) => Buffer.isBuffer(r))).toBe(true)
  })
})
