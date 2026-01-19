import type {
  DecodedType as _DecodedType,
  MasterFileMap as _MasterFileMap,
} from '@/types/generated/MasterFileMap'
import { JsonObject } from '@/types/json'
import { LogLevel } from '@/utils/logger/Logger'

// ============================================================================
// Generated enum re-definitions with JSDoc
// ============================================================================

/**
 * Character body type
 */
export enum BodyType {
  /** Boy body type (e.g., Bennett, Razor) */
  BODY_BOY = 'BODY_BOY',
  /** Girl body type (e.g., Barbara, Fischl) */
  BODY_GIRL = 'BODY_GIRL',
  /** Lady body type (e.g., Jean, Ningguang) */
  BODY_LADY = 'BODY_LADY',
  /** Loli body type (e.g., Klee, Qiqi) */
  BODY_LOLI = 'BODY_LOLI',
  /** Male body type (e.g., Diluc, Zhongli) */
  BODY_MALE = 'BODY_MALE',
}

/**
 * Character quality/rarity type
 */
export enum QualityType {
  /** 5-star rarity (Orange) */
  QUALITY_ORANGE = 'QUALITY_ORANGE',
  /** Special 5-star rarity (Orange SP, e.g., Aloy) */
  QUALITY_ORANGE_SP = 'QUALITY_ORANGE_SP',
  /** 4-star rarity (Purple) */
  QUALITY_PURPLE = 'QUALITY_PURPLE',
}

/**
 * Weapon type
 */
export enum WeaponType {
  /** Bow */
  WEAPON_BOW = 'WEAPON_BOW',
  /** Catalyst */
  WEAPON_CATALYST = 'WEAPON_CATALYST',
  /** Claymore */
  WEAPON_CLAYMORE = 'WEAPON_CLAYMORE',
  /** Polearm */
  WEAPON_POLE = 'WEAPON_POLE',
  /** Sword */
  WEAPON_SWORD_ONE_HAND = 'WEAPON_SWORD_ONE_HAND',
}

/**
 * Item type
 */
export enum ItemType {
  /** Material item */
  ITEM_MATERIAL = 'ITEM_MATERIAL',
  /** Virtual item */
  ITEM_VIRTUAL = 'ITEM_VIRTUAL',
}

/**
 * Artifact equipment slot type
 */
export enum EquipType {
  /** Flower of Life */
  EQUIP_BRACER = 'EQUIP_BRACER',
  /** Plume of Death */
  EQUIP_DRESS = 'EQUIP_DRESS',
  /** Sands of Eon */
  EQUIP_NECKLACE = 'EQUIP_NECKLACE',
  /** Goblet of Eonothem */
  EQUIP_RING = 'EQUIP_RING',
  /** Circlet of Logos */
  EQUIP_SHOES = 'EQUIP_SHOES',
}

/**
 * Artifact type (alias for EquipType)
 */
export const ArtifactType = EquipType
/** Artifact type (alias for EquipType) */
export type ArtifactType = EquipType

/**
 * Profile picture unlock type
 */
export enum ProfilePictureType {
  /** Unlocked by obtaining avatar */
  PROFILE_PICTURE_UNLOCK_BY_AVATAR = 'PROFILE_PICTURE_UNLOCK_BY_AVATAR',
  /** Unlocked by obtaining costume */
  PROFILE_PICTURE_UNLOCK_BY_COSTUME = 'PROFILE_PICTURE_UNLOCK_BY_COSTUME',
  /** Unlocked by default */
  PROFILE_PICTURE_UNLOCK_BY_DEFAULT = 'PROFILE_PICTURE_UNLOCK_BY_DEFAULT',
  /** Unlocked by item */
  PROFILE_PICTURE_UNLOCK_BY_ITEM = 'PROFILE_PICTURE_UNLOCK_BY_ITEM',
  /** Unlocked by completing parent quest */
  PROFILE_PICTURE_UNLOCK_BY_PARENT_QUEST = 'PROFILE_PICTURE_UNLOCK_BY_PARENT_QUEST',
}

/**
 * Material type
 */
export enum MaterialType {
  /** Activity gear material */
  MATERIAL_ACTIVITY_GEAR = 'MATERIAL_ACTIVITY_GEAR',
  /** Activity jigsaw material */
  MATERIAL_ACTIVITY_JIGSAW = 'MATERIAL_ACTIVITY_JIGSAW',
  /** Activity robot material */
  MATERIAL_ACTIVITY_ROBOT = 'MATERIAL_ACTIVITY_ROBOT',
  /** Adsorbate material */
  MATERIAL_ADSORBATE = 'MATERIAL_ADSORBATE',
  /** Aranara material */
  MATERIAL_ARANARA = 'MATERIAL_ARANARA',
  /** Avatar material */
  MATERIAL_AVATAR = 'MATERIAL_AVATAR',
  /** Avatar ascension material */
  MATERIAL_AVATAR_MATERIAL = 'MATERIAL_AVATAR_MATERIAL',
  /** Avatar talent material */
  MATERIAL_AVATAR_TALENT_MATERIAL = 'MATERIAL_AVATAR_TALENT_MATERIAL',
  /** Avatar trace material */
  MATERIAL_AVATAR_TRACE = 'MATERIAL_AVATAR_TRACE',
  /** Beyond costume selectable chest */
  MATERIAL_BEYOND_COSTUME_SELECTABLE_CHEST = 'MATERIAL_BEYOND_COSTUME_SELECTABLE_CHEST',
  /** BGM material */
  MATERIAL_BGM = 'MATERIAL_BGM',
  /** Bronze carriage box */
  MATERIAL_BRONZE_CARRIAGE_BOX = 'MATERIAL_BRONZE_CARRIAGE_BOX',
  /** Channeller slab buff */
  MATERIAL_CHANNELLER_SLAB_BUFF = 'MATERIAL_CHANNELLER_SLAB_BUFF',
  /** Chest */
  MATERIAL_CHEST = 'MATERIAL_CHEST',
  /** Chest batch use */
  MATERIAL_CHEST_BATCH_USE = 'MATERIAL_CHEST_BATCH_USE',
  /** Chest batch use with group */
  MATERIAL_CHEST_BATCH_USE_WITH_GROUP = 'MATERIAL_CHEST_BATCH_USE_WITH_GROUP',
  /** Clue shop handbook */
  MATERIAL_CLUE_SHOP_HANDBOOK = 'MATERIAL_CLUE_SHOP_HANDBOOK',
  /** Consumable */
  MATERIAL_CONSUME = 'MATERIAL_CONSUME',
  /** Consumable batch use */
  MATERIAL_CONSUME_BATCH_USE = 'MATERIAL_CONSUME_BATCH_USE',
  /** Costume */
  MATERIAL_COSTUME = 'MATERIAL_COSTUME',
  /** Cricket */
  MATERIAL_CRICKET = 'MATERIAL_CRICKET',
  /** Deshret manual */
  MATERIAL_DESHRET_MANUAL = 'MATERIAL_DESHRET_MANUAL',
  /** Elemental crystal */
  MATERIAL_ELEM_CRYSTAL = 'MATERIAL_ELEM_CRYSTAL',
  /** Exchange material */
  MATERIAL_EXCHANGE = 'MATERIAL_EXCHANGE',
  /** EXP fruit */
  MATERIAL_EXP_FRUIT = 'MATERIAL_EXP_FRUIT',
  /** Fake absorbate */
  MATERIAL_FAKE_ABSORBATE = 'MATERIAL_FAKE_ABSORBATE',
  /** Fire master avatar talent item */
  MATERIAL_FIRE_MASTER_AVATAR_TALENT_ITEM = 'MATERIAL_FIRE_MASTER_AVATAR_TALENT_ITEM',
  /** Fireworks */
  MATERIAL_FIREWORKS = 'MATERIAL_FIREWORKS',
  /** Fish bait */
  MATERIAL_FISH_BAIT = 'MATERIAL_FISH_BAIT',
  /** Fish rod */
  MATERIAL_FISH_ROD = 'MATERIAL_FISH_ROD',
  /** Glider */
  MATERIAL_FLYCLOAK = 'MATERIAL_FLYCLOAK',
  /** Food */
  MATERIAL_FOOD = 'MATERIAL_FOOD',
  /** Furniture formula */
  MATERIAL_FURNITURE_FORMULA = 'MATERIAL_FURNITURE_FORMULA',
  /** Furniture suite formula */
  MATERIAL_FURNITURE_SUITE_FORMULA = 'MATERIAL_FURNITURE_SUITE_FORMULA',
  /** Genius Invokation TCG card */
  MATERIAL_GCG_CARD = 'MATERIAL_GCG_CARD',
  /** Genius Invokation TCG card back */
  MATERIAL_GCG_CARD_BACK = 'MATERIAL_GCG_CARD_BACK',
  /** Genius Invokation TCG card face */
  MATERIAL_GCG_CARD_FACE = 'MATERIAL_GCG_CARD_FACE',
  /** Genius Invokation TCG exchange item */
  MATERIAL_GCG_EXCHANGE_ITEM = 'MATERIAL_GCG_EXCHANGE_ITEM',
  /** Genius Invokation TCG field */
  MATERIAL_GCG_FIELD = 'MATERIAL_GCG_FIELD',
  /** Great festival v2 invite */
  MATERIAL_GREATEFESTIVALV2_INVITE = 'MATERIAL_GREATEFESTIVALV2_INVITE',
  /** Holiday memory book */
  MATERIAL_HOLIDAY_MEMORY_BOOK = 'MATERIAL_HOLIDAY_MEMORY_BOOK',
  /** Holiday resort invite */
  MATERIAL_HOLIDAY_RESORT_INVITE = 'MATERIAL_HOLIDAY_RESORT_INVITE',
  /** Serenitea Pot seed */
  MATERIAL_HOME_SEED = 'MATERIAL_HOME_SEED',
  /** Lantern Rite v5 Paimon greeting card */
  MATERIAL_LANV5_PAIMON_GREETING_CARD = 'MATERIAL_LANV5_PAIMON_GREETING_CARD',
  /** Magic story book */
  MATERIAL_MAGIC_STORY_BOOK = 'MATERIAL_MAGIC_STORY_BOOK',
  /** Mikawa flower invite */
  MATERIAL_MIKAWA_FLOWER_INVITE = 'MATERIAL_MIKAWA_FLOWER_INVITE',
  /** Moon night card */
  MATERIAL_MOON_NIGHT_CARD = 'MATERIAL_MOON_NIGHT_CARD',
  /** Music game book theme */
  MATERIAL_MUSIC_GAME_BOOK_THEME = 'MATERIAL_MUSIC_GAME_BOOK_THEME',
  /** Namecard */
  MATERIAL_NAMECARD = 'MATERIAL_NAMECARD',
  /** Natlan race album */
  MATERIAL_NATLAN_RACE_ALBUM = 'MATERIAL_NATLAN_RACE_ALBUM',
  /** Natlan race envelope */
  MATERIAL_NATLAN_RACE_ENVELOPE = 'MATERIAL_NATLAN_RACE_ENVELOPE',
  /** Natlan relation A */
  MATERIAL_NATLAN_RELATION_A = 'MATERIAL_NATLAN_RELATION_A',
  /** Natlan relation B */
  MATERIAL_NATLAN_RELATION_B = 'MATERIAL_NATLAN_RELATION_B',
  /** None */
  MATERIAL_NONE = 'MATERIAL_NONE',
  /** Notice add HP */
  MATERIAL_NOTICE_ADD_HP = 'MATERIAL_NOTICE_ADD_HP',
  /** Photo display book */
  MATERIAL_PHOTO_DISPLAY_BOOK = 'MATERIAL_PHOTO_DISPLAY_BOOK',
  /** Photograph pose */
  MATERIAL_PHOTOGRAPH_POSE = 'MATERIAL_PHOTOGRAPH_POSE',
  /** Photo v5 handbook */
  MATERIAL_PHOTOV5_HAND_BOOK = 'MATERIAL_PHOTOV5_HAND_BOOK',
  /** Photo v6 handbook */
  MATERIAL_PHOTOV6_HAND_BOOK = 'MATERIAL_PHOTOV6_HAND_BOOK',
  /** Profile frame */
  MATERIAL_PROFILE_FRAME = 'MATERIAL_PROFILE_FRAME',
  /** Profile picture */
  MATERIAL_PROFILE_PICTURE = 'MATERIAL_PROFILE_PICTURE',
  /** Quest item */
  MATERIAL_QUEST = 'MATERIAL_QUEST',
  /** Quest album */
  MATERIAL_QUEST_ALBUM = 'MATERIAL_QUEST_ALBUM',
  /** Quest event book */
  MATERIAL_QUEST_EVENT_BOOK = 'MATERIAL_QUEST_EVENT_BOOK',
  /** Rainbow prince handbook */
  MATERIAL_RAINBOW_PRINCE_HAND_BOOK = 'MATERIAL_RAINBOW_PRINCE_HAND_BOOK',
  /** Rare growth material */
  MATERIAL_RARE_GROWTH_MATERIAL = 'MATERIAL_RARE_GROWTH_MATERIAL',
  /** Artifact enhancement material */
  MATERIAL_RELIQUARY_MATERIAL = 'MATERIAL_RELIQUARY_MATERIAL',
  /** Remus music box */
  MATERIAL_REMUS_MUSIC_BOX = 'MATERIAL_REMUS_MUSIC_BOX',
  /** Rename item */
  MATERIAL_RENAME_ITEM = 'MATERIAL_RENAME_ITEM',
  /** Robot gift */
  MATERIAL_ROBO_GIFT = 'MATERIAL_ROBO_GIFT',
  /** Sea lamp */
  MATERIAL_SEA_LAMP = 'MATERIAL_SEA_LAMP',
  /** Selectable chest */
  MATERIAL_SELECTABLE_CHEST = 'MATERIAL_SELECTABLE_CHEST',
  /** Spice food */
  MATERIAL_SPICE_FOOD = 'MATERIAL_SPICE_FOOD',
  /** Talent book */
  MATERIAL_TALENT = 'MATERIAL_TALENT',
  /** Weapon enhancement ore */
  MATERIAL_WEAPON_EXP_STONE = 'MATERIAL_WEAPON_EXP_STONE',
  /** Weapon skin */
  MATERIAL_WEAPON_SKIN = 'MATERIAL_WEAPON_SKIN',
  /** Widget */
  MATERIAL_WIDGET = 'MATERIAL_WIDGET',
  /** Wood */
  MATERIAL_WOOD = 'MATERIAL_WOOD',
}

// ============================================================================
// Type aliases for generic types (cannot be re-defined as enum)
// ============================================================================

/** Master file map type */
export type MasterFileMap = _MasterFileMap
/** Decoded master file type */
export type DecodedType<T extends keyof MasterFileMap> = _DecodedType<T>

/**
 * Supported language codes (ISO 639-1 with region)
 */
export type Language =
  | 'en'
  | 'ru'
  | 'vi'
  | 'th'
  | 'pt'
  | 'ko'
  | 'ja'
  | 'id'
  | 'fr'
  | 'es'
  | 'de'
  | 'zh-tw'
  | 'zh-cn'

/**
 * Enhanced master file structure with recursive support
 */
export interface EncryptedKeyMasterFile {
  /**
   * Metadata
   */
  metadata: {
    sourceFile: string
    generatedAt: string
  }
  /**
   * Primary key mapping template (decoded reference object with highest data density)
   */
  keyMappingTemplate: JsonObject
  /**
   * Alternative patterns for structural variations (optional, ordered by data density)
   */
  alternativePatterns?: JsonObject[]
}

/**
 * Cost item for ascension
 */
export interface CostItem {
  /**
   * Material ID
   */
  id: number
  /**
   * Item count
   */
  count: number
}

/**
 * Ascension material with ID and count
 */
export interface AscensionMaterial {
  /**
   * Material ID
   */
  id: number
  /**
   * Material count
   */
  count: number
}

/**
 * Skill level upgrade plan
 */
export interface SkillLevelPlan {
  /**
   * Normal attack level: [current, target] or undefined if no change
   */
  normalAttack?: [number, number]
  /**
   * Elemental skill level: [current, target] or undefined if no change
   */
  elementalSkill?: [number, number]
  /**
   * Elemental burst level: [current, target] or undefined if no change
   */
  elementalBurst?: [number, number]
}

/**
 * Character upgrade plan interface
 */
