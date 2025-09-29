import { NetworkError } from '@/errors'
import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'

/**
 * Enka Network API error
 */
export class EnkaNetworkError extends NetworkError {
  public readonly errorCode = GenshinManagerErrorCode.GM_NETWORK_ENKA_ERROR

  /**
   * Enka API error code if available
   */
  public readonly enkaErrorCode?: string

  /**
   * Constructor for EnkaNetworkError
   * @param message - Error message
   * @param url - Request URL
   * @param statusCode - HTTP status code
   * @param enkaErrorCode - Enka-specific error code
   * @param method - HTTP method
   * @param context - Additional error context // TODO: 使われていない。
   * @param cause - Original error
   */
  constructor(
    message: string,
    url?: string,
    statusCode?: number,
    enkaErrorCode?: string,
    method = 'GET',
    context?: ErrorContext,
    cause?: Error,
  ) {
    super(message, url, method, statusCode, undefined, context, cause)
    this.enkaErrorCode = enkaErrorCode
  }

  /**
   * Create EnkaNetworkError from API response
   * @param response - Fetch response object
   * @param responseBody - Response body if available
   * @param context - Additional error context
   */
  public static fromResponse(
    response: Response,
    responseBody?: unknown,
    context?: ErrorContext,
  ): EnkaNetworkError {
    const url = response.url
    const statusCode = response.status

    let message = `Enka Network API error: ${response.status.toString()} ${response.statusText}`
    let enkaErrorCode: string | undefined

    // Try to extract error details from response body
    if (responseBody && typeof responseBody === 'object') {
      const body = responseBody as Record<string, unknown>
      if (typeof body.message === 'string') message = body.message

      if (typeof body.error === 'string') enkaErrorCode = body.error
    }

    const errorContext = ErrorContextFactory.createNetworkContext(
      url,
      'GET',
      statusCode,
    )

    const mergedContext = ErrorContextFactory.merge(context, errorContext)

    return new EnkaNetworkError(
      message,
      url,
      statusCode,
      enkaErrorCode,
      'GET',
      mergedContext,
    )
  }
}
