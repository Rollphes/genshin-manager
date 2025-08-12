import { EventEmitter } from 'events'

/**
 * Mock AssetCacheManager for testing
 * Avoids real API calls to GitLab and file system operations
 */
export class AssetCacheManager extends EventEmitter {
  public static readonly _assetEventEmitter = new EventEmitter()

  public static gameVersion = '5.1.0'

  /**
   * Updates the asset cache
   */
  public static async updateCache(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Checks for updates in the Git repository
   */
  public static async checkGitUpdate(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Downloads a JSON file from the server
   */
  public static async downloadJsonFile(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Deploys the asset cache manager
   */
  public async deploy(): Promise<void> {
    return Promise.resolve()
  }
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use AssetCacheManager instead
 */
export const MockAssetCacheManager = AssetCacheManager
