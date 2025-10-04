/**
 * Rich error context interface for debugging and troubleshooting
 */
export interface ErrorContext {
  // File information
  /**
   * File path where the error occurred
   */
  readonly filePath?: string
  /**
   * JSON file associated with the error
   */
  readonly jsonFile?: string
  /**
   * Image file associated with the error
   */
  readonly imageFile?: string
  /**
   * Audio file associated with the error
   */
  readonly audioFile?: string

  // Network information
  /**
   * URL associated with the error
   */
  readonly url?: string
  /**
   * HTTP request method used
   */
  readonly requestMethod?: string
  /**
   * HTTP status code received
   */
  readonly statusCode?: number
  /**
   * HTTP response headers
   */
  readonly responseHeaders?: Record<string, string>

  // Data information
  /**
   * Property or field name that failed validation
   */
  readonly propertyKey?: string
  /**
   * Source data that caused the error
   */
  readonly sourceData?: string
  /**
   * Target data expected
   */
  readonly targetData?: string
  /**
   * Type of data being processed
   */
  readonly dataType?: string

  // Operation information
  /**
   * Operation being performed when error occurred
   */
  readonly operation?: string
  /**
   * Expected value for validation
   */
  readonly expectedValue?: unknown
  /**
   * Actual value that failed validation
   */
  readonly actualValue?: unknown
  /**
   * Path to the property that failed validation
   */
  readonly validationPath?: string

  // Performance information
  /**
   * Timestamp when error occurred
   */
  readonly timestamp?: Date
  /**
   * Duration of operation in milliseconds
   */
  readonly duration?: number

  // Debugging information
  /**
   * Stack trace at error location
   */
  readonly stackTrace?: string
  /**
   * User agent string
   */
  readonly userAgent?: string
  /**
   * Environment information
   */
  readonly environmentInfo?: Record<string, unknown>

  // Custom metadata
  /**
   * Additional metadata for the error
   */
  readonly metadata?: Record<string, unknown>
}

/**
 * Factory for creating common error contexts
 */
export const ErrorContextFactory = {
  /**
   * Create file-related error context
   */
  createFileContext(filePath: string, operation?: string): ErrorContext {
    return {
      filePath,
      operation,
      timestamp: new Date(),
    }
  },

  /**
   * Create network-related error context
   */
  createNetworkContext(
    url: string,
    requestMethod = 'GET',
    statusCode?: number,
    responseHeaders?: Record<string, string>,
  ): ErrorContext {
    return {
      url,
      requestMethod,
      statusCode,
      responseHeaders,
      timestamp: new Date(),
    }
  },

  /**
   * Create validation-related error context
   */
  createValidationContext(
    propertyKey: string,
    expectedValue: unknown,
    actualValue: unknown,
    validationPath?: string,
  ): ErrorContext {
    return {
      propertyKey,
      expectedValue,
      actualValue,
      validationPath,
      timestamp: new Date(),
    }
  },

  /**
   * Create decoding-related error context
   */
  createDecodingContext(
    sourceData: string,
    targetData?: string,
    operation?: string,
  ): ErrorContext {
    return {
      sourceData,
      targetData,
      operation,
      timestamp: new Date(),
    }
  },

  /**
   * Create asset-related error context
   */
  createAssetContext(
    filePath?: string,
    imageFile?: string,
    audioFile?: string,
    operation?: string,
  ): ErrorContext {
    return {
      filePath,
      imageFile,
      audioFile,
      operation,
      timestamp: new Date(),
    }
  },

  /**
   * Create configuration-related error context
   */
  createConfigContext(
    propertyKey: string,
    jsonFile?: string,
    expectedValue?: unknown,
    actualValue?: unknown,
  ): ErrorContext {
    return {
      propertyKey,
      jsonFile,
      expectedValue,
      actualValue,
      timestamp: new Date(),
    }
  },

  /**
   * Merge multiple error contexts
   */
  merge(...contexts: (ErrorContext | undefined)[]): ErrorContext {
    const result: ErrorContext = { timestamp: new Date() }

    for (const context of contexts) if (context) Object.assign(result, context)

    return result
  },
}
