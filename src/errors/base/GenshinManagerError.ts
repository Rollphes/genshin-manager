import type {
  ErrorCategory,
  GenshinManagerErrorCode,
  RetryConfiguration,
} from '@/errors/base/ErrorCodes'
import { errorCategories, retryClassifications } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'

/**
 * Unified base error class for genshin-manager with comprehensive error handling
 */
export abstract class GenshinManagerError extends Error {
  /**
   * Whether this error originated from genshin-manager library
   */
  public readonly isGenshinManagerError = true

  /**
   * Error category for grouping and handling
   */
  public readonly category!: ErrorCategory

  /**
   * Rich context information for debugging
   */
  public readonly context?: ErrorContext

  /**
   * Retry configuration based on error type
   */
  public readonly retryConfig!: RetryConfiguration

  /**
   * Timestamp when the error occurred
   */
  public readonly timestamp: Date

  /**
   * Original error that caused this error (Node.js 16.9.0+)
   */
  public readonly cause?: Error

  /**
   * Unique error code for identification and classification
   */
  public abstract readonly errorCode: GenshinManagerErrorCode

  /**
   * Constructor for GenshinManagerError
   * @param message - Human-readable error message
   * @param context - Rich error context for debugging
   * @param cause - Original error that caused this error
   */
  constructor(message: string, context?: ErrorContext, cause?: Error) {
    super(message)
    this.name = this.constructor.name
    this.context = context
    this.timestamp = new Date()
    this.cause = cause
    // Initialize category and retryConfig in a later call after errorCode is set
    this.initializeConfig()

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype)

    // Capture stack trace
    if (typeof Error.captureStackTrace === 'function')
      Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Static helper to check if an error is a GenshinManagerError
   */
  public static isGenshinManagerError(
    error: unknown,
  ): error is GenshinManagerError {
    return (
      error instanceof Error &&
      'isGenshinManagerError' in error &&
      error.isGenshinManagerError === true
    )
  }

  /**
   * Static helper to create error from unknown type
   */
  public static async fromUnknown(
    error: unknown,
    fallbackMessage = 'Unknown error occurred',
    context?: ErrorContext,
  ): Promise<GenshinManagerError> {
    if (GenshinManagerError.isGenshinManagerError(error)) return error

    // Dynamic import to avoid circular dependency
    const { GeneralError: generalError } = await import(
      '@/errors/general/GeneralError'
    )

    if (error instanceof Error)
      return new generalError(error.message, context, error)

    return new generalError(
      typeof error === 'string' ? error : fallbackMessage,
      context,
    )
  }

  /**
   * Generate detailed error message with context information
   */
  public getDetailedMessage(): string {
    let detailedMessage = `[${this.errorCode}] ${this.message}`

    if (this.context) {
      const contextInfo: string[] = []

      if (this.context.filePath)
        contextInfo.push(`File: ${this.context.filePath}`)

      if (this.context.url) contextInfo.push(`URL: ${this.context.url}`)

      if (this.context.operation)
        contextInfo.push(`Operation: ${this.context.operation}`)

      if (this.context.propertyKey)
        contextInfo.push(`Property: ${this.context.propertyKey}`)

      if (this.context.expectedValue !== undefined) {
        contextInfo.push(
          `Expected: ${JSON.stringify(this.context.expectedValue)}`,
        )
      }

      if (this.context.actualValue !== undefined)
        contextInfo.push(`Actual: ${JSON.stringify(this.context.actualValue)}`)

      if (contextInfo.length > 0)
        detailedMessage += ` | Context: ${contextInfo.join(', ')}`
    }

    return detailedMessage
  }

  /**
   * Check if this error is retryable
   */
  public isRetryable(): boolean {
    return this.retryConfig.isRetryable
  }

  /**
   * Get retry configuration
   */
  public getRetryConfig(): RetryConfiguration {
    return this.retryConfig
  }

  /**
   * Serialize error for logging or transport
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      errorCode: this.errorCode,
      category: this.category,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      retryConfig: this.retryConfig,
      stack: this.stack,
      isGenshinManagerError: this.isGenshinManagerError,
    }
  }

  /**
   * Create a copy of this error with additional context
   */
  public withContext(additionalContext: Partial<ErrorContext>): this {
    const mergedContext = { ...this.context, ...additionalContext }
    const errorClass = this.constructor as new (
      message: string,
      context?: ErrorContext,
      cause?: Error,
    ) => this
    return new errorClass(this.message, mergedContext, this.cause)
  }

  /**
   * Initialize category and retry configuration after errorCode is available
   */
  private initializeConfig(): void {
    const category = errorCategories[this.errorCode]
    const retryConfig = retryClassifications[this.errorCode]

    // Use object assignment to bypass readonly modifier
    Object.assign(this, { category, retryConfig })
  }
}
