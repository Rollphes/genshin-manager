import type { ErrorCode } from '@/errors/ErrorCodes'

/**
 * Abstract base class for all Genshin Manager errors
 */
export abstract class GenshinManagerError extends Error {
  public abstract readonly errorCode: ErrorCode

  /**
   * Constructor for GenshinManagerError
   * @param message - Error message
   * @param options - Error options
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = this.constructor.name
  }
}