export interface CharacterUpgradePlan {
  /**
   * Character level upgrade: [current, target] or undefined if no change
   */
  characterLevel?: [number, number]
  /**
   * Skill level upgrades
   */
  skillLevels?: {
    /**
     * Normal attack level: [current, target] or undefined if no change
     */
    normalAttack?: [number, number]
    /**
     * Elemental skill level: [current, target] or undefined if no change
     */
    elementalSkill?: [number, number]
    /**
     * Elemental burst level: [current, target] or undefined if no change
     */
    elementalBurst?: [number, number]
  }
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
  fetchOption: RequestInit
  /**
   * List of TextMaps to download when new assets are found.
   * @default
   * ```ts
   * ['en','ru','vi','th','pt','ko','ja','id','fr','es','de','zh-tw','zh-cn']
   * ```
   */
  downloadLanguages: (keyof typeof TextMapLanguage)[]
  /**
   * default image base URL
   * @default 'https://gi.yatta.top/assets/UI'
   */
  defaultImageBaseURL: string
  /**
   * default audio base URL
   * @default 'https://gi.yatta.top/assets/Audio'
   */
  defaultAudioBaseURL: string
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
  imageBaseURLByRegex: Record<string, RegExp[]>
  /**
   * audio base url by regex
   * @default
   * ```ts
   * {}
   * ```
   * @key Base URL
   * @value Array of regex patterns to match asset names
   */
  audioBaseURLByRegex: Record<string, RegExp[]>
  /**
   * default language
   * @default 'en'
   */
  defaultLanguage: keyof typeof TextMapLanguage
  /**
   * log level for the application
   * @default LogLevel.NONE
   */
  logLevel?: LogLevel
  /**
   * auto fetch latest assets by cron
   * @warning If this option is `undefined`, asset updates and initial setup are not executed
   * @default '0 0 0 * * 3' // minute hour day-of-month month day-of-week
   * @see https://crontab.guru/
   */
  autoFetchLatestAssetsByCron: string | undefined
  /**
   * Automatically re-download the textMap if it has not been downloaded or if there is an error in the json format
   * @warning If `autoFetchLatestAssetsByCron` is `undefined`, this option will be ignored
   * @default true
   */
  autoFixTextMap: boolean
  /**
   * Automatically fix the ExcelBin if it has not been downloaded or if there is an error in the json format
   * @warning If `autoFetchLatestAssetsByCron` is `undefined`, this option will be ignored
   * @default true
   */
  autoFixExcelBin: boolean
  /**
   * auto cache image
   * @default true
   */
  autoCacheImage: boolean
  /**
   * auto cache audio
   * @default true
   */
  autoCacheAudio: boolean
  /**
   * asset cache folder path
   * @default node_modules/genshin-manager/cache
   */
  assetCacheFolderPath: string
}

/**
 * Element Map for ExcelBinOut to Element
 */
export const ElementKeys = {
  Physical: 'Phys',
  Fire: 'Pyro',
  Electric: 'Electro',
  Ice: 'Cryo',
  Wind: 'Anemo',
  Water: 'Hydro',
  Rock: 'Geo',
  Grass: 'Dendro',
} as const

/**
 * Element type
 */
export type Element =
  | 'Phys'
  | 'Pyro'
  | 'Electro'
  | 'Cryo'
  | 'Anemo'
  | 'Hydro'
  | 'Geo'
  | 'Dendro'

/**
 * Character voice type (subset of Language with voice acting support)
 */
export type CVType = Extract<Language, 'en' | 'ja' | 'ko' | 'zh-cn'>

/**
 * FightProp Map
 * @remarks Numeric keys are necessary for runtime mapping from game data IDs
 */
export const FightProps = {
  0: 'FIGHT_PROP_NONE',
  1: 'FIGHT_PROP_BASE_HP',
  2: 'FIGHT_PROP_HP',
  3: 'FIGHT_PROP_HP_PERCENT',
  4: 'FIGHT_PROP_BASE_ATTACK',
  5: 'FIGHT_PROP_ATTACK',
  6: 'FIGHT_PROP_ATTACK_PERCENT',
  7: 'FIGHT_PROP_BASE_DEFENSE',
  8: 'FIGHT_PROP_DEFENSE',
  9: 'FIGHT_PROP_DEFENSE_PERCENT',
  10: 'FIGHT_PROP_BASE_SPEED',
  11: 'FIGHT_PROP_SPEED_PERCENT',
  // 12: 'FIGHT_PROP_HP_MP_PERCENT',
  // 13: 'FIGHT_PROP_ATTACK_MP_PERCENT',
  20: 'FIGHT_PROP_CRITICAL',
  // 21: 'FIGHT_PROP_ANTI_CRITICAL',
  22: 'FIGHT_PROP_CRITICAL_HURT',
  23: 'FIGHT_PROP_CHARGE_EFFICIENCY',
  // 24: 'FIGHT_PROP_ADD_HURT',
  // 25: 'FIGHT_PROP_SUB_HURT',
  26: 'FIGHT_PROP_HEAL_ADD',
  27: 'FIGHT_PROP_HEALED_ADD',
  28: 'FIGHT_PROP_ELEMENT_MASTERY',
  29: 'FIGHT_PROP_PHYSICAL_SUB_HURT',
  30: 'FIGHT_PROP_PHYSICAL_ADD_HURT',
  // 31: 'FIGHT_PROP_DEFENCE_IGNORE_RATIO',
  // 32: 'FIGHT_PROP_DEFENCE_IGNORE_DELTA',
  40: 'FIGHT_PROP_FIRE_ADD_HURT',
  41: 'FIGHT_PROP_ELEC_ADD_HURT',
  42: 'FIGHT_PROP_WATER_ADD_HURT',
  43: 'FIGHT_PROP_GRASS_ADD_HURT',
  44: 'FIGHT_PROP_WIND_ADD_HURT',
  45: 'FIGHT_PROP_ROCK_ADD_HURT',
  46: 'FIGHT_PROP_ICE_ADD_HURT',
  //47: 'FIGHT_PROP_HIT_HEAD_ADD_HURT',
  50: 'FIGHT_PROP_FIRE_SUB_HURT',
  51: 'FIGHT_PROP_ELEC_SUB_HURT',
  52: 'FIGHT_PROP_WATER_SUB_HURT',
  53: 'FIGHT_PROP_GRASS_SUB_HURT',
  54: 'FIGHT_PROP_WIND_SUB_HURT',
  55: 'FIGHT_PROP_ROCK_SUB_HURT',
  56: 'FIGHT_PROP_ICE_SUB_HURT',
  // 60: 'FIGHT_PROP_EFFECT_HIT',
  // 61: 'FIGHT_PROP_EFFECT_RESIST',
  // 62: 'FIGHT_PROP_FREEZE_RESIST',
  // 64: 'FIGHT_PROP_DIZZY_RESIST',
  // 65: 'FIGHT_PROP_FREEZE_SHORTEN',
  // 67: 'FIGHT_PROP_DIZZY_SHORTEN',
  // 70: 'FIGHT_PROP_MAX_FIRE_ENERGY',
  // 71: 'FIGHT_PROP_MAX_ELEC_ENERGY',
  // 72: 'FIGHT_PROP_MAX_WATER_ENERGY',
  // 73: 'FIGHT_PROP_MAX_GRASS_ENERGY',
  // 74: 'FIGHT_PROP_MAX_WIND_ENERGY',
  // 75: 'FIGHT_PROP_MAX_ICE_ENERGY',
  // 76: 'FIGHT_PROP_MAX_ROCK_ENERGY',
  80: 'FIGHT_PROP_SKILL_CD_MINUS_RATIO',
  81: 'FIGHT_PROP_SHIELD_COST_MINUS_RATIO',
  // 1000: 'FIGHT_PROP_CUR_FIRE_ENERGY',
  // 1001: 'FIGHT_PROP_CUR_ELEC_ENERGY',
  // 1002: 'FIGHT_PROP_CUR_WATER_ENERGY',
  // 1003: 'FIGHT_PROP_CUR_GRASS_ENERGY',
  // 1004: 'FIGHT_PROP_CUR_WIND_ENERGY',
  // 1005: 'FIGHT_PROP_CUR_ICE_ENERGY',
  // 1006: 'FIGHT_PROP_CUR_ROCK_ENERGY',
  1010: 'FIGHT_PROP_CUR_HP',
  2000: 'FIGHT_PROP_MAX_HP',
  2001: 'FIGHT_PROP_CUR_ATTACK',
  2002: 'FIGHT_PROP_CUR_DEFENSE',
  2003: 'FIGHT_PROP_CUR_SPEED',
  // 2004: 'FIGHT_PROP_CUR_HP_DEBTS',
  // 2005: 'FIGHT_PROP_CUR_HP_PAID_DEBTS',
  // 3000: 'FIGHT_PROP_NONEXTRA_ATTACK',
  // 3001: 'FIGHT_PROP_NONEXTRA_DEFENSE',
  // 3002: 'FIGHT_PROP_NONEXTRA_CRITICAL',
  // 3003: 'FIGHT_PROP_NONEXTRA_ANTI_CRITICAL',
  // 3004: 'FIGHT_PROP_NONEXTRA_CRITICAL_HURT',
  // 3005: 'FIGHT_PROP_NONEXTRA_CHARGE_EFFICIENCY',
  // 3006: 'FIGHT_PROP_NONEXTRA_ELEMENT_MASTERY',
  // 3007: 'FIGHT_PROP_NONEXTRA_PHYSICAL_SUB_HURT',
  // 3008: 'FIGHT_PROP_NONEXTRA_FIRE_ADD_HURT',
  // 3009: 'FIGHT_PROP_NONEXTRA_ELEC_ADD_HURT',
  // 3010: 'FIGHT_PROP_NONEXTRA_WATER_ADD_HURT',
  // 3011: 'FIGHT_PROP_NONEXTRA_GRASS_ADD_HURT',
  // 3012: 'FIGHT_PROP_NONEXTRA_WIND_ADD_HURT',
  // 3013: 'FIGHT_PROP_NONEXTRA_ROCK_ADD_HURT',
  // 3014: 'FIGHT_PROP_NONEXTRA_ICE_ADD_HURT',
  // 3015: 'FIGHT_PROP_NONEXTRA_FIRE_SUB_HURT',
  // 3016: 'FIGHT_PROP_NONEXTRA_ELEC_SUB_HURT',
  // 3017: 'FIGHT_PROP_NONEXTRA_WATER_SUB_HURT',
  // 3018: 'FIGHT_PROP_NONEXTRA_GRASS_SUB_HURT',
  // 3019: 'FIGHT_PROP_NONEXTRA_WIND_SUB_HURT',
  // 3020: 'FIGHT_PROP_NONEXTRA_ROCK_SUB_HURT',
  // 3021: 'FIGHT_PROP_NONEXTRA_ICE_SUB_HURT',
  // 3022: 'FIGHT_PROP_NONEXTRA_SKILL_CD_MINUS_RATIO',
  // 3023: 'FIGHT_PROP_NONEXTRA_SHIELD_COST_MINUS_RATIO',
  // 3024: 'FIGHT_PROP_NONEXTRA_PHYSICAL_ADD_HURT',
  // 3045: 'FIGHT_PROP_BASE_ELEM_REACT_CRITICAL',
  // 3046: 'FIGHT_PROP_BASE_ELEM_REACT_CRITICAL_HURT',
  // 3025: 'FIGHT_PROP_ELEM_REACT_CRITICAL',
  // 3026: 'FIGHT_PROP_ELEM_REACT_CRITICAL_HURT',
  // 3027: 'FIGHT_PROP_ELEM_REACT_EXPLODE_CRITICAL',
  // 3028: 'FIGHT_PROP_ELEM_REACT_EXPLODE_CRITICAL_HURT',
  // 3029: 'FIGHT_PROP_ELEM_REACT_SWIRL_CRITICAL',
  // 3030: 'FIGHT_PROP_ELEM_REACT_SWIRL_CRITICAL_HURT',
  // 3031: 'FIGHT_PROP_ELEM_REACT_ELECTRIC_CRITICAL',
  // 3032: 'FIGHT_PROP_ELEM_REACT_ELECTRIC_CRITICAL_HURT',
  // 3033: 'FIGHT_PROP_ELEM_REACT_SCONDUCT_CRITICAL',
  // 3034: 'FIGHT_PROP_ELEM_REACT_SCONDUCT_CRITICAL_HURT',
  // 3035: 'FIGHT_PROP_ELEM_REACT_BURN_CRITICAL',
  // 3036: 'FIGHT_PROP_ELEM_REACT_BURN_CRITICAL_HURT',
  // 3037: 'FIGHT_PROP_ELEM_REACT_FROZENBROKEN_CRITICAL',
  // 3038: 'FIGHT_PROP_ELEM_REACT_FROZENBROKEN_CRITICAL_HURT',
  // 3039: 'FIGHT_PROP_ELEM_REACT_OVERGROW_CRITICAL',
  // 3040: 'FIGHT_PROP_ELEM_REACT_OVERGROW_CRITICAL_HURT',
  // 3041: 'FIGHT_PROP_ELEM_REACT_OVERGROW_FIRE_CRITICAL',
  // 3042: 'FIGHT_PROP_ELEM_REACT_OVERGROW_FIRE_CRITICAL_HURT',
  // 3043: 'FIGHT_PROP_ELEM_REACT_OVERGROW_ELECTRIC_CRITICAL',
  // 3044: 'FIGHT_PROP_ELEM_REACT_OVERGROW_ELECTRIC_CRITICAL_HURT',
} as const

/**
 * FightProp type
 */
export type FightPropType =
  | 'FIGHT_PROP_NONE'
  | 'FIGHT_PROP_BASE_HP'
  | 'FIGHT_PROP_HP'
  | 'FIGHT_PROP_HP_PERCENT'
  | 'FIGHT_PROP_BASE_ATTACK'
  | 'FIGHT_PROP_ATTACK'
  | 'FIGHT_PROP_ATTACK_PERCENT'
  | 'FIGHT_PROP_BASE_DEFENSE'
  | 'FIGHT_PROP_DEFENSE'
  | 'FIGHT_PROP_DEFENSE_PERCENT'
  | 'FIGHT_PROP_BASE_SPEED'
  | 'FIGHT_PROP_SPEED_PERCENT'
  | 'FIGHT_PROP_CRITICAL'
  | 'FIGHT_PROP_CRITICAL_HURT'
  | 'FIGHT_PROP_CHARGE_EFFICIENCY'
  | 'FIGHT_PROP_HEAL_ADD'
  | 'FIGHT_PROP_HEALED_ADD'
  | 'FIGHT_PROP_ELEMENT_MASTERY'
  | 'FIGHT_PROP_PHYSICAL_SUB_HURT'
  | 'FIGHT_PROP_PHYSICAL_ADD_HURT'
  | 'FIGHT_PROP_FIRE_ADD_HURT'
  | 'FIGHT_PROP_ELEC_ADD_HURT'
  | 'FIGHT_PROP_WATER_ADD_HURT'
  | 'FIGHT_PROP_GRASS_ADD_HURT'
  | 'FIGHT_PROP_WIND_ADD_HURT'
  | 'FIGHT_PROP_ROCK_ADD_HURT'
  | 'FIGHT_PROP_ICE_ADD_HURT'
  | 'FIGHT_PROP_FIRE_SUB_HURT'
  | 'FIGHT_PROP_ELEC_SUB_HURT'
  | 'FIGHT_PROP_WATER_SUB_HURT'
  | 'FIGHT_PROP_GRASS_SUB_HURT'
  | 'FIGHT_PROP_WIND_SUB_HURT'
  | 'FIGHT_PROP_ROCK_SUB_HURT'
  | 'FIGHT_PROP_ICE_SUB_HURT'
  | 'FIGHT_PROP_SKILL_CD_MINUS_RATIO'
  | 'FIGHT_PROP_SHIELD_COST_MINUS_RATIO'
  | 'FIGHT_PROP_CUR_HP'
  | 'FIGHT_PROP_MAX_HP'
  | 'FIGHT_PROP_CUR_ATTACK'
  | 'FIGHT_PROP_CUR_DEFENSE'
  | 'FIGHT_PROP_CUR_SPEED'

/**
 * TextMap language type
 */
export const TextMapLanguage = {
  en: ['TextMapEN.json'],
  ru: ['TextMapRU_0.json', 'TextMapRU_1.json'],
  vi: ['TextMapVI.json'],
  th: ['TextMapTH_0.json', 'TextMapTH_1.json'],
  pt: ['TextMapPT.json'],
  ko: ['TextMapKR.json'],
  ja: ['TextMapJP.json'],
  id: ['TextMapID.json'],
  fr: ['TextMapFR.json'],
  es: ['TextMapES.json'],
  de: ['TextMapDE.json'],
  'zh-tw': ['TextMapCHT.json'],
  'zh-cn': ['TextMapCHS.json'],
} as const satisfies Record<Language, readonly string[]>

/**
 * ExcelBin outputs
 */
