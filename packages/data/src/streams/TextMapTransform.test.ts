import { Language } from '@genshin-manager/core'
import { Readable } from 'stream'
import { beforeEach, describe, expect, it } from 'vitest'

import { TextMapFormatError } from '@/errors/TextMapFormatError'
import { FileLocation } from '@/paths/FileLocation'
import { TextMapTransform } from '@/streams/TextMapTransform'

describe('TextMapTransform', () => {
  let testLocation: FileLocation

  beforeEach(() => {
    FileLocation.deploy({ assetCacheFolderPath: '/test-cache' })
    testLocation = FileLocation.textMapFolder()
  })

  async function collectOutput(transform: TextMapTransform): Promise<string> {
    const chunks: Buffer[] = []
    return new Promise((resolve, reject) => {
      transform.on('data', (chunk: Buffer) => chunks.push(chunk))
      transform.on('end', () => {
        resolve(Buffer.concat(chunks).toString())
      })
      transform.on('error', reject)
    })
  }

  it('should create instance with language, filter set and location', () => {
    const filterSet = new Set([123, 456])
    const transform = new TextMapTransform(Language.En, filterSet, testLocation)
    expect(transform).toBeInstanceOf(TextMapTransform)
  })

  it('should filter lines by hash key', async () => {
    const filterSet = new Set([123])
    const transform = new TextMapTransform(Language.En, filterSet, testLocation)

    const input = '{\n"123": "Hello"\n"456": "World"\n}'
    const readable = Readable.from([input])
    readable.pipe(transform)

    const output = await collectOutput(transform)
    expect(output).toContain('"123"')
    expect(output).not.toContain('"456"')
  })

  it('should output valid JSON structure', async () => {
    const filterSet = new Set([123, 789])
    const transform = new TextMapTransform(Language.En, filterSet, testLocation)

    const input = '{\n"123": "Hello"\n"789": "Test"\n}'
    const readable = Readable.from([input])
    readable.pipe(transform)

    const output = await collectOutput(transform)
    expect(output.startsWith('{')).toBe(true)
    expect(output.endsWith('}')).toBe(true)
  })

  it('should handle multiple matching entries', async () => {
    const filterSet = new Set([123, 456])
    const transform = new TextMapTransform(Language.En, filterSet, testLocation)

    const input = '{\n"123": "First"\n"456": "Second"\n}'
    const readable = Readable.from([input])
    readable.pipe(transform)

    const output = await collectOutput(transform)
    expect(output).toContain('"123"')
    expect(output).toContain('"456"')
    expect(output).toContain(',')
  })

  it('should handle chunked input', async () => {
    const filterSet = new Set([123])
    const transform = new TextMapTransform(Language.En, filterSet, testLocation)

    // Simulate chunked delivery
    const chunks = ['{\n"12', '3": "Hello"\n}']
    const readable = Readable.from(chunks)
    readable.pipe(transform)

    const output = await collectOutput(transform)
    expect(output).toContain('"123"')
  })

  it('should replace escaped newlines in values', async () => {
    const filterSet = new Set([123])
    const transform = new TextMapTransform(Language.En, filterSet, testLocation)

    const input = '{\n"123": "Line1\\\\nLine2"\n}'
    const readable = Readable.from([input])
    readable.pipe(transform)

    const output = await collectOutput(transform)
    expect(output).toContain('\\n')
  })

  it('should skip malformed lines', async () => {
    const filterSet = new Set([123])
    const transform = new TextMapTransform(Language.En, filterSet, testLocation)

    const input = '{\nmalformed line\n"123": "Valid"\n}'
    const readable = Readable.from([input])
    readable.pipe(transform)

    const output = await collectOutput(transform)
    expect(output).toContain('"123"')
    expect(output).not.toContain('malformed')
  })

  it('should throw TextMapFormatError when JSON does not end with closing brace', async () => {
    const filterSet = new Set([123])
    const transform = new TextMapTransform(Language.En, filterSet, testLocation)

    const input = '{\n"123": "Hello"\n'
    const readable = Readable.from([input])
    readable.pipe(transform)

    await expect(collectOutput(transform)).rejects.toThrow(TextMapFormatError)
  })

  it('should return empty filtered output for no matches', async () => {
    const filterSet = new Set([999])
    const transform = new TextMapTransform(Language.En, filterSet, testLocation)

    const input = '{\n"123": "Hello"\n}'
    const readable = Readable.from([input])
    readable.pipe(transform)

    const output = await collectOutput(transform)
    // Should still have JSON structure but no entries
    expect(output).toContain('{')
  })
})
