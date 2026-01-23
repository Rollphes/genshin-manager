import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { NetworkError } from '@/errors/network/NetworkError'
import type { NetworkContext } from '@/types/errorContext'

/**
 * Network unavailable error
 */
export class NetworkUnavailableError extends NetworkError {
  public readonly errorCode = GenshinManagerErrorCode.GmNetworkUnavailable

  /**
   * Constructor for NetworkUnavailableError
   * @param url - Request URL
   * @param method - HTTP method
   * @param context - Structured network context
   * @param cause - Original error
   */
  constructor(
    url?: string,
    method = 'GET',
    context?: NetworkContext,
    cause?: Error,
  ) {
    const locationPrefix = NetworkError.buildNetworkLocationPrefix(context)
    const message = url
      ? `${locationPrefix}Network is unavailable: ${url}`
      : `${locationPrefix}Network is unavailable`

    super(message, url, method, context, cause)
  }
}
