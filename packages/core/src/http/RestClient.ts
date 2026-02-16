import { GeneralError } from '@/errors/GeneralError'
import { NetworkError } from '@/errors/NetworkError'

/**
 * URL parameter value type (path and query parameters)
 */
type UrlParamValue = string | number | boolean

/**
 * Route definition structure for type-safe REST client
 * @remarks params/query constraints are intentionally omitted from this interface
 * because TypeScript interfaces lack implicit index signatures, making them
 * incompatible with Record<string, T> constraints. Type safety for URL parameters
 * is enforced at buildUrl call sites instead.
 */
interface RouteDefinition {
  readonly response?: unknown
}

/**
 * Client configuration options
 */
interface ClientOptions {
  /**
   * HTTP headers
   */
  readonly headers?: HeadersInit
  /**
   * Abort signal for cancellation
   */
  readonly signal?: AbortSignal
  /**
   * Number of retry attempts on failure
   * @default 0
   */
  readonly retry?: number
  /**
   * Delay between retries in milliseconds
   * @default 100
   */
  readonly retryDelay?: number
}

/**
 * Extract params type from route definition
 */
type ExtractParams<T> = T extends { params?: infer P }
  ? P extends Record<string, never>
    ? undefined
    : P
  : undefined

/**
 * Extract query type from route definition
 */
type ExtractQuery<T> = T extends { query?: infer Q }
  ? Q extends Record<string, never>
    ? undefined
    : Q
  : undefined

/**
 * Extract response type from route definition
 */
type ExtractResponse<T> = T extends { response: infer R } ? R : never

/**
 * Route options for fetch call
 */
type RouteOptions<T> = (ExtractParams<T> extends undefined
  ? { params?: undefined }
  : { params: ExtractParams<T> }) &
  (ExtractQuery<T> extends undefined
    ? { query?: undefined }
    : { query?: ExtractQuery<T> }) & {
    fetchOptions?: RequestInit
  }

/**
 * Check if route options are required
 */
type IsOptionsRequired<T> = ExtractParams<T> extends undefined ? false : true

/**
 * Full URL type (starts with http:// or https://)
 */
type FullUrl = `http://${string}` | `https://${string}`

/**
 * Type-safe REST client that infers response types from URL paths
 * @example
 * ```ts
 * interface MyApiRoutes {
 *   '/api/users/:id': {
 *     params: { id: number }
 *     response: User
 *   }
 *   '/api/posts': {
 *     query: { page: number; limit: number }
 *     response: Post[]
 *   }
 * }
 *
 * const client = new RestClient<MyApiRoutes>('https://api.example.com')
 * const user = await client.fetch('/api/users/:id', { params: { id: 1 } })
 * // user is typed as User
 *
 * // Direct URL fetch
 * const response = await client.fetchRaw('https://cdn.example.com/image.png')
 * const buffer = await response.arrayBuffer()
 * ```
 * @remarks Routes uses Record<string, RouteDefinition> as constraint because
 * REST API route definitions have diverse structures that cannot be predefined.
 * Callers provide concrete types via generics.
 */
export class RestClient<
  Routes extends { [K in keyof Routes]: RouteDefinition },
