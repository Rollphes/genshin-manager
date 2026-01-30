import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

/**
 * Announcement content not found error
 */
export class AnnContentNotFoundError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmAnnNotFound

  /**
   * Constructor for AnnContentNotFoundError
   * @param announcementId - Announcement ID or identifier
   * @param options - Error options
   */
  constructor(
    public readonly announcementId: string,
    options?: ErrorOptions,
  ) {
    const message = `Announcement content not found: ${announcementId}`

    super(message, options)
  }
}
