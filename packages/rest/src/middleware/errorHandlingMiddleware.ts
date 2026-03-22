import type { Middleware } from 'openapi-fetch'

import { NetworkError } from '@/error/NetworkError'
import { TimeoutError } from '@/error/TimeoutError'

/**
 * Middleware that transforms fetch errors into typed RestError subclasses.
 * Handles AbortError (timeout) and TypeError (network failure).
 */
export const errorHandlingMiddleware: Middleware = {
  /**
   * Transforms low-level fetch errors into typed RestError subclasses.
   * @param context - the error context containing the error object
   * @param context.error - the error thrown during fetch
   * @returns the transformed error
   * @throws - TimeoutError for AbortError, NetworkError for TypeError
   */
  onError({ error }): Error {
    if (error instanceof Error) {
      if (error.name === 'AbortError')
        return new TimeoutError('Request timed out', { cause: error })

      if (error instanceof TypeError)
        return new NetworkError('Network request failed', { cause: error })
    }

    if (error instanceof Error) return error

    return new Error(String(error))
  },
}
