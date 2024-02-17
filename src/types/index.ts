/**
 * Type of value of object
 */
export type ValueOf<T> = T[keyof T]

/**
 * Client option
 */
export interface ClientOption {
  /**
   * Fetch option
   * @default
   * ```ts
   * {
   *   'user-agent': 'genshin-manager/x.x.x',
   * }
   * ```
   */
  fetchOption: RequestInit
  /**
   * List of TextMaps to download when new assets are found.
   * @default
   * ```ts
   * ['EN','RU','VI','TH','PT','KR','JP','ID','FR','ES','DE','CHT','CHS']
   * ```
   */
  downloadLanguages: (keyof typeof TextMapLanguage)[]
  /**
   * default image base URL
   * @default 'https://api.ambr.top/assets/UI'
   */
  defaultImageBaseURL: string
  /**
   * default audio base URL
   * @default 'https://api.ambr.top/assets/Audio'
   */
  defaultAudioBaseURL: string
  /**
   * image base URL by regex
   * @default
   * ```ts
   * {
   *    'https://enka.network/ui': [
   *      /^UI_(EquipIcon|NameCardPic|RelicIcon|AvatarIcon|AvatarIcon_Side|NameCardIcon|Costume)_/,
   *      /^UI_AvatarIcon_(.+)_Card$/,
   *      /^UI_AvatarIcon_(.+)_Circle/,
   *    ],
   *    'https://res.cloudinary.com/genshin/image/upload/sprites': [
   *      /^Eff_UI_Talent_/,
   *      /^UI_(TowerPic|TowerBlessing|GcgIcon|Gcg_Cardtable|Gcg_CardBack)_/,
   *    ],
   *    'https://api.ambr.top/assets/UI/monster': [
   *      /^UI_(MonsterIcon|AnimalIcon)_/,
   *    ],
   *    'https://api.ambr.top/assets/UI/gcg': [/^UI_Gcg_CardFace_/],
   *  },
   * ```
   */
  imageBaseURLByRegex: { [url: string]: RegExp[] }
  /**
   * audio base url by regex
   * @default
   * ```ts
   * {}
   * ```
   */
  audioBaseURLByRegex: { [url: string]: RegExp[] }
  /**
   * default language
   * @default 'EN'
   */
  defaultLanguage: keyof typeof TextMapLanguage
  /**
   * show fetch cache log
   * @default true
   */
  showFetchCacheLog: boolean
  /**
   * auto fetch latest assets by cron
   * @warn If this option is `undefined`, asset updates and initial setup are not executed
   * @default '0 0 0 * * 3' // minute hour day-of-month month day-of-week
   * @see https://crontab.guru/
   */
  autoFetchLatestAssetsByCron: string | undefined
  /**
   * Automatically re-download the textMap if it has not been downloaded or if there is an error in the json format
   * @warn If `autoFetchLatestAssetsByCron` is `undefined`, this option will be ignored
   * @default true
   */
  autoFixTextMap: boolean
  /**
   * Automatically fix the ExcelBin if it has not been downloaded or if there is an error in the json format
   * @warn If `autoFetchLatestAssetsByCron` is `undefined`, this option will be ignored
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
export type Element = ValueOf<typeof ElementKeys>

/**
 * Time difference per region (hour)
 */
export const TimeZonesPerRegion = {
  cn_gf01: +8,
  cn_qd01: +8,
  os_usa: -5,
  os_euro: +1,
  os_asia: +8,
  os_cht: +8,
} as const

/**
 * Region type
 */
export type Region = keyof typeof TimeZonesPerRegion

/**
 * Character voice type
 */
export type CVType = keyof Omit<
  typeof TextMapLanguage,
  'RU' | 'VI' | 'TH' | 'PT' | 'ID' | 'FR' | 'ES' | 'DE' | 'CHT'
>

/**
 * Artifact type
 */
export type ArtifactType =
  | 'EQUIP_BRACER'
  | 'EQUIP_NECKLACE'
  | 'EQUIP_SHOES'
  | 'EQUIP_RING'
  | 'EQUIP_DRESS'

//TODO: If genshin does a major update, I'll update here.
/**
 * Association type
 */
export type AssocType =
  | 'ASSOC_TYPE_FATUI'
  | 'ASSOC_TYPE_FONTAINE'
  | 'ASSOC_TYPE_INAZUMA'
  | 'ASSOC_TYPE_LIYUE'
  | 'ASSOC_TYPE_MAINACTOR'
  | 'ASSOC_TYPE_MONDSTADT'
  | 'ASSOC_TYPE_RANGER'
  | 'ASSOC_TYPE_SUMERU'

/**
 * Item type
 */
export type ItemType = 'ITEM_VIRTUAL' | 'ITEM_MATERIAL'

/**
 * Material type
 */
export type MaterialType =
  | 'MATERIAL_ACTIVITY_GEAR'
  | 'MATERIAL_ACTIVITY_JIGSAW'
  | 'MATERIAL_ACTIVITY_ROBOT'
  | 'MATERIAL_ADSORBATE'
  | 'MATERIAL_ARANARA'
  | 'MATERIAL_AVATAR'
  | 'MATERIAL_AVATAR_MATERIAL'
  | 'MATERIAL_BGM'
  | 'MATERIAL_CHANNELLER_SLAB_BUFF'
  | 'MATERIAL_CHEST'
  | 'MATERIAL_CHEST_BATCH_USE'
  | 'MATERIAL_CONSUME'
  | 'MATERIAL_CONSUME_BATCH_USE'
  | 'MATERIAL_COSTUME'
  | 'MATERIAL_CRICKET'
  | 'MATERIAL_DESHRET_MANUAL'
  | 'MATERIAL_ELEM_CRYSTAL'
  | 'MATERIAL_EXCHANGE'
  | 'MATERIAL_EXP_FRUIT'
  | 'MATERIAL_FAKE_ABSORBATE'
  | 'MATERIAL_FIREWORKS'
  | 'MATERIAL_FISH_BAIT'
  | 'MATERIAL_FISH_ROD'
  | 'MATERIAL_FLYCLOAK'
  | 'MATERIAL_FOOD'
  | 'MATERIAL_FURNITURE_FORMULA'
  | 'MATERIAL_FURNITURE_SUITE_FORMULA'
  | 'MATERIAL_GCG_CARD'
  | 'MATERIAL_GCG_CARD_BACK'
  | 'MATERIAL_GCG_CARD_FACE'
  | 'MATERIAL_GCG_EXCHANGE_ITEM'
  | 'MATERIAL_GCG_FIELD'
  | 'MATERIAL_HOME_SEED'
  | 'MATERIAL_NAMECARD'
  | 'MATERIAL_NOTICE_ADD_HP'
  | 'MATERIAL_QUEST'
  | 'MATERIAL_RELIQUARY_MATERIAL'
  | 'MATERIAL_RENAME_ITEM'
  | 'MATERIAL_SEA_LAMP'
  | 'MATERIAL_SELECTABLE_CHEST'
  | 'MATERIAL_SPICE_FOOD'
  | 'MATERIAL_TALENT'
  | 'MATERIAL_WEAPON_EXP_STONE'
  | 'MATERIAL_WIDGET'
  | 'MATERIAL_WOOD'

/**
 * FightProp Map
 */
export const FightProps = {
  // 0: 'FIGHT_PROP_NONE',
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
export type FightPropType = ValueOf<typeof FightProps>

/**
 * Weapon type
 */
export type WeaponType =
  | 'WEAPON_BOW'
  | 'WEAPON_CATALYST'
  | 'WEAPON_CLAYMORE'
  | 'WEAPON_POLE'
  | 'WEAPON_SWORD_ONE_HAND'

/**
 * Character's profile picture type
 */
export type ProfilePictureType =
  | 'PROFILE_PICTURE_UNLOCK_BY_AVATAR'
  | 'PROFILE_PICTURE_UNLOCK_BY_COSTUME'
  | 'PROFILE_PICTURE_UNLOCK_BY_ITEM'

/**
 * Quality type (Rarity Type)
 */
export type QualityType =
  | 'QUALITY_ORANGE'
  | 'QUALITY_PURPLE'
  | 'QUALITY_ORANGE_SP'

/**
 * Body type
 */
export type BodyType =
  | 'BODY_BOY'
  | 'BODY_GIRL'
  | 'BODY_LADY'
  | 'BODY_LOLI'
  | 'BODY_MALE'

/**
 * Monster type
 * @description `CODEX_SUBTYPE_ELEMENT_LIFE` is original (reason:Element lifeforms does not have a subType)
 */
export type CodexType =
  | 'CODEX_SUBTYPE_ELEMENT_LIFE'
  | 'CODEX_SUBTYPE_ABYSS'
  | 'CODEX_SUBTYPE_ANIMAL'
  | 'CODEX_SUBTYPE_AUTOMATRON'
  | 'CODEX_SUBTYPE_AVIARY'
  | 'CODEX_SUBTYPE_BEAST'
  | 'CODEX_SUBTYPE_BOSS'
  | 'CODEX_SUBTYPE_CRITTER'
  | 'CODEX_SUBTYPE_FATUI'
  | 'CODEX_SUBTYPE_FISH'
  | 'CODEX_SUBTYPE_HILICHURL'
  | 'CODEX_SUBTYPE_HUMAN'

/**
 * TextMap language type
 */
export const TextMapLanguage = {
  EN: 'TextMapEN.json',
  RU: 'TextMapRU.json',
  VI: 'TextMapVI.json',
  TH: 'TextMapTH.json',
  PT: 'TextMapPT.json',
  KR: 'TextMapKR.json',
  JP: 'TextMapJP.json',
  ID: 'TextMapID.json',
  FR: 'TextMapFR.json',
  ES: 'TextMapES.json',
  DE: 'TextMapDE.json',
  CHT: 'TextMapCHT.json',
  CHS: 'TextMapCHS.json',
} as const

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
