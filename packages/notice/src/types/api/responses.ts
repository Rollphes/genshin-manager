// ============================================
// Hoyoverse Announcement API Response Types
// ============================================

/**
 * GetAnnContent response
 */
export interface GetAnnContentResponse {
  /** return code */
  readonly retcode: number
  /** message */
  readonly message: string
  /** content data */
  readonly data: ContentData
}

/**
 * Content data
 */
interface ContentData {
  /** list */
  readonly list: readonly ContentList[]
  /** total */
  readonly total: number
  /** pic list */
  readonly pic_list: readonly string[]
  /** pic total */
  readonly pic_total: number
}

/**
 * Content list item
 */
export interface ContentList {
  /** Ann ID */
  readonly ann_id: number
  /** Ann title */
  readonly title: string
  /** Ann subtitle */
  readonly subtitle: string
  /** Ann banner URL */
  readonly banner: string
  /** Ann content */
  readonly content: string
  /** Ann language */
  readonly lang: string
}

/**
 * GetAnnList response
 */
export interface GetAnnListResponse {
  /** return code */
  readonly retcode: number
  /** message */
  readonly message: string
  /** list data */
  readonly data: ListData
}

/**
 * List data
 */
interface ListData {
  /** list */
  readonly list: readonly TabList[]
  /** total */
  readonly total: number
  /** type list */
  readonly type_list: readonly TypeList[]
  /** alert */
  readonly alert: boolean
  /** alert ID */
  readonly alert_id: number
  /** timezone */
  readonly timezone: number
  /** timestamp */
  readonly t: string
  /** pic list */
  readonly pic_list: readonly string[]
  /** pic total */
  readonly pic_total: number
  /** pic type list */
  readonly pic_type_list: readonly string[]
  /** pic alert */
  readonly pic_alert: boolean
  /** pic alert ID */
  readonly pic_alert_id: number
  /** static sign */
  readonly static_sign: string
}

/**
 * Tab list item
 */
interface TabList {
  /** list */
  readonly list: readonly DataList[]
  /** type ID */
  readonly type_id: number
  /** type label */
  readonly type_label: string
}

/**
 * Data list item (announcement entry)
 */
export interface DataList {
  /** Ann ID */
  readonly ann_id: number
  /** Ann title */
  readonly title: string
  /** Ann subtitle */
  readonly subtitle: string
  /** Ann banner URL */
  readonly banner: string
  /** Ann content */
  readonly content: string
  /** Ann type label */
  readonly type_label: string
  /** Ann tag label (1:! 2:flag 3:star) */
  readonly tag_label: string
  /** Ann tag icon URL */
  readonly tag_icon: string
  /** Ann login alert */
  readonly login_alert: number
  /** Ann language */
  readonly lang: string
  /** Ann start time */
  readonly start_time: string
  /** Ann end time */
  readonly end_time: string
  /** Ann type */
  readonly type: number
  /** Ann remind */
  readonly remind: number
  /** Ann alert */
  readonly alert: number
  /** Ann tag start time */
  readonly tag_start_time: string
  /** Ann tag end time */
  readonly tag_end_time: string
  /** Ann remind version */
  readonly remind_ver: number
  /** Ann has content */
  readonly has_content: boolean
  /** Ann extra remind */
  readonly extra_remind: number
}

/**
 * Type list item
 */
interface TypeList {
  /** type ID */
  readonly id: number
  /** type name */
  readonly name: string
  /** i18n name */
  readonly mi18n_name: string
}
