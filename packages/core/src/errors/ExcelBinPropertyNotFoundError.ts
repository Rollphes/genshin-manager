import { ErrorCode } from '@/errors/ErrorCodes'
import { GenshinManagerError } from '@/errors/GenshinManagerError'
import type { LocationPath } from '@/types/LocationLike'
import { locationToString } from '@/types/LocationLike'

/**
 * Error thrown when a property value is not found in ExcelBinOutput
 */
export class ExcelBinPropertyNotFoundError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmExcelBinPropertyNotFound

  /** Location path string (converted from LocationPath) */
  public readonly locationPath: string

  /**
   * Constructor for ExcelBinPropertyNotFoundError
   * @param location - Location or path string within the ExcelBinOutput file
   * @param searchValue - The value that was searched for
   * @param options - Error options
   */
  constructor(
    location: LocationPath,
    public readonly searchValue: string | number | boolean,
    options?: ErrorOptions,
  ) {
    const locationStr = locationToString(location)
    const message = `Property not found: ${locationStr} (searched: '${String(searchValue)}')`
    super(message, options)
    this.locationPath = locationStr
  }
}
