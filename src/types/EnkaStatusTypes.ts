/**
 * EnkaStatusTypes
 * @description This is a parse of status.enka.network/api/now
 */
export interface APIEnkaStatus {
  /**
   * now Date string
   */
  readonly now: string
  /**
   * HSR Stat
   */
  readonly hsr: APIEnkaStat
  /**
   * GI Stat
   */
  readonly gi: APIEnkaStat
  /**
   * GG Stat
   */
  readonly gg: APIEnkaStat
  /**
   * Pingu Stat
   */
  readonly pingu: APIEnkaPingu
}

/**
 * EnkaRegion
 */
export type APIEnkaRegion =
  | 'euro'
  | 'usa'
  | 'asia'
  | 'cht'
  | 'china'
  | 'bilibili'

/**
 * EnkaStat
 */
export interface APIEnkaStat {
  /**
   * response time (ms)
   */
  time: Partial<{ [key in APIEnkaRegion]: number }>
  /**
   * ping (ms)
   */
  ping: Partial<{ [key in APIEnkaRegion]: number }>
  /**
   * request capacity (req/min)
   */
  nodes: Partial<{ [key in APIEnkaRegion]: number }>
  /**
   * underruns (fails)
   */
  underruns: Partial<{ [key in APIEnkaRegion]: string }>
}

/**
 * EnkaPingu
 */
export interface APIEnkaPingu {
  /**
   * CDN
   */
  cdn: APIEnkaPing
  /**
   * Main
   */
  main: APIEnkaPing
  /**
   * API
   */
  api: APIEnkaPing
  /**
   * Fox
   */
  fox: APIEnkaPing
}

/**
 * EnkaPing
 */
export interface APIEnkaPing {
  /**
   * response time (ms)
   */
  ms: number
  /**
   * status code
   */
  status: number
}
