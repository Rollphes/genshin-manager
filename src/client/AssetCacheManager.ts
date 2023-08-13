import * as cliProgress from 'cli-progress'
import fs from 'fs'
import * as fsPromises from 'fs/promises'
import Module from 'module'
import fetch from 'node-fetch'
import * as path from 'path'

import { Client } from '@/client/Client'
import { ExcelBinOutputs, GitLabAPIResponse, TextMapLanguage } from '@/types'
import { JsonObject, JsonParser } from '@/utils/JsonParser'
import { ObjectKeyDecoder } from '@/utils/ObjectKeyDecoder'
import { TextMapEmptyWritable } from '@/utils/TextMapEmptyWritable'
import { TextMapTransform } from '@/utils/TextMapTransform'
//static only
export abstract class AssetCacheManager {
  private static gitRemoteAPIUrl: string =
    'https://gitlab.com/api/v4/projects/41287973/repository/commits?per_page=1'
  private static gitRemoteRawBaseURL: string =
    'https://gitlab.com/Dimbreath/AnimeGameData/-/raw'
  private static nowCommitId: string
  private static commitFilePath: string
  private static assetCacheFolderPath: string
  private static excelBinOutputFolderPath: string
  private static textMapFolderPath: string

  private static childrenModule: Module[]
  private static excelBinOutputMapUseModel: {
    [className: string]: Array<keyof typeof ExcelBinOutputs>
  } = {
    Character: [
      'AvatarCostumeExcelConfigData',
      'AvatarExcelConfigData',
      'AvatarSkillDepotExcelConfigData',
      'AvatarSkillExcelConfigData',
    ],
    Costume: ['AvatarCostumeExcelConfigData', 'AvatarExcelConfigData'],
    Profile: ['FetterInfoExcelConfigData'],
    Material: ['MaterialExcelConfigData'],
    Talent: ['AvatarTalentExcelConfigData'],
    Skill: ['AvatarSkillExcelConfigData'],
    FightProp: ['ManualTextMapConfigData'],
    StatProperty: ['ManualTextMapConfigData'],
    Weapon: [
      'WeaponExcelConfigData',
      'WeaponPromoteExcelConfigData',
      'EquipAffixExcelConfigData',
      'WeaponCurveExcelConfigData',
    ],
    Artifact: [
      'ReliquaryExcelConfigData',
      'ReliquarySetExcelConfigData',
      'EquipAffixExcelConfigData',
      'ReliquaryMainPropExcelConfigData',
      'ReliquaryLevelExcelConfigData',
      'ReliquaryAffixExcelConfigData',
    ],
    ShowAvatarInfo: [
      'AvatarCostumeExcelConfigData',
      'AvatarExcelConfigData',
      'AvatarSkillDepotExcelConfigData',
      'AvatarSkillExcelConfigData',
    ],
    PlayerInfo: [
      'AvatarCostumeExcelConfigData',
      'AvatarExcelConfigData',
      'AvatarSkillDepotExcelConfigData',
      'AvatarSkillExcelConfigData',
      'MaterialExcelConfigData',
    ],
    AvatarInfo: [
      'ReliquaryExcelConfigData',
      'ReliquarySetExcelConfigData',
      'EquipAffixExcelConfigData',
      'ReliquaryMainPropExcelConfigData',
      'ReliquaryLevelExcelConfigData',
      'ReliquaryAffixExcelConfigData',
      'AvatarCostumeExcelConfigData',
      'AvatarExcelConfigData',
      'AvatarSkillDepotExcelConfigData',
      'AvatarSkillExcelConfigData',
      'ManualTextMapConfigData',
      'AvatarTalentExcelConfigData',
      'WeaponExcelConfigData',
      'WeaponPromoteExcelConfigData',
      'WeaponCurveExcelConfigData',
    ],
    EnkaManager: [
      'MaterialExcelConfigData',
      'ReliquaryExcelConfigData',
      'ReliquarySetExcelConfigData',
      'EquipAffixExcelConfigData',
      'ReliquaryMainPropExcelConfigData',
      'ReliquaryLevelExcelConfigData',
      'ReliquaryAffixExcelConfigData',
      'AvatarCostumeExcelConfigData',
      'AvatarExcelConfigData',
      'AvatarSkillDepotExcelConfigData',
      'AvatarSkillExcelConfigData',
      'ManualTextMapConfigData',
      'AvatarTalentExcelConfigData',
      'WeaponExcelConfigData',
      'WeaponPromoteExcelConfigData',
      'WeaponCurveExcelConfigData',
    ],
  }

  private static textHashList: Set<number> = new Set()
  private static excelBinOutputKeyList: Set<keyof typeof ExcelBinOutputs> =
    new Set()

  public static cachedTextMap: Map<string, string> = new Map()
  public static cachedExcelBinOutput: Map<
    keyof typeof ExcelBinOutputs,
    JsonParser
  > = new Map()

  protected static async deploy(client: Client, children: Module[]) {
    this.childrenModule = children
    this.assetCacheFolderPath = client.option.assetCacheFolderPath
    this.commitFilePath = path.resolve(
      this.assetCacheFolderPath,
      'commits.json',
    )

    this.commitFilePath = path.resolve(
      this.assetCacheFolderPath,
      'commits.json',
    )

    this.excelBinOutputFolderPath = path.resolve(
      this.assetCacheFolderPath,
      'ExcelBinOutput',
    )
    this.textMapFolderPath = path.resolve(this.assetCacheFolderPath, 'TextMap')
    await this.updateCache(client)
    if (
      client.option.autoFetchLatestExcelBinOutput &&
      client.option.assetCacheFolderPath ==
        path.resolve(__dirname, '..', '..', 'cache')
    ) {
      void this.startFetchLatestExcelBinOutputTimeout(client)
    }
  }

