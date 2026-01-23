import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'
import type { NetworkContext } from '@/types/errorContext'

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
   * Service or API name being called
   */
  public readonly service?: string

  /**
   * Number of retry attempts made
   */
  public readonly retryCount?: number

  /**
   * Constructor for NetworkError
   * @param message - Error message
   * @param url - Request URL
   * @param method - HTTP method
   * @param networkContext - Structured network context
   * @param cause - Original error
   */
  constructor(
    message: string,
    url?: string,
    method?: string,
    networkContext?: NetworkContext,
    cause?: Error,
  ) {
    const errorContext = url
      ? ErrorContextFactory.createNetworkContext(
          url,
          method ?? 'GET',
          networkContext?.statusCode,
        )
      : undefined

    // Add service info to metadata
    const mergedContext = networkContext?.service
      ? {
          ...errorContext,
          metadata: {
            service: networkContext.service,
            retryCount: networkContext.retryCount,
          },
        }
      : errorContext

    super(message, mergedContext, cause)

    this.url = url
    this.method = method
    this.statusCode = networkContext?.statusCode
    this.timeout = networkContext?.timeout
    this.service = networkContext?.service
    this.retryCount = networkContext?.retryCount
  }

  /**
   * Build location prefix from NetworkContext
   * @param context - Network context
   * @returns Location prefix string
   */
  protected static buildNetworkLocationPrefix(
    context?: NetworkContext,
  ): string {
    if (!context?.service) return ''
    return `[${context.service}] `
  }
}
