import * as cliProgress from 'cli-progress'
import EventEmitter from 'events'
import fs from 'fs'
import * as path from 'path'
import { pipeline } from 'stream/promises'

import { AssetsNotFoundError } from '@/errors/AssetsNotFoundError'
import { BodyNotFoundError } from '@/errors/BodyNotFoundError'
import { TextMapFormatError } from '@/errors/TextMapFormatError'
import { ClientOption, ExcelBinOutputs, TextMapLanguage } from '@/types'
import { JsonObject, JsonParser } from '@/utils/JsonParser'
import { ObjectKeyDecoder } from '@/utils/ObjectKeyDecoder'
import { EventMap, PromiseEventEmitter } from '@/utils/PromiseEventEmitter'
import { ReadableStreamWrapper } from '@/utils/ReadableStreamWrapper'
import { TextMapEmptyWritable } from '@/utils/TextMapEmptyWritable'
import { TextMapTransform } from '@/utils/TextMapTransform'
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
  public static readonly _cachedTextMap = new Map<string, string>()

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
  private static readonly cachedExcelBinOutput = new Map<
    keyof typeof ExcelBinOutputs,
    JsonParser
  >()

  private static option: ClientOption
  private static nowCommitId: string

  private static commitFilePath: string
  private static excelBinOutputFolderPath: string
  private static textMapFolderPath: string

  private static textHashes = new Set<number>()
  private static useExcelBinOutputKeys = new Set<keyof typeof ExcelBinOutputs>()

  /**
   * Create a AssetCacheManager
   * @param option Client option
   */
  constructor(option: ClientOption) {
    super()
    AssetCacheManager.option = option
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
   * @returns Assets game version text or undefined
   */
  protected static get gameVersion(): string | undefined {
    const oldCommits = fs.existsSync(this.commitFilePath)
      ? (JSON.parse(
          fs.readFileSync(this.commitFilePath, {
            encoding: 'utf8',
          }),
        ) as GitLabAPIResponse[])
      : null
    if (oldCommits) {
      const versionTexts = /OSRELWin(\d+\.\d+\.\d+)_/.exec(oldCommits[0].title)
      if (!versionTexts || versionTexts.length < 2) return '?.?.?'
      return versionTexts[1]
    } else {
      return undefined
    }
  }

  /**
   * Create ExcelBinOutput Keys to cache
   * @returns All ExcelBinOutput Keys
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
   * Add ExcelBinOutput Key from Class Prototype to AssetCacheManager
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param classPrototype Class Prototype
   */
  public static _addExcelBinOutputKeyFromClassPrototype(
    classPrototype: unknown,
  ): void {
    const targetOrigin = classPrototype as Record<
      string,
      (...args: unknown[]) => unknown
    >
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
   * @param key ExcelBinOutput name
   * @param id ID of character, etc
   * @returns Json
   */
  public static _getJsonFromCachedExcelBinOutput(
    key: keyof typeof ExcelBinOutputs,
    id: string | number,
  ): JsonObject {
    const excelBinOutput = this.cachedExcelBinOutput.get(key)
    if (!excelBinOutput) throw new AssetsNotFoundError(key)

    const json = excelBinOutput.get(String(id))
    if (!json) throw new AssetsNotFoundError(key, id)

    return json
  }

  /**
   * Get cached excel bin output by name
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key ExcelBinOutput name
   * @returns Cached excel bin output
   */
  public static _getCachedExcelBinOutputByName(
    key: keyof typeof ExcelBinOutputs,
  ): Record<string, JsonObject> {
    const excelBinOutput = this.cachedExcelBinOutput.get(key)
    if (!excelBinOutput) throw new AssetsNotFoundError(key)

    return excelBinOutput.get() as Record<string, JsonObject>
  }

  /**
   * Check if cached excel bin output exists by name
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key ExcelBinOutput name
   * @returns Cached excel bin output exists
   */
  public static _hasCachedExcelBinOutputByName(
    key: keyof typeof ExcelBinOutputs,
  ): boolean {
    return this.cachedExcelBinOutput.has(key)
  }

  /**
   * Check if cached excel bin output exists by ID
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key ExcelBinOutput name
   * @param id ID of character, etc
   * @returns Cached excel bin output exists
   */
  public static _hasCachedExcelBinOutputById(
    key: keyof typeof ExcelBinOutputs,
    id: string | number,
  ): boolean {
    const excelBinOutput = this.cachedExcelBinOutput.get(key)
    if (!excelBinOutput) return false

    const json = excelBinOutput.get(String(id))
    if (!json) return false

    return true
  }

  /**
   * Search ID in CachedExcelBinOutput by text
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key ExcelBinOutput name
   * @param text Text
   * @returns IDs
   */
  public static _searchIdInExcelBinOutByText(
    key: keyof typeof ExcelBinOutputs,
    text: string,
  ): string[] {
    return Object.entries(this._getCachedExcelBinOutputByName(key))
      .filter(([, json]) =>
        Object.keys(json).some((jsonKey) => {
          if (/TextMapHash/g.exec(jsonKey)) {
            const hash = json[jsonKey] as number
            return this._cachedTextMap.get(String(hash)) === text
          }
        }),
      )
      .map(([id]) => id)
  }

  /**
   * Set excel bin output to cache
   * @param keys ExcelBinOutput names
   * @returns Returns true if an error occurs
   */
  protected static async setExcelBinOutputToCache(
    keys: Set<keyof typeof ExcelBinOutputs>,
  ): Promise<boolean> {
    this.cachedExcelBinOutput.clear()
    for (const key of keys) {
      const filename = ExcelBinOutputs[key]
      const selectedExcelBinOutputPath = path.join(
        this.excelBinOutputFolderPath,
        filename,
      )
      let text = ''
      if (!fs.existsSync(selectedExcelBinOutputPath)) {
        if (this.option.autoFixExcelBin) {
          if (this.option.showFetchCacheLog) {
            console.log(
              `GenshinManager: ${filename} not found. Re downloading...`,
            )
          }
          await this.reDownloadAllExcelBinOutput()
          return true
        } else {
          throw new AssetsNotFoundError(key)
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
            this.cachedExcelBinOutput.set(key, new JsonParser(text))
            resolve()
          })
        },
      ).catch(async (error: unknown) => {
        if (error instanceof SyntaxError) {
          if (this.option.autoFixExcelBin) {
            if (this.option.showFetchCacheLog) {
              console.log(
                `GenshinManager: ${filename} format error. Re downloading...`,
              )
            }
            await this.reDownloadAllExcelBinOutput()
            return true
          } else {
            throw error
          }
        }
      })
      if (setCachePromiseResult) return true
    }

    const decoder = new ObjectKeyDecoder()
    this.cachedExcelBinOutput.forEach((v, k) => {
      this.cachedExcelBinOutput.set(
        k,
        new JsonParser(JSON.stringify(decoder.execute(v, k))),
      )
    })
    return false
  }

  /**
   * Change cached languages
   * @param language Country code
   * @returns Returns true if an error occurs
   */
  protected static async setTextMapToCache(
    language: keyof typeof TextMapLanguage,
  ): Promise<boolean> {
    //Since the timing of loading into the cache is the last, unnecessary cache is not loaded, and therefore clearing the cache is not necessary.
    const results = await Promise.all(
      TextMapLanguage[language].map(async (fileName) => {
        const selectedTextMapPath = path.join(this.textMapFolderPath, fileName)
        if (!fs.existsSync(selectedTextMapPath)) {
          if (this.option.autoFixTextMap) {
            if (this.option.showFetchCacheLog) {
              console.log(
                `GenshinManager: ${fileName} not found. Re downloading...`,
              )
            }
            await this.reDownloadTextMap(language)
            return true
          } else {
            throw new AssetsNotFoundError(language)
          }
        }

        const eventEmitter = new TextMapEmptyWritable()

        eventEmitter.on('data', ({ key, value }) =>
          this._cachedTextMap.set(key as string, value as string),
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
              if (this.option.showFetchCacheLog) {
                console.log(
                  `GenshinManager: TextMap${language}.json format error. Re downloading...`,
                )
              }
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
    if (this.option.showFetchCacheLog)
      console.log('GenshinManager: Start update cache.')
    const newVersionText = await this.checkGitUpdate()
    if (!this.gameVersion) return
    if (newVersionText && this.option.autoFetchLatestAssetsByCron) {
      this._assetEventEmitter.emit('BEGIN_UPDATE_ASSETS', newVersionText)
      if (this.option.showFetchCacheLog) {
        console.log(
          `GenshinManager: New Asset found. Update Assets. GameVersion: ${newVersionText}`,
        )
      }
      await this.fetchAssetFolder(
        this.excelBinOutputFolderPath,
        Object.values(ExcelBinOutputs),
      )
      // eslint-disable-next-line no-empty
      while (await this.setExcelBinOutputToCache(this.excelBinOutputAllKeys)) {}
      this.createTextHashes()
      const textMapFileNames = this.option.downloadLanguages
        .map((key) => TextMapLanguage[key])
        .flat()
      await this.fetchAssetFolder(this.textMapFolderPath, textMapFileNames)
      this._assetEventEmitter.emit('END_UPDATE_ASSETS', newVersionText)
      if (this.option.showFetchCacheLog)
        console.log('GenshinManager: Set cache.')
    } else {
      if (this.option.showFetchCacheLog) {
        console.log(
          `GenshinManager: No new Asset found. Set cache. GameVersion: ${this.gameVersion}`,
        )
      }
    }
    this._assetEventEmitter.emit('BEGIN_UPDATE_CACHE', this.gameVersion)
    // eslint-disable-next-line no-empty
    while (await this.setExcelBinOutputToCache(this.useExcelBinOutputKeys)) {}
    this.createTextHashes()
    // eslint-disable-next-line no-empty
    while (await this.setTextMapToCache(this.option.defaultLanguage)) {}
    this._assetEventEmitter.emit('END_UPDATE_CACHE', this.gameVersion)

    if (this.option.showFetchCacheLog)
      console.log('GenshinManager: Finish update cache and set cache.')
  }

  /**
   * Check gitlab for new commits
   * @returns New assets version text or undefined
   */
  private static async checkGitUpdate(): Promise<undefined | string> {
    ;[
      this.option.assetCacheFolderPath,
      this.excelBinOutputFolderPath,
      this.textMapFolderPath,
    ].map((folderPath) => {
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
    })

    const oldCommits = fs.existsSync(this.commitFilePath)
      ? (JSON.parse(
          fs.readFileSync(this.commitFilePath, {
            encoding: 'utf8',
          }),
        ) as GitLabAPIResponse[])
      : null

    await this.downloadJsonFile(this.GIT_REMOTE_API_URL, this.commitFilePath)

    const newCommits = JSON.parse(
      fs.readFileSync(this.commitFilePath, {
        encoding: 'utf8',
      }),
    ) as GitLabAPIResponse[]

    this.nowCommitId = newCommits[0].id
    if (oldCommits && newCommits[0].id === oldCommits[0].id) {
      return undefined
    } else {
      const versionTexts = /OSRELWin(\d+\.\d+\.\d+)_/.exec(newCommits[0].title)
      if (!versionTexts || versionTexts.length < 2) return '?.?.?'
      return versionTexts[1]
    }
  }

  /**
   * Create TextHashes to cache
   */
  private static createTextHashes(): void {
    this.textHashes.clear()
    this.cachedExcelBinOutput.forEach((excelBin) => {
      Object.values(excelBin.get()).forEach((obj) => {
        Object.values(obj).forEach((value) => {
          const obj = value as JsonObject
          Object.keys(obj).forEach((key) => {
            if (/TextMapHash/g.exec(key)) {
              const hash = obj[key] as number
              this.textHashes.add(hash)
            }
            if (key === 'paramDescList') {
              const hashes = obj[key] as number[]
              hashes.forEach((hash) => this.textHashes.add(hash))
            }
          })
        })
        Object.keys(obj).forEach((key) => {
          if (/TextMapHash/g.exec(key)) {
            const hash = obj[key] as number
            this.textHashes.add(hash)
          }
          if (key === 'tips') {
            const hashes = obj[key] as number[]
            hashes.forEach((hash) => this.textHashes.add(hash))
          }
        })
      })
    })
  }

  /**
   * Re download text map
   * @param language Country code
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
   * @param folderPath Folder path
   * @param files File names
   * @param isRetry Is Retry
   */
  private static async fetchAssetFolder(
    folderPath: string,
    files: string[],
    isRetry = false,
  ): Promise<void> {
    if (!isRetry) {
      fs.rmdirSync(folderPath, { recursive: true })
      fs.mkdirSync(folderPath)
    }
    const gitFolderName = path.relative(
      this.option.assetCacheFolderPath,
      folderPath,
    )
    const consoleFolderName = gitFolderName.slice(0, 8)
    const progressBar = this.option.showFetchCacheLog
      ? new cliProgress.SingleBar({
          hideCursor: true,
          format: `GenshinManager: Downloading ${consoleFolderName}...\t [{bar}] {percentage}% |ETA: {eta}s| {value}/{total} files`,
        })
      : undefined

    if (progressBar) progressBar.start(files.length, 0)
    await Promise.all(
      files.map(async (fileName) => {
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
    if (progressBar) progressBar.stop()
  }

  /**
   * Download json file from URL and write to downloadFilePath
   * @param url URL
   * @param downloadFilePath Download file path
   */
  private static async downloadJsonFile(
    url: string,
    downloadFilePath: string,
  ): Promise<void> {
    const res = await fetch(url, this.option.fetchOption)
    if (!res.body) throw new BodyNotFoundError(url)
    const writeStream = fs.createWriteStream(downloadFilePath, {
      highWaterMark: 1 * 1024 * 1024,
    })
    const language = path
      .basename(downloadFilePath)
      .split('.')[0] as keyof typeof TextMapLanguage
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
  }
}