  private static startFetchLatestExcelBinOutputTimeout(client: Client) {
    const now = new Date()
    const currentDay = now.getDate()
    const targetDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      currentDay + 1,
      0,
      0,
      0,
    )
    const timeUntilMidnight = targetDate.getTime() - now.getTime()
    setTimeout(() => {
      void this.updateCache(client)
      this.startFetchLatestExcelBinOutputTimeout(client)
    }, timeUntilMidnight)
  }

  public static async updateCache(client: Client) {
    if (await this.checkGitUpdate()) {
      console.log('GenshinManager: New Asset found. Perform updates.')
      this.createExcelBinOutputKeyList()
      await this.fetchAssetFolder(
        this.excelBinOutputFolderPath,
        Object.values(ExcelBinOutputs),
      )
      await this.setExcelBinOutputToCache()
      this.createTextHashList()
      await this.fetchAssetFolder(
        this.textMapFolderPath,
        Object.values(TextMapLanguage),
      )
      this.createExcelBinOutputKeyList(this.childrenModule)
      await this.setExcelBinOutputToCache()
      this.createTextHashList()
      await this.setTextMapToCache(client.option.defaultLanguage)
    } else {
      console.log('GenshinManager: No new Asset found. Set cache.')
      if (this.cachedExcelBinOutput.size != 0) return
      this.createExcelBinOutputKeyList(this.childrenModule)
      await this.setExcelBinOutputToCache()
      this.createTextHashList()
      await this.setTextMapToCache(client.option.defaultLanguage)
    }
  }

  private static async checkGitUpdate() {
    await Promise.all(
      [
        this.assetCacheFolderPath,
        this.excelBinOutputFolderPath,
        this.textMapFolderPath,
      ].map(async (FolderPath) => {
        if (!fs.existsSync(FolderPath))
          await fsPromises.mkdir(FolderPath, {
            recursive: true,
          })
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
    return oldCommits && newCommits[0].id == oldCommits[0].id ? false : true
  }

  private static createExcelBinOutputKeyList(children?: Module[]) {
    this.excelBinOutputKeyList.clear()
    if (!children) {
      this.excelBinOutputKeyList = new Set(
        Object.keys(ExcelBinOutputs).map(
          (key) => key as keyof typeof ExcelBinOutputs,
        ),
      )
    } else {
      this.excelBinOutputKeyList = new Set(['AvatarCostumeExcelConfigData'])
      children.forEach((child) => {
        const className = path.basename(child.id).split('.')[0]
        if (this.excelBinOutputMapUseModel[className]) {
          this.excelBinOutputKeyList = new Set([
            ...this.excelBinOutputKeyList,
            ...this.excelBinOutputMapUseModel[className],
          ])
        }
      })
    }
  }

  protected static async setExcelBinOutputToCache() {
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

  private static createTextHashList() {
    this.textHashList.clear()
    Client.cachedExcelBinOutput.forEach((excelBin) => {
      ;(Object.values(excelBin.get() as JsonObject) as JsonObject[]).forEach(
        (obj) => {
          Object.keys(obj).forEach((key) => {
            if (/TextMapHash/g.exec(key)) {
              const hash = obj[key] as number
              this.textHashList.add(hash)
            }
          })
        },
      )
    })
  }

  protected static async setTextMapToCache(
    language: keyof typeof TextMapLanguage,
  ) {
    //キャッシュに読み込むタイミングは一番最後なので不要なキャッシュは読み込まれない、よってキャッシュのクリアは不要。
    const selectedTextMapPath = path.join(
      this.textMapFolderPath,
      `TextMap${language}.json`,
    )

    const stream = fs
      .createReadStream(selectedTextMapPath, {
        highWaterMark: 1 * 1024 * 1024,
      })
      .pipe(new TextMapTransform([...this.textHashList]))
      .pipe(new TextMapEmptyWritable())

    stream.on('data', ({ key, value }) =>
      this.cachedTextMap.set(key as string, value as string),
    )

    stream.on('error', (error) => console.error(error))

    await new Promise<void>((resolve) => {
      stream.on('finish', () => resolve())
    })
  }

  private static async fetchAssetFolder(FolderPath: string, files: string[]) {
    const gitFolderName = path.relative(this.assetCacheFolderPath, FolderPath)
    const consoleFolderName = gitFolderName.slice(0, 8)
    const progressBar = new cliProgress.SingleBar({
      hideCursor: true,
      format: `GenshinManager: Downloading ${consoleFolderName}...\t [{bar}] {percentage}% |ETA: {eta}s| {value}/{total} files`,
    })

    progressBar.start(files.length, 0)
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
        progressBar.increment()
      }),
    )
    progressBar.stop()
  }

  private static async downloadJsonFile(url: string, downloadFilePath: string) {
    const res = await fetch(url)
    const writeStream = fs.createWriteStream(downloadFilePath, {
      highWaterMark: 1 * 1024 * 1024,
    })
    const stream =
      'TextMap' == path.basename(path.dirname(downloadFilePath))
        ? res.body
            .pipe(new TextMapTransform([...this.textHashList]))
            .pipe(writeStream)
        : res.body.pipe(writeStream)
    stream.on('error', (error) => console.error(error))
    await new Promise<void>((resolve) => {
      stream.on('finish', () => resolve())
    })
  }
}
