import { RestError } from '@/error/RestError'

/**
 * Error representing network connection failures.
 * Wraps TypeError thrown by fetch when network is unavailable.
 */
export class NetworkError extends RestError {
  /**
   * Creates a new NetworkError instance.
   * @param message - the error message
   * @param options - optional error options including cause
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'NetworkError'
  }
}
