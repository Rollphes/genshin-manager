import { NetworkError } from '@/errors'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'

/**
 * Network timeout error
 */
export class NetworkTimeoutError extends NetworkError {
  public readonly errorCode = GenshinManagerErrorCode.GM_NETWORK_TIMEOUT

  /**
   * Constructor for NetworkTimeoutError
   * @param url - Request URL
   * @param timeout - Timeout duration in milliseconds
   * @param method - HTTP method
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    url: string,
    timeout: number,
    method = 'GET',
    context?: ErrorContext,
    cause?: Error,
  ) {
    const message = `Network request timed out after ${timeout.toString()}ms: ${url}`

    super(message, url, method, undefined, timeout, context, cause)
  }
}
