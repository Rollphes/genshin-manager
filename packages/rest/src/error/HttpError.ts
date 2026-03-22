import { RestError } from '@/error/RestError'

/**
 * Error representing HTTP 4xx/5xx responses.
 */
export class HttpError extends RestError {
  /**
   * The HTTP status code.
   */
  public readonly status: number

  /**
   * The HTTP status text.
   */
  public readonly statusText: string

  /**
   * The response body parsed as JSON or raw text.
   */
  public readonly body: unknown

  /**
   * Creates a new HttpError instance.
   * @param status - the HTTP status code
   * @param statusText - the HTTP status text
   * @param body - the response body
   */
  constructor(status: number, statusText: string, body: unknown) {
    super(`HTTP ${String(status)}: ${statusText}`)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
    this.body = body
  }
}
