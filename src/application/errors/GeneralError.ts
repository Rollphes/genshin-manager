import { GenshinManagerErrorCode } from '@/domain/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/domain/errors/base/GenshinManagerError'

/**
 * General error for unknown or uncategorized errors
 */
export class GeneralError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GmGeneralUnknown
}
