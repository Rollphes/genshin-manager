import { describe, expect, it, vi } from 'vitest'

import { TextMapEmptyWritable } from '@/streams/TextMapEmptyWritable'

describe('TextMapEmptyWritable', () => {
  it('should create instance', () => {
    const writable = new TextMapEmptyWritable()
    expect(writable).toBeInstanceOf(TextMapEmptyWritable)
  })

  it('should emit data event with textMapHash-textValue pair', async () => {
    const writable = new TextMapEmptyWritable()
    const dataHandler = vi.fn()
    writable.on('data', dataHandler)

    const line = '"123": "Hello World"\n'
    await new Promise<void>((resolve) => {
      writable.write(Buffer.from(line), () => {
        resolve()
      })
    })

    expect(dataHandler).toHaveBeenCalledWith({
      textMapHash: '123',
      textValue: 'Hello World',
    })
  })

  it('should handle multiple lines in single chunk', async () => {
    const writable = new TextMapEmptyWritable()
    const dataHandler = vi.fn()
    writable.on('data', dataHandler)

    const lines = '"hash1": "value1"\n"hash2": "value2"\n'
    await new Promise<void>((resolve) => {
      writable.write(Buffer.from(lines), () => {
        resolve()
      })
    })

    expect(dataHandler).toHaveBeenCalledTimes(2)
    expect(dataHandler).toHaveBeenNthCalledWith(1, {
      textMapHash: 'hash1',
      textValue: 'value1',
    })
    expect(dataHandler).toHaveBeenNthCalledWith(2, {
      textMapHash: 'hash2',
      textValue: 'value2',
    })
  })

  it('should buffer incomplete lines', async () => {
    const writable = new TextMapEmptyWritable()
    const dataHandler = vi.fn()
    writable.on('data', dataHandler)

    // Write incomplete line
    await new Promise<void>((resolve) => {
      writable.write(Buffer.from('"partial": "val'), () => {
        resolve()
      })
    })

    expect(dataHandler).not.toHaveBeenCalled()

    // Complete the line
    await new Promise<void>((resolve) => {
      writable.write(Buffer.from('ue"\n'), () => {
        resolve()
      })
    })

    expect(dataHandler).toHaveBeenCalledWith({
      textMapHash: 'partial',
      textValue: 'value',
    })
  })

  it('should replace \\n with actual newlines in value', async () => {
    const writable = new TextMapEmptyWritable()
    const dataHandler = vi.fn()
    writable.on('data', dataHandler)

    const line = '"123456": "line1\\nline2"\n'
    await new Promise<void>((resolve) => {
      writable.write(Buffer.from(line), () => {
        resolve()
      })
    })

    expect(dataHandler).toHaveBeenCalledWith({
      textMapHash: '123456',
      textValue: 'line1\nline2',
    })
  })

  it('should skip malformed lines', async () => {
    const writable = new TextMapEmptyWritable()
    const dataHandler = vi.fn()
    writable.on('data', dataHandler)

    const lines = 'malformed line\n"valid": "data"\n'
    await new Promise<void>((resolve) => {
      writable.write(Buffer.from(lines), () => {
        resolve()
      })
    })

    expect(dataHandler).toHaveBeenCalledTimes(1)
    expect(dataHandler).toHaveBeenCalledWith({
      textMapHash: 'valid',
      textValue: 'data',
    })
  })

  it('should handle empty value', async () => {
    const writable = new TextMapEmptyWritable()
    const dataHandler = vi.fn()
    writable.on('data', dataHandler)

    const line = '"789012": ""\n'
    await new Promise<void>((resolve) => {
      writable.write(Buffer.from(line), () => {
        resolve()
      })
    })

    expect(dataHandler).toHaveBeenCalledWith({
      textMapHash: '789012',
      textValue: '',
    })
  })

  it('should handle callback even when no lines to process', async () => {
    const writable = new TextMapEmptyWritable()
    const callback = vi.fn()

    writable.write(Buffer.from('no newline'), callback)

    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(callback).toHaveBeenCalled()
  })
})
