import { RestError } from '@/error/RestError'

/**
 * Error representing request timeout.
 * Wraps AbortError thrown when a request is aborted due to timeout.
 */
export class TimeoutError extends RestError {
  /**
   * Creates a new TimeoutError instance.
   * @param message - the error message
   * @param options - optional error options including cause
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'TimeoutError'
  }
}
