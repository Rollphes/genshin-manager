import { NetworkUnavailableError } from '@/infrastructure/errors/NetworkUnavailableError'

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
 */
export class RestClient<Routes extends object> {
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
   */
  public async fetch<P extends keyof Routes & string>(
    ...args: IsOptionsRequired<Routes[P]> extends true
      ? [path: P, options: RouteOptions<Routes[P]>]
      : [path: P, options?: RouteOptions<Routes[P]>]
  ): Promise<ExtractResponse<Routes[P]>> {
    const [path, options] = args
    const url = this.buildUrl(
      path,
      options?.params as Record<string, string | number> | undefined,
      options?.query as object | undefined,
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
   */
  public async fetchRaw(
    url: FullUrl,
    fetchOptions?: RequestInit,
  ): Promise<Response>

  /**
   * Fetch raw Response from the specified path
   * @param args - Path and options tuple
   * @returns Promise resolving to Response
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
    const url = this.buildUrl(
      pathOrUrl,
      options?.params as Record<string, string | number> | undefined,
      options?.query as object | undefined,
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
    params?: Record<string, string | number>,
    query?: object,
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

        if (!response.ok) {
          throw new NetworkUnavailableError(url, 'GET', {
            statusCode: response.status,
          })
        }

        return await handler(response)
      } catch (error) {
        lastError =
          error instanceof Error
            ? error
            : new NetworkUnavailableError(url, 'GET', undefined, error as Error)

        if (attempt < maxRetries)
          await this.delay(retryDelay * Math.pow(2, attempt))
      }
    }

    throw lastError ?? new NetworkUnavailableError(url, 'GET')
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
