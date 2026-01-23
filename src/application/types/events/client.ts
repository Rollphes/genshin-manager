/**
 * Client events
 */
export enum ClientEvents {
  /** When the cache update starts, fires */
  BeginUpdateCache = 'BeginUpdateCache',
  /** When the cache update ends, fires */
  EndUpdateCache = 'EndUpdateCache',
  /** When the assets update starts, fires */
  BeginUpdateAssets = 'BeginUpdateAssets',
  /** When the assets update ends, fires */
  EndUpdateAssets = 'EndUpdateAssets',
}

/**
 * Client event map
 * @internal
 */
export interface ClientEventMap {
  /**
   * When the cache update starts, fires
   * @param version - Game version of assets to cache
   */
  [ClientEvents.BeginUpdateCache]: [version: string]
  /**
   * When the cache update ends, fires
   * @param version - Game version of assets to cache
   */
  [ClientEvents.EndUpdateCache]: [version: string]
  /**
   * When the assets update starts, fires
   * @param version - Game version of new assets
   */
  [ClientEvents.BeginUpdateAssets]: [version: string]
  /**
   * When the assets update ends, fires
   * @param version - Game version of new assets
   */
  [ClientEvents.EndUpdateAssets]: [version: string]
}
