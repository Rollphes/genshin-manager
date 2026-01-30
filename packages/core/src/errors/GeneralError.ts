import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'

/**
 * General error for unknown or uncategorized errors
 */
export class GeneralError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmGeneral
}
