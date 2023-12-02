import * as cliProgress from 'cli-progress'
import fs from 'fs'
import * as fsPromises from 'fs/promises'
import Module from 'module'
import * as path from 'path'
import { pipeline } from 'stream/promises'

import { Client } from '@/client/Client'
import { AssetsNotFoundError } from '@/errors/AssetsNotFoundError'
import { BodyNotFoundError } from '@/errors/BodyNotFoundError'
import { TextMapFormatError } from '@/errors/TextMapFormatError'
import { ClientOption, ExcelBinOutputs, TextMapLanguage } from '@/types'
import { getClassNamesRecursive } from '@/utils/getClassNamesRecursive'
import { JsonObject, JsonParser } from '@/utils/JsonParser'
import { ObjectKeyDecoder } from '@/utils/ObjectKeyDecoder'
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

/**
 * Class for managing cached assets
 * @abstract
 */
export abstract class AssetCacheManager {
  /**
   * Cached text map
   * @key Text hash
   * @value Text
   */
  public static cachedTextMap: Map<string, string> = new Map()

  private static option: ClientOption
  private static gitRemoteAPIUrl: string =
    'https://gitlab.com/api/v4/projects/41287973/repository/commits?per_page=1'
  private static gitRemoteRawBaseURL: string =
    'https://gitlab.com/Dimbreath/AnimeGameData/-/raw'
  private static nowCommitId: string
  private static commitFilePath: string
  private static excelBinOutputFolderPath: string
  private static textMapFolderPath: string

  private static childrenModule: Module[]

  /**
   * Map to cache ExcelBinOutput for each class
   */
  private static excelBinOutputMapUseModel: {
    [className: string]: Array<keyof typeof ExcelBinOutputs>
  } = {
    CharacterInfo: [
      'AvatarCostumeExcelConfigData',
      'AvatarExcelConfigData',
      'AvatarSkillDepotExcelConfigData',
      'AvatarSkillExcelConfigData',
    ],
    CharacterStatus: [
      'AvatarExcelConfigData',
      'AvatarPromoteExcelConfigData',
      'AvatarCurveExcelConfigData',
    ],
    CharacterStories: ['FetterStoryExcelConfigData'],
    CharacterAscension: [
      'AvatarExcelConfigData',
      'AvatarPromoteExcelConfigData',
    ],
    Costume: ['AvatarCostumeExcelConfigData', 'AvatarExcelConfigData'],
    Profile: ['FetterInfoExcelConfigData'],
    Material: ['MaterialExcelConfigData'],
    Talent: ['AvatarTalentExcelConfigData'],
    Skill: ['AvatarSkillExcelConfigData'],
    StatProperty: ['ManualTextMapConfigData'],
    Weapon: [
      'WeaponExcelConfigData',
      'WeaponPromoteExcelConfigData',
      'WeaponCurveExcelConfigData',
    ],
    WeaponAscension: ['WeaponExcelConfigData', 'WeaponPromoteExcelConfigData'],
    WeaponRefinement: ['WeaponExcelConfigData', 'EquipAffixExcelConfigData'],
    Artifact: [
      'ReliquaryExcelConfigData',
      'ReliquarySetExcelConfigData',
      'EquipAffixExcelConfigData',
      'ReliquaryMainPropExcelConfigData',
      'ReliquaryLevelExcelConfigData',
      'ReliquaryAffixExcelConfigData',
    ],
    TowerSchedule: [
      'TowerScheduleExcelConfigData',
      'DungeonLevelEntityConfigData',
    ],
    TowerFloor: ['TowerFloorExcelConfigData', 'DungeonLevelEntityConfigData'],
    TowerLevel: ['TowerLevelExcelConfigData'],
    Monster: [
      'MonsterExcelConfigData',
      'MonsterDescribeExcelConfigData',
      'MonsterCurveExcelConfigData',
      'AnimalCodexExcelConfigData',
    ],
    ProfilePicture: [
      'ProfilePictureExcelConfigData',
      'AvatarCostumeExcelConfigData',
      'AvatarExcelConfigData',
      'MaterialExcelConfigData',
    ],
  }

  private static textHashList: Set<number> = new Set()
  private static excelBinOutputKeyList: Set<keyof typeof ExcelBinOutputs> =
    new Set()

  /**
   * Cached text map
   */
  private static cachedExcelBinOutput: Map<
    keyof typeof ExcelBinOutputs,
    JsonParser
  > = new Map()

  /**
   * Create a AssetCacheManager
   * @param option Client option
   * @param children import modules
   */
  constructor(option: ClientOption, children: Module[]) {
    AssetCacheManager.option = option
    AssetCacheManager.childrenModule = children
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
    const excelBinOutput = Client.cachedExcelBinOutput.get(key)
    if (!excelBinOutput) throw new AssetsNotFoundError(key)

    const json = excelBinOutput.get(String(id)) as JsonObject | undefined
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
  ): { [key in string]: JsonObject } {
    const excelBinOutput = Client.cachedExcelBinOutput.get(key)
    if (!excelBinOutput) throw new AssetsNotFoundError(key)

    return excelBinOutput.get() as { [key in string]: JsonObject }
  }

