import { NetworkError } from '@/errors'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'

/**
 * Enka Network status-related error (maintenance, rate limiting, etc.)
 */
export class EnkaNetworkStatusError extends NetworkError {
  public readonly errorCode =
    GenshinManagerErrorCode.GM_NETWORK_ENKA_STATUS_ERROR

  /**
   * Type of status error
   */
  public readonly statusType: 'maintenance' | 'rate_limit' | 'unavailable'

  /**
   * Retry after duration in seconds (for rate limiting)
   */
  public readonly retryAfter?: number

  /**
   * Constructor for EnkaNetworkStatusError
   * @param message - Error message
   * @param statusType - Type of status error
   * @param url - Request URL
   * @param statusCode - HTTP status code
   * @param retryAfter - Retry after duration in seconds
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    message: string,
    statusType: 'maintenance' | 'rate_limit' | 'unavailable',
    url?: string,
    statusCode?: number,
    retryAfter?: number,
    context?: ErrorContext,
    cause?: Error,
  ) {
    super(message, url, 'GET', statusCode, undefined, context, cause)
    this.statusType = statusType
    this.retryAfter = retryAfter
  }

  /**
   * Create rate limit error
   * @param retryAfter - Retry after duration in seconds
   * @param url - Request URL
   * @param context - Additional error context
   */
  public static createRateLimitError(
    retryAfter: number,
    url?: string,
    context?: ErrorContext,
  ): EnkaNetworkStatusError {
    const message = `Rate limit exceeded. Retry after ${retryAfter.toString()} seconds`

    const rateLimitContext = ErrorContextFactory.createNetworkContext(
      url ?? 'unknown',
      'GET',
      429,
    )

    const mergedContext = ErrorContextFactory.merge(context, rateLimitContext)

    return new EnkaNetworkStatusError(
      message,
      'rate_limit',
      url,
      429,
      retryAfter,
      mergedContext,
    )
  }

  /**
   * Create maintenance error
   * @param url - Request URL
   * @param context - Additional error context
   */
  public static createMaintenanceError(
    url?: string,
    context?: ErrorContext,
  ): EnkaNetworkStatusError {
    const message = 'Enka Network is currently under maintenance'

    const maintenanceContext = ErrorContextFactory.createNetworkContext(
      url ?? 'unknown',
      'GET',
      503,
    )

    const mergedContext = ErrorContextFactory.merge(context, maintenanceContext)

    return new EnkaNetworkStatusError(
      message,
      'maintenance',
      url,
      503,
      undefined,
      mergedContext,
    )
  }
}
