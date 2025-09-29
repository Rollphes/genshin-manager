import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * Announcement content not found error
 */
export class AnnContentNotFoundError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GM_CONTENT_ANN_NOT_FOUND

  /**
   * Announcement ID or identifier
   */
  public readonly announcementId: string

  /**
   * Constructor for AnnContentNotFoundError
   * @param announcementId - Announcement ID or identifier
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(announcementId: string, context?: ErrorContext, cause?: Error) {
    const message = `Announcement content not found: ${announcementId}`

    const contentContext = ErrorContextFactory.merge(context, {
      propertyKey: 'announcementId',
      actualValue: announcementId,
      operation: 'fetch announcement content',
      timestamp: new Date(),
    })

    super(message, contentContext, cause)

    this.announcementId = announcementId
  }
}

/**
 * Body content not found error
 */
export class BodyNotFoundError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GM_CONTENT_BODY_NOT_FOUND

  /**
   * Content type or identifier
   */
  public readonly contentType: string

  /**
   * Constructor for BodyNotFoundError
   * @param contentType - Content type or identifier
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(contentType: string, context?: ErrorContext, cause?: Error) {
    const message = `Body content not found for: ${contentType}`

    const contentContext = ErrorContextFactory.merge(context, {
      propertyKey: 'contentType',
      actualValue: contentType,
      operation: 'fetch body content',
      timestamp: new Date(),
    })

    super(message, contentContext, cause)

    this.contentType = contentType
  }
}

/**
 * Text map format error
 */
export class TextMapFormatError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GM_CONTENT_TEXT_MAP_FORMAT

  /**
   * Text map key or identifier
   */
  public readonly textMapKey: string

  /**
   * Expected format description
   */
  public readonly expectedFormat: string

  /**
   * Constructor for TextMapFormatError
   * @param textMapKey - Text map key or identifier
   * @param expectedFormat - Expected format description
   * @param actualValue - Actual invalid value
   * @param context - Additional error context
   * @param cause - Original error
   */
  constructor(
    textMapKey: string,
    expectedFormat: string,
    actualValue: unknown,
    context?: ErrorContext,
    cause?: Error,
  ) {
    const message = `Invalid text map format for '${textMapKey}': expected ${expectedFormat}, got ${String(actualValue)}`

    const contentContext = ErrorContextFactory.createValidationContext(
      textMapKey,
      expectedFormat,
      actualValue,
    )

    const mergedContext = ErrorContextFactory.merge(context, contentContext, {
      operation: 'parse text map',
    })

    super(message, mergedContext, cause)

    this.textMapKey = textMapKey
    this.expectedFormat = expectedFormat
  }
}
