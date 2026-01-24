import EventEmitter from 'events'
import fs from 'fs'
import * as path from 'path'

import {
  ExcelBinCache,
  PrimitiveKeys,
} from '@/adapter/input/cache/ExcelBinCache'
import { TextMapCache } from '@/adapter/input/cache/TextMapCache'
import { AssetDownloader } from '@/adapter/input/download/AssetDownloader'
import { getTextMapFileNamesFromGitLab } from '@/adapter/input/download/getTextMapFileNamesFromGitLab'
import { VersionChecker } from '@/adapter/input/download/VersionChecker'
import { AssetCorruptedError } from '@/adapter/input/errors/AssetCorruptedError'
import { ConfigMissingError } from '@/adapter/input/errors/ConfigMissingError'
import { PromiseEventEmitter } from '@/adapter/input/events/PromiseEventEmitter'
import { logger } from '@/adapter/input/logger/Logger'
import { GitLabApiRoutes } from '@/adapter/input/types/api/gitlab/routes'
import { ExcelBinOutputs } from '@/adapter/input/types/excelBinOutputs'
import { MasterFileMap } from '@/adapter/input/types/generated/MasterFileMap'
import { RestClient } from '@/application/client/RestClient'
import { ClientEventMap, ClientEvents } from '@/application/types/events/client'
import { hasValidConstructor } from '@/domain/typeGuards/hasValidConstructor'
import { LogLevel } from '@/domain/types/LogLevel'
import type { ClientOption, Language } from '@/domain/types/types'

/**
 * Class for managing cached assets
 * @internal
 */
export abstract class AssetCacheManager<
  T extends ClientEventMap,
