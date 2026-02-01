import { ErrorCode, GenshinManagerError } from '@genshin-manager/core'
import type { QueryLocation } from '@genshin-manager/query'

/**
 * Error thrown when a property value is not found in ExcelBinOutput
 */
export class ExcelBinPropertyNotFoundError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmExcelBinPropertyNotFound

  /** Location path string */
  public readonly locationPath: string

  /**
   * Constructor for ExcelBinPropertyNotFoundError
   * @param location - QueryLocation indicating the search path
   * @param searchValue - The value that was searched for
   * @param options - Error options
   */
  constructor(
    location: QueryLocation,
    public readonly searchValue: string | number | boolean,
    options?: ErrorOptions,
  ) {
    const locationStr = location.toString()
    const message = `Property not found: ${locationStr} (searched: '${String(searchValue)}')`
    super(message, options)
    this.locationPath = locationStr
  }
}