export const ExcelBinOutputs = {
  // AbilityOverrideExcelConfigData: 'AbilityOverrideExcelConfigData.json',
  // AbilityPropExcelConfigData: 'AbilityPropExcelConfigData.json',
  // AbilityStateResistanceByIDExcelConfigData:
  //   'AbilityStateResistanceByIDExcelConfigData.json',
  // AchievementExcelConfigData: 'AchievementExcelConfigData.json',
  // AchievementGoalExcelConfigData: 'AchievementGoalExcelConfigData.json',
  // ActivityAbilityGroupExcelConfigData:
  //   'ActivityAbilityGroupExcelConfigData.json',
  // ActivityArenaChallengeChapterExcelConfigData:
  //   'ActivityArenaChallengeChapterExcelConfigData.json',
  // ActivityArenaChallengeExcelConfigData:
  //   'ActivityArenaChallengeExcelConfigData.json',
  // ActivityArenaChallengeLevelInfoExcelConfigData:
  //   'ActivityArenaChallengeLevelInfoExcelConfigData.json',
  // ActivityArenaChallengePreviewExcelConfigData:
  //   'ActivityArenaChallengePreviewExcelConfigData.json',
  // ActivityBannerExcelConfigData: 'ActivityBannerExcelConfigData.json',
  // ActivityCharAmusementLevelExcelConfigData:
  //   'ActivityCharAmusementLevelExcelConfigData.json',
  // ActivityCharAmusementOverallExcelConfigData:
  //   'ActivityCharAmusementOverallExcelConfigData.json',
  // ActivityCharAmusementStageExcelConfigData:
  //   'ActivityCharAmusementStageExcelConfigData.json',
  // ActivityChessAffixExcelConfigData: 'ActivityChessAffixExcelConfigData.json',
  // ActivityChessCardExcelConfigData: 'ActivityChessCardExcelConfigData.json',
  // ActivityChessGearExcelConfigData: 'ActivityChessGearExcelConfigData.json',
  // ActivityChessLevelExcelConfigData: 'ActivityChessLevelExcelConfigData.json',
  // ActivityChessMapExcelConfigData: 'ActivityChessMapExcelConfigData.json',
  // ActivityChessMapPointExcelConfigData:
  //   'ActivityChessMapPointExcelConfigData.json',
  // ActivityChessPreviewExcelConfigData:
  //   'ActivityChessPreviewExcelConfigData.json',
  // ActivityChessScheduleExcelConfigData:
  //   'ActivityChessScheduleExcelConfigData.json',
  // ActivityCrystalLinkCondBuffExcelConfigData:
  //   'ActivityCrystalLinkCondBuffExcelConfigData.json',
  // ActivityCrystalLinkDifficultyExcelConfigData:
  //   'ActivityCrystalLinkDifficultyExcelConfigData.json',
  // ActivityCrystalLinkEffectBuffExcelConfigData:
  //   'ActivityCrystalLinkEffectBuffExcelConfigData.json',
  // ActivityCrystalLinkLevelExcelConfigData:
  //   'ActivityCrystalLinkLevelExcelConfigData.json',
  // ActivityDeliveryDailyExcelConfigData:
  //   'ActivityDeliveryDailyExcelConfigData.json',
  // ActivityDeliveryExcelConfigData: 'ActivityDeliveryExcelConfigData.json',
  // ActivityDeliveryWatcherDataConfigData:
  //   'ActivityDeliveryWatcherDataConfigData.json',
  // ActivityDuelHeartDifficultyExcelConfigData:
  //   'ActivityDuelHeartDifficultyExcelConfigData.json',
  // ActivityDuelHeartExcelConfigData: 'ActivityDuelHeartExcelConfigData.json',
  // ActivityDuelHeartLevelExcelConfigData:
  //   'ActivityDuelHeartLevelExcelConfigData.json',
  // ActivityDuelHeartTaskExcelConfigData:
  //   'ActivityDuelHeartTaskExcelConfigData.json',
  // ActivityExcelConfigData: 'ActivityExcelConfigData.json',
  // ActivityFFV2PhotographPosExcelConfigData:
  //   'ActivityFFV2PhotographPosExcelConfigData.json',
  // ActivityFFV2PhotoStageExcelConfigData:
  //   'ActivityFFV2PhotoStageExcelConfigData.json',
  // ActivityGachaBaseExcelConfigData: 'ActivityGachaBaseExcelConfigData.json',
  // ActivityGachaRobotExcelConfigData: 'ActivityGachaRobotExcelConfigData.json',
  // ActivityGachaStageExcelConfigData: 'ActivityGachaStageExcelConfigData.json',
  // ActivityGachaStageTextExcelConfigData:
  //   'ActivityGachaStageTextExcelConfigData.json',
  // ActivityGCGFestivalExcelConfigData: 'ActivityGCGFestivalExcelConfigData.json',
  // ActivityGCGFestivalTextExcelConfigData:
  //   'ActivityGCGFestivalTextExcelConfigData.json',
  // ActivityGearExcelConfigData: 'ActivityGearExcelConfigData.json',
  // ActivityGearGadgetGearExcelConfigData:
  //   'ActivityGearGadgetGearExcelConfigData.json',
  // ActivityGearGadgetJigsawExcelConfigData:
  //   'ActivityGearGadgetJigsawExcelConfigData.json',
  // ActivityGearGadgetShaftExcelConfigData:
  //   'ActivityGearGadgetShaftExcelConfigData.json',
  // ActivityGearJigsawExcelConfigData: 'ActivityGearJigsawExcelConfigData.json',
  // ActivityGearLevelExcelConfigData: 'ActivityGearLevelExcelConfigData.json',
  // ActivityGroupLinksExcelConfigData: 'ActivityGroupLinksExcelConfigData.json',
  // ActivityHachiFinalStageExcelConfigData:
  //   'ActivityHachiFinalStageExcelConfigData.json',
  // ActivityHachiStageExcelConfigData: 'ActivityHachiStageExcelConfigData.json',
  // ActivityHideAndSeekBasicConfigData: 'ActivityHideAndSeekBasicConfigData.json',
  // ActivityIslandPartyOverallExcelConfigData:
  //   'ActivityIslandPartyOverallExcelConfigData.json',
  // ActivityIslandPartyScoreExcelConfigData:
  //   'ActivityIslandPartyScoreExcelConfigData.json',
  // ActivityIslandPartyStageExcelConfigData:
  //   'ActivityIslandPartyStageExcelConfigData.json',
  // ActivityMapExcelConfigData: 'ActivityMapExcelConfigData.json',
  // ActivityMapMarkExcelConfigData: 'ActivityMapMarkExcelConfigData.json',
  // ActivityMapTypeExcelConfigData: 'ActivityMapTypeExcelConfigData.json',
  // ActivityMistTrialAvatarDataExcelConfigData:
  //   'ActivityMistTrialAvatarDataExcelConfigData.json',
  // ActivityMistTrialLevelDataExcelConfigData:
  //   'ActivityMistTrialLevelDataExcelConfigData.json',
  // ActivityMistTrialLevelFactorExcelConfigData:
  //   'ActivityMistTrialLevelFactorExcelConfigData.json',
  // ActivityMistTrialStatisticsListExcelConfigData:
  //   'ActivityMistTrialStatisticsListExcelConfigData.json',
  // ActivityMistTrialWatcherListDataExcelConfigData:
  //   'ActivityMistTrialWatcherListDataExcelConfigData.json',
  // ActivityMuqadasPotionExcelConfigData:
  //   'ActivityMuqadasPotionExcelConfigData.json',
  // ActivityMuqadasPotionLevelExcelConfigData:
  //   'ActivityMuqadasPotionLevelExcelConfigData.json',
  // ActivityMuqadasPotionMonsterExcelConfigData:
  //   'ActivityMuqadasPotionMonsterExcelConfigData.json',
  // ActivityPhotographExcelConfigData: 'ActivityPhotographExcelConfigData.json',
  // ActivityPhotographPosExcelConfigData:
  //   'ActivityPhotographPosExcelConfigData.json',
  // ActivityPlantFlowerDailyExcelConfigData:
  //   'ActivityPlantFlowerDailyExcelConfigData.json',
  // ActivityPlantFlowerMainExcelConfigData:
  //   'ActivityPlantFlowerMainExcelConfigData.json',
  // ActivityPotionBuffExcelConfigData: 'ActivityPotionBuffExcelConfigData.json',
  // ActivityPotionDifficultyExcelConfigData:
  //   'ActivityPotionDifficultyExcelConfigData.json',
  // ActivityPotionLevelExcelConfigData: 'ActivityPotionLevelExcelConfigData.json',
  // ActivityPotionModeChoiceExcelConfigData:
  //   'ActivityPotionModeChoiceExcelConfigData.json',
  // ActivityPotionOverallExcelConfigData:
  //   'ActivityPotionOverallExcelConfigData.json',
  // ActivityPotionStageExcelConfigData: 'ActivityPotionStageExcelConfigData.json',
  // ActivityRockBoardExploreQuestExcelConfigData:
  //   'ActivityRockBoardExploreQuestExcelConfigData.json',
  // ActivityRockBoardExploreStageExcelConfigData:
  //   'ActivityRockBoardExploreStageExcelConfigData.json',
  // ActivitySalesmanDailyExcelConfigData:
  //   'ActivitySalesmanDailyExcelConfigData.json',
  // ActivitySalesmanExcelConfigData: 'ActivitySalesmanExcelConfigData.json',
  // ActivitySalesmanRewardMatchConfigData:
  //   'ActivitySalesmanRewardMatchConfigData.json',
  // ActivitySandwormCannonLevelExcelConfigData:
  //   'ActivitySandwormCannonLevelExcelConfigData.json',
  // ActivityShopOverallExcelConfigData: 'ActivityShopOverallExcelConfigData.json',
  // ActivityShopSheetExcelConfigData: 'ActivityShopSheetExcelConfigData.json',
  // ActivitySkillExcelConfigData: 'ActivitySkillExcelConfigData.json',
  // ActivitySpiceExcelConfigData: 'ActivitySpiceExcelConfigData.json',
  // ActivitySpiceFoodExcelConfigData: 'ActivitySpiceFoodExcelConfigData.json',
  // ActivitySpiceGivingExcelConfigData: 'ActivitySpiceGivingExcelConfigData.json',
  // ActivitySpiceStageDataExcelConfigData:
  //   'ActivitySpiceStageDataExcelConfigData.json',
  // ActivitySteepleChaseConfigData: 'ActivitySteepleChaseConfigData.json',
  // ActivitySummerTimeExcelConfigData: 'ActivitySummerTimeExcelConfigData.json',
  // ActivitySummerTimeFloatSignalExcelConfigData:
  //   'ActivitySummerTimeFloatSignalExcelConfigData.json',
  // ActivitySummerTimeRaceExcelConfigData:
  //   'ActivitySummerTimeRaceExcelConfigData.json',
  // ActivitySummerTimeRacePreviewExcelConfigData:
  //   'ActivitySummerTimeRacePreviewExcelConfigData.json',
  // ActivitySummerTimeStageExcelConfigData:
  //   'ActivitySummerTimeStageExcelConfigData.json',
  // ActivitySumoDifficultyExcelConfigData:
  //   'ActivitySumoDifficultyExcelConfigData.json',
  // ActivitySumoOverallConfigData: 'ActivitySumoOverallConfigData.json',
  // ActivitySumoStageExcelConfigData: 'ActivitySumoStageExcelConfigData.json',
  // ActivitySumoSwitchSkillExcelConfigData:
  //   'ActivitySumoSwitchSkillExcelConfigData.json',
  // ActivityTanukiTravelDataExcelConfigData:
  //   'ActivityTanukiTravelDataExcelConfigData.json',
  // ActivityTanukiTravelRouteDataExcelConfigData:
  //   'ActivityTanukiTravelRouteDataExcelConfigData.json',
  //ActivityUpAvatarExcelConfigData: 'ActivityUpAvatarExcelConfigData.json',
  // ActivityVintageCampChallengeExcelConfigData:
  //   'ActivityVintageCampChallengeExcelConfigData.json',
  // ActivityVintageDataExcelConfigData: 'ActivityVintageDataExcelConfigData.json',
  // ActivityVintageDecoExcelConfigData: 'ActivityVintageDecoExcelConfigData.json',
  // ActivityVintageHuntingExcelConfigData:
  //   'ActivityVintageHuntingExcelConfigData.json',
  // ActivityVintageHuntingMonsterExcelConfigData:
  //   'ActivityVintageHuntingMonsterExcelConfigData.json',
  // ActivityVintageMarketPrepareExcelConfigData:
  //   'ActivityVintageMarketPrepareExcelConfigData.json',
  // ActivityVintageMarketStageExcelConfigData:
  //   'ActivityVintageMarketStageExcelConfigData.json',
  // ActivityVintagePlayTypeExcelConfigData:
  //   'ActivityVintagePlayTypeExcelConfigData.json',
  // ActivityVintagePresentExcelConfigData:
  //   'ActivityVintagePresentExcelConfigData.json',
  // ActivityVintageQuestDataExcelConfigData:
  //   'ActivityVintageQuestDataExcelConfigData.json',
  // ActivityWatcherConfigData: 'ActivityWatcherConfigData.json',
  // AdjustFirebaseGachaExcelConfigData: 'AdjustFirebaseGachaExcelConfigData.json',
  // AdjustFirebaseOnlineTimeExcelConfigData:
  //   'AdjustFirebaseOnlineTimeExcelConfigData.json',
  // AkaFesArchaeologyExcelConfigData: 'AkaFesArchaeologyExcelConfigData.json',
  // AkaFesArchaeologyLevelExcelConfigData:
  //   'AkaFesArchaeologyLevelExcelConfigData.json',
  // AkaFesArchitectComponentExcelConfigData:
  //   'AkaFesArchitectComponentExcelConfigData.json',
  // AkaFesArchitectLevelExcelConfigData:
  //   'AkaFesArchitectLevelExcelConfigData.json',
  // AkaFesAstrolabeExcelConfigData: 'AkaFesAstrolabeExcelConfigData.json',
  // AkaFesAstrolabeLevelExcelConfigData:
  //   'AkaFesAstrolabeLevelExcelConfigData.json',
  // AkaFesInfoExcelConfigData: 'AkaFesInfoExcelConfigData.json',
  // AkaFesOverallExcelConfigData: 'AkaFesOverallExcelConfigData.json',
  // AkaFesPotionDifficultyExcelConfigData:
  //   'AkaFesPotionDifficultyExcelConfigData.json',
  // AkaFesPotionExcelConfigData: 'AkaFesPotionExcelConfigData.json',
  // AkaFesPotionFactorExcelConfigData: 'AkaFesPotionFactorExcelConfigData.json',
  // AkaFesPotionLevelExcelConfigData: 'AkaFesPotionLevelExcelConfigData.json',
  // AkaFesReasoningLevelExcelConfigData:
  //   'AkaFesReasoningLevelExcelConfigData.json',
  // AkaFesReasoningQuestionExcelConfigData:
  //   'AkaFesReasoningQuestionExcelConfigData.json',
  // AkaFesReasoningWordExcelConfigData: 'AkaFesReasoningWordExcelConfigData.json',
  // AkaFesRhythmExcelConfigData: 'AkaFesRhythmExcelConfigData.json',
  // AkaFesRhythmLevelFishExcelConfigData:
  //   'AkaFesRhythmLevelFishExcelConfigData.json',
  // AkaFesRhythmLevelPigExcelConfigData:
  //   'AkaFesRhythmLevelPigExcelConfigData.json',
  // AkaFesRhythmLevelWeaselExcelConfigData:
  //   'AkaFesRhythmLevelWeaselExcelConfigData.json',
  // AkaFesRhythmLevelWeaselGroupExcelConfigData:
  //   'AkaFesRhythmLevelWeaselGroupExcelConfigData.json',
  // AkaFesRhythmTitleExcelConfigData: 'AkaFesRhythmTitleExcelConfigData.json',
  AnimalCodexExcelConfigData: 'AnimalCodexExcelConfigData.json',
  // AnimalDescribeExcelConfigData: 'AnimalDescribeExcelConfigData.json',
  // AranaraCollectionExcelConfigData: 'AranaraCollectionExcelConfigData.json',
  // AsterActivityPerviewExcelConfigData:
  //   'AsterActivityPerviewExcelConfigData.json',
  // AsterAvatarUpExcelConfigData: 'AsterAvatarUpExcelConfigData.json',
  // AsterLittleExcelConfigData: 'AsterLittleExcelConfigData.json',
  // AsterMidDifficultyExcelConfigData: 'AsterMidDifficultyExcelConfigData.json',
  // AsterMidExcelConfigData: 'AsterMidExcelConfigData.json',
  // AsterMidGroupsExcelConfigData: 'AsterMidGroupsExcelConfigData.json',
  // AsterMissionExcelConfigData: 'AsterMissionExcelConfigData.json',
  // AsterStageExcelConfigData: 'AsterStageExcelConfigData.json',
  // AsterTeamBuffExcelConfigData: 'AsterTeamBuffExcelConfigData.json',
  // AttackAttenuationExcelConfigData: 'AttackAttenuationExcelConfigData.json',
  // AudioMonsterConfigData: 'AudioMonsterConfigData.json',
  // AudioPlayerlvConfigData: 'AudioPlayerlvConfigData.json',
  // AudioSceneConfigData: 'AudioSceneConfigData.json',
  // AvatarCodexExcelConfigData: 'AvatarCodexExcelConfigData.json',
  AvatarCostumeExcelConfigData: 'AvatarCostumeExcelConfigData.json',
  AvatarCurveExcelConfigData: 'AvatarCurveExcelConfigData.json',
  AvatarExcelConfigData: 'AvatarExcelConfigData.json',
  // AvatarExtraPropExcelConfigData: 'AvatarExtraPropExcelConfigData.json',
  // AvatarFettersLevelExcelConfigData: 'AvatarFettersLevelExcelConfigData.json',
  // AvatarFlycloakExcelConfigData: 'AvatarFlycloakExcelConfigData.json',
  // AvatarHeroEntityExcelConfigData: 'AvatarHeroEntityExcelConfigData.json',
  // AvatarLevelExcelConfigData: 'AvatarLevelExcelConfigData.json',
  AvatarPromoteExcelConfigData: 'AvatarPromoteExcelConfigData.json',
  // AvatarRenameExcelConfigData: 'AvatarRenameExcelConfigData.json',
  // AvatarReplaceCostumeExcelConfigData:
  //   'AvatarReplaceCostumeExcelConfigData.json',
  AvatarSkillDepotExcelConfigData: 'AvatarSkillDepotExcelConfigData.json',
  AvatarSkillExcelConfigData: 'AvatarSkillExcelConfigData.json',
  AvatarTalentExcelConfigData: 'AvatarTalentExcelConfigData.json',
  // BargainExcelConfigData: 'BargainExcelConfigData.json',
  // BartenderAffixExcelConfigData: 'BartenderAffixExcelConfigData.json',
  // BartenderBasicExcelConfigData: 'BartenderBasicExcelConfigData.json',
  // BartenderEventExcelConfigData: 'BartenderEventExcelConfigData.json',
  // BartenderFormulaExcelConfigData: 'BartenderFormulaExcelConfigData.json',
  // BartenderFormulaTypeConfigData: 'BartenderFormulaTypeConfigData.json',
  // BartenderLevelExcelConfigData: 'BartenderLevelExcelConfigData.json',
  // BartenderMaterialUnlockConfigData: 'BartenderMaterialUnlockConfigData.json',
  // BartenderOrderExcelConfigData: 'BartenderOrderExcelConfigData.json',
  // BartenderTaskExcelConfigData: 'BartenderTaskExcelConfigData.json',
  // BartenderTaskOrderExcelConfigData: 'BartenderTaskOrderExcelConfigData.json',
  // BattlePassLevelExcelConfigData: 'BattlePassLevelExcelConfigData.json',
  // BattlePassMissionExcelConfigData: 'BattlePassMissionExcelConfigData.json',
  // BattlePassRewardExcelConfigData: 'BattlePassRewardExcelConfigData.json',
  // BattlePassScheduleExcelConfigData: 'BattlePassScheduleExcelConfigData.json',
  // BattlePassStoryExcelConfigData: 'BattlePassStoryExcelConfigData.json',
  // BirthdayMailExcelConfigData: 'BirthdayMailExcelConfigData.json',
  // BlessingScanExcelConfigData: 'BlessingScanExcelConfigData.json',
  // BlessingScanPicExcelConfigData: 'BlessingScanPicExcelConfigData.json',
  // BlessingScanTypeExcelConfigData: 'BlessingScanTypeExcelConfigData.json',
  // BlitzRushExcelConfigData: 'BlitzRushExcelConfigData.json',
  // BlitzRushParkourExcelConfigData: 'BlitzRushParkourExcelConfigData.json',
  // BlitzRushStageExcelConfigData: 'BlitzRushStageExcelConfigData.json',
  // BlossomChestExcelConfigData: 'BlossomChestExcelConfigData.json',
  // BlossomGroupsExcelConfigData: 'BlossomGroupsExcelConfigData.json',
  // BlossomOpenExcelConfigData: 'BlossomOpenExcelConfigData.json',
  // BlossomRefreshExcelConfigData: 'BlossomRefreshExcelConfigData.json',
  // BlossomReviseExcelConfigData: 'BlossomReviseExcelConfigData.json',
  // BlossomSectionOrderExcelConfigData: 'BlossomSectionOrderExcelConfigData.json',
  // BlossomTalkExcelConfigData: 'BlossomTalkExcelConfigData.json',
  // BonusActivityClientExcelConfigData: 'BonusActivityClientExcelConfigData.json',
  // BonusActivityExcelConfigData: 'BonusActivityExcelConfigData.json',
  // BonusTreasureSolutionExcelConfigData:
  //   'BonusTreasureSolutionExcelConfigData.json',
  // BooksCodexExcelConfigData: 'BooksCodexExcelConfigData.json',
  // BookSuitExcelConfigData: 'BookSuitExcelConfigData.json',
  // BoredActionPriorityExcelConfigData: 'BoredActionPriorityExcelConfigData.json',
  // BoredCreateMonsterExcelConfigData: 'BoredCreateMonsterExcelConfigData.json',
  // BoredEventExcelConfigData: 'BoredEventExcelConfigData.json',
  // BoredMonsterPoolConfigData: 'BoredMonsterPoolConfigData.json',
  // BounceConjuringChapterExcelConfigData:
  //   'BounceConjuringChapterExcelConfigData.json',
  // BounceConjuringItemExcelConfigData: 'BounceConjuringItemExcelConfigData.json',
  // BounceConjuringPreviewExcelConfigData:
  //   'BounceConjuringPreviewExcelConfigData.json',
  // BrickBreakerBaseExcelConfigData: 'BrickBreakerBaseExcelConfigData.json',
  // BrickBreakerDungeonLevelExcelConfigData:
  //   'BrickBreakerDungeonLevelExcelConfigData.json',
  // BrickBreakerInfoExcelConfigData: 'BrickBreakerInfoExcelConfigData.json',
  // BrickBreakerQuestExcelConfigData: 'BrickBreakerQuestExcelConfigData.json',
  // BrickBreakerSkillExcelConfigData: 'BrickBreakerSkillExcelConfigData.json',
  // BrickBreakerStageExcelConfigData: 'BrickBreakerStageExcelConfigData.json',
  // BrickBreakerWorldLevelExcelConfigData:
  //   'BrickBreakerWorldLevelExcelConfigData.json',
  // BuffExcelConfigData: 'BuffExcelConfigData.json',
  // BuffIconExcelConfigData: 'BuffIconExcelConfigData.json',
  // BuoyantCombatExcelConfigData: 'BuoyantCombatExcelConfigData.json',
  // BuoyantCombatLevelExcelConfigData: 'BuoyantCombatLevelExcelConfigData.json',
  // CampExcelConfigData: 'CampExcelConfigData.json',
  // CaptureExcelConfigData: 'CaptureExcelConfigData.json',
  // CaptureTagsExcelConfigData: 'CaptureTagsExcelConfigData.json',
  // CatalogExcelConfigData: 'CatalogExcelConfigData.json',
  // ChannellerSlabBuffCostExcelConfigData:
  //   'ChannellerSlabBuffCostExcelConfigData.json',
  // ChannellerSlabBuffEnergyExcelConfigData:
  //   'ChannellerSlabBuffEnergyExcelConfigData.json',
  // ChannellerSlabBuffExcelConfigData: 'ChannellerSlabBuffExcelConfigData.json',
  // ChannellerSlabChapterExcelConfigData:
  //   'ChannellerSlabChapterExcelConfigData.json',
  // ChannellerSlabDungeonExcelConfigData:
  //   'ChannellerSlabDungeonExcelConfigData.json',
  // ChannellerSlabLevelExcelConfigData: 'ChannellerSlabLevelExcelConfigData.json',
  // ChannellerSlabLoopDungeonConditionExcelConfigData:
  //   'ChannellerSlabLoopDungeonConditionExcelConfigData.json',
  // ChannellerSlabLoopDungeonDifficultyExcelConfigData:
  //   'ChannellerSlabLoopDungeonDifficultyExcelConfigData.json',
  // ChannellerSlabLoopDungeonExcelConfigData:
  //   'ChannellerSlabLoopDungeonExcelConfigData.json',
  // ChannellerSlabLoopDungeonPreviewExcelConfigData:
  //   'ChannellerSlabLoopDungeonPreviewExcelConfigData.json',
  // ChannellerSlabLoopDungeonRewardExcelConfigData:
  //   'ChannellerSlabLoopDungeonRewardExcelConfigData.json',
  // ChannellerSlabPreviewExcelConfigData:
  //   'ChannellerSlabPreviewExcelConfigData.json',
  // ChapterExcelConfigData: 'ChapterExcelConfigData.json',
  // ChargeBarStyleExcelConfigData: 'ChargeBarStyleExcelConfigData.json',
  // ChatExcelConfigData: 'ChatExcelConfigData.json',
  // ChestLevelSetConfigData: 'ChestLevelSetConfigData.json',
  // CityConfigData: 'CityConfigData.json',
  // CityLevelupConfigData: 'CityLevelupConfigData.json',
  // CityTaskOpenExcelConfigData: 'CityTaskOpenExcelConfigData.json',
  // ClientSceneTagConfigData: 'ClientSceneTagConfigData.json',
  // CoinCollectExcelConfigData: 'CoinCollectExcelConfigData.json',
  // CoinCollectOverallExcelConfigData: 'CoinCollectOverallExcelConfigData.json',
  // CoinCollectPreviewImageExcelConfigData:
  //   'CoinCollectPreviewImageExcelConfigData.json',
  // CoinCollectSkillExcelConfigData: 'CoinCollectSkillExcelConfigData.json',
  // CombatEndCleanExcelConfigData: 'CombatEndCleanExcelConfigData.json',
  // CombineExcelConfigData: 'CombineExcelConfigData.json',
  // CompoundBoostExcelConfigData: 'CompoundBoostExcelConfigData.json',
  // CompoundExcelConfigData: 'CompoundExcelConfigData.json',
  // ConstValueExcelConfigData: 'ConstValueExcelConfigData.json',
  // CookBonusExcelConfigData: 'CookBonusExcelConfigData.json',
  // CookRecipeExcelConfigData: 'CookRecipeExcelConfigData.json',
  // CoopActivityExcelConfigData: 'CoopActivityExcelConfigData.json',
  // CoopCGExcelConfigData: 'CoopCGExcelConfigData.json',
  // CoopChapterExcelConfigData: 'CoopChapterExcelConfigData.json',
  // CoopExcelConfigData: 'CoopExcelConfigData.json',
  // CoopInteractionExcelConfigData: 'CoopInteractionExcelConfigData.json',
  // CoopPointExcelConfigData: 'CoopPointExcelConfigData.json',
  // CoopRewardExcelConfigData: 'CoopRewardExcelConfigData.json',
  // CSSceneTagConfigData: 'CSSceneTagConfigData.json',
  // CusmtomGadgetConfigIdExcelConfigData:
  //   'CusmtomGadgetConfigIdExcelConfigData.json',
  // CusmtomGadgetSlotExcelConfigData: 'CusmtomGadgetSlotExcelConfigData.json',
  // CustomGadgetRootExcelConfigData: 'CustomGadgetRootExcelConfigData.json',
  // CustomGadgetSlotLevelTagConfigData: 'CustomGadgetSlotLevelTagConfigData.json',
  // CustomGadgetTabExcelConfigData: 'CustomGadgetTabExcelConfigData.json',
  // CustomGalleryProgressExcelConfigData:
  //   'CustomGalleryProgressExcelConfigData.json',
  // CustomGalleryTargetExcelConfigData: 'CustomGalleryTargetExcelConfigData.json',
  // CustomLevelComponentConfigData: 'CustomLevelComponentConfigData.json',
  // CustomLevelComponentLimitConfigData:
  //   'CustomLevelComponentLimitConfigData.json',
  // CustomLevelComponentTypeConfigData: 'CustomLevelComponentTypeConfigData.json',
  // CustomLevelDungeonConfigData: 'CustomLevelDungeonConfigData.json',
  // CustomLevelGroupConfigData: 'CustomLevelGroupConfigData.json',
  // CustomLevelTagConfigData: 'CustomLevelTagConfigData.json',
  // CustomLevelTagSortConfigData: 'CustomLevelTagSortConfigData.json',
  // CustomLevelUIConfigData: 'CustomLevelUIConfigData.json',
  // CutsceneExcelConfigData: 'CutsceneExcelConfigData.json',
  // DailyDungeonConfigData: 'DailyDungeonConfigData.json',
  // DailyTaskExcelConfigData: 'DailyTaskExcelConfigData.json',
  // DailyTaskLevelExcelConfigData: 'DailyTaskLevelExcelConfigData.json',
  // DailyTaskRewardExcelConfigData: 'DailyTaskRewardExcelConfigData.json',
  // DeathRegionLevelExcelConfigData: 'DeathRegionLevelExcelConfigData.json',
  // DeshretCatalogDataData: 'DeshretCatalogDataData.json',
  // DeshretObeliskArgumentExcelConfigData:
  //   'DeshretObeliskArgumentExcelConfigData.json',
  // DeshretPoiCatalogDataData: 'DeshretPoiCatalogDataData.json',
  // DeshretPushTipsCatalogDataData: 'DeshretPushTipsCatalogDataData.json',
  // DialogExcelConfigData: 'DialogExcelConfigData.json',
  // DialogSelectTimeOutExcelConfigData: 'DialogSelectTimeOutExcelConfigData.json',
  // DieTypeTipsExcelConfigData: 'DieTypeTipsExcelConfigData.json',
  // DigGroupLinkExcelConfigData: 'DigGroupLinkExcelConfigData.json',
  // DigOverAllExcelConfigData: 'DigOverAllExcelConfigData.json',
  // DigStageDataExcelConfigData: 'DigStageDataExcelConfigData.json',
  // DisplayItemExcelConfigData: 'DisplayItemExcelConfigData.json',
  // DocumentExcelConfigData: 'DocumentExcelConfigData.json',
  // DraftExcelConfigData: 'DraftExcelConfigData.json',
  // DraftTextDataExcelConfigData: 'DraftTextDataExcelConfigData.json',
  // DragonSpineEnhanceExcelConfigData: 'DragonSpineEnhanceExcelConfigData.json',
  // DragonSpineMissionExcelConfigData: 'DragonSpineMissionExcelConfigData.json',
  // DragonSpinePreviewExcelConfigData: 'DragonSpinePreviewExcelConfigData.json',
  // DragonSpineStageExcelConfigData: 'DragonSpineStageExcelConfigData.json',
  // DungeonChallengeConfigData: 'DungeonChallengeConfigData.json',
  // DungeonElementChallengeExcelConfigData:
  //   'DungeonElementChallengeExcelConfigData.json',
  DungeonEntryExcelConfigData: 'DungeonEntryExcelConfigData.json',
  // DungeonExcelConfigData: 'DungeonExcelConfigData.json',
  DungeonLevelEntityConfigData: 'DungeonLevelEntityConfigData.json',
  // DungeonMapAreaExcelConfigData: 'DungeonMapAreaExcelConfigData.json',
  // DungeonPassExcelConfigData: 'DungeonPassExcelConfigData.json',
  // DungeonRosterConfigData: 'DungeonRosterConfigData.json',
  // DungeonSerialConfigData: 'DungeonSerialConfigData.json',
  // DynamicInteractionExcelConfigData: 'DynamicInteractionExcelConfigData.json',
  // EchoShellExcelConfigData: 'EchoShellExcelConfigData.json',
  // EchoShellFloatSignalExcelConfigData:
  //   'EchoShellFloatSignalExcelConfigData.json',
  // EchoShellPreviewExcelConfigData: 'EchoShellPreviewExcelConfigData.json',
  // EchoShellRewardExcelConfigData: 'EchoShellRewardExcelConfigData.json',
  // EchoShellStoryExcelConfigData: 'EchoShellStoryExcelConfigData.json',
  // EchoShellSummerTimeDungeonExcelConfigData:
  //   'EchoShellSummerTimeDungeonExcelConfigData.json',
  // EffigyChallengeExcelConfigData: 'EffigyChallengeExcelConfigData.json',
  // EffigyChallengeV2DifficultyExcelConfigData:
  //   'EffigyChallengeV2DifficultyExcelConfigData.json',
  // EffigyChallengeV2ExcelConfigData: 'EffigyChallengeV2ExcelConfigData.json',
  // EffigyChallengeV2OverallExcelConfigData:
  //   'EffigyChallengeV2OverallExcelConfigData.json',
  // EffigyChallengeV2SkillExcelConfigData:
  //   'EffigyChallengeV2SkillExcelConfigData.json',
  // EffigyChallengeV2TagExcelConfigData:
  //   'EffigyChallengeV2TagExcelConfigData.json',
  // EffigyDifficultyExcelConfigData: 'EffigyDifficultyExcelConfigData.json',
  // EffigyLimitingConditionExcelConfigData:
  //   'EffigyLimitingConditionExcelConfigData.json',
  // EffigyRewardExcelConfigData: 'EffigyRewardExcelConfigData.json',
  // ElectroherculesBattleExcelConfigData:
  //   'ElectroherculesBattleExcelConfigData.json',
  // ElectroherculesBattleLevelExcelConfigData:
  //   'ElectroherculesBattleLevelExcelConfigData.json',
  // ElectroherculesBattleStageExcelConfigData:
  //   'ElectroherculesBattleStageExcelConfigData.json',
  // ElementCoeffExcelConfigData: 'ElementCoeffExcelConfigData.json',
  // ElementStateExcelConfigData: 'ElementStateExcelConfigData.json',
  // EmbeddedTextMapConfigData: 'EmbeddedTextMapConfigData.json',
  // EmojiDataExcelConfigData: 'EmojiDataExcelConfigData.json',
  // EmojiSetDataExcelConfigData: 'EmojiSetDataExcelConfigData.json',
  // EmotionTemplateExcelConfigData: 'EmotionTemplateExcelConfigData.json',
  // EndureTemplateExcelConfigData: 'EndureTemplateExcelConfigData.json',
  // EntityMultiPlayerExcelConfigData: 'EntityMultiPlayerExcelConfigData.json',
  // EnvAnimalGatherExcelConfigData: 'EnvAnimalGatherExcelConfigData.json',
  // EnvAnimalWeightExcelConfigData: 'EnvAnimalWeightExcelConfigData.json',
  // EpicCatalogShieldConfigData: 'EpicCatalogShieldConfigData.json',
  EquipAffixExcelConfigData: 'EquipAffixExcelConfigData.json',
  // ExhibitionCardExcelConfigData: 'ExhibitionCardExcelConfigData.json',
  // ExhibitionListExcelConfigData: 'ExhibitionListExcelConfigData.json',
  // ExhibitionScoreExcelConfigData: 'ExhibitionScoreExcelConfigData.json',
  // ExpeditionActivityMarkerExcelConfigData:
  //   'ExpeditionActivityMarkerExcelConfigData.json',
  // ExpeditionActivityPreviewExcelConfigData:
  //   'ExpeditionActivityPreviewExcelConfigData.json',
  // ExpeditionBonusExcelConfigData: 'ExpeditionBonusExcelConfigData.json',
  // ExpeditionChallengeExcelConfigData: 'ExpeditionChallengeExcelConfigData.json',
  // ExpeditionDataExcelConfigData: 'ExpeditionDataExcelConfigData.json',
  // ExpeditionDifficultyExcelConfigData:
  //   'ExpeditionDifficultyExcelConfigData.json',
  // ExpeditionPathExcelConfigData: 'ExpeditionPathExcelConfigData.json',
  // ExploreAreaTotalExpExcelConfigData: 'ExploreAreaTotalExpExcelConfigData.json',
  // ExploreExcelConfigData: 'ExploreExcelConfigData.json',
  // FeatureTagExcelConfigData: 'FeatureTagExcelConfigData.json',
  // FeatureTagGroupExcelConfigData: 'FeatureTagGroupExcelConfigData.json',
  // FetterCharacterCardExcelConfigData: 'FetterCharacterCardExcelConfigData.json',
  FetterInfoExcelConfigData: 'FetterInfoExcelConfigData.json',
  FettersExcelConfigData: 'FettersExcelConfigData.json',
  FetterStoryExcelConfigData: 'FetterStoryExcelConfigData.json',
  // FFV2PacmanStageExcelConfigData: 'FFV2PacmanStageExcelConfigData.json',
  // FindHilichurlAssignmentExcelConfigData:
  //   'FindHilichurlAssignmentExcelConfigData.json',
  // FindHilichurlExcelConfigData: 'FindHilichurlExcelConfigData.json',
  // FindHilichurlHiliWeiExcelConfigData:
  //   'FindHilichurlHiliWeiExcelConfigData.json',
  // FireworksExcelConfigData: 'FireworksExcelConfigData.json',
  // FireworksFactorExcelConfigData: 'FireworksFactorExcelConfigData.json',
  // FireworksLaunchExcelConfigData: 'FireworksLaunchExcelConfigData.json',
  // FireworksPushtipsExcelConfigData: 'FireworksPushtipsExcelConfigData.json',
  // FishBaitExcelConfigData: 'FishBaitExcelConfigData.json',
  // FishExcelConfigData: 'FishExcelConfigData.json',
  // FishPoolExcelConfigData: 'FishPoolExcelConfigData.json',
  // FishProficientExcelConfigData: 'FishProficientExcelConfigData.json',
  // FishRodExcelConfigData: 'FishRodExcelConfigData.json',
  // FishSkillExcelConfigData: 'FishSkillExcelConfigData.json',
  // FishStockExcelConfigData: 'FishStockExcelConfigData.json',
  // FleurFairBuffEnergyStatExcelConfigData:
  //   'FleurFairBuffEnergyStatExcelConfigData.json',
  // FleurFairChapterExcelConfigData: 'FleurFairChapterExcelConfigData.json',
  // FleurFairDungeonExcelConfigData: 'FleurFairDungeonExcelConfigData.json',
  // FleurFairDungeonStatExcelConfigData:
  //   'FleurFairDungeonStatExcelConfigData.json',
  // FleurFairMiniGameExcelConfigData: 'FleurFairMiniGameExcelConfigData.json',
  // FleurFairPreviewExcelConfigData: 'FleurFairPreviewExcelConfigData.json',
  // FleurFairTipsExcelConfigData: 'FleurFairTipsExcelConfigData.json',
  // FleurFairV2ExcelConfigData: 'FleurFairV2ExcelConfigData.json',
  // FlightActivityDayExcelConfigData: 'FlightActivityDayExcelConfigData.json',
  // FlightActivityExcelConfigData: 'FlightActivityExcelConfigData.json',
  // FlightActivityMedalExcelConfigData: 'FlightActivityMedalExcelConfigData.json',
  // ForgeExcelConfigData: 'ForgeExcelConfigData.json',
  // ForgeRandomExcelConfigData: 'ForgeRandomExcelConfigData.json',
  // ForgeUpdateExcelConfigData: 'ForgeUpdateExcelConfigData.json',
  // FungusBaseExcelConfigData: 'FungusBaseExcelConfigData.json',
  // FungusCampExcelConfigData: 'FungusCampExcelConfigData.json',
  // FungusCultivateExcelConfigData: 'FungusCultivateExcelConfigData.json',
  // FungusExcelConfigData: 'FungusExcelConfigData.json',
  // FungusFighterV2EnemyExcelConfigData:
  //   'FungusFighterV2EnemyExcelConfigData.json',
  // FungusFighterV2ExcelConfigData: 'FungusFighterV2ExcelConfigData.json',
  // FungusFighterV2MonsterExcelConfigData:
  //   'FungusFighterV2MonsterExcelConfigData.json',
  // FungusFighterV2OverallExcelConfigData:
  //   'FungusFighterV2OverallExcelConfigData.json',
  // FungusFighterV2SkillExcelConfigData:
  //   'FungusFighterV2SkillExcelConfigData.json',
  // FungusNameExcelConfigData: 'FungusNameExcelConfigData.json',
  // FungusPlotDungeonEnemyExcelConfigData:
  //   'FungusPlotDungeonEnemyExcelConfigData.json',
  // FungusPlotDungeonExcelConfigData: 'FungusPlotDungeonExcelConfigData.json',
  // FungusTrainingDungeonEnemyAffixExcelConfigData:
  //   'FungusTrainingDungeonEnemyAffixExcelConfigData.json',
  // FungusTrainingDungeonExcelConfigData:
  //   'FungusTrainingDungeonExcelConfigData.json',
  // FurnitureMakeExcelConfigData: 'FurnitureMakeExcelConfigData.json',
  // FurnitureSuiteExcelConfigData: 'FurnitureSuiteExcelConfigData.json',
  // GachaRestrictConfigData: 'GachaRestrictConfigData.json',
  // GadgetChainExcelConfigData: 'GadgetChainExcelConfigData.json',
  // GadgetCurveExcelConfigData: 'GadgetCurveExcelConfigData.json',
  // GadgetExcelConfigData: 'GadgetExcelConfigData.json',
  // GadgetGuestExcelConfigData: 'GadgetGuestExcelConfigData.json',
  // GadgetInteractExcelConfigData: 'GadgetInteractExcelConfigData.json',
  // GadgetPropExcelConfigData: 'GadgetPropExcelConfigData.json',
  // GadgetTitleExcelConfigData: 'GadgetTitleExcelConfigData.json',
  // GalleryExcelConfigData: 'GalleryExcelConfigData.json',
  // GatherBundleExcelConfigData: 'GatherBundleExcelConfigData.json',
  // GatherExcelConfigData: 'GatherExcelConfigData.json',
  // GCGBossLevelExcelConfigData: 'GCGBossLevelExcelConfigData.json',
  // GCGCardExcelConfigData: 'GCGCardExcelConfigData.json',
  // GCGCardFaceExcelConfigData: 'GCGCardFaceExcelConfigData.json',
  // GCGCardFilterExcelConfigData: 'GCGCardFilterExcelConfigData.json',
  // GCGCardViewExcelConfigData: 'GCGCardViewExcelConfigData.json',
  // GCGChallengeExcelConfigData: 'GCGChallengeExcelConfigData.json',
  // GCGCharacterLevelExcelConfigData: 'GCGCharacterLevelExcelConfigData.json',
  // GCGCharExcelConfigData: 'GCGCharExcelConfigData.json',
  // GCGChooseExcelConfigData: 'GCGChooseExcelConfigData.json',
  // GCGCostExcelConfigData: 'GCGCostExcelConfigData.json',
  // GCGDeckBackExcelConfigData: 'GCGDeckBackExcelConfigData.json',
  // GCGDeckCardExcelConfigData: 'GCGDeckCardExcelConfigData.json',
  // GCGDeckExcelConfigData: 'GCGDeckExcelConfigData.json',
  // GCGDeckFaceLinkExcelConfigData: 'GCGDeckFaceLinkExcelConfigData.json',
  // GCGDeckFieldExcelConfigData: 'GCGDeckFieldExcelConfigData.json',
  // GCGDeckStorageExcelConfigData: 'GCGDeckStorageExcelConfigData.json',
  // GCGElementExcelConfigData: 'GCGElementExcelConfigData.json',
  // GCGElementReactionExcelConfigData: 'GCGElementReactionExcelConfigData.json',
  // GCGGameExcelConfigData: 'GCGGameExcelConfigData.json',
  // GCGGameGroupExcelConfigData: 'GCGGameGroupExcelConfigData.json',
  // GCGGameRewardExcelConfigData: 'GCGGameRewardExcelConfigData.json',
  // GCGKeywordExcelConfigData: 'GCGKeywordExcelConfigData.json',
  // GCGLevelExcelConfigData: 'GCGLevelExcelConfigData.json',
  // GCGLevelLockExcelConfigData: 'GCGLevelLockExcelConfigData.json',
  // GCGMatchExcelConfigData: 'GCGMatchExcelConfigData.json',
  // GcgOtherLevelExcelConfigData: 'GcgOtherLevelExcelConfigData.json',
  // GCGProficiencyRewardExcelConfigData:
  //   'GCGProficiencyRewardExcelConfigData.json',
  // GCGQuestLevelExcelConfigData: 'GCGQuestLevelExcelConfigData.json',
  // GCGRuleExcelConfigData: 'GCGRuleExcelConfigData.json',
  // GCGRuleTextDetailExcelConfigData: 'GCGRuleTextDetailExcelConfigData.json',
  // GCGRuleTextExcelConfigData: 'GCGRuleTextExcelConfigData.json',
  // GCGSceneConstNpcExcelConfigData: 'GCGSceneConstNpcExcelConfigData.json',
  // GCGSceneDistributionExcelConfigData:
  //   'GCGSceneDistributionExcelConfigData.json',
  // GCGScenePointExcelConfigData: 'GCGScenePointExcelConfigData.json',
  // GCGShopSubTabExcelConfigData: 'GCGShopSubTabExcelConfigData.json',
  // GCGShopTabExcelConfigData: 'GCGShopTabExcelConfigData.json',
  // GCGSkillExcelConfigData: 'GCGSkillExcelConfigData.json',
  // GCGSkillTagExcelConfigData: 'GCGSkillTagExcelConfigData.json',
  // GCGStageExcelConfigData: 'GCGStageExcelConfigData.json',
  // GCGTableExcelConfigData: 'GCGTableExcelConfigData.json',
  // GCGTagExcelConfigData: 'GCGTagExcelConfigData.json',
  // GCGTalkDetailExcelConfigData: 'GCGTalkDetailExcelConfigData.json',
  // GCGTalkDetailIconExcelConfigData: 'GCGTalkDetailIconExcelConfigData.json',
  // GCGTalkExcelConfigData: 'GCGTalkExcelConfigData.json',
  // GCGTokenDescConfigData: 'GCGTokenDescConfigData.json',
  // GCGTutorialTextExcelConfigData: 'GCGTutorialTextExcelConfigData.json',
  // GCGWeekLevelExcelConfigData: 'GCGWeekLevelExcelConfigData.json',
  // GCGWeekRefreshExcelConfigData: 'GCGWeekRefreshExcelConfigData.json',
  // GCGWorldLevelExcelConfigData: 'GCGWorldLevelExcelConfigData.json',
  // GcgWorldWorkTimeExcelConfigData: 'GcgWorldWorkTimeExcelConfigData.json',
  // GeneralRewardExcelConfigData: 'GeneralRewardExcelConfigData.json',
  // GivingExcelConfigData: 'GivingExcelConfigData.json',
  // GivingGroupExcelConfigData: 'GivingGroupExcelConfigData.json',
  // GlobalWatcherConfigData: 'GlobalWatcherConfigData.json',
  // GravenInnocenceBossDataExcelConfigData:
  //   'GravenInnocenceBossDataExcelConfigData.json',
  // GravenInnocenceCampLevelExcelConfigData:
  //   'GravenInnocenceCampLevelExcelConfigData.json',
  // GravenInnocenceCampStageExcelConfigData:
  //   'GravenInnocenceCampStageExcelConfigData.json',
  // GravenInnocenceCarveOverallExcelConfigData:
  //   'GravenInnocenceCarveOverallExcelConfigData.json',
  // GravenInnocenceCarveStageExcelConfigData:
  //   'GravenInnocenceCarveStageExcelConfigData.json',
  // GravenInnocenceExcelConfigData: 'GravenInnocenceExcelConfigData.json',
  // GravenInnocenceObjectDataExcelConfigData:
  //   'GravenInnocenceObjectDataExcelConfigData.json',
  // GravenInnocencePhotoStageExcelConfigData:
  //   'GravenInnocencePhotoStageExcelConfigData.json',
  // GravenInnocenceRaceLevelExcelConfigData:
  //   'GravenInnocenceRaceLevelExcelConfigData.json',
  // GroupLinksBundleExcelConfigData: 'GroupLinksBundleExcelConfigData.json',
  // GroupLinksBundleRewardExcelConfigData:
  //   'GroupLinksBundleRewardExcelConfigData.json',
  // GroupTagExcelConfigData: 'GroupTagExcelConfigData.json',
  // GuideRatingExcelConfigData: 'GuideRatingExcelConfigData.json',
  // GuideTriggerExcelConfigData: 'GuideTriggerExcelConfigData.json',
  // H5ActivityExcelConfigData: 'H5ActivityExcelConfigData.json',
  // H5ActivityWatcherExcelConfigData: 'H5ActivityWatcherExcelConfigData.json',
  // HandbookMainQuestGuideExcelConfigData:
  //   'HandbookMainQuestGuideExcelConfigData.json',
  // HandbookQuestGuideExcelConfigData: 'HandbookQuestGuideExcelConfigData.json',
  // HandbookQuestGuideHintPicExcelConfigData:
  //   'HandbookQuestGuideHintPicExcelConfigData.json',
  // HideAndSeekAvatarSDExcelConfigData: 'HideAndSeekAvatarSDExcelConfigData.json',
  // HideAndSeekMatchExcelConfigData: 'HideAndSeekMatchExcelConfigData.json',
  // HideAndSeekSkillExcelConfigData: 'HideAndSeekSkillExcelConfigData.json',
  // HitLevelTemplateExcelConfigData: 'HitLevelTemplateExcelConfigData.json',
  // HomeworldAnimalExcelConfigData: 'HomeworldAnimalExcelConfigData.json',
  // HomeWorldAreaComfortExcelConfigData:
  //   'HomeWorldAreaComfortExcelConfigData.json',
  // HomeWorldBgmExcelConfigData: 'HomeWorldBgmExcelConfigData.json',
  // HomeWorldBlueprintSlotExcelConfigData:
  //   'HomeWorldBlueprintSlotExcelConfigData.json',
  // HomeWorldCameraExcelConfigData: 'HomeWorldCameraExcelConfigData.json',
  // HomeWorldComfortLevelExcelConfigData:
  //   'HomeWorldComfortLevelExcelConfigData.json',
  // HomeWorldCustomFurnitureSlotExcelConfigData:
  //   'HomeWorldCustomFurnitureSlotExcelConfigData.json',
  // HomeWorldEventExcelConfigData: 'HomeWorldEventExcelConfigData.json',
  // HomeWorldExtraFurnitureExcelConfigData:
  //   'HomeWorldExtraFurnitureExcelConfigData.json',
  // HomeWorldFarmFieldExcelConfigData: 'HomeWorldFarmFieldExcelConfigData.json',
  // HomeworldFurnitureDeployRulesetData:
  //   'HomeworldFurnitureDeployRulesetData.json',
  // HomeWorldFurnitureExcelConfigData: 'HomeWorldFurnitureExcelConfigData.json',
  // HomeWorldFurnitureTypeExcelConfigData:
  //   'HomeWorldFurnitureTypeExcelConfigData.json',
  // HomeWorldInteractiveNPCExcelConfigData:
  //   'HomeWorldInteractiveNPCExcelConfigData.json',
  // HomeWorldLeastShopExcelConfigData: 'HomeWorldLeastShopExcelConfigData.json',
  // HomeworldLevelExcelConfigData: 'HomeworldLevelExcelConfigData.json',
  // HomeWorldLimitShopExcelConfigData: 'HomeWorldLimitShopExcelConfigData.json',
  // HomeworldModuleExcelConfigData: 'HomeworldModuleExcelConfigData.json',
  // HomeWorldNPCExcelConfigData: 'HomeWorldNPCExcelConfigData.json',
  // HomeworldNPCExcelDataData: 'HomeworldNPCExcelDataData.json',
  // HomeWorldPlantExcelConfigData: 'HomeWorldPlantExcelConfigData.json',
  // HomeWorldServerGadgetExcelConfigData:
  //   'HomeWorldServerGadgetExcelConfigData.json',
  // HomeWorldShopSubTagExcelConfigData: 'HomeWorldShopSubTagExcelConfigData.json',
  // HomeWorldSpecialFurnitureExcelConfigData:
  //   'HomeWorldSpecialFurnitureExcelConfigData.json',
  // HomeWorldWoodExcelConfigData: 'HomeWorldWoodExcelConfigData.json',
  // HuntingClueGatherExcelConfigData: 'HuntingClueGatherExcelConfigData.json',
  // HuntingClueMonsterExcelConfigData: 'HuntingClueMonsterExcelConfigData.json',
  // HuntingClueTextExcelConfigData: 'HuntingClueTextExcelConfigData.json',
  // HuntingGroupInfoExcelConfigData: 'HuntingGroupInfoExcelConfigData.json',
  // HuntingMonsterExcelConfigData: 'HuntingMonsterExcelConfigData.json',
  // HuntingRefreshExcelConfigData: 'HuntingRefreshExcelConfigData.json',
  // HuntingRegionExcelConfigData: 'HuntingRegionExcelConfigData.json',
  // IconAdsorbEffectExcelConfigData: 'IconAdsorbEffectExcelConfigData.json',
  // ImageWorldExcelConfigData: 'ImageWorldExcelConfigData.json',
  // InferenceConclusionExcelConfigData: 'InferenceConclusionExcelConfigData.json',
  // InferenceFreestyleExcelConfigData: 'InferenceFreestyleExcelConfigData.json',
  // InferencePageExcelConfigData: 'InferencePageExcelConfigData.json',
  // InferenceWordExcelConfigData: 'InferenceWordExcelConfigData.json',
  // InstableSprayBuffExcelConfigData: 'InstableSprayBuffExcelConfigData.json',
  // InstableSprayDifficultyExcelConfigData:
  //   'InstableSprayDifficultyExcelConfigData.json',
  // InstableSprayLevelExcelConfigData: 'InstableSprayLevelExcelConfigData.json',
  // InstableSprayOverallExcelConfigData:
  //   'InstableSprayOverallExcelConfigData.json',
  // InstableSprayStageExcelConfigData: 'InstableSprayStageExcelConfigData.json',
  // InvestigationConfigData: 'InvestigationConfigData.json',
  // InvestigationDungeonConfigData: 'InvestigationDungeonConfigData.json',
  // InvestigationMonsterConfigData: 'InvestigationMonsterConfigData.json',
  // InvestigationTargetConfigData: 'InvestigationTargetConfigData.json',
  // IrodoriChessAffixExcelConfigData: 'IrodoriChessAffixExcelConfigData.json',
  // IrodoriChessCardExcelConfigData: 'IrodoriChessCardExcelConfigData.json',
  // IrodoriChessDisorderExcelConfigData:
  //   'IrodoriChessDisorderExcelConfigData.json',
  // IrodoriChessGearExcelConfigData: 'IrodoriChessGearExcelConfigData.json',
  // IrodoriChessLevelExcelConfigData: 'IrodoriChessLevelExcelConfigData.json',
  // IrodoriChessMapExcelConfigData: 'IrodoriChessMapExcelConfigData.json',
  // IrodoriChessMapPointExcelConfigData:
  //   'IrodoriChessMapPointExcelConfigData.json',
  // IrodoriExcelConfigData: 'IrodoriExcelConfigData.json',
  // IrodoriFlowerGroupExcelConfigData: 'IrodoriFlowerGroupExcelConfigData.json',
  // IrodoriFlowerThemeExcelConfigData: 'IrodoriFlowerThemeExcelConfigData.json',
  // IrodoriMasterExcelConfigData: 'IrodoriMasterExcelConfigData.json',
  // IrodoriMasterLevelExcelConfigData: 'IrodoriMasterLevelExcelConfigData.json',
  // IrodoriPoetryExcelConfigData: 'IrodoriPoetryExcelConfigData.json',
  // IrodoriPoetryLineExcelConfigData: 'IrodoriPoetryLineExcelConfigData.json',
  // IrodoriQuestExcelConfigData: 'IrodoriQuestExcelConfigData.json',
  // KeywordEasterEggExcelConfigData: 'KeywordEasterEggExcelConfigData.json',
  // KeywordEasterEggGroupExcelConfigData:
  //   'KeywordEasterEggGroupExcelConfigData.json',
  // LampContributionExcelConfigData: 'LampContributionExcelConfigData.json',
  // LampPhaseExcelConfigData: 'LampPhaseExcelConfigData.json',
  // LampProgressControlConfigData: 'LampProgressControlConfigData.json',
  // LampRegionDataConfigData: 'LampRegionDataConfigData.json',
  // LandSoundExcelConfigData: 'LandSoundExcelConfigData.json',
  // LanV2FireworksChallengeDataExcelConfigData:
  //   'LanV2FireworksChallengeDataExcelConfigData.json',
  // LanV2FireworksFactorDataExcelConfigData:
  //   'LanV2FireworksFactorDataExcelConfigData.json',
  // LanV2FireworksOverallDataExcelConfigData:
  //   'LanV2FireworksOverallDataExcelConfigData.json',
  // LanV2FireworksSkillDataExcelConfigData:
  //   'LanV2FireworksSkillDataExcelConfigData.json',
  // LanV2FireworksStageDataExcelConfigData:
  //   'LanV2FireworksStageDataExcelConfigData.json',
  // LanV2OverAllDataExcelConfigData: 'LanV2OverAllDataExcelConfigData.json',
  // LanV2ProjectionExcelConfigData: 'LanV2ProjectionExcelConfigData.json',
  // LanV2ProjectionLevelExcelConfigData:
  //   'LanV2ProjectionLevelExcelConfigData.json',
  // LanV2ProjectionStageExcelConfigData:
  //   'LanV2ProjectionStageExcelConfigData.json',
  // LanV2ProjectionSwitchButtonConfigData:
  //   'LanV2ProjectionSwitchButtonConfigData.json',
  // LanV3AvatarSelectExcelConfigData: 'LanV3AvatarSelectExcelConfigData.json',
  // LanV3BoatBaseExcelConfigData: 'LanV3BoatBaseExcelConfigData.json',
  // LanV3BoatExcelConfigData: 'LanV3BoatExcelConfigData.json',
  // LanV3CampLevelExcelConfigData: 'LanV3CampLevelExcelConfigData.json',
  // LanV3CampStageExcelConfigData: 'LanV3CampStageExcelConfigData.json',
  // LanV3OverAllExcelConfigData: 'LanV3OverAllExcelConfigData.json',
  // LanV3RaceExcelConfigData: 'LanV3RaceExcelConfigData.json',
  // LanV3ShadowCameraExcelConfigData: 'LanV3ShadowCameraExcelConfigData.json',
  // LanV3ShadowExcelConfigData: 'LanV3ShadowExcelConfigData.json',
  // LanV3ShadowLevelExcelConfigData: 'LanV3ShadowLevelExcelConfigData.json',
  // LanV3ShadowStageExcelConfigData: 'LanV3ShadowStageExcelConfigData.json',
  // LanV3TaskExcelConfigData: 'LanV3TaskExcelConfigData.json',
  // LevelSuppressExcelConfigData: 'LevelSuppressExcelConfigData.json',
  // LevelTagExcelConfigData: 'LevelTagExcelConfigData.json',
  // LevelTagGroupsExcelConfigData: 'LevelTagGroupsExcelConfigData.json',
  // LevelTagMapAreaConfigData: 'LevelTagMapAreaConfigData.json',
  // LevelTagResetExcelConfigData: 'LevelTagResetExcelConfigData.json',
  // LilouparDataData: 'LilouparDataData.json',
  // LimitRegionExcelConfigData: 'LimitRegionExcelConfigData.json',
  // LoadingCustomExcelConfigData: 'LoadingCustomExcelConfigData.json',
  // LoadingSituationExcelConfigData: 'LoadingSituationExcelConfigData.json',
  // LoadingTipsExcelConfigData: 'LoadingTipsExcelConfigData.json',
  // LocalizationExcelConfigData: 'LocalizationExcelConfigData.json',
  // LockTemplateExcelConfigData: 'LockTemplateExcelConfigData.json',
  // LuminanceStoneChallengeOverallExcelConfigData:
  //   'LuminanceStoneChallengeOverallExcelConfigData.json',
  // LuminanceStoneChallengeStageExcelConfigData:
  //   'LuminanceStoneChallengeStageExcelConfigData.json',
  // LunaRiteBattleBuffExcelConfigData: 'LunaRiteBattleBuffExcelConfigData.json',
  // LunaRiteBattleExcelConfigData: 'LunaRiteBattleExcelConfigData.json',
  // LunaRitePreviewExcelConfigData: 'LunaRitePreviewExcelConfigData.json',
  // LunaRiteQuestExcelConfigData: 'LunaRiteQuestExcelConfigData.json',
  // LunaRiteSearchingExcelConfigData: 'LunaRiteSearchingExcelConfigData.json',
  // MailExcelConfigData: 'MailExcelConfigData.json',
  // MainCoopExcelConfigData: 'MainCoopExcelConfigData.json',
  // MainQuestExcelConfigData: 'MainQuestExcelConfigData.json',
  ManualTextMapConfigData: 'ManualTextMapConfigData.json',
  // MapAreaConfigData: 'MapAreaConfigData.json',
  // MapTagDataConfigData: 'MapTagDataConfigData.json',
  // MatchExcelConfigData: 'MatchExcelConfigData.json',
  // MatchingTextDataExcelConfigData: 'MatchingTextDataExcelConfigData.json',
  // MatchNewRuleExcelConfigData: 'MatchNewRuleExcelConfigData.json',
  // MatchNewRuleSpecifiedExcelConfigData:
  //   'MatchNewRuleSpecifiedExcelConfigData.json',
  // MatchPunishExcelConfigData: 'MatchPunishExcelConfigData.json',
  // MaterialCodexExcelConfigData: 'MaterialCodexExcelConfigData.json',
  MaterialExcelConfigData: 'MaterialExcelConfigData.json',
  // MaterialSourceDataExcelConfigData: 'MaterialSourceDataExcelConfigData.json',
  // MechanicBuildingExcelConfigData: 'MechanicBuildingExcelConfigData.json',
  // MechanicusCardCurseExcelConfigData: 'MechanicusCardCurseExcelConfigData.json',
  // MechanicusCardEffectExcelConfigData:
  //   'MechanicusCardEffectExcelConfigData.json',
  // MechanicusCardExcelConfigData: 'MechanicusCardExcelConfigData.json',
  // MechanicusDifficultyExcelConfigData:
  //   'MechanicusDifficultyExcelConfigData.json',
  // MechanicusExcelConfigData: 'MechanicusExcelConfigData.json',
  // MechanicusGearLevelUpExcelConfigData:
  //   'MechanicusGearLevelUpExcelConfigData.json',
  // MechanicusMapExcelConfigData: 'MechanicusMapExcelConfigData.json',
  // MechanicusMapPointExcelConfigData: 'MechanicusMapPointExcelConfigData.json',
  // MechanicusSequenceExcelConfigData: 'MechanicusSequenceExcelConfigData.json',
  // MechanicusWatcherExcelConfigData: 'MechanicusWatcherExcelConfigData.json',
  // MichiaeAntiErosionExcelConfigData: 'MichiaeAntiErosionExcelConfigData.json',
  // MichiaeBattleSkillExcelConfigData: 'MichiaeBattleSkillExcelConfigData.json',
  // MichiaeBossChallengeExcelConfigData:
  //   'MichiaeBossChallengeExcelConfigData.json',
  // MichiaeDarkChallengeExcelConfigData:
  //   'MichiaeDarkChallengeExcelConfigData.json',
  // MichiaeErosionAreaExcelConfigData: 'MichiaeErosionAreaExcelConfigData.json',
  // MichiaeErosionMapExcelConfigData: 'MichiaeErosionMapExcelConfigData.json',
  // MichiaeOfferingDataExcelConfigData: 'MichiaeOfferingDataExcelConfigData.json',
  // MichiaeOverallExcelConfigData: 'MichiaeOverallExcelConfigData.json',
  // MichiaePreviewExcelConfigData: 'MichiaePreviewExcelConfigData.json',
  // MichiaeRadarExcelConfigData: 'MichiaeRadarExcelConfigData.json',
  // MichiaeStageExcelConfigData: 'MichiaeStageExcelConfigData.json',
  // MichiaeWatcherExcelConfigData: 'MichiaeWatcherExcelConfigData.json',
  // MiracleRingDropExcelConfigData: 'MiracleRingDropExcelConfigData.json',
  // MiracleRingExcelConfigData: 'MiracleRingExcelConfigData.json',
  // MonsterAffixExcelConfigData: 'MonsterAffixExcelConfigData.json',
  MonsterCurveExcelConfigData: 'MonsterCurveExcelConfigData.json',
  MonsterDescribeExcelConfigData: 'MonsterDescribeExcelConfigData.json',
  MonsterExcelConfigData: 'MonsterExcelConfigData.json',
  //MonsterMultiPlayerExcelConfigData: 'MonsterMultiPlayerExcelConfigData.json',
  // MonsterRelationshipExcelConfigData: 'MonsterRelationshipExcelConfigData.json',
  // MonsterRelOverloadExcelConfigData: 'MonsterRelOverloadExcelConfigData.json',
  // MonsterSpecialNameExcelConfigData: 'MonsterSpecialNameExcelConfigData.json',
  // MonsterTitleExcelConfigData: 'MonsterTitleExcelConfigData.json',
  // MoonfinTrialExcelConfigData: 'MoonfinTrialExcelConfigData.json',
  // MoonfinTrialLevelExcelConfigData: 'MoonfinTrialLevelExcelConfigData.json',
  // MpPlayAbilityGroupExcelConfigData: 'MpPlayAbilityGroupExcelConfigData.json',
  // MpPlayBuffExcelConfigData: 'MpPlayBuffExcelConfigData.json',
  // MpPlayGroupExcelConfigData: 'MpPlayGroupExcelConfigData.json',
  // MpPlayLevelTextDataExcelConfigData: 'MpPlayLevelTextDataExcelConfigData.json',
  // MpPlayMatchExcelConfigData: 'MpPlayMatchExcelConfigData.json',
  // MpPlayScoreExcelConfigData: 'MpPlayScoreExcelConfigData.json',
  // MpPlayStatisticConfigData: 'MpPlayStatisticConfigData.json',
  // MpPlayTextDataExcelConfigData: 'MpPlayTextDataExcelConfigData.json',
  // MpPlayWatcherConfigData: 'MpPlayWatcherConfigData.json',
  // MultistageExcelConfigData: 'MultistageExcelConfigData.json',
  // MusicGameBasicConfigData: 'MusicGameBasicConfigData.json',
  // MusicGameDrumConfigData: 'MusicGameDrumConfigData.json',
  // MusicGamePositionConfigData: 'MusicGamePositionConfigData.json',
  // MusicGamePreviewConfigData: 'MusicGamePreviewConfigData.json',
  // MusicInfoConfigData: 'MusicInfoConfigData.json',
  // MusicInstrumentConfigData: 'MusicInstrumentConfigData.json',
  // MusicRiddleConfigData: 'MusicRiddleConfigData.json',
  // MusicRiddlePlayConfigData: 'MusicRiddlePlayConfigData.json',
  // NewActivityAvatarSelectionExcelConfigData:
  //   'NewActivityAvatarSelectionExcelConfigData.json',
  // NewActivityCondExcelConfigData: 'NewActivityCondExcelConfigData.json',
  // NewActivityEntryConfigData: 'NewActivityEntryConfigData.json',
  // NewActivityExcelConfigData: 'NewActivityExcelConfigData.json',
  // NewActivityMainQuestDataExcelConfigData:
  //   'NewActivityMainQuestDataExcelConfigData.json',
  // NewActivityOverlapExcelConfigData: 'NewActivityOverlapExcelConfigData.json',
  // NewActivityPreviewConfigData: 'NewActivityPreviewConfigData.json',
  // NewActivityPushTipsConfigData: 'NewActivityPushTipsConfigData.json',
  // NewActivitySaleExcelConfigData: 'NewActivitySaleExcelConfigData.json',
  // NewActivityScoreLimitExcelConfigData:
  //   'NewActivityScoreLimitExcelConfigData.json',
  // NewActivityScoreRewardExcelConfigData:
  //   'NewActivityScoreRewardExcelConfigData.json',
  // NewActivityScoreShowExcelConfigData:
  //   'NewActivityScoreShowExcelConfigData.json',
  // NewActivityTimeGroupExcelConfigData:
  //   'NewActivityTimeGroupExcelConfigData.json',
  // NewActivityWatcherConfigData: 'NewActivityWatcherConfigData.json',
  // NightCrowArgumentExcelConfigData: 'NightCrowArgumentExcelConfigData.json',
  // NpcCrowdExcelConfigData: 'NpcCrowdExcelConfigData.json',
  // NpcExcelConfigData: 'NpcExcelConfigData.json',
  // NpcFirstMetExcelConfigData: 'NpcFirstMetExcelConfigData.json',
  // OfferingLevelUpExcelConfigData: 'OfferingLevelUpExcelConfigData.json',
  // OfferingLumenStoneExcelConfigData: 'OfferingLumenStoneExcelConfigData.json',
  // OfferingOpenStateConfigData: 'OfferingOpenStateConfigData.json',
  // OfferingPariExcelConfigData: 'OfferingPariExcelConfigData.json',
  // OfferingVersionExcelConfigData: 'OfferingVersionExcelConfigData.json',
  // OpActivityBonusExcelConfigData: 'OpActivityBonusExcelConfigData.json',
  // OpActivityExcelConfigData: 'OpActivityExcelConfigData.json',
  // OpenStateConfigData: 'OpenStateConfigData.json',
  // OptionExcelConfigData: 'OptionExcelConfigData.json',
  // OraionokamiDataExcelConfigData: 'OraionokamiDataExcelConfigData.json',
  // OraionokamiDescExcelConfigData: 'OraionokamiDescExcelConfigData.json',
  // OverflowTransformExcelConfigData: 'OverflowTransformExcelConfigData.json',
  // PartnerCurveExcelConfigData: 'PartnerCurveExcelConfigData.json',
  // PassCatalogDataData: 'PassCatalogDataData.json',
  // PerceptionTemplateExcelConfigData: 'PerceptionTemplateExcelConfigData.json',
  // PersonalLineActivityExcelConfigData:
  //   'PersonalLineActivityExcelConfigData.json',
  // PersonalLineExcelConfigData: 'PersonalLineExcelConfigData.json',
  // PhotographCheckAnimatorDataData: 'PhotographCheckAnimatorDataData.json',
  // PhotographExpressionExcelConfigData:
  //   'PhotographExpressionExcelConfigData.json',
  // PhotographPoseExcelConfigData: 'PhotographPoseExcelConfigData.json',
  // PhotographPosenameExcelConfigData: 'PhotographPosenameExcelConfigData.json',
  // PhotographTaskData: 'PhotographTaskData.json',
  // PlaceNameConfigData: 'PlaceNameConfigData.json',
  // PlayerLevelExcelConfigData: 'PlayerLevelExcelConfigData.json',
  // PlayerLevelLockExcelConfigData: 'PlayerLevelLockExcelConfigData.json',
  // PriceTierConfigData: 'PriceTierConfigData.json',
  // ProductAppleGiftCardDetailConfigData:
  //   'ProductAppleGiftCardDetailConfigData.json',
  // ProductCardDetailConfigData: 'ProductCardDetailConfigData.json',
  // ProductConcertPackageDetailConfigData:
  //   'ProductConcertPackageDetailConfigData.json',
  // ProductGoogleGiftCardDetailConfigData:
  //   'ProductGoogleGiftCardDetailConfigData.json',
  // ProductIdConfigData: 'ProductIdConfigData.json',
  // ProductMcoinDetailConfigData: 'ProductMcoinDetailConfigData.json',
  // ProductPlayDetailConfigData: 'ProductPlayDetailConfigData.json',
  // ProductPS4PackageDetailConfigData: 'ProductPS4PackageDetailConfigData.json',
  // ProductPsnCompensationDetailConfigData:
  //   'ProductPsnCompensationDetailConfigData.json',
  ProudSkillExcelConfigData: 'ProudSkillExcelConfigData.json',
  ProfilePictureExcelConfigData: 'ProfilePictureExcelConfigData.json',
  // PS4GroupExcelConfigData: 'PS4GroupExcelConfigData.json',
  // PS5GroupExcelConfigData: 'PS5GroupExcelConfigData.json',
  // PSActivitiesActivityConfigData: 'PSActivitiesActivityConfigData.json',
  // PSActivitiesSubTaskConfigData: 'PSActivitiesSubTaskConfigData.json',
  // PSActivitiesTaskConfigData: 'PSActivitiesTaskConfigData.json',
  // PushTipsCodexExcelConfigData: 'PushTipsCodexExcelConfigData.json',
  // PushTipsConfigData: 'PushTipsConfigData.json',
  // QTEExcelConfigData: 'QTEExcelConfigData.json',
  // QTEStepExcelConfigData: 'QTEStepExcelConfigData.json',
  // QuestAcceptionMarkExcelConfigData: 'QuestAcceptionMarkExcelConfigData.json',
  // QuestCatalogExcelConfigData: 'QuestCatalogExcelConfigData.json',
  // QuestCatalogGuideExcelConfigData: 'QuestCatalogGuideExcelConfigData.json',
  // QuestCodexExcelConfigData: 'QuestCodexExcelConfigData.json',
  // QuestDialogDecoratorExcelConfigData:
  //   'QuestDialogDecoratorExcelConfigData.json',
  // QuestExcelConfigData: 'QuestExcelConfigData.json',
  // QuestGlobalVarConfigData: 'QuestGlobalVarConfigData.json',
  // QuestPlaceConfigData: 'QuestPlaceConfigData.json',
  // QuestResCollectionExcelConfigData: 'QuestResCollectionExcelConfigData.json',
  // QuestSpecialShowConfigData: 'QuestSpecialShowConfigData.json',
  // QuestSummarizationTextExcelConfigData:
  //   'QuestSummarizationTextExcelConfigData.json',
  // RadarHintExcelConfigData: 'RadarHintExcelConfigData.json',
  // RandomCompoundDisplayExcelConfigData:
  //   'RandomCompoundDisplayExcelConfigData.json',
  // RandomMainQuestExcelConfigData: 'RandomMainQuestExcelConfigData.json',
  // RandomQuestElemPoolExcelConfigData: 'RandomQuestElemPoolExcelConfigData.json',
  // RandomQuestEntranceExcelConfigData: 'RandomQuestEntranceExcelConfigData.json',
  // RandomQuestExcelConfigData: 'RandomQuestExcelConfigData.json',
  // RandomQuestTemplateExcelConfigData: 'RandomQuestTemplateExcelConfigData.json',
  // RandTaskExcelConfigData: 'RandTaskExcelConfigData.json',
  // RandTaskLevelConfigData: 'RandTaskLevelConfigData.json',
  // RandTaskRewardConfigData: 'RandTaskRewardConfigData.json',
  // ReactionEnergyExcelConfigData: 'ReactionEnergyExcelConfigData.json',
  // RefreshIndexExcelConfigData: 'RefreshIndexExcelConfigData.json',
  // RefreshPolicyExcelConfigData: 'RefreshPolicyExcelConfigData.json',
  // RegionSearchCondExcelConfigData: 'RegionSearchCondExcelConfigData.json',
  // RegionSearchExcelConfigData: 'RegionSearchExcelConfigData.json',
  // RegionSearchRegionExcelConfigData: 'RegionSearchRegionExcelConfigData.json',
  ReliquaryAffixExcelConfigData: 'ReliquaryAffixExcelConfigData.json',
  // ReliquaryCodexExcelConfigData: 'ReliquaryCodexExcelConfigData.json',
  // ReliquaryDecomposeExcelConfigData: 'ReliquaryDecomposeExcelConfigData.json',
  ReliquaryExcelConfigData: 'ReliquaryExcelConfigData.json',
  ReliquaryLevelExcelConfigData: 'ReliquaryLevelExcelConfigData.json',
  ReliquaryMainPropExcelConfigData: 'ReliquaryMainPropExcelConfigData.json',
  // ReliquaryPowerupExcelConfigData: 'ReliquaryPowerupExcelConfigData.json',
  ReliquarySetExcelConfigData: 'ReliquarySetExcelConfigData.json',
  // ReminderExcelConfigData: 'ReminderExcelConfigData.json',
  // ReminderIndexExcelConfigData: 'ReminderIndexExcelConfigData.json',
  // ReputationCityExcelConfigData: 'ReputationCityExcelConfigData.json',
  // ReputationEntranceExcelConfigData: 'ReputationEntranceExcelConfigData.json',
  // ReputationExploreExcelConfigData: 'ReputationExploreExcelConfigData.json',
  // ReputationFunctionExcelConfigData: 'ReputationFunctionExcelConfigData.json',
  // ReputationLevelExcelConfigData: 'ReputationLevelExcelConfigData.json',
  // ReputationQuestExcelConfigData: 'ReputationQuestExcelConfigData.json',
  // ReputationRequestExcelConfigData: 'ReputationRequestExcelConfigData.json',
  // ReunionCommercialExcelConfigData: 'ReunionCommercialExcelConfigData.json',
  // ReunionGuideExcelConfigData: 'ReunionGuideExcelConfigData.json',
  // ReunionMissionExcelConfigData: 'ReunionMissionExcelConfigData.json',
  // ReunionPrivilegeExcelConfigData: 'ReunionPrivilegeExcelConfigData.json',
  // ReunionScheduleExcelConfigData: 'ReunionScheduleExcelConfigData.json',
  // ReunionSignInExcelConfigData: 'ReunionSignInExcelConfigData.json',
  // ReunionWatcherExcelConfigData: 'ReunionWatcherExcelConfigData.json',
  // ReviseLevelGrowExcelConfigData: 'ReviseLevelGrowExcelConfigData.json',
  // RewardExcelConfigData: 'RewardExcelConfigData.json',
  // RewardPreviewExcelConfigData: 'RewardPreviewExcelConfigData.json',
  // RogueCellWeightExcelConfigData: 'RogueCellWeightExcelConfigData.json',
  // RogueDiaryBuffDataExcelConfigData: 'RogueDiaryBuffDataExcelConfigData.json',
  // RogueDiaryCardWeightExcelConfigData:
  //   'RogueDiaryCardWeightExcelConfigData.json',
  // RogueDiaryDungeonExcelConfigData: 'RogueDiaryDungeonExcelConfigData.json',
  // RogueDiaryPreviewExcelConfigData: 'RogueDiaryPreviewExcelConfigData.json',
  // RogueDiaryQuestExcelConfigData: 'RogueDiaryQuestExcelConfigData.json',
  // RogueDiaryResourceExcelConfigData: 'RogueDiaryResourceExcelConfigData.json',
  // RogueDiaryRoomExcelConfigData: 'RogueDiaryRoomExcelConfigData.json',
  // RogueDiaryRoundRoomExcelConfigData: 'RogueDiaryRoundRoomExcelConfigData.json',
  // RogueDiaryStageExcelConfigData: 'RogueDiaryStageExcelConfigData.json',
  // RogueDungeonCellExcelConfigData: 'RogueDungeonCellExcelConfigData.json',
  // RogueGadgetExcelConfigData: 'RogueGadgetExcelConfigData.json',
  // RogueGadgetRotConfigData: 'RogueGadgetRotConfigData.json',
  // RoguelikeCardExcelConfigData: 'RoguelikeCardExcelConfigData.json',
  // RoguelikeCurseExcelConfigData: 'RoguelikeCurseExcelConfigData.json',
  // RoguelikeCursePoolExcelConfigData: 'RoguelikeCursePoolExcelConfigData.json',
  // RoguelikeRuneExcelConfigData: 'RoguelikeRuneExcelConfigData.json',
  // RoguelikeShikigamiExcelConfigData: 'RoguelikeShikigamiExcelConfigData.json',
  // RoguelikeShikigamiGroupExcelConfigData:
  //   'RoguelikeShikigamiGroupExcelConfigData.json',
  // RogueMonsterPoolExcelConfigData: 'RogueMonsterPoolExcelConfigData.json',
  // RogueSequenceExcelConfigData: 'RogueSequenceExcelConfigData.json',
  // RogueStageExcelConfigData: 'RogueStageExcelConfigData.json',
  // RogueTokenExcelConfigData: 'RogueTokenExcelConfigData.json',
  // RoomExcelConfigData: 'RoomExcelConfigData.json',
  // RoomWeatherExcelConfigData: 'RoomWeatherExcelConfigData.json',
  // RoutineDetailExcelConfigData: 'RoutineDetailExcelConfigData.json',
  // RoutineTypeExcelConfigData: 'RoutineTypeExcelConfigData.json',
  // RqTalkExcelConfigData: 'RqTalkExcelConfigData.json',
  // SalvageChallengeDataExcelConfigData:
  //   'SalvageChallengeDataExcelConfigData.json',
  // SalvageOverAllExcelConfigData: 'SalvageOverAllExcelConfigData.json',
  // SalvageStageDataExcelConfigData: 'SalvageStageDataExcelConfigData.json',
  // SalvageTypeDataExcelConfigData: 'SalvageTypeDataExcelConfigData.json',
  // SceneExcelConfigData: 'SceneExcelConfigData.json',
  // SceneTagConfigData: 'SceneTagConfigData.json',
  // SeaLampSectionExcelConfigData: 'SeaLampSectionExcelConfigData.json',
  // SeaLampSectionMainQuestExcelConfigData:
  //   'SeaLampSectionMainQuestExcelConfigData.json',
  // SeaLampSectionMiniQuestExcelConfigData:
  //   'SeaLampSectionMiniQuestExcelConfigData.json',
  // SensitiveWordConfigData: 'SensitiveWordConfigData.json',
  // ServerMessageExcelConfigData: 'ServerMessageExcelConfigData.json',
  // ShareCDExcelConfigData: 'ShareCDExcelConfigData.json',
  // ShopExcelConfigData: 'ShopExcelConfigData.json',
  // ShopGoodsExcelConfigData: 'ShopGoodsExcelConfigData.json',
  // ShopmallEntranceExcelConfigData: 'ShopmallEntranceExcelConfigData.json',
  // ShopmallGoodsSaleConfigData: 'ShopmallGoodsSaleConfigData.json',
  // ShopmallRecommendConfigData: 'ShopmallRecommendConfigData.json',
  // ShopmallSubTabExcelConfigData: 'ShopmallSubTabExcelConfigData.json',
  // ShopMaterialOrderExcelConfigData: 'ShopMaterialOrderExcelConfigData.json',
  // ShopRotateExcelConfigData: 'ShopRotateExcelConfigData.json',
  // ShopSheetExcelConfigData: 'ShopSheetExcelConfigData.json',
  // ShopSpecialKeysDataExcelConfigData: 'ShopSpecialKeysDataExcelConfigData.json',
  // SignInCondExcelConfigData: 'SignInCondExcelConfigData.json',
  // SignInDayExcelConfigData: 'SignInDayExcelConfigData.json',
  // SignInPeriodExcelConfigData: 'SignInPeriodExcelConfigData.json',
  // SorushTrialBaseExcelConfigData: 'SorushTrialBaseExcelConfigData.json',
  // SorushTrialHitmanGalleryExcelConfigData:
  //   'SorushTrialHitmanGalleryExcelConfigData.json',
  // SorushTrialHitmanSurveyExcelConfigData:
  //   'SorushTrialHitmanSurveyExcelConfigData.json',
  // SorushTrialPhotoMatchGalleryExcelConfigData:
  //   'SorushTrialPhotoMatchGalleryExcelConfigData.json',
  // SorushTrialQuestExcelConfigData: 'SorushTrialQuestExcelConfigData.json',
  // SorushTrialRaceGalleryExcelConfigData:
  //   'SorushTrialRaceGalleryExcelConfigData.json',
  // SorushTrialSorushSurveyExcelConfigData:
  //   'SorushTrialSorushSurveyExcelConfigData.json',
  // SorushTrialStageDetailExcelConfigData:
  //   'SorushTrialStageDetailExcelConfigData.json',
  // SorushTrialStageExcelConfigData: 'SorushTrialStageExcelConfigData.json',
  // SpriteTagExcelConfigData: 'SpriteTagExcelConfigData.json',
  // StateExcelConfigData: 'StateExcelConfigData.json',
  // StrengthenBasePointExcelConfigData: 'StrengthenBasePointExcelConfigData.json',
  // SubQuestCatalogExcelConfigData: 'SubQuestCatalogExcelConfigData.json',
  // SubSpriteTagExcelConfigData: 'SubSpriteTagExcelConfigData.json',
  // SummerTimeV2BoatStageExcelConfigData:
  //   'SummerTimeV2BoatStageExcelConfigData.json',
  // SummerTimeV2DungeonStageExcelConfigData:
  //   'SummerTimeV2DungeonStageExcelConfigData.json',
  // SummerTimeV2OverallExcelConfigData: 'SummerTimeV2OverallExcelConfigData.json',
  // SystemOpenUIConfigData: 'SystemOpenUIConfigData.json',
  // TalkExcelConfigData: 'TalkExcelConfigData.json',
  // TalkSelectTimeOutExcelConfigData: 'TalkSelectTimeOutExcelConfigData.json',
  // TauntLevelTemplateExcelConfigData: 'TauntLevelTemplateExcelConfigData.json',
  // TeamChainBuffExcelConfigData: 'TeamChainBuffExcelConfigData.json',
  // TeamChainDifficultyExcelConfigData: 'TeamChainDifficultyExcelConfigData.json',
  // TeamChainExcelConfigData: 'TeamChainExcelConfigData.json',
  // TeamChainOverallExcelConfigData: 'TeamChainOverallExcelConfigData.json',
  // TeamResonanceExcelConfigData: 'TeamResonanceExcelConfigData.json',
  // TemplateReminderExcelConfigData: 'TemplateReminderExcelConfigData.json',
  // TowerBuffExcelConfigData: 'TowerBuffExcelConfigData.json',
  TowerFloorExcelConfigData: 'TowerFloorExcelConfigData.json',
  TowerLevelExcelConfigData: 'TowerLevelExcelConfigData.json',
  //TowerRewardExcelConfigData: 'TowerRewardExcelConfigData.json',
  TowerScheduleExcelConfigData: 'TowerScheduleExcelConfigData.json',
  // TowerSkipFloorExcelConfigData: 'TowerSkipFloorExcelConfigData.json',
  // TransPointRewardConfigData: 'TransPointRewardConfigData.json',
  // TravelCatalogExcelConfigData: 'TravelCatalogExcelConfigData.json',
  // TreasureMapBonusRegionExcelConfigData:
  //   'TreasureMapBonusRegionExcelConfigData.json',
  // TreasureMapExcelConfigData: 'TreasureMapExcelConfigData.json',
  // TreasureMapRegionExcelConfigData: 'TreasureMapRegionExcelConfigData.json',
  // TreasureSeelieExcelConfigData: 'TreasureSeelieExcelConfigData.json',
  // TreasureSeelieRegionExcelConfigData:
  //   'TreasureSeelieRegionExcelConfigData.json',
  // TreeDropExcelConfigData: 'TreeDropExcelConfigData.json',
  // TreeTypeExcelConfigData: 'TreeTypeExcelConfigData.json',
  // TrialAvatarActivityDataExcelConfigData:
  //   'TrialAvatarActivityDataExcelConfigData.json',
  // TrialAvatarActivityExcelConfigData: 'TrialAvatarActivityExcelConfigData.json',
  // TrialAvatarExcelConfigData: 'TrialAvatarExcelConfigData.json',
  // TrialAvatarFetterDataConfigData: 'TrialAvatarFetterDataConfigData.json',
  // TrialAvatarTemplateExcelConfigData: 'TrialAvatarTemplateExcelConfigData.json',
  // TrialReliquaryExcelConfigData: 'TrialReliquaryExcelConfigData.json',
  // TriggerExcelConfigData: 'TriggerExcelConfigData.json',
  // TutorialCatalogExcelConfigData: 'TutorialCatalogExcelConfigData.json',
  // TutorialDetailExcelConfigData: 'TutorialDetailExcelConfigData.json',
  // TutorialExcelConfigData: 'TutorialExcelConfigData.json',
  // UidOpNotifyExcelConfigData: 'UidOpNotifyExcelConfigData.json',
  // UIInteractExcelConfigData: 'UIInteractExcelConfigData.json',
  // VehicleBasicDataExcelConfigData: 'VehicleBasicDataExcelConfigData.json',
  // VehicleMarkExcelConfigData: 'VehicleMarkExcelConfigData.json',
  // VehicleSkillDepotExcelConfigData: 'VehicleSkillDepotExcelConfigData.json',
  // VehicleSkillExcelConfigData: 'VehicleSkillExcelConfigData.json',
  // ViewCodexExcelConfigData: 'ViewCodexExcelConfigData.json',
  // VintageMarketAttrFactorExcelConfigData:
  //   'VintageMarketAttrFactorExcelConfigData.json',
  // VintageMarketAttrRandomTemplateExcelConfigData:
  //   'VintageMarketAttrRandomTemplateExcelConfigData.json',
  // VintageMarketAttrUpgradeExcelConfigData:
  //   'VintageMarketAttrUpgradeExcelConfigData.json',
  // VintageMarketBargainExcelConfigData:
  //   'VintageMarketBargainExcelConfigData.json',
  // VintageMarketConstValueExcelConfigData:
  //   'VintageMarketConstValueExcelConfigData.json',
  // VintageMarketDealExcelConfigData: 'VintageMarketDealExcelConfigData.json',
  // VintageMarketEnvEventExcelConfigData:
  //   'VintageMarketEnvEventExcelConfigData.json',
  // VintageMarketEventExcelConfigData: 'VintageMarketEventExcelConfigData.json',
  // VintageMarketHelpSkillExcelConfigData:
  //   'VintageMarketHelpSkillExcelConfigData.json',
  // VintageMarketNpcEventExcelConfigData:
  //   'VintageMarketNpcEventExcelConfigData.json',
  // VintageMarketRoundExcelConfigData: 'VintageMarketRoundExcelConfigData.json',
  // VintageMarketSkillExcelConfigData: 'VintageMarketSkillExcelConfigData.json',
  // VintageMarketStoreExcelConfigData: 'VintageMarketStoreExcelConfigData.json',
  // WeaponCodexExcelConfigData: 'WeaponCodexExcelConfigData.json',
  WeaponCurveExcelConfigData: 'WeaponCurveExcelConfigData.json',
  WeaponExcelConfigData: 'WeaponExcelConfigData.json',
  // WeaponLevelExcelConfigData: 'WeaponLevelExcelConfigData.json',
  WeaponPromoteExcelConfigData: 'WeaponPromoteExcelConfigData.json',
  // WeatherExcelConfigData: 'WeatherExcelConfigData.json',
  // WeatherTemplateExcelConfigData: 'WeatherTemplateExcelConfigData.json',
  // WidgetActiveExcelConfigData: 'WidgetActiveExcelConfigData.json',
  // WidgetCameraExcelConfigData: 'WidgetCameraExcelConfigData.json',
  // WidgetCameraScanExcelConfigData: 'WidgetCameraScanExcelConfigData.json',
  // WidgetExcelConfigData: 'WidgetExcelConfigData.json',
  // WidgetGeneralExcelConfigData: 'WidgetGeneralExcelConfigData.json',
  // WidgetUseableExcelConfigData: 'WidgetUseableExcelConfigData.json',
  // WindFieldShowChallengeExcelConfigData:
  //   'WindFieldShowChallengeExcelConfigData.json',
  // WindFieldStageExcelConfigData: 'WindFieldStageExcelConfigData.json',
  // WinterCampBattleExcelConfigData: 'WinterCampBattleExcelConfigData.json',
  // WinterCampExcelConfigData: 'WinterCampExcelConfigData.json',
  // WinterCampExploreExcelConfigData: 'WinterCampExploreExcelConfigData.json',
  // WinterCampRaceExcelConfigData: 'WinterCampRaceExcelConfigData.json',
  // WinterCampRaceItemTipsExcelConfigData:
  //   'WinterCampRaceItemTipsExcelConfigData.json',
  // WinterCampSnowmanDetailExcelConfigData:
  //   'WinterCampSnowmanDetailExcelConfigData.json',
  // WinterCampSnowmanExcelConfigData: 'WinterCampSnowmanExcelConfigData.json',
  // WorldAreaConfigData: 'WorldAreaConfigData.json',
  // WorldAreaExploreEventConfigData: 'WorldAreaExploreEventConfigData.json',
  // WorldAreaLevelupConfigData: 'WorldAreaLevelupConfigData.json',
  // WorldExcelConfigData: 'WorldExcelConfigData.json',
  // WorldLevelExcelConfigData: 'WorldLevelExcelConfigData.json',
} as const