> {
  private readonly origin: string
  private readonly defaultOptions: ClientOptions

  /**
   * Create a RestClient instance
   * @param origin - Base URL, origin, or empty string (for fetchRaw with full URLs only)
   * @param options - Default client options
   */
  constructor(origin: URL | string, options?: ClientOptions) {
    if (origin === '') {
      this.origin = ''
    } else {
      const url = typeof origin === 'string' ? new URL(origin) : origin
      this.origin = url.origin
    }
    this.defaultOptions = options ?? {}
  }

  /**
   * Fetch JSON data from the specified path
   * @param args - Path and options tuple
   * @returns Promise resolving to the typed response
   * @throws {@link NetworkError} - If the request fails
   * @throws {@link GeneralError} - If an unexpected error occurs
   */
  public async fetch<P extends keyof Routes & string>(
    ...args: IsOptionsRequired<Routes[P]> extends true
      ? [path: P, options: RouteOptions<Routes[P]>]
      : [path: P, options?: RouteOptions<Routes[P]>]
  ): Promise<ExtractResponse<Routes[P]>> {
    const [path, options] = args
    // Interface types lack implicit index signatures in TypeScript,
    // requiring cast for buildUrl's Record<string, UrlParamValue> parameter
    const url = this.buildUrl(
      path,
      options?.params as Record<string, UrlParamValue> | undefined,
      options?.query as Record<string, UrlParamValue> | undefined,
    )
    const mergedOptions = this.mergeOptions(options?.fetchOptions)

    return this.executeWithRetry(
      url,
      mergedOptions,
      async (res) => (await res.json()) as ExtractResponse<Routes[P]>,
    )
  }

  /**
   * Fetch raw Response from a direct URL
   * @param url - Full URL to fetch
   * @param fetchOptions - Fetch options
   * @returns Promise resolving to Response
   * @throws {@link NetworkError} - If the request fails
   * @throws {@link GeneralError} - If an unexpected error occurs
   */
  public async fetchRaw(
    url: FullUrl,
    fetchOptions?: RequestInit,
  ): Promise<Response>

  /**
   * Fetch raw Response from the specified path
   * @param args - Path and options tuple
   * @returns Promise resolving to Response
   * @throws {@link NetworkError} - If the request fails
   * @throws {@link GeneralError} - If an unexpected error occurs
   */
  public async fetchRaw<P extends keyof Routes & string>(
    ...args: IsOptionsRequired<Routes[P]> extends true
      ? [path: P, options: RouteOptions<Routes[P]>]
      : [path: P, options?: RouteOptions<Routes[P]>]
  ): Promise<Response>

  /**
   * Fetch raw Response (implementation)
   * @param pathOrUrl - Path or full URL
   * @param optionsOrFetchOptions - Route options or fetch options
   * @returns Promise resolving to Response
   * @throws {@link NetworkError} - If the request fails
   * @throws {@link GeneralError} - If an unexpected error occurs
   */
  public async fetchRaw<P extends keyof Routes & string>(
    pathOrUrl: P | FullUrl,
    optionsOrFetchOptions?: RouteOptions<Routes[P]> | RequestInit,
  ): Promise<Response> {
    // Direct URL fetch
    if (this.isFullUrl(pathOrUrl)) {
      const mergedOptions = this.mergeOptions(
        optionsOrFetchOptions as RequestInit | undefined,
      )
      return this.executeWithRetry(pathOrUrl, mergedOptions, (res) =>
        Promise.resolve(res),
      )
    }

    // Route-based fetch
    const options = optionsOrFetchOptions as RouteOptions<Routes[P]> | undefined
    // Interface types lack implicit index signatures in TypeScript
    const url = this.buildUrl(
      pathOrUrl,
      options?.params as Record<string, UrlParamValue> | undefined,
      options?.query as Record<string, UrlParamValue> | undefined,
    )
    const mergedOptions = this.mergeOptions(options?.fetchOptions)

    return this.executeWithRetry(url, mergedOptions, (res) =>
      Promise.resolve(res),
    )
  }

  /**
   * Check if the string is a full URL
   * @param value - String to check
   * @returns True if the string starts with http:// or https://
   */
  private isFullUrl(value: string): value is FullUrl {
    return value.startsWith('http://') || value.startsWith('https://')
  }

  /**
   * Build the full URL with params and query string
   * @param path - URL path template
   * @param params - Path parameters
   * @param query - Query parameters
   * @returns Full URL string
   */
  private buildUrl(
    path: string,
    params?: Record<string, UrlParamValue>,
    query?: Record<string, UrlParamValue>,
  ): string {
    let resolvedPath = path

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        resolvedPath = resolvedPath.replace(
          `:${key}`,
          encodeURIComponent(String(value)),
        )
      }
    }

    const url = new URL(`${this.origin}${resolvedPath}`)

    if (query) {
      for (const [key, value] of Object.entries(query))
        url.searchParams.append(key, String(value))
    }

    return url.toString()
  }

  /**
   * Merge fetch options with defaults
   * @param options - Override options
   * @returns Merged options
   */
  private mergeOptions(options?: RequestInit): RequestInit {
    const mergedHeaders = new Headers(this.defaultOptions.headers)
    if (options?.headers) {
      const overrideHeaders = new Headers(options.headers)
      overrideHeaders.forEach((value, key) => {
        mergedHeaders.set(key, value)
      })
    }

    // Convert Headers to plain object for better test compatibility
    const headersObject: Record<string, string> = {}
    mergedHeaders.forEach((value, key) => {
      headersObject[key] = value
    })

    return {
      headers: headersObject,
      signal: options?.signal ?? this.defaultOptions.signal,
    }
  }

  /**
   * Execute fetch with retry logic
   * @param url - Request URL
   * @param options - Fetch options
   * @param handler - Response handler function
   * @returns Response data
   * @throws {@link NetworkError} - If the request fails after all retries
   * @throws {@link GeneralError} - If an unexpected error occurs
   */
  private async executeWithRetry<T>(
    url: string,
    options: RequestInit,
    handler: (response: Response) => Promise<T>,
  ): Promise<T> {
    const maxRetries = this.defaultOptions.retry ?? 0
    const retryDelay = this.defaultOptions.retryDelay ?? 100

    let lastError: Error | undefined

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: options.headers,
          signal: options.signal,
        })

        // Handle 429 Too Many Requests with Retry-After header
        if (response.status === 429) {
          const retryAfter = this.parseRetryAfter(response)
          if (attempt < maxRetries && retryAfter > 0) {
            await this.delay(retryAfter)
            continue
          }
        }

        if (!response.ok) throw new NetworkError(new Request(url), response)

        // Handler errors (e.g., JSON parse) should NOT be retried
        // as they are not transient network issues
        return await handler(response)
      } catch (error) {
        // Only retry network errors, not handler errors
        const isNetworkError =
          error instanceof NetworkError ||
          error instanceof TypeError || // fetch network failures
          (error instanceof Error && error.name === 'AbortError')

        if (!isNetworkError) {
          // Non-retryable error (e.g., JSON parse error) - throw immediately
          throw error instanceof Error
            ? error
            : new GeneralError(String(error), { cause: error })
        }

        // Preserve cause chain for network errors
        lastError =
          error instanceof Error
            ? error
            : new GeneralError(String(error), { cause: error })

        if (attempt < maxRetries)
          await this.delay(retryDelay * Math.pow(2, attempt))
      }
    }

    throw lastError ?? new GeneralError(`Network request failed: ${url}`)
  }

  /**
   * Parse Retry-After header value
   * @param response - HTTP response
   * @returns Delay in milliseconds, or 0 if not present/invalid
   */
  private parseRetryAfter(response: Response): number {
    const retryAfter = response.headers.get('Retry-After')
    if (!retryAfter) return 0

    // Retry-After can be a number (seconds) or an HTTP-date
    const seconds = parseInt(retryAfter, 10)
    if (!isNaN(seconds)) return seconds * 1000

    // Try parsing as HTTP-date
    const date = new Date(retryAfter)
    if (!isNaN(date.getTime())) {
      const delayMs = date.getTime() - Date.now()
      return delayMs > 0 ? delayMs : 0
    }

    return 0
  }

  /**
   * Delay execution
   * @param ms - Delay in milliseconds
   * @returns Promise that resolves after delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
