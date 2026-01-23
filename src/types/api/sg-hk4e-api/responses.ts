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

interface ContentData {
  readonly list: readonly ContentList[]
  readonly total: number
  readonly pic_list: readonly string[]
  readonly pic_total: number
}

/**
 * Data of ContentData
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

interface ListData {
  readonly list: readonly TabList[]
  readonly total: number
  readonly type_list: readonly TypeList[]
  readonly alert: boolean
  readonly alert_id: number
  readonly timezone: number
  readonly t: string
  readonly pic_list: readonly string[]
  readonly pic_total: number
  readonly pic_type_list: readonly string[]
  readonly pic_alert: boolean
  readonly pic_alert_id: number
  readonly static_sign: string
}

interface TabList {
  readonly list: readonly DataList[]
  readonly type_id: number
  readonly type_label: string
}

/**
 * Data of TabList
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
  /**
   * Ann content
   * @remarks none
   */
  readonly content: string
  /** Ann type label (type_list.mi18n_name) */
  readonly type_label: string
  /** Ann Tab label (1:! 2:flag 3:star) */
  readonly tag_label: string
  /** Ann Tab icon URL */
  readonly tag_icon: string
  /**
   * Ann login alert (1:yes 0:no)
   * @remarks unknown. 1 only?
   */
  readonly login_alert: number
  /** Ann language */
  readonly lang: string
  /** Ann start time (Always fluctuating) */
  readonly start_time: string
  /** Ann end time (Always fluctuating) */
  readonly end_time: string
  /** Ann type (type_list.id) */
  readonly type: number
  /**
   * Ann remind (1:yes 0:no)
   * @remarks unknown. 0 only?
   */
  readonly remind: number
  /**
   * Ann alert (1:yes 0:no)
   * @remarks unknown. 0 only?
   */
  readonly alert: number
  /** Ann Tab start time(unknown) */
  readonly tag_start_time: string
  /** Ann Tab end time(unknown) */
  readonly tag_end_time: string
  /**
   * Ann remind version
   * @remarks fix version?
   */
  readonly remind_ver: number
  /**
   * Ann has content
   * @remarks unknown. true only?
   */
  readonly has_content: boolean
  /**
   * Ann extra remind
   * @remarks unknown
   */
  readonly extra_remind: number
}

interface TypeList {
  readonly id: number //1:event 2:important
  readonly name: string
  readonly mi18n_name: string
}