/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Cache structure type mapping for processed game data
 */
export interface CacheStructureMap {
  /**
   * Animal codex entries mapped by describe ID
   */
  AnimalCodexExcelConfigData: Record<
    string,
    MasterFileMap['AnimalCodexExcelConfigData'] | undefined
  >

  /**
   * Avatar costume data mapped by skin ID
   */
  AvatarCostumeExcelConfigData: Record<
    string,
    MasterFileMap['AvatarCostumeExcelConfigData'] | undefined
  >

  /**
   * Avatar stat curve data indexed by type then level
   */
  AvatarCurveExcelConfigData: Record<string, Record<number, number>>

  /**
   * Avatar base data mapped by character ID
   */
  AvatarExcelConfigData: Record<
    string,
    MasterFileMap['AvatarExcelConfigData'] | undefined
  >

  /**
   * Avatar ascension data nested by promote ID and level
   */
  AvatarPromoteExcelConfigData: Record<
    string,
    Record<string, MasterFileMap['AvatarPromoteExcelConfigData'] | undefined>
  >

  /**
   * Avatar skill depot configurations mapped by ID
   */
  AvatarSkillDepotExcelConfigData: Record<
    string,
    MasterFileMap['AvatarSkillDepotExcelConfigData'] | undefined
  >

  /**
   * Avatar skill definitions mapped by skill ID
   */
  AvatarSkillExcelConfigData: Record<
    string,
    MasterFileMap['AvatarSkillExcelConfigData'] | undefined
  >