> extends PromiseEventEmitter<T> {
  /**
   * Asset event emitter
   * @internal
   */
  protected static readonly _assetEventEmitter: EventEmitter<ClientEventMap> =
    new EventEmitter<ClientEventMap>()

  /**
   * GitLab Project Id
   */
  private static readonly GITLAB_PROJECT_ID = 53216109

  /**
   * Maximum retry count for cache loading
   */
  private static readonly MAX_RETRY_COUNT = 3

  /**
   * GitLab API client
   */
  private static gitlabApiClient: RestClient<GitLabApiRoutes>

  /**
   * Asset downloader
   */
  private static assetDownloader: AssetDownloader

  /**
   * Version checker (backing field)
   */
  private static _versionChecker: VersionChecker | undefined

  /**
   * ExcelBinOutput cache (backing field)
   */
  private static _excelBinCache: ExcelBinCache | undefined

  /**
   * TextMap cache (backing field)
   */
  private static _textMapCache: TextMapCache | undefined

  /**
   * Client options
   */
  private static option: ClientOption

  /**
   * Folder paths
   */
  private static excelBinOutputFolderPath: string
  private static textMapFolderPath: string

  /**
   * Text hashes for filtering
   */
  private static textHashes = new Set<number>()

  /**
   * Used ExcelBinOutput keys
   */
  private static useExcelBinOutputKeys = new Set<keyof typeof ExcelBinOutputs>()

  /**
   * Create a AssetCacheManager
   * @param option - client option
   */
  constructor(option: ClientOption) {
    super()
    AssetCacheManager.option = option

    const logLevel = option.logLevel ?? LogLevel.NONE
    logger.configure({ level: logLevel })

    // Initialize paths
    const commitFilePath = path.resolve(
      option.assetCacheFolderPath,
      'commits.json',
    )
    AssetCacheManager.excelBinOutputFolderPath = path.resolve(
      option.assetCacheFolderPath,
      'ExcelBinOutput',
    )
    AssetCacheManager.textMapFolderPath = path.resolve(
      option.assetCacheFolderPath,
      'TextMap',
    )

    // Initialize REST client
    AssetCacheManager.gitlabApiClient = new RestClient<GitLabApiRoutes>(
      'https://gitlab.com',
      {
        headers: option.fetchOption.headers,
        retry: 3,
        retryDelay: 100,
      },
    )

    // Initialize asset downloader
    AssetCacheManager.assetDownloader = new AssetDownloader({
      restClient: AssetCacheManager.gitlabApiClient,
      projectId: AssetCacheManager.GITLAB_PROJECT_ID,
    })

    // Initialize version checker (only once)
    AssetCacheManager._versionChecker ??= new VersionChecker({
      commitFilePath,
      projectId: AssetCacheManager.GITLAB_PROJECT_ID,
      restClient: AssetCacheManager.gitlabApiClient,
    })

    // Initialize ExcelBin cache (only once)
    AssetCacheManager._excelBinCache ??= new ExcelBinCache({
      folderPath: AssetCacheManager.excelBinOutputFolderPath,
      autoFix: option.autoFixExcelBin,
    })

    // Initialize TextMap cache (only once)
    AssetCacheManager._textMapCache ??= new TextMapCache({
      folderPath: AssetCacheManager.textMapFolderPath,
      autoFix: option.autoFixTextMap,
    })
  }

  /**
   * Cached text map (exposed for compatibility)
   * @internal
   */
  public static get _cachedTextMap(): Map<number, string> {
    return this.textMapCache.data
  }

  /**
   * Assets game version text
   */
  protected static get gameVersion(): string | undefined {
    return this._versionChecker?.getGameVersion()
  }

  /**
   * Version checker accessor
   */
  private static get versionChecker(): VersionChecker {
    if (!this._versionChecker)
      throw new ConfigMissingError('versionChecker', 'AssetCacheManager')
    return this._versionChecker
  }

  /**
   * ExcelBin cache accessor
   */
  private static get excelBinCache(): ExcelBinCache {
    if (!this._excelBinCache)
      throw new ConfigMissingError('excelBinCache', 'AssetCacheManager')
    return this._excelBinCache
  }

  /**
   * TextMap cache accessor
   */
  private static get textMapCache(): TextMapCache {
    if (!this._textMapCache)
      throw new ConfigMissingError('textMapCache', 'AssetCacheManager')
    return this._textMapCache
  }

  /**
   * Add ExcelBinOutput Key from Class Prototype
   * @param classPrototype - Class prototype to extract keys from
   * @internal
   */
  public static _addExcelBinOutputKeyFromClassPrototype(
    classPrototype: unknown,
  ): void {
    if (!hasValidConstructor(classPrototype)) return
    const methodSource = classPrototype.constructor.toString()

    const keys = Object.keys(ExcelBinOutputs)
    const matches = [
      ...methodSource.matchAll(
        new RegExp(`(?<=("|\`|'))(${keys.join('|')})(?=("|\`|'))`, 'g'),
      ),
    ]
    matches
      .map((match) => match[0] as keyof typeof ExcelBinOutputs)
      .forEach((key) => this.useExcelBinOutputKeys.add(key))
  }

  /**
   * Get all records for a table
   * @param table - Table name
   * @internal
   */
  public static _getAll<K extends keyof MasterFileMap>(
    table: K,
  ): MasterFileMap[K][] {
    return this.excelBinCache.getAll(table)
  }

  /**
   * Filter records by property value (uses lazy index for O(1))
   * @param table - Table name
   * @param property - Property name to filter by
   * @param value - Value to match
   * @internal
   */
  public static _filterBy<
    K extends keyof MasterFileMap,
    P extends PrimitiveKeys<MasterFileMap[K]>,
  >(table: K, property: P, value: MasterFileMap[K][P]): MasterFileMap[K][] {
    return this.excelBinCache.filterBy(table, property, value)
  }

  /**
   * Find first record by property value
   * @param table - Table name
   * @param property - Property name to filter by
   * @param value - Value to match
   * @internal
   */
  public static _findBy<
    K extends keyof MasterFileMap,
    P extends PrimitiveKeys<MasterFileMap[K]>,
  >(
    table: K,
    property: P,
    value: MasterFileMap[K][P],
  ): MasterFileMap[K] | undefined {
    return this.excelBinCache.findBy(table, property, value)
  }

  /**
   * Check if table is loaded
   * @param table - Table name
   * @internal
   */
  public static _hasTable(table: keyof MasterFileMap): boolean {
    return this.excelBinCache.hasTable(table)
  }

  /**
   * Search records by text
   * @param table - Table name
   * @param text - Text to search
   * @internal
   */
  public static _searchByText<K extends keyof MasterFileMap>(
    table: K,
    text: string,
  ): MasterFileMap[K][] {
    return this.excelBinCache.searchByText(table, text, this.textMapCache.data)
  }

  /**
   * Update cache
   */
  protected static async updateCache(): Promise<void> {
    logger.info('GenshinManager: Start update cache.')

    this.ensureFolders()

    const newVersionText = await this.versionChecker.checkForUpdate()
    if (!this.gameVersion) return

    if (newVersionText && this.option.autoFetchLatestAssetsByCron) {
      await this.downloadNewAssets(newVersionText)
    } else {
      logger.info(
        `GenshinManager: No new Asset found. Set cache. GameVersion: ${this.gameVersion}`,
      )
    }

    await this.loadCache()
    logger.info('GenshinManager: Finish update cache and set cache.')
  }

  /**
   * Change cached languages
   * @param language - Target language
   */
  protected static async setTextMapToCache(language: Language): Promise<void> {
    await this.loadTextMapCacheWithRetry(language, this.textHashes)
  }

  /**
   * Download new assets from GitLab
   * @param versionText - Version text
   */
  private static async downloadNewAssets(versionText: string): Promise<void> {
    this._assetEventEmitter.emit(ClientEvents.BeginUpdateAssets, versionText)
    logger.info(
      `GenshinManager: New Asset found. Update Assets. GameVersion: ${versionText}`,
    )

    await this.fetchAssetFolder(
      this.excelBinOutputFolderPath,
      Object.values(ExcelBinOutputs),
    )

    await this.loadExcelBinCacheWithRetry(ExcelBinCache.allKeys)
    this.textHashes = this.excelBinCache.extractTextHashes()

    const textMapFileNamesMap = await getTextMapFileNamesFromGitLab(
      this.option.downloadLanguages,
      {
        restClient: this.gitlabApiClient,
        projectId: this.GITLAB_PROJECT_ID,
        commitId: this.versionChecker.commitId,
      },
    )
    const textMapFileNames = [...textMapFileNamesMap.values()].flat()

    await this.fetchAssetFolder(this.textMapFolderPath, textMapFileNames)

    this._assetEventEmitter.emit(ClientEvents.EndUpdateAssets, versionText)
    logger.info('GenshinManager: Set cache.')
  }

  /**
   * Load cache from local files
   */
  private static async loadCache(): Promise<void> {
    this._assetEventEmitter.emit(
      ClientEvents.BeginUpdateCache,
      this.gameVersion ?? '',
    )

    await this.loadExcelBinCacheWithRetry(this.useExcelBinOutputKeys)
    this.textHashes = this.excelBinCache.extractTextHashes()

    await this.loadTextMapCacheWithRetry(
      this.option.defaultLanguage,
      this.textHashes,
    )

    this._assetEventEmitter.emit(
      ClientEvents.EndUpdateCache,
      this.gameVersion ?? '',
    )
  }

  /**
   * Ensure cache folders exist
   */
  private static ensureFolders(): void {
    const folders = [
      this.option.assetCacheFolderPath,
      this.excelBinOutputFolderPath,
      this.textMapFolderPath,
    ]
    for (const folder of folders)
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
  }

  /**
   * Re-download text map
   * @param language - Target language
   */
  private static async reDownloadTextMap(language: Language): Promise<void> {
    const textMapFileNamesMap = await getTextMapFileNamesFromGitLab(
      [language],
      {
        restClient: this.gitlabApiClient,
        projectId: this.GITLAB_PROJECT_ID,
        commitId: this.versionChecker.commitId,
      },
    )
    const textMapFileNames = textMapFileNamesMap.get(language) ?? []

    await this.loadExcelBinCacheWithRetry(ExcelBinCache.allKeys)
    this.textHashes = this.excelBinCache.extractTextHashes()

    await this.fetchAssetFolder(this.textMapFolderPath, textMapFileNames, true)
  }

  /**
   * Re-download all excel bin output
   */
  private static async reDownloadAllExcelBinOutput(): Promise<void> {
    await this.fetchAssetFolder(
      this.excelBinOutputFolderPath,
      Object.values(ExcelBinOutputs),
      true,
    )
  }

  /**
   * Fetch asset folder from GitLab
   * @param downloadFolderPath - Path to download folder
   * @param files - Files to download
   * @param isRetry - Whether this is a retry
   */
  private static async fetchAssetFolder(
    downloadFolderPath: string,
    files: string[],
    isRetry = false,
  ): Promise<void> {
    const gitFolderName = path.relative(
      this.option.assetCacheFolderPath,
      downloadFolderPath,
    )

    this.assetDownloader.commitId = this.versionChecker.commitId
    this.assetDownloader.textHashes = this.textHashes

    await this.assetDownloader.downloadFolder(
      downloadFolderPath,
      gitFolderName,
      files,
      isRetry,
    )
  }

  /**
   * Load ExcelBin cache with automatic re-download on failure
   * @param keys - Keys to load
   */
  private static async loadExcelBinCacheWithRetry(
    keys: Set<keyof typeof ExcelBinOutputs>,
  ): Promise<void> {
    let result = await this.excelBinCache.load(keys)
    let retryCount = 0
    while (result.redownloadRequired) {
      if (retryCount >= this.MAX_RETRY_COUNT) {
        throw new AssetCorruptedError(
          'ExcelBinOutput',
          `Max retry count (${String(this.MAX_RETRY_COUNT)}) exceeded`,
          { source: 'ExcelBinOutput', operation: 'load' },
        )
      }

      await this.reDownloadAllExcelBinOutput()
      result = await this.excelBinCache.load(keys)
      retryCount++
    }
  }

  /**
   * Load TextMap cache with automatic re-download on failure
   * @param language - Target language
   * @param textHashes - Text hashes to filter
   */
  private static async loadTextMapCacheWithRetry(
    language: Language,
    textHashes: Set<number>,
  ): Promise<void> {
    let result = await this.textMapCache.load(language, textHashes)
    let retryCount = 0
    while (result.redownloadLanguage) {
      if (retryCount >= this.MAX_RETRY_COUNT) {
        throw new AssetCorruptedError(
          'TextMap',
          `Max retry count (${String(this.MAX_RETRY_COUNT)}) exceeded`,
          { source: 'TextMap', operation: 'load' },
        )
      }

      await this.reDownloadTextMap(result.redownloadLanguage)
      result = await this.textMapCache.load(language, textHashes)
      retryCount++
    }
  }
}
