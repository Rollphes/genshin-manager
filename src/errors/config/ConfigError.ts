import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * Configuration invalid error
 */
export class ConfigInvalidError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GM_CONFIG_INVALID

  /**
   * Configuration property that is invalid
   */
  public readonly configProperty: string

  /**
   * Configuration file path if applicable
   */
  public readonly configFile?: string

  /**
   * Constructor for ConfigInvalidError
   * @param configProperty - Configuration property that is invalid
   * @param expectedValue - Expected value or type
   * @param actualValue - Actual invalid value
   * @param configFile - Configuration file path
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    configProperty: string,
    expectedValue: unknown,
    actualValue: unknown,
    configFile?: string,
    context?: ErrorContext,
    cause?: Error,
  ) {
    const message = `Invalid configuration for '${configProperty}': expected ${String(expectedValue)}, got ${String(actualValue)}`

    const configContext = ErrorContextFactory.createConfigContext(
      configProperty,
      configFile,
      expectedValue,
      actualValue,
    )

    const mergedContext = ErrorContextFactory.merge(context, configContext)

    super(message, mergedContext, cause)

    this.configProperty = configProperty
    this.configFile = configFile
  }
}

/**
 * Configuration missing error
 */
export class ConfigMissingError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GM_CONFIG_MISSING

  /**
   * Missing configuration property
   */
  public readonly configProperty: string

  /**
   * Configuration file path if applicable
   */
  public readonly configFile?: string

  /**
   * Constructor for ConfigMissingError
   * @param configProperty - Missing configuration property
   * @param configFile - Configuration file path
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    configProperty: string,
    configFile?: string,
    context?: ErrorContext,
    cause?: Error,
  ) {
    const message = `Missing required configuration: '${configProperty}'${configFile ? ` in ${configFile}` : ''}`

    const configContext = ErrorContextFactory.createConfigContext(
      configProperty,
      configFile,
      'required value',
      'undefined',
    )

    const mergedContext = ErrorContextFactory.merge(context, configContext)

    super(message, mergedContext, cause)

    this.configProperty = configProperty
    this.configFile = configFile
  }
}
