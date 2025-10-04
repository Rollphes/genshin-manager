import { GenshinManagerErrorCode } from '@/errors/base/ErrorCodes'
import { GenshinManagerError } from '@/errors/base/GenshinManagerError'

/**
 * General error for unknown or uncategorized errors
 */
export class GeneralError extends GenshinManagerError {
  public readonly errorCode = GenshinManagerErrorCode.GM_GENERAL_UNKNOWN
}
