import type { WeaponType } from '@/domain/types/enums'
import type { LogLevel } from '@/domain/types/LogLevel'

/**
 * Supported language codes (ISO 639-1 with region)
 */
export enum Language {
  En = 'en',
  Ru = 'ru',
  Vi = 'vi',
  Th = 'th',
  Pt = 'pt',
  Ko = 'ko',
  Ja = 'ja',
  Id = 'id',
  Fr = 'fr',
  Es = 'es',
  De = 'de',
  ZhTw = 'zh-tw',
  ZhCn = 'zh-cn',
}

/**
 * Cost item for ascension
 */
export interface CostItem {
  /** Material ID */
  readonly id: number
  /** Item count */
  readonly count: number
}

/**
 * Ascension material with ID and count
 */
export interface AscensionMaterial {
  /** Material ID */
  readonly id: number
  /** Material count */
  readonly count: number
}

/**
 * Level range tuple: [current, target]
 */
export type LevelRange = [number, number]

/**
 * Skill level upgrade plan
 */
export interface SkillLevelPlan {
  /** Normal attack level: [current, target] or undefined if no change */
  readonly normalAttack?: LevelRange
  /** Elemental skill level: [current, target] or undefined if no change */
  readonly elementalSkill?: LevelRange
  /** Elemental burst level: [current, target] or undefined if no change */
  readonly elementalBurst?: LevelRange
}

/**
 * Character upgrade plan interface
 */
export interface CharacterUpgradePlan {
  /** Character level upgrade: [current, target] or undefined if no change */
  readonly characterLevel?: LevelRange
  /** Skill level upgrades */
  readonly skillLevels?: SkillLevelPlan
}

/**
 * Weapon summary information
 */
export interface WeaponSummary {
  /** Weapon name */
  readonly name: string
  /** Weapon type */
  readonly type: WeaponType
  /** Weapon rarity (1-5 stars) */
  readonly rarity: number
  /** Weapon level (e.g. "90/90") */
  readonly level: string
  /** Refinement rank (e.g. "R5") */
  readonly refinement: string
}

/**
 * Validation error detail.
 * @internal
 */
export interface ValidationDetail {
  /** Path to the invalid field */
  readonly path: string
  /** Description of the validation issue */
  readonly issue: string
  /** Expected value or type (if applicable) */
  readonly expected?: unknown
  /** Received value (if applicable) */
  readonly received?: unknown
}

/**
 * Key matching error detail.
 * @internal
 */
export interface KeyMatchingDetail {
  /** Keys that failed to match */
  readonly failedKeys: readonly string[]
  /** Keys that were expected */
  readonly expectedKeys: readonly string[]
  /** Expected keys that were not matched */
  readonly unmatchedExpected: readonly string[]
  /** Success rate (0-1) */
  readonly successRate: number
}

/**
 * JSON parse error related files.
 * @internal
 * TODO: 親のErrorクラスが未使用...?
 */
export interface JsonParseRelatedFiles {
  /** Name of the JSON file (e.g. "AvatarExcelConfigData") */
  readonly jsonFileName: string
  /** Path to the master file */
  readonly masterFilePath: string
  /** Path to the cache file */
  readonly cacheFilePath: string
}

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
   * @see {@link https://crontab.guru/}
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
 * Element type
 */
export enum Element {
  Phys = 'Phys',
  Pyro = 'Pyro',
  Electro = 'Electro',
  Cryo = 'Cryo',
  Anemo = 'Anemo',
  Hydro = 'Hydro',
  Geo = 'Geo',
  Dendro = 'Dendro',
}

/**
 * Character voice type (subset of Language with voice acting support)
 */
export type CVType = Language.En | Language.Ja | Language.Ko | Language.ZhCn

/**
 * TextMap base name mapping
 * @description Maps language codes to TextMap file base names (without extension or split suffix)
 */
export const TextMapBaseName = {
  [Language.En]: 'TextMapEN',
  [Language.Ru]: 'TextMapRU',
  [Language.Vi]: 'TextMapVI',
  [Language.Th]: 'TextMapTH',
  [Language.Pt]: 'TextMapPT',
  [Language.Ko]: 'TextMapKR',
  [Language.Ja]: 'TextMapJP',
  [Language.Id]: 'TextMapID',
  [Language.Fr]: 'TextMapFR',
  [Language.Es]: 'TextMapES',
  [Language.De]: 'TextMapDE',
  [Language.ZhTw]: 'TextMapCHT',
  [Language.ZhCn]: 'TextMapCHS',
} as const satisfies Record<Language, string>
