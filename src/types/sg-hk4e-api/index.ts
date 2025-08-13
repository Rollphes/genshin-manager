/**
 * Time difference per region (hour)
 */
export const TimeZonesPerRegion = {
  cn_gf01: 8,
  cn_qd01: 8,
  os_usa: -5,
  os_euro: 1,
  os_asia: 8,
  os_cht: 8,
} as const

/**
 * Region type
 */
export type Region = keyof typeof TimeZonesPerRegion

/**
 * URL params for getAnn
 */
export interface URLParams {
  /**
   * Game ID
   * @default 'hk4e'
   */
  game: string
  /**
   * Game biz
   * @default 'hk4e_global'
   */
  game_biz: string
  /**
   * Language
   * @default 'en'
   */
  lang: keyof typeof NoticeLanguage
  /**
   * Auth app ID
   * @default 'announcement'
   */
  auth_appid: string
  /**
   * Bundle ID
   * @default 'hk4e_global'
   */
  bundle_id: string
  /**
   * Channel ID
   * @default '1'
   */
  channel_id: string
  /**
   * Level
   * @default '60'
   */
  level: string
  /**
   * Platform
   * @default 'pc'
   */
  platform: string
  /**
   * Region
   * @default 'os_asia'
   */
  region: Region
  /**
   * SDK presentation style
   * @default 'fullscreen'
   */
  sdk_presentation_style: string
  /**
   * SDK screen transparent
   * @default 'true'
   */
  sdk_screen_transparent: string
  /**
   * UID
   * @default '888888888'
   */
  uid: string
}

/**
 * language code map for getAnn
 */
export const NoticeLanguage = {
  en: 'en-us',
  ru: 'ru-ru',
  vi: 'vi-vn',
  th: 'th-th',
  pt: 'pt-br',
  ko: 'ko-kr',
  ja: 'ja-jp',
  id: 'id-id',
  fr: 'fr-fr',
  es: 'es-es',
  de: 'de-de',
  'zh-tw': 'zh-tw',
  'zh-cn': 'zh-cn',
} as const