  /**
   * Check if cached excel bin output exists
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key ExcelBinOutput name
   * @returns Cached excel bin output exists
   */
  public static _hasCachedExcelBinOutputByName(
    key: keyof typeof ExcelBinOutputs,
  ): boolean {
    return Client.cachedExcelBinOutput.has(key)
  }

  /**
   * search hashes in CachedTextMap by value
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param searchValue Search value
   * @returns Hashes
   */
  public static _searchHashInCachedTextMapByValue(
    searchValue: string,
  ): string[] {
    return Array.from(this.cachedTextMap)
      .filter(([, value]) => value === searchValue)
      .map(([key]) => key)
  }

  /**
   * search key in CachedExcelBinOutput by text hashes
   * @deprecated This method is deprecated because it is used to pass data to each class
   * @param key ExcelBinOutput name
   * @param textHashes Text hashes
   * @returns Keys
   */
  public static _searchKeyInExcelBinOutputByTextHashes(
    key: keyof typeof ExcelBinOutputs,
    textHashes: string[],
  ): string[] {
    return Object.entries(Client._getCachedExcelBinOutputByName(key))
      .filter(([, avatarData]) =>
        Object.keys(avatarData).some((key) => {
          if (/TextMapHash/g.exec(key)) {
            const hash = avatarData[key] as number
            return textHashes.includes(String(hash))
          }
        }),
      )
      .map(([key]) => key)
  }

  /**
   * Update cache
   * @example
   * ```ts
   * await Client.updateCache()
   * ```
   */
  protected static async updateCache(): Promise<void> {
    if (await this.checkGitUpdate()) {
      if (this.option.showFetchCacheLog)
        console.log('GenshinManager: New Assets found. Update Assets.')
      this.createExcelBinOutputKeyList()
      await this.fetchAssetFolder(
        this.excelBinOutputFolderPath,
        Object.values(ExcelBinOutputs),
      )
      await this.setExcelBinOutputToCache()
      this.createTextHashList()
      const textMapFileNames = this.option.downloadLanguages.map(
        (key) => TextMapLanguage[key],
      )
      await this.fetchAssetFolder(this.textMapFolderPath, textMapFileNames)
      if (this.option.showFetchCacheLog)
        console.log('GenshinManager: Set cache.')
      this.createExcelBinOutputKeyList(this.childrenModule)
      await this.setExcelBinOutputToCache()
      this.createTextHashList()
      await this.setTextMapToCache(this.option.defaultLanguage)
    } else {
      if (this.option.showFetchCacheLog)
        console.log('GenshinManager: No new Asset found. Set cache.')
      this.createExcelBinOutputKeyList(this.childrenModule)
      await this.setExcelBinOutputToCache()
      this.createTextHashList()
      await this.setTextMapToCache(this.option.defaultLanguage)
    }
    if (this.option.showFetchCacheLog)
      console.log('GenshinManager: finish update cache and set cache.')
  }

  /**
   * Set excel bin output to cache
   */
  protected static async setExcelBinOutputToCache(): Promise<void> {
    this.cachedExcelBinOutput.clear()
    await Promise.all(
      [...this.excelBinOutputKeyList].map(async (key) => {
        const filename = ExcelBinOutputs[key]
        const selectedExcelBinOutputPath = path.join(
          this.excelBinOutputFolderPath,
          filename,
        )
        let text = ''
        const stream = fs.createReadStream(selectedExcelBinOutputPath, {
          highWaterMark: 1 * 1024 * 1024,
        })
        stream.on('data', (chunk) => (text += chunk as string))
        stream.on('error', (error) => console.error(error))
        await new Promise<void>((resolve) => {
          stream.on('end', () => {
            this.cachedExcelBinOutput.set(key, new JsonParser(text))
            resolve()
          })
        })
      }),
    )

    const decoder = new ObjectKeyDecoder()
    this.cachedExcelBinOutput.forEach((v, k) => {
      this.cachedExcelBinOutput.set(
        k,
        new JsonParser(JSON.stringify(decoder.execute(v, k))),
      )
    })
  }

