/**
 * Context information for enum validation errors
 */
export interface EnumContext {
  /**
   * ExcelBinOutput name (e.g., 'MonsterExcelConfigData')
   */
  readonly source?: string
  /**
   * Record ID within the data source (e.g., 21010101)
   */
  readonly recordId?: string | number
  /**
   * JSON path to the property (e.g., 'propGrowCurves[0].type')
   */
  readonly path?: string
}

/**
 * Context information for validation errors
 */
export interface ValidationContext {
  /**
   * Property or field name being validated (e.g., 'level', 'refinementRank')
   */
  readonly propertyKey: string
  /**
   * Data source where the validation occurs (e.g., 'WeaponExcelConfigData')
   */
  readonly source?: string
  /**
   * Record ID within the data source
   */
  readonly recordId?: string | number
}

/**
 * Context information for asset errors
 */
export interface AssetContext {
  /**
   * Data source name (e.g., 'MonsterExcelConfigData', 'TextMap')
   */
  readonly source?: string
  /**
   * Record ID within the data source
   */
  readonly recordId?: string | number
  /**
   * Operation being performed (e.g., 'load', 'download', 'parse')
   */
  readonly operation?: string
  /**
   * URL being accessed (for network-related asset errors)
   */
  readonly url?: string
}

/**
 * Context information for network errors
 */
export interface NetworkContext {
  /**
   * HTTP status code
   */
  readonly statusCode?: number
  /**
   * Service or API name being called
   */
  readonly service?: string
  /**
   * Request timeout in milliseconds
   */
  readonly timeout?: number
  /**
   * Number of retry attempts made
   */
  readonly retryCount?: number
}
