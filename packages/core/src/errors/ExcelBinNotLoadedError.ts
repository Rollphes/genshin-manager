import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import type { LocationPath } from '@/types/LocationLike'
import { locationToString } from '@/types/LocationLike'

/**
 * Error thrown when ExcelBinOutput table is not loaded
 */
export class ExcelBinNotLoadedError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmExcelBinNotLoaded

  /** Location path string (converted from LocationPath) */
  public readonly locationPath: string

  /**
   * Constructor for ExcelBinNotLoadedError
   * @param location - Location or path string of the ExcelBinOutput file
   * @param options - Error options
   */
  constructor(location: LocationPath, options?: ErrorOptions) {
    super('ExcelBinOutput is not loaded', options)
    this.locationPath = locationToString(location)
  }
}
