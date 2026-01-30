import type { Language, LogLevel } from '@genshin-manager/core'

/**
 * Client option
 */
export interface ClientOption {
  /**
   * Fetch option
   * @default
   * ```ts
   * {
   *   'user-agent': 'genshin-manager@x.x.x',
   * }
   * ```
   */
  readonly fetchOption: RequestInit
  /**
   * List of TextMaps to download when new assets are found.
   * @default
   * ```ts
   * ['en','ru','vi','th','pt','ko','ja','id','fr','es','de','zh-tw','zh-cn']
   * ```
   */
  readonly downloadLanguages: readonly Language[]
  /**
   * default image base URL
   * @default 'https://gi.yatta.top/assets/UI'
   */
  readonly defaultImageBaseURL: string
  /**
   * default audio base URL
   * @default 'https://gi.yatta.top/assets/Audio'
   */
  readonly defaultAudioBaseURL: string
  /**
   * image base URL by regex
   * @default
   * ```ts
   * {
   *    'https://enka.network/ui': [
   *      /^UI_(AvatarIcon_Side|Costume)_/,
   *      /^UI_AvatarIcon_(.+)_Card$/,
   *      /^UI_AvatarIcon_(.+)_Circle/,
   *      /^UI_NameCardPic_(.+)_Alpha/,
   *      /^UI_EquipIcon_(.+)_Awaken/,
   *    ],
   *    'https://res.cloudinary.com/genshin/image/upload/sprites': [
   *      /^Eff_UI_Talent_/,
   *      /^UI_(TowerPic|TowerBlessing|GcgIcon|Gcg_Cardtable|Gcg_CardBack)_/,
   *    ],
   *    'https://gi.yatta.top/assets/UI/monster': [
   *      /^UI_(MonsterIcon|AnimalIcon)_/,
   *    ],
   *    'https://gi.yatta.top/assets/UI/gcg': [/^UI_Gcg_CardFace_/],
   *    'https://gi.yatta.top/assets/UI/reliquary': [/^UI_RelicIcon_/],
   *    'https://gi.yatta.top/assets/UI/namecard': [/^UI_NameCard/],
   *  },
   * ```
   * @key Base URL
   * @value Array of regex patterns to match asset names
   */
  readonly imageBaseURLByRegex: Readonly<Record<string, readonly RegExp[]>>
  /**
   * audio base url by regex
   * @default
   * ```ts
   * {}
   * ```
   * @key Base URL
   * @value Array of regex patterns to match asset names
   */
  readonly audioBaseURLByRegex: Readonly<Record<string, readonly RegExp[]>>
  /**
   * default language
   * @default 'en'
   */
  readonly defaultLanguage: Language
  /**
   * log level for the application
   * @default LogLevel.NONE
   */
  readonly logLevel?: LogLevel
  /**
   * auto fetch latest assets by cron
   * @warning If this option is `undefined`, asset updates and initial setup are not executed
   * @default '0 0 0 * * 3'
   * @see {@link https://crontab.guru/} - Cron expression reference
   */
  readonly autoFetchLatestAssetsByCron: string | undefined
  /**
   * Automatically re-download the textMap if it has not been downloaded or if there is an error in the json format
   * @warning If `autoFetchLatestAssetsByCron` is `undefined`, this option will be ignored
   * @default true
   */
  readonly autoFixTextMap: boolean
  /**
   * Automatically fix the ExcelBin if it has not been downloaded or if there is an error in the json format
   * @warning If `autoFetchLatestAssetsByCron` is `undefined`, this option will be ignored
   * @default true
   */
  readonly autoFixExcelBin: boolean
  /**
   * auto cache image
   * @default true
   */
  readonly autoCacheImage: boolean
  /**
   * auto cache audio
   * @default true
   */
  readonly autoCacheAudio: boolean
  /**
   * asset cache folder path
   * @default node_modules/genshin-manager/cache
   */
  readonly assetCacheFolderPath: string
}

/**
 * GenshinManager events
 */
export enum GenshinManagerEvents {
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
 * GenshinManager event map
 */
export interface GenshinManagerEventMap {
  /**
   * When the cache update starts, fires
   * @param version - Game version of assets to cache
   */
  [GenshinManagerEvents.BeginUpdateCache]: [version: string]
  /**
   * When the cache update ends, fires
   * @param version - Game version of assets to cache
   */
  [GenshinManagerEvents.EndUpdateCache]: [version: string]
  /**
   * When the assets update starts, fires
   * @param version - Game version of new assets
   */
  [GenshinManagerEvents.BeginUpdateAssets]: [version: string]
  /**
   * When the assets update ends, fires
   * @param version - Game version of new assets
   */
  [GenshinManagerEvents.EndUpdateAssets]: [version: string]
}
