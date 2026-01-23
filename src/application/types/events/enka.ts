import type { EnkaData } from '@/application/enka/EnkaManager'

/**
 * EnkaManager events
 */
export enum EnkaManagerEvents {
  /** When new data is added to the cache, fires */
  GetNewEnkaData = 'GetNewEnkaData',
}

/**
 * EnkaManager event map
 * @internal
 */
export interface EnkaManagerEventMap {
  /**
   * When new data is added to the cache, fires
   * @param data - New data added to the cache
   */
  [EnkaManagerEvents.GetNewEnkaData]: [data: EnkaData]
}
