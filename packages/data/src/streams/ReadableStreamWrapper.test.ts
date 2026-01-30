import { describe, expect, it, vi } from 'vitest'

import { ReadableStreamWrapper } from '@/streams/ReadableStreamWrapper'

describe('ReadableStreamWrapper', () => {
  it('should create instance with reader', () => {
    const mockReader = {
      read: vi.fn().mockResolvedValue({ done: true, value: undefined }),
    } as unknown as ReadableStreamDefaultReader<Uint8Array>

    const wrapper = new ReadableStreamWrapper(mockReader)
    expect(wrapper).toBeInstanceOf(ReadableStreamWrapper)
  })

  it('should push data from reader', async () => {
    const testData = new Uint8Array([1, 2, 3, 4, 5])
    const mockReader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({ done: false, value: testData })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    } as unknown as ReadableStreamDefaultReader<Uint8Array>

    const wrapper = new ReadableStreamWrapper(mockReader)
    const chunks: Buffer[] = []

    await new Promise<void>((resolve) => {
      wrapper.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })
      wrapper.on('end', resolve)
    })

    expect(chunks).toHaveLength(1)
    expect(chunks[0]).toEqual(Buffer.from(testData))
  })

  it('should handle multiple chunks', async () => {
    const chunk1 = new Uint8Array([1, 2])
    const chunk2 = new Uint8Array([3, 4])
    const mockReader = {
      read: vi
        .fn()
        .mockResolvedValueOnce({ done: false, value: chunk1 })
        .mockResolvedValueOnce({ done: false, value: chunk2 })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    } as unknown as ReadableStreamDefaultReader<Uint8Array>

    const wrapper = new ReadableStreamWrapper(mockReader)
    const chunks: Buffer[] = []

    await new Promise<void>((resolve) => {
      wrapper.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })
      wrapper.on('end', resolve)
    })

    expect(chunks).toHaveLength(2)
    expect(chunks[0]).toEqual(Buffer.from(chunk1))
    expect(chunks[1]).toEqual(Buffer.from(chunk2))
  })

  it('should emit error on reader failure', async () => {
    const testError = new Error('Read failed')
    const mockReader = {
      read: vi.fn().mockRejectedValue(testError),
    } as unknown as ReadableStreamDefaultReader<Uint8Array>

    const wrapper = new ReadableStreamWrapper(mockReader)

    await new Promise<void>((resolve, reject) => {
      wrapper.on('error', (err: unknown) => {
        expect(err).toBe(testError)
        resolve()
      })
      wrapper.on('end', () => {
        reject(new Error('Should have emitted error'))
      })
      wrapper.read()
    })
  })

  it('should signal end when reader is done', async () => {
    const mockReadFn = vi
      .fn()
      .mockResolvedValue({ done: true, value: undefined })
    const mockReader = {
      read: mockReadFn,
    } as unknown as ReadableStreamDefaultReader<Uint8Array>

    const wrapper = new ReadableStreamWrapper(mockReader)

    await new Promise<void>((resolve) => {
      wrapper.on('end', resolve)
      wrapper.resume() // Trigger reading
    })

    expect(mockReadFn).toHaveBeenCalled()
  })
})
