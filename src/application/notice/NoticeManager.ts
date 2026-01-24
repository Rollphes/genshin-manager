import { merge } from 'ts-deepmerge'

import { PromiseEventEmitter } from '@/adapter/input/events/PromiseEventEmitter'
import type { AnnouncementQuery } from '@/adapter/input/types/api/sg-hk4e-api/queries'
import type {
  HoyoverseApiRoutes,
  HoyoverseStaticApiRoutes,
} from '@/adapter/input/types/api/sg-hk4e-api/routes'
import { Notice } from '@/adapter/output/Notice'
import { RestClient } from '@/application/client/RestClient'
import { AnnContentNotFoundError } from '@/application/errors/AnnContentNotFoundError'
import type { NoticeManagerEventMap } from '@/application/types/events/notice'
import { NoticeManagerEvents } from '@/application/types/events/notice'
import { createUpdateIntervalSchema } from '@/domain/schemas/createUpdateIntervalSchema'
import { Language } from '@/domain/types/types'
import { validate } from '@/domain/validation/validate'

/**
 * Class for fetching notices from mihoyo
 */
export class NoticeManager extends PromiseEventEmitter<NoticeManagerEventMap> {
  /**
   * Minimum update interval(ms)
   * @default 1 minute
   */
  private static readonly MIN_UPDATE_INTERVAL = 1000 * 60 * 1

  private static noticeLanguage = {
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
  } as const satisfies Record<Language, string>

  /**
   * Content API client
   */
  private static readonly contentClient =
    new RestClient<HoyoverseStaticApiRoutes>(
      'https://sg-hk4e-api-static.hoyoverse.com',
    )

  /**
   * List API client
   */
  private static readonly listClient = new RestClient<HoyoverseApiRoutes>(
    'https://sg-hk4e-api.hoyoverse.com',
  )

  /**
   * Default query parameters
   */
  private static readonly defaultQuery: AnnouncementQuery = {
    game: 'hk4e',
    game_biz: 'hk4e_global',
    lang: Language.En,
    auth_appid: 'announcement',
    bundle_id: 'hk4e_global',
    channel_id: '1',
    level: '60',
    platform: 'pc',
    region: 'os_asia',
    sdk_presentation_style: 'fullscreen',
    sdk_screen_transparent: 'true',
    uid: '888888888',
  }

  /**
   * Language of notices
   */
  public readonly language: Language

  /**
   * Update interval(ms)
   */
  public readonly updateInterval: number | undefined

  /**
   * Notices
   * @key Notice ID
   * @value Notice
   */
  public readonly notices = new Map<number, Notice>()

  /**
   * Query parameters
   */
  private readonly query: AnnouncementQuery

  /**
   * Create a NoticeManager
   * @param language - language of notices
   * @param updateInterval - update interval(ms) Min: 1 minute
   * @param query - query parameters
   * @example
   * ```ts
   * const noticeManager = new NoticeManager('en', 60000)
   * await noticeManager.update()
   * console.log(noticeManager.notices.size)
   * ```
   */
  constructor(
    language: Language,
    updateInterval?: number,
    query?: Partial<AnnouncementQuery>,
  ) {
    super()
    this.language = language
    this.updateInterval = updateInterval
    if (this.updateInterval) {
      const schema = createUpdateIntervalSchema(
        NoticeManager.MIN_UPDATE_INTERVAL,
      )
      this.updateInterval = validate(schema, this.updateInterval, {
        propertyKey: 'updateInterval',
      })
    }
    this.query = merge.withOptions(
      { mergeArrays: false },
      NoticeManager.defaultQuery,
      query ?? {},
    ) as AnnouncementQuery
    if (this.updateInterval)
      void setInterval(() => void this.update(), this.updateInterval)
  }

  /**
   * Update notices
   */
  public async update(): Promise<void> {
    const requestQuery = { ...this.query, lang: this.language }
    const enQuery = { ...this.query, lang: Language.En }
    const annContent = await NoticeManager.contentClient.fetch(
      '/common/hk4e_global/announcement/api/getAnnContent',
      { query: requestQuery },
    )
    const annEnContent = await NoticeManager.contentClient.fetch(
      '/common/hk4e_global/announcement/api/getAnnContent',
      { query: enQuery },
    )
    const annList = await NoticeManager.listClient.fetch(
      '/common/hk4e_global/announcement/api/getAnnList',
      { query: requestQuery },
    )
    const annListDatas = annList.data.list.flatMap((tab) => tab.list)
    const annListIds = annListDatas.map((data) => data.ann_id)
    this.notices.forEach((notice, id) => {
      if (!annListIds.includes(id)) {
        this.emit(NoticeManagerEvents.RemoveNotice, notice)
        this.notices.delete(id)
      }
    })
    annListDatas.forEach((data) => {
      if (!this.notices.has(data.ann_id)) {
        const content = annContent.data.list.find(
          (content) => content.ann_id === data.ann_id,
        )
        const enContent = annEnContent.data.list.find(
          (content) => content.ann_id === data.ann_id,
        )
        if (!content || !enContent)
          throw new AnnContentNotFoundError(String(data.ann_id))
        const notice = new Notice(data, content, enContent, this.query.region)
        this.emit(NoticeManagerEvents.AddNotice, notice)
        this.notices.set(data.ann_id, notice)
      }
    })
  }
}
