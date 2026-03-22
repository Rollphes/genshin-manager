/**
 *
 */
export interface paths {
  /**
   *
   */
  '/common/hk4e_global/announcement/api/getAnnContent': {
    /**
     *
     */
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get announcement content */
    get: operations['getAnnContent']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  /**
   *
   */
  '/common/hk4e_global/announcement/api/getAnnList': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /** Get announcement list */
    get: operations['getAnnList']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
/**
 *
 */
export type webhooks = Record<string, never>
/**
 *
 */
export interface components {
  /**
   *
   */
  schemas: {
    GetAnnContentResponse: {
      retcode: number
      message: string
      data: components['schemas']['ContentData']
    }
    /**
     *
     */
    ContentData: {
      list: components['schemas']['ContentItem'][]
      total: number
      pic_list: string[]
      pic_total: number
    }
    /**
     *
     */
    ContentItem: {
      ann_id: number
      title: string
      subtitle: string
      banner: string
      content: string
      lang: string
    }
    GetAnnListResponse: {
      retcode: number
      message: string
      data: components['schemas']['ListData']
    }
    /**
     *
     */
    ListData: {
      list: components['schemas']['TabList'][]
      total: number
      type_list: components['schemas']['TypeList'][]
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
    TabList: {
      list: components['schemas']['DataItem'][]
      type_id: number
      type_label: string
    }
    DataItem: {
      ann_id: number
      title: string
      subtitle: string
      banner: string
      content: string
      type_label: string
      tag_label: string
      tag_icon: string
      login_alert: number
      lang: string
      start_time: string
      end_time: string
      type: number
      remind: number
      alert: number
      tag_start_time: string
      tag_end_time: string
      remind_ver: number
      has_content: boolean
      extra_remind: number
    }
    /**
     *
     */
    TypeList: {
      id: number
      name: string
      mi18n_name: string
    }
    /**
     *
     */
    ErrorResponse: {
      message?: string
      error?: string
    }
  }
  /**
   *
   */
  responses: never
  /**
   *
   */
  parameters: never
  /**
   *
   */
  requestBodies: never
  /**
   *
   */
  headers: never
  /**
   *
   */
  pathItems: never
}
/**
 *
 */
export type $defs = Record<string, never>
/**
 *
 */
export interface operations {
  /**
   *
   */
  getAnnContent: {
    parameters: {
      /**
       *
       */
      query: {
        game: string
        game_biz: string
        lang:
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
        auth_appid: string
        bundle_id: string
        channel_id: string
        level: string
        platform: string
        region: 'os_asia' | 'os_euro' | 'os_usa' | 'os_cht'
        sdk_presentation_style: string
        sdk_screen_transparent: string
        uid: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Announcement content */
      200: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['GetAnnContentResponse']
        }
      }
      /** @description Error response */
      default: {
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
  /**
   *
   */
  getAnnList: {
    parameters: {
      query: {
        game: string
        game_biz: string
        lang:
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
        auth_appid: string
        bundle_id: string
        channel_id: string
        level: string
        platform: string
        region: 'os_asia' | 'os_euro' | 'os_usa' | 'os_cht'
        sdk_presentation_style: string
        sdk_screen_transparent: string
        uid: string
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Announcement list */
      200: {
        headers: Record<string, unknown>
        content: {
          'application/json': components['schemas']['GetAnnListResponse']
        }
      }
      /** @description Error response */
      default: {
        headers: Record<string, unknown>
        /**
         *
         */
        content: {
          'application/json': components['schemas']['ErrorResponse']
        }
      }
    }
  }
}
