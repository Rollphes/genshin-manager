import { describe, expect, it } from 'vitest'

import { BodyNotFoundError } from '@/errors/BodyNotFoundError'
import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

describe('BodyNotFoundError', () => {
  it('should create error with request and response', () => {
    const request = new Request('https://example.com/api/data')
    const response = new Response(null, {
      status: 204,
      statusText: 'No Content',
    })
    const error = new BodyNotFoundError(request, response)

    expect(error).toBeInstanceOf(GenshinManagerError)
    expect(error.errorCode).toBe(ErrorCode.GmNetworkBodyNotFound)
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.message).toContain('Response body not found')
    expect(error.message).toContain('204')
    expect(error.message).toContain('https://example.com/api/data')
  })

  it('should support cause option for error chaining', () => {
    const originalError = new Error('Stream ended unexpectedly')
    const request = new Request('https://example.com')
    const response = new Response(null, { status: 200 })
    const error = new BodyNotFoundError(request, response, {
      cause: originalError,
    })

    expect(error.cause).toBe(originalError)
  })

  it('should work without cause', () => {
    const request = new Request('https://example.com')
    const response = new Response(null, { status: 200 })
    const error = new BodyNotFoundError(request, response)
    expect(error.cause).toBeUndefined()
  })

  it('should have correct name property', () => {
    const request = new Request('https://example.com')
    const response = new Response(null, { status: 200 })
    const error = new BodyNotFoundError(request, response)
    expect(error.name).toBe('BodyNotFoundError')
  })

  it('should have stack trace', () => {
    const request = new Request('https://example.com')
    const response = new Response(null, { status: 200 })
    const error = new BodyNotFoundError(request, response)
    expect(error.stack).toBeDefined()
    expect(typeof error.stack).toBe('string')
  })
})
