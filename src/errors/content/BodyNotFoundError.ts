import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import type { ErrorContext } from '@/errors/base/ErrorContext'
import { ErrorContextFactory } from '@/errors/base/ErrorContext'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

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
