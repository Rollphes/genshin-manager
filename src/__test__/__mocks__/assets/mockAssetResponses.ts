import { vi } from 'vitest'

import {
  corruptedOggData,
  corruptedPngData,
  validOggData,
  validPngData,
} from '@/__test__/__mocks__/assets/mockBinaryData'

/**
 * Mock fetch responses for asset testing
 */

/**
 * Create a successful image response with valid PNG data
 * @returns Mock Response with valid PNG data
 */
export function createSuccessfulImageResponse(): Response {
  const stream = new ReadableStream({
    start(controller: ReadableStreamDefaultController): void {
      controller.enqueue(validPngData)
      controller.close()
    },
  })

  return new Response(stream, {
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'image/png',
      'content-length': String(validPngData.length),
    },
  })
}

/**
 * Create a successful audio response with valid OGG data
 * @returns Mock Response with valid OGG data
 */
export function createSuccessfulAudioResponse(): Response {
  const stream = new ReadableStream({
    start(controller: ReadableStreamDefaultController): void {
      controller.enqueue(validOggData)
      controller.close()
    },
  })

  return new Response(stream, {
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'audio/ogg',
      'content-length': String(validOggData.length),
    },
  })
}

/**
 * Create a corrupted image response with invalid PNG data
 * @returns Mock Response with corrupted PNG data
 */
export function createCorruptedImageResponse(): Response {
  const stream = new ReadableStream({
    start(controller: ReadableStreamDefaultController): void {
      controller.enqueue(corruptedPngData)
      controller.close()
    },
  })

  return new Response(stream, {
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'image/png',
      'content-length': String(corruptedPngData.length),
    },
  })
}

/**
 * Create a corrupted audio response with invalid OGG data
 * @returns Mock Response with corrupted OGG data
 */
export function createCorruptedAudioResponse(): Response {
  const stream = new ReadableStream({
    start(controller: ReadableStreamDefaultController): void {
      controller.enqueue(corruptedOggData)
      controller.close()
    },
  })

  return new Response(stream, {
    status: 200,
    statusText: 'OK',
    headers: {
      'content-type': 'audio/ogg',
      'content-length': String(corruptedOggData.length),
    },
  })
}

/**
 * Create a 404 not found response
 * @returns Mock Response with 404 status
 */
export function createNotFoundResponse(): Response {
  return new Response(null, {
    status: 404,
    statusText: 'Not Found',
  })
}

/**
 * Create a network error response
 * @returns Mock Response with 500 status
 */
export function createNetworkErrorResponse(): Response {
  return new Response(null, {
    status: 500,
    statusText: 'Internal Server Error',
  })
}

/**
 * Setup mock fetch for asset testing
 * @param mockResponses - Map of URL patterns to response functions
 */
export function setupAssetMock(
  mockResponses: Record<string, (url: string) => Response> = {},
): void {
  global.fetch = vi.fn().mockImplementation((url: RequestInfo | URL) => {
    let urlString: string
    if (typeof url === 'string') urlString = url
    else if (url instanceof URL) urlString = url.href
    else if ('url' in url) urlString = url.url
    else urlString = ''

    // Check for specific mock responses first
    for (const [pattern, responseFunc] of Object.entries(mockResponses))
      if (urlString.includes(pattern)) return responseFunc(urlString)

    // Default behavior based on URL patterns
    if (urlString.includes('error') || urlString.includes('fail'))
      return createNetworkErrorResponse()

    if (urlString.includes('notfound') || urlString.includes('404'))
      return createNotFoundResponse()

    if (urlString.includes('corrupted-image'))
      return createCorruptedImageResponse()

    if (urlString.includes('corrupted-audio'))
      return createCorruptedAudioResponse()

    if (urlString.endsWith('.png') || urlString.includes('image'))
      return createSuccessfulImageResponse()

    if (urlString.endsWith('.ogg') || urlString.includes('audio'))
      return createSuccessfulAudioResponse()

    // Default to 404 for unknown URLs
    return createNotFoundResponse()
  })
}
