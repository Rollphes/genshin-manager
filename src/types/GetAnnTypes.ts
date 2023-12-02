import { Region, ValueOf } from '@/types'

/**
 *
 */
export interface UrlParams {
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
   * Auth appid
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
 *
 */
export interface APIGetAnnContent {
  /**
   *
   */
  retcode: number
  /**
   *
   */
  message: string
  /**
   *
   */
  data: ContentData
}

interface ContentData {
  list: ContentList[]
  total: number
  pic_list: string[]
  pic_total: number
}

/**
 *
 */
export interface ContentList {
  /**
   *
   */
  ann_id: number
  /**
   *
   */
  title: string
  /**
   *
   */
  subtitle: string
  /**
   *
   */
  banner: string
  /**
   *
   */
  content: string
  /**
   *
   */
  lang: ValueOf<typeof NoticeLanguage>
}

/**
 *
 */
export interface APIGetAnnList {
  /**
   *
   */
  retcode: number
  /**
   *
   */
  message: string
  /**
   *
   */
  data: ListData
}

interface ListData {
  list: TabList[]
  total: number
  type_list: TypeList[]
  alert: boolean
  alert_id: number
  timezone: number
  t: string
  pic_list: string[] //any
  pic_total: number
  pic_type_list: string[] //any
  pic_alert: boolean
  pic_alert_id: number
  static_sign: string
}

interface TabList {
  list: DataList[]
  type_id: number
  type_label: string
}

/**
 *
 */
export interface DataList {
  /**
   *
   */
  ann_id: number
  /**
   *
   */
  title: string
  /**
   *
   */
  subtitle: string
  /**
   *
   */
  banner: string //Image URL
  /**
   *
   */
  content: string //none
  /**
   *
   */
  type_label: string //from type_list.mi18n_name
  /**
   *
   */
  tag_label: string // 1:! 2:flag 3:star
  /**
   *
   */
  tag_icon: string //Image URL
  /**
   *
   */
  login_alert: number //unknown 1 only?
  /**
   *
   */
  lang: ValueOf<typeof NoticeLanguage> //language
  /**
   *
   */
  start_time: string // banner start time(Always fluctuating)
  /**
   *
   */
  end_time: string // banner end time(Always fluctuating)
  /**
   *
   */
  type: number //from type_list.id
  /**
   *
   */
  remind: number //unknown. 0 only?
  /**
   *
   */
  alert: number //unknown. 0 only?
  /**
   *
   */
  tag_start_time: string //unknown.
  /**
   *
   */
  tag_end_time: string //unknown.
  /**
   *
   */
  remind_ver: number //fix version?
  /**
   *
   */
  has_content: boolean //unknown. true only?
  /**
   *
   */
  extra_remind: number //unknown.
}

export /**
eeeeeee *
eeeeeee
eeeeeee
eeeeeee
eeeeeee
eeeeeee */
const NoticeLanguage = {
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

//Tab
interface TypeList {
  id: number //1:event 2:important
  name: string
  mi18n_name: string
}