  /**
   * Change cached languages
   * @param language Country code
   */
  protected static async setTextMapToCache(
    language: keyof typeof TextMapLanguage,
  ): Promise<void> {
    //Since the timing of loading into the cache is the last, unnecessary cache is not loaded, and therefore clearing the cache is not necessary.
    const selectedTextMapPath = path.join(
      this.textMapFolderPath,
      `TextMap${language}.json`,
    )
    if (!fs.existsSync(selectedTextMapPath)) {
      if (this.option.autoFixTextMap) {
        if (this.option.showFetchCacheLog) {
          console.log(
            `GenshinManager: TextMap${language}.json not found. Re downloading...`,
          )
        }
        await this.reDownloadTextMap(language)
      } else {
        throw new AssetsNotFoundError(language)
      }
    }

    const eventEmitter = new TextMapEmptyWritable()

    eventEmitter.on('data', ({ key, value }) =>
      this.cachedTextMap.set(key as string, value as string),
    )

    await pipeline(
      fs.createReadStream(selectedTextMapPath, {
        highWaterMark: 1 * 1024 * 1024,
      }),
      new TextMapTransform(language, this.textHashList),
      eventEmitter,
    ).catch(async (error) => {
      if (error instanceof TextMapFormatError) {
        if (this.option.autoFixTextMap) {
          if (this.option.showFetchCacheLog) {
            console.log(
              'GenshinManager: TextMap format error. Re downloading...',
            )
          }
          await this.reDownloadTextMap(language)
        } else {
          throw error
        }
      }
    })
  }

  /**
   * Check gitlab for new commits
   * @returns New commits found
   */
  private static async checkGitUpdate(): Promise<boolean> {
    await Promise.all(
      [
        this.option.assetCacheFolderPath,
        this.excelBinOutputFolderPath,
        this.textMapFolderPath,
      ].map(async (FolderPath) => {
        if (!fs.existsSync(FolderPath)) {
          await fsPromises.mkdir(FolderPath, {
            recursive: true,
          })
        }
      }),
    )

    const oldCommits = fs.existsSync(this.commitFilePath)
      ? (JSON.parse(
          await fsPromises.readFile(this.commitFilePath, {
            encoding: 'utf8',
          }),
        ) as GitLabAPIResponse[])
      : null

    await this.downloadJsonFile(this.gitRemoteAPIUrl, this.commitFilePath)

    const newCommits = JSON.parse(
      await fsPromises.readFile(this.commitFilePath, {
        encoding: 'utf8',
      }),
    ) as GitLabAPIResponse[]

    this.nowCommitId = newCommits[0].id
    return oldCommits && newCommits[0].id === oldCommits[0].id ? false : true
  }

  /**
   * Create ExcelBinOutput Key List to cache
   * @param children import modules
   */
  private static createExcelBinOutputKeyList(children?: Module[]): void {
    this.excelBinOutputKeyList.clear()
    if (!children) {
      this.excelBinOutputKeyList = new Set(
        Object.keys(ExcelBinOutputs).map(
          (key) => key as keyof typeof ExcelBinOutputs,
        ),
      )
    } else {
      getClassNamesRecursive(children).forEach((className) => {
        if (this.excelBinOutputMapUseModel[className]) {
          this.excelBinOutputKeyList = new Set([
            ...this.excelBinOutputKeyList,
            ...this.excelBinOutputMapUseModel[className],
          ])
        }
      })
    }
  }

  /**
   * Create TextHash List to cache
   */
  private static createTextHashList(): void {
    this.textHashList.clear()
    Client.cachedExcelBinOutput.forEach((excelBin) => {
      ;(Object.values(excelBin.get() as JsonObject) as JsonObject[]).forEach(
        (obj) => {
          Object.keys(obj).forEach((key) => {
            if (/TextMapHash/g.exec(key)) {
              const hash = obj[key] as number
              this.textHashList.add(hash)
            }
            if (key === 'tips') {
              const hashList = obj[key] as number[]
              hashList.forEach((hash) => this.textHashList.add(hash))
            }
          })
        },
      )
    })
  }

  /**
   * Re download text map
   * @param language Country code
   */
  private static async reDownloadTextMap(
    language: keyof typeof TextMapLanguage,
  ): Promise<void> {
    const textMapFileName = TextMapLanguage[language]
    this.createExcelBinOutputKeyList()
    await this.setExcelBinOutputToCache()
    this.createTextHashList()
    await this.fetchAssetFolder(this.textMapFolderPath, [textMapFileName])
    await Client.updateCache()
  }

  /**
   * Fetch asset folder from gitlab
   * @param FolderPath Folder path
   * @param files File names
   */
  private static async fetchAssetFolder(
    FolderPath: string,
    files: string[],
  ): Promise<void> {
    const gitFolderName = path.relative(
      this.option.assetCacheFolderPath,
      FolderPath,
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
          this.gitRemoteRawBaseURL,
          this.nowCommitId,
          gitFolderName,
          fileName,
        ].join('/')
        const filePath = path.join(FolderPath, fileName)
        await this.downloadJsonFile(url, filePath)
        if (progressBar) progressBar.increment()
      }),
    )
    if (progressBar) progressBar.stop()
  }

  /**
   * download json file from url and write to downloadFilePath
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
        new TextMapTransform(language, this.textHashList),
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
