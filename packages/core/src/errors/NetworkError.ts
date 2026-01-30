import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

/**
 * Network error
 */
export class NetworkError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmNetwork

  /**
   * Constructor for NetworkError
   * @param request - Request object
   * @param response - Response object
   * @param options - Error options
   */
  constructor(
    public readonly request: Request,
    public readonly response: Response,
    options?: ErrorOptions,
  ) {
    const message = `Network error: ${String(response.status)} ${response.statusText} for ${request.url}`
    super(message, options)
  }
}
