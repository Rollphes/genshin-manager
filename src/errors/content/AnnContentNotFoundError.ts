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
