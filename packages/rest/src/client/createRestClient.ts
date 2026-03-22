import type { Client, ClientOptions } from 'openapi-fetch'
import createClient from 'openapi-fetch'

import { bigIntPreservationMiddleware } from '@/middleware/bigIntPreservationMiddleware'
import {
  createRateLimitMiddleware,
  type RateLimitMiddlewareOptions,
} from '@/middleware/createRateLimitMiddleware'
import { errorHandlingMiddleware } from '@/middleware/errorHandlingMiddleware'
import { userAgentMiddleware } from '@/middleware/userAgentMiddleware'

/**
 * Extended client options with rate limit configuration
 */
export interface RestClientOptions extends ClientOptions {
  /** Rate limit middleware options */
  rateLimit?: RateLimitMiddlewareOptions
}

/**
 * Create a new openapi-fetch client with pre-configured middleware.
 * Automatically registers userAgent, rateLimit, bigIntPreservation, and errorHandling middleware.
 * @param baseUrl - the base URL for the API
 * @param options - additional client options including rate limit configuration
 * @returns a configured openapi-fetch client
 */
export function createRestClient<Paths extends object>(
  baseUrl: string,
  options?: RestClientOptions,
): Client<Paths> {
  const { rateLimit: rateLimitOptions, ...clientOptions } = options ?? {}

  const client = createClient<Paths>({
    baseUrl,
    ...clientOptions,
  })

  client.use(userAgentMiddleware)
  client.use(createRateLimitMiddleware(rateLimitOptions))
  client.use(bigIntPreservationMiddleware)
  client.use(errorHandlingMiddleware)

  return client
}
