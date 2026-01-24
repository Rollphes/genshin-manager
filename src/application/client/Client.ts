import cron, { ScheduledTask } from 'node-cron'
import path from 'path'
import { merge } from 'ts-deepmerge'

import { AssetCacheManager } from '@/application/client/AssetCacheManager'
import { ClientEventMap, ClientEvents } from '@/application/types/events/client'
import { LogLevel } from '@/domain/types/LogLevel'
import { ClientOption, Language } from '@/domain/types/types'
import { AudioAssets } from '@/interface/assets/AudioAssets'
import { ImageAssets } from '@/interface/assets/ImageAssets'
/**
 * Event listener entry for cleanup tracking
 */
interface EventListenerEntry {
  readonly event: ClientEvents
  readonly listener: (version: string) => void
}

/**
 * Main client for the Genshin Manager library
 * @description This is the main body of `Genshin-Manager` where cache information is stored
 */
export class Client extends AssetCacheManager<ClientEventMap> {
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
      Language.En,
      Language.Ru,
      Language.Vi,
      Language.Th,
      Language.Pt,
      Language.Ko,
      Language.Ja,
      Language.Id,
      Language.Fr,
      Language.Es,
      Language.De,
      Language.ZhTw,
      Language.ZhCn,
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
    defaultLanguage: Language.En,
    logLevel: LogLevel.NONE,
    autoFetchLatestAssetsByCron: '0 0 0 * * 3', //Every Wednesday 00:00:00
    autoCacheImage: true,
    autoCacheAudio: true,
    autoFixTextMap: true,
    autoFixExcelBin: true,
    assetCacheFolderPath: __dirname
      .replace(/\\/g, '/')
      .includes('/node_modules/genshin-manager')
      ? path.resolve(__dirname, '..', '..', 'cache')
      : path.resolve(__dirname, '..', '..', '..', 'cache'),
  }

  /**
   * Client options
   */
  public readonly option: ClientOption

  /**
   * Registered event listeners for cleanup
   */
  private readonly eventListeners: EventListenerEntry[] = []

  /**
   * Cron task reference for cleanup
   */
  private cronTask: ScheduledTask | undefined

  /**
   * Flag indicating if the client has been destroyed
   */
  private isDestroyed = false

  /**
   * Create a Client
   * @param option - client option
   * @example
   * ```ts
   * const client = new Client({
   *   defaultLanguage: 'en',
   *   logLevel: LogLevel.INFO,
   *   autoCacheImage: true
   * })
   * ```
   */
  constructor(option?: Partial<ClientOption>) {
    const baseOption = merge.withOptions(
      { mergeArrays: false },
      Client.defaultOption,
      option ?? {},
    ) as ClientOption

    const downloadLanguages = [
      ...new Set([baseOption.defaultLanguage, ...baseOption.downloadLanguages]),
    ]

    const autoFixTextMap = baseOption.autoFetchLatestAssetsByCron
      ? baseOption.autoFixTextMap
      : false
    const autoFixExcelBin = baseOption.autoFetchLatestAssetsByCron
      ? baseOption.autoFixExcelBin
      : false

    const mergeOption: ClientOption = {
      ...baseOption,
      downloadLanguages,
      autoFixTextMap,
      autoFixExcelBin,
    }

    super(mergeOption)
    this.option = mergeOption
    this.registerEventListeners()
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
   * Destroy the client and release all resources
   * @description Stops cron jobs, removes event listeners, and cleans up resources
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * // ... use the client ...
   * client.destroy()
   * ```
   */
  public destroy(): void {
    if (this.isDestroyed) return

    // Stop cron job
    void this.cronTask?.stop()
    this.cronTask = undefined

    // Remove event listeners from static emitter
    for (const { event, listener } of this.eventListeners)
      Client._assetEventEmitter.off(event, listener)

    this.eventListeners.length = 0

    // Remove all listeners from this instance
    this.removeAllListeners()

    this.isDestroyed = true
  }

  /**
   * Change cached languages
   * @param language - country code
   * @example
   * ```ts
   * const client = new Client()
   * await client.deploy()
   * await client.changeLanguage('ja')
   * ```
   */
  public async changeLanguage(language: Language): Promise<void> {
    await Client.setTextMapToCache(language)
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
      this.cronTask = cron.schedule(
        this.option.autoFetchLatestAssetsByCron,
        () => {
          void (async (): Promise<void> => {
            await Client.updateCache()
          })()
        },
      )
    }
    ImageAssets.deploy(this.option)
    AudioAssets.deploy(this.option)
  }

  /**
   * Register event listeners and store references for cleanup
   */
  private registerEventListeners(): void {
    for (const event of Object.values(ClientEvents)) {
      const listener = (version: string): void => {
        this.emit(event, version)
      }
      Client._assetEventEmitter.on(event, listener)
      this.eventListeners.push({ event, listener })
    }
  }
}
