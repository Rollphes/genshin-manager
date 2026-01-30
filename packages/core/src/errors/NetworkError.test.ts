import { describe, expect, it } from 'vitest'

import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import { NetworkError } from '@/errors/NetworkError'

describe('NetworkError', () => {
  it('should create error with request and response', () => {
    const request = new Request('https://example.com/api')
    const response = new Response(null, {
      status: 404,
      statusText: 'Not Found',
    })
    const error = new NetworkError(request, response)

    expect(error).toBeInstanceOf(GenshinManagerError)
    expect(error.errorCode).toBe(ErrorCode.GmNetwork)
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.message).toContain('404')
    expect(error.message).toContain('Not Found')
    expect(error.message).toContain('https://example.com/api')
  })

  it('should support cause option for error chaining', () => {
    const originalError = new Error('Connection refused')
    const request = new Request('https://example.com/api')
    const response = new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
    const error = new NetworkError(request, response, {
      cause: originalError,
    })

    expect(error.cause).toBe(originalError)
  })

  it('should work without cause', () => {
    const request = new Request('https://example.com/api')
    const response = new Response(null, { status: 503 })
    const error = new NetworkError(request, response)

    expect(error.cause).toBeUndefined()
  })

  it('should have correct name property', () => {
    const request = new Request('https://example.com')
    const response = new Response(null, { status: 500 })
    const error = new NetworkError(request, response)

    expect(error.name).toBe('NetworkError')
  })

  it('should have stack trace', () => {
    const request = new Request('https://example.com')
    const response = new Response(null, { status: 500 })
    const error = new NetworkError(request, response)

    expect(error.stack).toBeDefined()
    expect(typeof error.stack).toBe('string')
  })
})
