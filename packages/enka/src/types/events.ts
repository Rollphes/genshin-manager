import type { EnkaData } from '@/EnkaManager'

/**
 * EnkaManager events
 */
export enum EnkaManagerEvents {
  /** When new data is added to the cache, fires */
  GetNewEnkaData = 'GetNewEnkaData',
}

/**
 * EnkaManager event map
 */
export interface EnkaManagerEventMap {
  /** When new data is added to the cache, fires */
  [EnkaManagerEvents.GetNewEnkaData]: [data: EnkaData]
}
