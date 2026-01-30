import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

/**
 * Response body not found error
 */
export class BodyNotFoundError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmNetworkBodyNotFound

  /**
   * Constructor for BodyNotFoundError
   * @param request - Request object
   * @param response - Response object
   * @param options - Error options
   */
  constructor(
    public readonly request: Request,
    public readonly response: Response,
    options?: ErrorOptions,
  ) {
    const message = `Response body not found: ${String(response.status)} ${response.statusText} for ${request.url}`
    super(message, options)
  }
}
