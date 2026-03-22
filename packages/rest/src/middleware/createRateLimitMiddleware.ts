import type { Middleware } from 'openapi-fetch'

/**
 * Rate limit state tracked across requests
 */
interface RateLimitState {
  limit: number | null
  remaining: number | null
  resetAt: number | null
}

/**
 * Options for rate limit middleware
 */
export interface RateLimitMiddlewareOptions {
  /** Maximum number of retries on 429 response (default: 3) */
  maxRetries?: number
  /** Base delay in milliseconds for retry (default: 1000) */
  retryDelayMs?: number
  /** Wait when remaining quota is at or below this threshold (default: 1) */
  proactiveThreshold?: number
}

/**
 * Sleep for specified milliseconds
 * @param ms - milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Parse Retry-After header value
 * Supports both delta-seconds and HTTP-date formats
 * @param headers - response headers
 * @returns delay in milliseconds, or null if not present/parseable
 */
function parseRetryAfter(headers: Headers): number | null {
  const value = headers.get('Retry-After')
  if (!value) return null

  // Try parsing as integer (delta-seconds)
  const seconds = parseInt(value, 10)
  if (!isNaN(seconds)) return seconds * 1000

  // Try parsing as HTTP-date
  const date = Date.parse(value)
  if (!isNaN(date)) return Math.max(0, date - Date.now())

  return null
}

/**
 * Parse IETF Draft RateLimit header (e.g., "fixedwindow";r=99;t=50)
 * @param headers - response headers
 * @returns object with remaining and resetSeconds, or null
 */
function parseIetfRateLimit(
  headers: Headers,
): { remaining: number; resetSeconds: number } | null {
  const value = headers.get('RateLimit')
  if (!value) return null

  const remainingMatch = /r=(\d+)/.exec(value)
  const resetMatch = /t=(\d+)/.exec(value)

  if (remainingMatch && resetMatch) {
    return {
      remaining: parseInt(remainingMatch[1], 10),
      resetSeconds: parseInt(resetMatch[1], 10),
    }
  }

  return null
}

/**
 * Parse IETF Draft RateLimit-Policy header (e.g., "fixedwindow";q=100;w=60)
 * @param headers - response headers
 * @returns quota limit, or null
 */
function parseIetfRateLimitPolicy(headers: Headers): number | null {
  const value = headers.get('RateLimit-Policy')
  if (!value) return null

  const quotaMatch = /q=(\d+)/.exec(value)
  if (quotaMatch) return parseInt(quotaMatch[1], 10)

  return null
}

/**
 * Parse legacy rate limit headers (RateLimit-* and X-RateLimit-*)
 * @param headers - response headers
 */
function parseLegacyRateLimitHeaders(
  headers: Headers,
): Partial<RateLimitState> {
  const result: Partial<RateLimitState> = {}

  // Try both with and without X- prefix
  const limitValue =
    headers.get('RateLimit-Limit') ?? headers.get('X-RateLimit-Limit')
  const remainingValue =
    headers.get('RateLimit-Remaining') ?? headers.get('X-RateLimit-Remaining')
  const resetValue =
    headers.get('RateLimit-Reset') ?? headers.get('X-RateLimit-Reset')

  if (limitValue) {
    const limit = parseInt(limitValue, 10)
    if (!isNaN(limit)) result.limit = limit
  }

  if (remainingValue) {
    const remaining = parseInt(remainingValue, 10)
    if (!isNaN(remaining)) result.remaining = remaining
  }

  if (resetValue) {
    const reset = parseInt(resetValue, 10)
    if (!isNaN(reset)) {
      // Unix timestamp in seconds, convert to ms
      result.resetAt = reset * 1000
    }
  }

  return result
}

/**
 * Update rate limit state from response headers
 * Prioritizes IETF Draft format, falls back to legacy headers
 * @param state - rate limit state to update
 * @param headers - response headers
 */
function updateStateFromHeaders(state: RateLimitState, headers: Headers): void {
  // Try IETF Draft format first
  const ietfLimit = parseIetfRateLimitPolicy(headers)
  const ietfRateLimit = parseIetfRateLimit(headers)

  if (ietfRateLimit) {
    state.remaining = ietfRateLimit.remaining
    state.resetAt = Date.now() + ietfRateLimit.resetSeconds * 1000
  }

  if (ietfLimit !== null) state.limit = ietfLimit

  // Fall back to legacy headers for missing values
  const legacy = parseLegacyRateLimitHeaders(headers)

  if (state.limit === null && legacy.limit !== undefined)
    state.limit = legacy.limit

  if (state.remaining === null && legacy.remaining !== undefined)
    state.remaining = legacy.remaining

  if (state.resetAt === null && legacy.resetAt !== undefined)
    state.resetAt = legacy.resetAt
}

/**
 * Wait if remaining quota is below threshold
 * @param state - rate limit state
 * @param options - middleware options
 */
async function waitIfNeeded(
  state: RateLimitState,
  options?: RateLimitMiddlewareOptions,
): Promise<void> {
  const threshold = options?.proactiveThreshold ?? 1

  if (
    state.remaining !== null &&
    state.remaining <= threshold &&
    state.resetAt !== null
  ) {
    const waitTime = state.resetAt - Date.now()
    if (waitTime > 0) {
      await sleep(waitTime)
      // Reset state after waiting
      state.remaining = null
      state.resetAt = null
    }
  }
}

/**
 * Retry request with exponential backoff
 * @param request - original request
 * @param response - 429 response
 * @param state - rate limit state
 * @param options - middleware options
 */
async function retryWithBackoff(
  request: Request,
  response: Response,
  state: RateLimitState,
  options?: RateLimitMiddlewareOptions,
): Promise<Response> {
  const maxRetries = options?.maxRetries ?? 3
  const baseDelay = options?.retryDelayMs ?? 1000

  let currentResponse = response

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const retryAfter = parseRetryAfter(currentResponse.headers)
    const delay = retryAfter ?? baseDelay * Math.pow(2, attempt)

    await sleep(delay)

    const newResponse = await fetch(new Request(request))
    updateStateFromHeaders(state, newResponse.headers)

    if (newResponse.status !== 429) return newResponse

    currentResponse = newResponse
  }

  // Max retries exceeded, return last response
  return currentResponse
}

/**
 * Creates a rate limit middleware for handling API rate limits.
 *
 * Features:
 * - Proactive: Waits before making requests when quota is low
 * - Reactive: Retries on 429 with exponential backoff
 *
 * Tracked headers:
 * - Retry-After (RFC 7231)
 * - RateLimit, RateLimit-Policy (IETF Draft)
 * - RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
 * - X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
 *
 * @param options - Configuration options
 * @returns Middleware instance with its own rate limit state
 */
export function createRateLimitMiddleware(
  options?: RateLimitMiddlewareOptions,
): Middleware {
  const state: RateLimitState = {
    limit: null,
    remaining: null,
    resetAt: null,
  }

  return {
    async onRequest({ request }): Promise<Request> {
      await waitIfNeeded(state, options)
      return request
    },

    async onResponse({ request, response }): Promise<Response> {
      updateStateFromHeaders(state, response.headers)

      if (response.status === 429)
        return retryWithBackoff(request, response, state, options)

      return response
    },
  }
}
