/**
 * Base error class for all REST-related errors.
 */
export class RestError extends Error {
  /**
   * The original error that caused this error.
   */
  public override readonly cause?: Error

  /**
   * Creates a new RestError instance.
   * @param message - the error message
   * @param options - optional error options including cause
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'RestError'
    this.cause = options?.cause as Error | undefined
  }
}
