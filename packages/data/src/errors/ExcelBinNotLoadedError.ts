import { ErrorCode, GenshinManagerError } from '@genshin-manager/core'
import type { QueryLocation } from '@genshin-manager/query'

/**
 * Error thrown when ExcelBinOutput table is not loaded
 */
export class ExcelBinNotLoadedError extends GenshinManagerError {
  public readonly errorCode = ErrorCode.GmExcelBinNotLoaded

  /** Location path string */
  public readonly locationPath: string

  /**
   * Constructor for ExcelBinNotLoadedError
   * @param location - QueryLocation indicating the ExcelBinOutput file
   * @param options - Error options
   */
  constructor(location: QueryLocation, options?: ErrorOptions) {
    super('ExcelBinOutput is not loaded', options)
    this.locationPath = location.toString()
  }
}
