import { NoticeLanguage } from '@/types/sg-hk4e-api'
import { ValueOf } from '@/types/types'
/**
 * GetAnnContent response
 */
export interface APIGetAnnContent {
  /**
   * return code
   */
  retcode: number
  /**
   * message
   */
  message: string
  /**
   * content data
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
 * Data of ContentData
 */
export interface ContentList {
  /**
   * Ann ID
   */
  ann_id: number
  /**
   * Ann title
   */
  title: string
  /**
   * Ann subtitle
   */
  subtitle: string
  /**
   * Ann banner URL
   */
  banner: string
  /**
   * Ann content
   */
  content: string
  /**
   * Ann language
   */
  lang: ValueOf<typeof NoticeLanguage>
}

/**
 * GetAnnList response
 */
export interface APIGetAnnList {
  /**
   * return code
   */
  retcode: number
  /**
   * message
   */
  message: string
  /**
   * list data
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
  pic_list: string[]
  pic_total: number
  pic_type_list: string[]
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
 * Data of TabList
 */
export interface DataList {
  /**
   * Ann ID
   */
  ann_id: number
  /**
   * Ann title
   */
  title: string
  /**
   * Ann subtitle
   */
  subtitle: string
  /**
   * Ann banner URL
   */
  banner: string
  /**
   * Ann content
   * @remark none
   */
  content: string
  /**
   * Ann type label (type_list.mi18n_name)
   */
  type_label: string
  /**
   * Ann Tab label (1:! 2:flag 3:star)
   */
  tag_label: string
  /**
   * Ann Tab icon URL
   */
  tag_icon: string
  /**
   * Ann login alert (1:yes 0:no)
   * @remark unknown. 1 only?
   */
  login_alert: number
  /**
   * Ann language
   */
  lang: ValueOf<typeof NoticeLanguage>
  /**
   * Ann start time (Always fluctuating)
   */
  start_time: string
  /**
   * Ann end time (Always fluctuating)
   */
  end_time: string
  /**
   * Ann type (type_list.id)
   */
  type: number
  /**
   * Ann remind (1:yes 0:no)
   * @remark unknown. 0 only?
   */
  remind: number
  /**
   * Ann alert (1:yes 0:no)
   * @remark unknown. 0 only?
   */
  alert: number
  /**
   * Ann Tab start time(unknown)
   */
  tag_start_time: string
  /**
   * Ann Tab end time(unknown)
   */
  tag_end_time: string
  /**
   * Ann remind version
   * @remark fix version?
   */
  remind_ver: number
  /**
   * Ann has content
   * @remark unknown. true only?
   */
  has_content: boolean
  /**
   * Ann extra remind
   * @remark unknown
   */
  extra_remind: number
}

interface TypeList {
  id: number //1:event 2:important
  name: string
  mi18n_name: string
}