  /**
   * Avatar talent data mapped by talent ID
   */
  AvatarTalentExcelConfigData: Record<
    string,
    MasterFileMap['AvatarTalentExcelConfigData'] | undefined
  >

  /**
   * Dungeon entry configurations mapped by ID
   */
  DungeonEntryExcelConfigData: Record<
    string,
    MasterFileMap['DungeonEntryExcelConfigData'] | undefined
  >

  /**
   * Dungeon level entity data mapped by client ID
   */
  DungeonLevelEntityConfigData: Record<
    string,
    MasterFileMap['DungeonLevelEntityConfigData'] | undefined
  >

  /**
   * Equipment affix data mapped by affix ID
   */
  EquipAffixExcelConfigData: Record<
    string,
    MasterFileMap['EquipAffixExcelConfigData'] | undefined
  >

  /**
   * Character fetter info mapped by avatar ID
   */
  FetterInfoExcelConfigData: Record<
    string,
    MasterFileMap['FetterInfoExcelConfigData'] | undefined
  >

  /**
   * Fetter configuration data mapped by fetter ID
   */
  FettersExcelConfigData: Record<
    string,
    MasterFileMap['FettersExcelConfigData'] | undefined
  >

  /**
   * Character story data mapped by fetter ID
   */
  FetterStoryExcelConfigData: Record<
    string,
    MasterFileMap['FetterStoryExcelConfigData'] | undefined
  >

