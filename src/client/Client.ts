import cron from 'node-cron'
import path from 'path'
import { merge } from 'ts-deepmerge'

import { AssetCacheManager } from '@/client'
import { AudioAssets } from '@/models/assets/AudioAssets'
import { ImageAssets } from '@/models/assets/ImageAssets'
import { ClientOption, TextMapLanguage } from '@/types'
import { LogLevel } from '@/utils/Logger'

/**
 * Client events
 * @see {@link Client}
 */
export enum ClientEvents {
  /**
   * When the cache update starts, fires
   * @event BEGIN_UPDATE_CACHE
   * @listener
   * | param | type | description |
   * | --- | --- | --- |
   * | version | string | Game version of assets to cache |
   */
  BEGIN_UPDATE_CACHE = 'BEGIN_UPDATE_CACHE',
  /**
   * When the cache update ends, fires
   * @event END_UPDATE_CACHE
   * @listener
   * | param | type | description |
   * | --- | --- | --- |
   * | version | string | Game version of assets to cache |
   */
  END_UPDATE_CACHE = 'END_UPDATE_CACHE',
  /**
   * When the assets update starts, fires
   * @event BEGIN_UPDATE_ASSETS
   * @listener
   * | param | type | description |
   * | --- | --- | --- |
   * | version | string | Game version of new assets |
   */
  BEGIN_UPDATE_ASSETS = 'BEGIN_UPDATE_ASSETS',
  /**
   * When the assets update ends, fires
   * @event END_UPDATE_ASSETS
   * @listener
   * | param | type | description |
   * | --- | --- | --- |
   * | version | string | Game version of new assets |
   */
  END_UPDATE_ASSETS = 'END_UPDATE_ASSETS',
}

interface ClientEventMap {
  BEGIN_UPDATE_CACHE: [version: string]
  END_UPDATE_CACHE: [version: string]
  BEGIN_UPDATE_ASSETS: [version: string]
  END_UPDATE_ASSETS: [version: string]
}

/**
 * Main client for the Genshin Manager library
 * @description This is the main body of `Genshin-Manager` where cache information is stored
 */
export class Client extends AssetCacheManager<ClientEventMap, ClientEvents> {
  /**
   * Default option
   */
  private static readonly defaultOption: ClientOption = {
    fetchOption: {
      headers: {
        'user-agent': `genshin-manager@${process.env.npm_package_version ?? 'unknown'}`,
      },
    },
    downloadLanguages: [
      'EN',
      'RU',
      'VI',
      'TH',
      'PT',
      'KR',
      'JP',
      'ID',
      'FR',
      'ES',
      'DE',
      'CHT',
      'CHS',
    ],
    defaultImageBaseURL: 'https://gi.yatta.top/assets/UI',
    defaultAudioBaseURL: 'https://gi.yatta.top/assets/Audio',
    imageBaseURLByRegex: {
      'https://enka.network/ui': [
        /^UI_(AvatarIcon_Side|Costume)_/,
        /^UI_AvatarIcon_(.+)_Card$/,
        /^UI_AvatarIcon_(.+)_Circle/,
        /^UI_NameCardPic_(.+)_Alpha/,
        /^UI_EquipIcon_(.+)_Awaken/,
      ],
      'https://res.cloudinary.com/genshin/image/upload/sprites': [
        /^Eff_UI_Talent_/,
        /^UI_(TowerPic|TowerBlessing|GcgIcon|Gcg_Cardtable|Gcg_CardBack)_/,
      ],
      'https://gi.yatta.top/assets/UI/monster': [
        /^UI_(MonsterIcon|AnimalIcon)_/,
      ],
      'https://gi.yatta.top/assets/UI/gcg': [/^UI_Gcg_CardFace_/],
      'https://gi.yatta.top/assets/UI/reliquary': [/^UI_RelicIcon_/],
      'https://gi.yatta.top/assets/UI/namecard': [/^UI_NameCard/],
    },
    audioBaseURLByRegex: {},
    defaultLanguage: 'EN',
    logLevel: LogLevel.NONE,
    autoFetchLatestAssetsByCron: '0 0 0 * * 3', //Every Wednesday 00:00:00
    autoCacheImage: true,
    autoCacheAudio: true,
    autoFixTextMap: true,
    autoFixExcelBin: true,
    assetCacheFolderPath: __dirname
      .replace(/\\/g, '/')
      .includes('/node_modules/genshin-manager')
      ? path.resolve(__dirname, '..', 'cache')
      : path.resolve(__dirname, '..', '..', 'cache'),
  }
  public readonly option: ClientOption

  /**
   * Create a Client
   * @param option client option
   * @example
   * ```ts
   * const client = new Client({
   *   defaultLanguage: 'EN',
   *   logLevel: LogLevel.INFO,
   *   autoCacheImage: true
   * })
   * ```
   */
  constructor(option?: Partial<ClientOption>) {
    const mergeOption = merge.withOptions(
      { mergeArrays: false },
      Client.defaultOption,
      option ?? {},
    ) as ClientOption

    mergeOption.downloadLanguages = [
      ...new Set([
        mergeOption.defaultLanguage,
        ...mergeOption.downloadLanguages,
      ]),
    ]

    if (!mergeOption.autoFetchLatestAssetsByCron) {
      mergeOption.autoFixTextMap = false
      mergeOption.autoFixExcelBin = false
    }

    Object.values(ClientEvents).forEach((event) => {
      Client._assetEventEmitter.on(event, (version) => {
        this.emit(event, version)
      })
    })
    super(mergeOption)
    this.option = mergeOption
  }

  /**
   * Cached game version
   * @returns cached game version
   * @example `5.1.0`
   */
  public get gameVersion(): string | undefined {
    return AssetCacheManager.gameVersion
  }

  /**
   * Change cached languages
   * @param language country code
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * await client.changeLanguage('JP')
   * ```
   */
  public async changeLanguage(
    language: keyof typeof TextMapLanguage,
  ): Promise<void> {
    if (await Client.setTextMapToCache(language)) {
      this.option.autoFixTextMap = false
      await Client.setTextMapToCache(language)
      this.option.autoFixTextMap = true
    }
  }

  /**
   * Deploy assets to cache & Update assets
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * ```
   */
  public async deploy(): Promise<void> {
    await Client.updateCache()
    if (this.option.autoFetchLatestAssetsByCron) {
      cron.schedule(this.option.autoFetchLatestAssetsByCron, () => {
        void (async (): Promise<void> => {
          await Client.updateCache()
        })()
      })
    }
    ImageAssets.deploy(this.option)
    AudioAssets.deploy(this.option)
  }
}
