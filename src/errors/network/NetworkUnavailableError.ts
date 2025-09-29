import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { NetworkError } from '@/errors/network/NetworkError'

/**
 * Network unavailable error
 */
export class NetworkUnavailableError extends NetworkError {
  public readonly errorCode = GenshinManagerErrorCode.GM_NETWORK_UNAVAILABLE

  /**
   * Constructor for NetworkUnavailableError
   * @param url - Request URL
   * @param method - HTTP method
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    url?: string,
    method = 'GET',
    context?: ErrorContext,
    cause?: Error,
  ) {
    const message = url
      ? `Network is unavailable: ${url}`
      : 'Network is unavailable'

    super(message, url, method, undefined, undefined, context, cause)
  }
}