  /**
   * Manual text map entries indexed by text map ID
   */
  ManualTextMapConfigData: Record<
    string,
    MasterFileMap['ManualTextMapConfigData'] | undefined
  >

  /**
   * Material item data mapped by material ID
   */
  MaterialExcelConfigData: Record<
    string,
    MasterFileMap['MaterialExcelConfigData'] | undefined
  >

  /**
   * Monster stat curve data indexed by type then level
   */
  MonsterCurveExcelConfigData: Record<string, Record<number, number>>

  /**
   * Monster description data mapped by ID
   */
  MonsterDescribeExcelConfigData: Record<
    string,
    MasterFileMap['MonsterDescribeExcelConfigData'] | undefined
  >

  /**
   * Monster configuration data mapped by monster ID
   */
  MonsterExcelConfigData: Record<
    string,
    MasterFileMap['MonsterExcelConfigData'] | undefined
  >

  /**
   * Profile picture data mapped by picture ID
   */
  ProfilePictureExcelConfigData: Record<
    string,
    MasterFileMap['ProfilePictureExcelConfigData'] | undefined
  >

  /**
   * Skill enhancement data nested by group ID and skill level
   */
  ProudSkillExcelConfigData: Record<
    string,
    Record<number, MasterFileMap['ProudSkillExcelConfigData'] | undefined>
  >

