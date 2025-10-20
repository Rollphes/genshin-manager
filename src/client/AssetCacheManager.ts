import * as cliProgress from 'cli-progress'
import EventEmitter from 'events'
import fs from 'fs'
import * as path from 'path'
import { pipeline } from 'stream/promises'

import {
  AssetCorruptedError,
  AssetNotFoundError,
  BodyNotFoundError,
  TextMapFormatError,
} from '@/errors'
import {
  CacheStructureMap,
  ClientOption,
  ExcelBinOutputs,
  MasterFileMap,
  TextMapLanguage,
} from '@/types'
import type { JsonObject } from '@/types/json'
import { buildCacheStructure, withFileLock } from '@/utils/cache'
import { EncryptedKeyDecoder } from '@/utils/crypto'
import { EventMap, PromiseEventEmitter } from '@/utils/events'
import { logger, LogLevel } from '@/utils/logger'
import {
  ReadableStreamWrapper,
  TextMapEmptyWritable,
  TextMapTransform,
} from '@/utils/streams'

interface GitLabAPIResponse {
  id: string
  short_id: string
  created_at: string
  parent_ids: string[]
  title: string
  message: string
  authored_date: string
  committed_date: string
  web_url: string
}

interface AssetCacheManagerEventMap {
  BEGIN_UPDATE_CACHE: [version: string]
  END_UPDATE_CACHE: [version: string]
  BEGIN_UPDATE_ASSETS: [version: string]
  END_UPDATE_ASSETS: [version: string]
}

/**
 * Class for managing cached assets
 * @abstract
 */
export abstract class AssetCacheManager<
  T extends EventMap<T>,
  E extends keyof T,
