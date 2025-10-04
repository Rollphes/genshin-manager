import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * Abstract base class for network-related errors
 */
export abstract class NetworkError extends GenshinManagerError {
  /**
   * URL associated with the network request
   */
  public readonly url?: string

  /**
   * HTTP method used
   */
  public readonly method?: string

  /**
   * HTTP status code if available
   */
  public readonly statusCode?: number

  /**
   * Request timeout in milliseconds
   */
  public readonly timeout?: number

  /**
   * Constructor for NetworkError
   * @param message - Error message
   * @param url - Request URL
   * @param method - HTTP method
   * @param statusCode - HTTP status code
   * @param timeout - Request timeout
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    message: string,
    url?: string,
    method?: string,
    statusCode?: number,
    timeout?: number,
    context?: ErrorContext,
    cause?: Error,
  ) {
    const networkContext = url
      ? ErrorContextFactory.createNetworkContext(
          url,
          method ?? 'GET',
          statusCode,
        )
      : undefined

    const mergedContext = ErrorContextFactory.merge(context, networkContext)

    super(message, mergedContext, cause)

    this.url = url
    this.method = method
    this.statusCode = statusCode
    this.timeout = timeout
  }
}