  /**
   * Artifact affix data mapped by affix ID
   */
  ReliquaryAffixExcelConfigData: Record<
    string,
    MasterFileMap['ReliquaryAffixExcelConfigData'] | undefined
  >

  /**
   * Artifact base data mapped by artifact ID
   */
  ReliquaryExcelConfigData: Record<
    string,
    MasterFileMap['ReliquaryExcelConfigData'] | undefined
  >

  /**
   * Artifact stat growth data indexed by type, rank, and level
   */
  ReliquaryLevelExcelConfigData: Record<
    string,
    Record<number, Record<number, number>>
  >

  /**
   * Artifact main stat data mapped by prop ID
   */
  ReliquaryMainPropExcelConfigData: Record<
    string,
    MasterFileMap['ReliquaryMainPropExcelConfigData'] | undefined
  >

  /**
   * Artifact set bonus data mapped by set ID
   */
  ReliquarySetExcelConfigData: Record<
    string,
    MasterFileMap['ReliquarySetExcelConfigData'] | undefined
  >

  /**
   * Spiral Abyss floor data mapped by floor ID
   */
  TowerFloorExcelConfigData: Record<
    string,
    MasterFileMap['TowerFloorExcelConfigData'] | undefined
  >

  /**
   * Spiral Abyss level data mapped by level ID
   */
  TowerLevelExcelConfigData: Record<
    string,
    MasterFileMap['TowerLevelExcelConfigData'] | undefined
  >

  /**
   * Spiral Abyss schedule data mapped by schedule ID
   */
  TowerScheduleExcelConfigData: Record<
    string,
    MasterFileMap['TowerScheduleExcelConfigData'] | undefined
  >

  /**
   * Weapon stat curve data indexed by type then level
   */
  WeaponCurveExcelConfigData: Record<string, Record<number, number>>

  /**
   * Weapon base data mapped by weapon ID
   */
  WeaponExcelConfigData: Record<
    string,
    MasterFileMap['WeaponExcelConfigData'] | undefined
  >

  /**
   * Weapon ascension data nested by promote ID and level
   */
  WeaponPromoteExcelConfigData: Record<
    string,
    Record<string, MasterFileMap['WeaponPromoteExcelConfigData'] | undefined>
  >
}
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Type helper to extract cache structure type from ExcelBinOutput key
 */
export type CacheStructureType<T extends keyof CacheStructureMap> =
  CacheStructureMap[T]