> extends PromiseEventEmitter<T, E> {
  /**
   * Cached text map
   * @deprecated This property is deprecated because it is used to pass data to each class
   * @key Text hash
   * @value Text
   */
  public static readonly _cachedTextMap = new Map<number, string>()

  /**
   * Asset event emitter
   * @deprecated This property is deprecated because it is used to pass data to each class
   */
  protected static readonly _assetEventEmitter: EventEmitter<AssetCacheManagerEventMap> =
    new EventEmitter<AssetCacheManagerEventMap>()

  private static readonly GIT_REMOTE_API_URL: string =
    'https://gitlab.com/api/v4/projects/53216109/repository/commits?per_page=1'
  private static readonly GIT_REMOTE_RAW_BASE_URL: string =
    'https://gitlab.com/Dimbreath/AnimeGameData/-/raw'
  /**
   * Cached text map
   * @key ExcelBinOutput name
   * @value Cached excel bin output
   */
  private static cachedExcelBinOutput: {
    [K in keyof CacheStructureMap]?: CacheStructureMap[K]
  } = {}

  private static option: ClientOption
  private static nowCommitId: string

  private static commitFilePath: string
  private static excelBinOutputFolderPath: string
  private static textMapFolderPath: string

  private static textHashes = new Set<number>()
  private static useExcelBinOutputKeys = new Set<keyof typeof ExcelBinOutputs>()

  /**
   * Create a AssetCacheManager
   * @param option client option
   */
  constructor(option: ClientOption) {
    super()
    AssetCacheManager.option = option

    // Configure logger with unified log level
    const logLevel = option.logLevel ?? LogLevel.NONE

    logger.configure({ level: logLevel })

    AssetCacheManager.commitFilePath = path.resolve(
      AssetCacheManager.option.assetCacheFolderPath,
      'commits.json',
    )

    AssetCacheManager.commitFilePath = path.resolve(
      AssetCacheManager.option.assetCacheFolderPath,
      'commits.json',
    )

    AssetCacheManager.excelBinOutputFolderPath = path.resolve(
      AssetCacheManager.option.assetCacheFolderPath,
      'ExcelBinOutput',
    )
    AssetCacheManager.textMapFolderPath = path.resolve(
      AssetCacheManager.option.assetCacheFolderPath,
      'TextMap',
    )
  }

  /**
   * Assets game version text
   * @returns assets game version text or undefined
   */
  protected static get gameVersion(): string | undefined {
    if (!fs.existsSync(this.commitFilePath)) return undefined

    try {
      const fileContent = fs.readFileSync(this.commitFilePath, {
        encoding: 'utf8',
      })

      if (fileContent.trim() === '') return undefined

      const oldCommitsRaw: unknown = JSON.parse(fileContent)
      if (
        !Array.isArray(oldCommitsRaw) ||
        oldCommitsRaw.length === 0 ||
        !this.isGitLabAPIResponse(oldCommitsRaw[0])
      )
        return undefined

      const versionTexts = /OSRELWin(\d+\.\d+\.\d+)_/.exec(
        oldCommitsRaw[0].title,
      )
      if (!versionTexts || versionTexts.length < 2) return '?.?.?'
      return versionTexts[1]
    } catch (error) {
      logger.error('GenshinManager: Error reading commits.json:', error)
      return undefined
    }
  }

  /**
   * Create ExcelBinOutput Keys to cache
   * @returns all ExcelBinOutput Keys
   */
  private static get excelBinOutputAllKeys(): Set<
    keyof typeof ExcelBinOutputs
  > {
    return new Set(
      Object.keys(ExcelBinOutputs).map(
        (key) => key as keyof typeof ExcelBinOutputs,
      ),
    )
  }

  /**
   * Download json file from URL and write to downloadFilePath
   * Prevents file conflicts through concurrent access control
   * @param url URL
   * @param downloadFilePath download file path
   */
  public static async downloadJsonFile(
    url: string,
    downloadFilePath: string,
  ): Promise<void> {
    return withFileLock(downloadFilePath, async () => {
      return this.downloadJsonFileInternal(url, downloadFilePath)
    })
  }

  /**
   * Add ExcelBinOutput Key from Class Prototype to AssetCacheManager
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param classPrototype class prototype
   */
  public static _addExcelBinOutputKeyFromClassPrototype(
    classPrototype: unknown,
  ): void {
    const targetOrigin = classPrototype as {
      constructor: { toString: () => string }
    }
    const methodSource = targetOrigin.constructor.toString()

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
   * Get Json from cached excel bin output
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key excelBinOutput name
   * @param id ID of character, etc
   * @returns JSON
   */
  public static _getJsonFromCachedExcelBinOutput<
    T extends keyof typeof ExcelBinOutputs,
  >(key: T, id: string | number): NonNullable<CacheStructureMap[T][string]> {
    const excelBinOutput = this.cachedExcelBinOutput[key]
    if (!excelBinOutput) throw new AssetNotFoundError(key)

    const excelBinOutputId = excelBinOutput[id] as CacheStructureMap[T][string]
    if (!excelBinOutputId)
      throw new AssetNotFoundError(`${key} ID:${String(id)}`)

    return excelBinOutputId
  }

  /**
   * Get cached excel bin output by name
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key excelBinOutput name
   * @returns cached excel bin output
   */
  public static _getCachedExcelBinOutputByName<
    T extends keyof typeof ExcelBinOutputs,
  >(key: T): CacheStructureMap[T] {
    const excelBinOutput = this.cachedExcelBinOutput[key]
    if (!excelBinOutput) throw new AssetNotFoundError(key)

    return excelBinOutput as CacheStructureMap[T]
  }

  /**
   * Check if cached excel bin output exists by name
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key excelBinOutput name
   * @returns cached excel bin output exists
   */
  public static _hasCachedExcelBinOutputByName(
    key: keyof typeof ExcelBinOutputs,
  ): boolean {
    return this.cachedExcelBinOutput[key] !== undefined
  }

  /**
   * Check if cached excel bin output exists by ID
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key excelBinOutput name
   * @param id ID of character, etc
   * @returns cached excel bin output exists
   */
  public static _hasCachedExcelBinOutputById(
    key: keyof typeof ExcelBinOutputs,
    id: string | number,
  ): boolean {
    const excelBinOutput = this.cachedExcelBinOutput[key]
    if (!excelBinOutput) return false

    return excelBinOutput[String(id)] !== undefined
  }

  /**
   * Search ID in CachedExcelBinOutput by text
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key excelBinOutput name
   * @param text text
   * @returns IDs
   */
  public static _searchIdInExcelBinOutByText(
    key: keyof typeof ExcelBinOutputs,
    text: string,
  ): string[] {
    const cachedData = this._getCachedExcelBinOutputByName(key)
    return Object.entries(cachedData)
      .filter(([, obj]) => {
        if (!obj || typeof obj !== 'object') return false
        const objRecord = obj as JsonObject
        return Object.keys(objRecord).some((jsonKey) => {
          if (/TextMapHash/g.exec(jsonKey)) {
            const value = objRecord[jsonKey]
            if (typeof value === 'number')
              return this._cachedTextMap.get(value) === text
          }
          return false
        })
      })
      .map(([id]) => id)
  }

  /**
   * Change cached languages
   * @param language country code
   * @returns true if an error occurs
   */
  protected static async setTextMapToCache(
    language: keyof typeof TextMapLanguage,
  ): Promise<boolean> {
    const results = await Promise.all(
      TextMapLanguage[language].map(async (fileName) => {
        const selectedTextMapPath = path.join(this.textMapFolderPath, fileName)
        if (!fs.existsSync(selectedTextMapPath)) {
          if (this.option.autoFixTextMap) {
            logger.info(
              `GenshinManager: ${fileName} not found. Re downloading...`,
            )
            await this.reDownloadTextMap(language)
            return true
          } else {
            throw new AssetNotFoundError(language)
          }
        }

        const eventEmitter = new TextMapEmptyWritable()

        eventEmitter.on('data', ({ key, value }) =>
          this._cachedTextMap.set(+(key as string), value as string),
        )

        const pipelinePromiseResult = await pipeline(
          fs.createReadStream(selectedTextMapPath, {
            highWaterMark: 1 * 1024 * 1024,
          }),
          new TextMapTransform(language, this.textHashes),
          eventEmitter,
        ).catch(async (error: unknown) => {
          if (error instanceof TextMapFormatError) {
            if (this.option.autoFixTextMap) {
              logger.info(
                `GenshinManager: TextMap${language}.json format error. Re downloading...`,
              )
              await this.reDownloadTextMap(language)
              return true
            } else {
              throw error
            }
          }
        })
        if (pipelinePromiseResult) return true
        return false
      }),
    )
    return results.every(Boolean)
  }

  /**
   * Update cache
   * @example
   * ```ts
   * await Client.updateCache()
   * ```
   */
  protected static async updateCache(): Promise<void> {
    logger.info('GenshinManager: Start update cache.')
    const newVersionText = await this.checkGitUpdate()
    if (!this.gameVersion) return
    if (newVersionText && this.option.autoFetchLatestAssetsByCron) {
      this._assetEventEmitter.emit('BEGIN_UPDATE_ASSETS', newVersionText)
      logger.info(
        `GenshinManager: New Asset found. Update Assets. GameVersion: ${newVersionText}`,
      )
      await this.fetchAssetFolder(
        this.excelBinOutputFolderPath,
        Object.values(ExcelBinOutputs),
      )
      await this.retryUntilSuccess(() =>
        this.setExcelBinOutputToCache(this.excelBinOutputAllKeys),
      )
      this.createTextHashes()
      const textMapFileNames = this.option.downloadLanguages
        .map((key) => TextMapLanguage[key])
        .flat()
      await this.fetchAssetFolder(this.textMapFolderPath, textMapFileNames)
      this._assetEventEmitter.emit('END_UPDATE_ASSETS', newVersionText)
      logger.info('GenshinManager: Set cache.')
    } else {
      logger.info(
        `GenshinManager: No new Asset found. Set cache. GameVersion: ${this.gameVersion}`,
      )
    }
    this._assetEventEmitter.emit('BEGIN_UPDATE_CACHE', this.gameVersion)
    await this.retryUntilSuccess(() =>
      this.setExcelBinOutputToCache(this.useExcelBinOutputKeys),
    )
    this.createTextHashes()
    await this.retryUntilSuccess(() =>
      this.setTextMapToCache(this.option.defaultLanguage),
    )
    this._assetEventEmitter.emit('END_UPDATE_CACHE', this.gameVersion)

    logger.info('GenshinManager: Finish update cache and set cache.')
  }

  /**
   * Set excel bin output to cache
   * @param keys excelBinOutput names
   * @returns true if an error occurs
   */
  protected static async setExcelBinOutputToCache(
    keys: Set<keyof typeof ExcelBinOutputs>,
  ): Promise<boolean> {
    const allKeys = Object.keys(
      ExcelBinOutputs,
    ) as (keyof typeof ExcelBinOutputs)[]
    allKeys.forEach((key) => {
      Reflect.deleteProperty(this.cachedExcelBinOutput, key)
    })

    const rawJsonDataMap = new Map<
      keyof typeof ExcelBinOutputs,
      MasterFileMap[keyof typeof ExcelBinOutputs][]
    >()
    for (const key of keys) {
      const filename = ExcelBinOutputs[key]
      const selectedExcelBinOutputPath = path.join(
        this.excelBinOutputFolderPath,
        filename,
      )
      let text = ''
      if (!fs.existsSync(selectedExcelBinOutputPath)) {
        if (this.option.autoFixExcelBin) {
          logger.info(
            `GenshinManager: ${filename} not found. Re downloading...`,
          )
          await this.reDownloadAllExcelBinOutput()
          return true
        } else {
          throw new AssetNotFoundError(key)
        }
      }
      const stream = fs.createReadStream(selectedExcelBinOutputPath, {
        highWaterMark: 1 * 1024 * 1024,
      })
      stream.on('data', (chunk) => (text += chunk as string))
      const setCachePromiseResult = await new Promise<void>(
        (resolve, reject) => {
          stream.on('error', (error) => {
            reject(error)
          })
          stream.on('end', () => {
            const parsedData: unknown = JSON.parse(text)
            if (!Array.isArray(parsedData)) {
              reject(
                new Error(
                  `Invalid data format for ${key}: expected array, got ${typeof parsedData}`,
                ),
              )
              return
            }
            rawJsonDataMap.set(key, parsedData as MasterFileMap[typeof key][])
            resolve()
          })
        },
      ).catch(async (error: unknown) => {
        if (error instanceof SyntaxError) {
          if (this.option.autoFixExcelBin) {
            logger.info(
              `GenshinManager: ${filename} format error. Re downloading...`,
            )
            await this.reDownloadAllExcelBinOutput()
            return true
          } else {
            throw error
          }
        }
      })
      if (setCachePromiseResult) return true
    }

    for (const [fileName, jsonObjectArray] of rawJsonDataMap)
      this.processCacheEntry(fileName, jsonObjectArray)

    return false
  }

  /**
   * Process and cache a single Excel bin output entry
   * @param fileName - Excel bin output file name
   * @param jsonObjectArray - Raw JSON data array
   */
  private static processCacheEntry<T extends keyof typeof ExcelBinOutputs>(
    fileName: T,
    jsonObjectArray: MasterFileMap[T][],
  ): void {
    const encryptedKeyDecoder = new EncryptedKeyDecoder(fileName)
    const encryptedKeyDecodedData = encryptedKeyDecoder.execute(
      jsonObjectArray as JsonObject[],
    )

    const processedData = buildCacheStructure(encryptedKeyDecodedData, fileName)
    this.cachedExcelBinOutput[fileName] = processedData

    logger.debug(
      `GenshinManager: ${fileName} processing complete (${String(Object.keys(jsonObjectArray).length)} → ${String(Object.keys(processedData).length)} keys)`,
    )
  }

  /**
   * Check gitlab for new commits
   * @returns new assets version text or undefined
   */
  private static async checkGitUpdate(): Promise<undefined | string> {
    ;[
      this.option.assetCacheFolderPath,
      this.excelBinOutputFolderPath,
      this.textMapFolderPath,
    ].map((folderPath) => {
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
    })

    let oldCommits: GitLabAPIResponse[] | null = null

    if (fs.existsSync(this.commitFilePath)) {
      try {
        const oldFileContent = fs.readFileSync(this.commitFilePath, {
          encoding: 'utf8',
        })

        if (oldFileContent.trim() === '') {
          oldCommits = null
        } else {
          const parsedData: unknown = JSON.parse(oldFileContent)
          oldCommits =
            Array.isArray(parsedData) &&
            parsedData.length > 0 &&
            this.isGitLabAPIResponse(parsedData[0])
              ? parsedData
              : null
        }
      } catch (error) {
        logger.error(
          'GenshinManager: Error reading existing commits.json:',
          error,
        )
        oldCommits = null
      }
    }

    await this.downloadJsonFile(this.GIT_REMOTE_API_URL, this.commitFilePath)

    try {
      const fileContent = fs.readFileSync(this.commitFilePath, {
        encoding: 'utf8',
      })

      if (fileContent.trim() === '') {
        logger.error('GenshinManager: Downloaded commits.json is empty!')
        throw new AssetCorruptedError('commits.json', 'File is empty')
      }

      const newCommitsRaw: unknown = JSON.parse(fileContent)

      if (
        !Array.isArray(newCommitsRaw) ||
        newCommitsRaw.length === 0 ||
        !this.isGitLabAPIResponse(newCommitsRaw[0])
      ) {
        logger.error(
          'GenshinManager: Downloaded commits.json contains invalid data structure!',
        )
        throw new AssetCorruptedError(
          'commits.json',
          'Invalid data structure (expected non-empty array)',
        )
      }

      this.nowCommitId = newCommitsRaw[0].id
      if (oldCommits && newCommitsRaw[0].id === oldCommits[0].id) {
        return undefined
      } else {
        const versionTexts = /OSRELWin(\d+\.\d+\.\d+)_/.exec(
          newCommitsRaw[0].title,
        )
        if (!versionTexts || versionTexts.length < 2) return '?.?.?'
        return versionTexts[1]
      }
    } catch (error) {
      logger.error('GenshinManager: Error reading new commits.json:', error)
      logger.error('GenshinManager: File path:', this.commitFilePath)

      try {
        const fileContent = fs.readFileSync(this.commitFilePath, {
          encoding: 'utf8',
        })
        logger.error(
          'GenshinManager: File content preview:',
          fileContent.substring(0, 200),
        )
      } catch (readError) {
        logger.error('GenshinManager: Cannot read file for debug:', readError)
      }

      throw error
    }
  }

  /**
   * Create TextHashes to cache
   */
  private static createTextHashes(): void {
    this.textHashes.clear()
    Object.values(this.cachedExcelBinOutput).forEach((excelBinDataMap) => {
      if (typeof excelBinDataMap !== 'object') return
      Object.values(excelBinDataMap).forEach((excelBinData) => {
        if (typeof excelBinData !== 'object') return

        const dataRecord = excelBinData as JsonObject
        Object.keys(dataRecord).forEach((key) => {
          if (/TextMapHash/g.exec(key)) {
            const hash = dataRecord[key]
            if (typeof hash === 'number') this.textHashes.add(hash)
          }
          if (key === 'tips') {
            const hashes = dataRecord[key]
            if (Array.isArray(hashes)) {
              hashes.forEach((hash) => {
                if (typeof hash === 'number') this.textHashes.add(hash)
              })
            }
          }
        })

        Object.values(dataRecord).forEach((value) => {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const valueRecord = value
            Object.keys(valueRecord).forEach((key) => {
              if (/TextMapHash/g.exec(key)) {
                const hash = valueRecord[key]
                if (typeof hash === 'number') this.textHashes.add(hash)
              }
              if (key === 'paramDescList') {
                const hashes = valueRecord[key]
                if (Array.isArray(hashes)) {
                  hashes.forEach((hash) => {
                    if (typeof hash === 'number') this.textHashes.add(hash)
                  })
                }
              }
            })
          }
        })
      })
    })
  }

  /**
   * Re download text map
   * @param language country code
   */
  private static async reDownloadTextMap(
    language: keyof typeof TextMapLanguage,
  ): Promise<void> {
    const textMapFileNames = TextMapLanguage[language]
    await this.setExcelBinOutputToCache(this.excelBinOutputAllKeys)
    this.createTextHashes()
    await this.fetchAssetFolder(
      this.textMapFolderPath,
      [...textMapFileNames],
      true,
    )
  }

  /**
   * Re download all excel bin output
   */
  private static async reDownloadAllExcelBinOutput(): Promise<void> {
    await this.fetchAssetFolder(
      this.excelBinOutputFolderPath,
      Object.values(ExcelBinOutputs),
      true,
    )
  }

  /**
   * Fetch asset folder from gitlab
   * @param folderPath folder path
   * @param files file names
   * @param isRetry is retry
   */
  private static async fetchAssetFolder(
    folderPath: string,
    files: string[],
    isRetry = false,
  ): Promise<void> {
    if (!isRetry) {
      await withFileLock(folderPath, async () => {
        if (fs.existsSync(folderPath))
          fs.rmdirSync(folderPath, { recursive: true })
        fs.mkdirSync(folderPath, { recursive: true })
        return Promise.resolve()
      })
    } else {
      if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath, { recursive: true })
    }

    const gitFolderName = path.relative(
      this.option.assetCacheFolderPath,
      folderPath,
    )
    const consoleFolderName = gitFolderName.slice(0, 8)
    const progressBar = logger.shouldLog(LogLevel.INFO)
      ? new cliProgress.SingleBar({
          hideCursor: true,
          format: `GenshinManager: Downloading ${consoleFolderName}...\t [{bar}] {percentage}% |ETA: {eta}s| {value}/{total} files`,
        })
      : undefined

    if (progressBar) progressBar.start(files.length, 0)

    const concurrentLimit = 3
    const chunks: string[][] = []
    for (let i = 0; i < files.length; i += concurrentLimit)
      chunks.push(files.slice(i, i + concurrentLimit))

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (fileName) => {
          const url = [
            this.GIT_REMOTE_RAW_BASE_URL,
            this.nowCommitId,
            gitFolderName,
            fileName,
          ].join('/')
          const filePath = path.join(folderPath, fileName)
          await this.downloadJsonFile(url, filePath)
          if (progressBar) progressBar.increment()
        }),
      )
      if (chunks.indexOf(chunk) < chunks.length - 1)
        await new Promise((resolve) => setTimeout(resolve, 100))
    }

    if (progressBar) progressBar.stop()
  }

  /**
   * Internal download process executed within file lock
   * @param url URL
   * @param downloadFilePath download file path
   */
  private static async downloadJsonFileInternal(
    url: string,
    downloadFilePath: string,
  ): Promise<void> {
    const maxRetries = 3
    const baseMsDelay = 100

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(url, this.option.fetchOption)
        if (!res.body) throw new BodyNotFoundError(url)

        const writeStream: fs.WriteStream = fs.createWriteStream(
          downloadFilePath,
          {
            highWaterMark: 1 * 1024 * 1024,
          },
        )

        const language = path
          .basename(downloadFilePath)
          .split('.')[0]
          .replace('TextMap', '') as keyof typeof TextMapLanguage

        if ('TextMap' === path.basename(path.dirname(downloadFilePath))) {
          await pipeline(
            new ReadableStreamWrapper(res.body.getReader()),
            new TextMapTransform(language, this.textHashes),
            writeStream,
          )
        } else {
          await pipeline(
            new ReadableStreamWrapper(res.body.getReader()),
            writeStream,
          )
        }

        await new Promise<void>((resolve, reject) => {
          if (writeStream.closed) {
            resolve()
            return
          }

          writeStream.once('finish', () => {
            try {
              const fd: unknown = (writeStream as { fd?: unknown }).fd
              if (fd !== null && fd !== undefined && typeof fd === 'number') {
                fs.fsync(fd, (err: NodeJS.ErrnoException | null) => {
                  if (err)
                    reject(err instanceof Error ? err : new Error(String(err)))
                  else resolve()
                })
              } else {
                resolve()
              }
            } catch (err) {
              reject(
                err instanceof Error
                  ? err
                  : new Error('Failed to get file descriptor'),
              )
            }
          })

          writeStream.once('error', (err: Error) => {
            reject(err)
          })
        })

        if (!fs.existsSync(downloadFilePath)) {
          throw new AssetNotFoundError(
            downloadFilePath,
            'File does not exist after download completion',
          )
        }

        let fileStats: fs.Stats
        try {
          fileStats = fs.statSync(downloadFilePath)
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            throw new AssetNotFoundError(
              downloadFilePath,
              'File was removed by another process during concurrent access',
            )
          }
          throw error
        }

        if (fileStats.size === 0) {
          throw new AssetCorruptedError(
            path.basename(downloadFilePath),
            'File is empty after download',
          )
        }

        if (
          downloadFilePath.endsWith('.json') ||
          downloadFilePath.includes('commits')
        ) {
          const testContent = fs.readFileSync(downloadFilePath, {
            encoding: 'utf8',
          })
          if (testContent.trim() === '') {
            throw new AssetCorruptedError(
              path.basename(downloadFilePath),
              'File content is empty after download',
            )
          }

          if (testContent.length < 10) {
            throw new AssetCorruptedError(
              path.basename(downloadFilePath),
              'File content is suspiciously short, likely truncated',
            )
          }

          JSON.parse(testContent)
        }

        return
      } catch (error) {
        if (attempt === maxRetries) throw error

        const delay = baseMsDelay * Math.pow(2, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))

        try {
          if (fs.existsSync(downloadFilePath)) fs.unlinkSync(downloadFilePath)
        } catch {
          // Silent cleanup failure
        }
      }
    }
  }

  /**
   * Type guard for GitLabAPIResponse
   * @param value value to check
   * @returns true if value is GitLabAPIResponse
   */
  private static isGitLabAPIResponse(
    value: unknown,
  ): value is GitLabAPIResponse {
    if (!value || typeof value !== 'object') return false
    const obj = value as Record<string, unknown>
    return (
      typeof obj.id === 'string' &&
      typeof obj.title === 'string' &&
      typeof obj.short_id === 'string'
    )
  }

  /**
   * Retry operation until it succeeds (returns false)
   * @param operation async operation that returns true on error (requires retry)
   */
  private static async retryUntilSuccess(
    operation: () => Promise<boolean>,
  ): Promise<void> {
    // eslint-disable-next-line no-empty
    while (await operation()) {}
  }
}
