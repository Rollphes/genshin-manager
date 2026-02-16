import type { Language } from '@genshin-manager/core'
import {
  AnnContentNotFoundError,
  createUpdateIntervalSchema,
  PromiseEventEmitter,
  RestClient,
  validate,
} from '@genshin-manager/core'
import { merge } from 'ts-deepmerge'

import { Notice } from '@/dto/Notice'
import { HoyoverseApiError } from '@/errors/HoyoverseApiError'
import type { AnnouncementQuery } from '@/types/api/queries'
import type {
  GetAnnContentResponse,
  GetAnnListResponse,
} from '@/types/api/responses'
import type {
  HoyoverseApiRoutes,
  HoyoverseStaticApiRoutes,
} from '@/types/api/routes'
import type { NoticeManagerEventMap } from '@/types/events'
import { NoticeManagerEvents } from '@/types/events'
import type { Region } from '@/types/Region'

/**
 * Class for fetching notices from mihoyo
 */
export class NoticeManager extends PromiseEventEmitter<NoticeManagerEventMap> {
  /**
   * Minimum update interval(ms)
   * @default 1 minute
   */
  private static readonly MIN_UPDATE_INTERVAL = 1000 * 60 * 1

  private static readonly noticeLanguage = {
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

  private static readonly defaultQuery: AnnouncementQuery = {
    game: 'hk4e',
    game_biz: 'hk4e_global',
    lang: 'en' as Language,
    auth_appid: 'announcement',
    bundle_id: 'hk4e_global',
    channel_id: '1',
    level: '60',
    platform: 'pc',
    region: 'os_asia' as Region,
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

  private readonly contentClient: RestClient<HoyoverseStaticApiRoutes>
  private readonly listClient: RestClient<HoyoverseApiRoutes>

  /**
   * Query parameters
   */
  private readonly query: AnnouncementQuery

  /**
   * Create a NoticeManager
   * @param language - language of notices
   * @param updateInterval - update interval(ms) Min: 1 minute
   * @param query - query parameters
   * @throws {@link ValidationError} - If updateInterval is invalid
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
      this.updateInterval = validate(schema, this.updateInterval)
    }
    this.query = merge.withOptions(
      { mergeArrays: false },
      NoticeManager.defaultQuery,
      query ?? {},
    ) as AnnouncementQuery

    this.contentClient = new RestClient<HoyoverseStaticApiRoutes>(
      'https://sg-hk4e-api-static.hoyoverse.com',
    )
    this.listClient = new RestClient<HoyoverseApiRoutes>(
      'https://sg-hk4e-api.hoyoverse.com',
    )
  }

  /**
   * Update notices
   * @throws {@link AnnContentNotFoundError} - If announcement content is not found
   * @throws {@link HoyoverseApiError} - If HoYoverse API returns an error
   */
  public async update(): Promise<void> {
    const requestQuery = { ...this.query, lang: this.language }
    const enQuery = {
      ...this.query,
      lang: 'en' as Language,
    }
    const annContent = await this.contentClient.fetch(
      '/common/hk4e_global/announcement/api/getAnnContent',
      { query: requestQuery },
    )
    this.validateApiResponse(annContent, 'getAnnContent')

    const annEnContent = await this.contentClient.fetch(
      '/common/hk4e_global/announcement/api/getAnnContent',
      { query: enQuery },
    )
    this.validateApiResponse(annEnContent, 'getAnnContent (en)')

    const annList = await this.listClient.fetch(
      '/common/hk4e_global/announcement/api/getAnnList',
      { query: requestQuery },
    )
    this.validateApiResponse(annList, 'getAnnList')

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
          (c) => c.ann_id === data.ann_id,
        )
        const enContent = annEnContent.data.list.find(
          (c) => c.ann_id === data.ann_id,
        )
        if (!content || !enContent)
          throw new AnnContentNotFoundError(String(data.ann_id))
        const notice = Notice.fromResponse(
          data,
          content,
          enContent,
          this.query.region,
        )
        this.emit(NoticeManagerEvents.AddNotice, notice)
        this.notices.set(data.ann_id, notice)
      }
    })
  }

  /**
   * Validate API response retcode
   * @param response - API response to validate
   * @param endpoint - Endpoint name for error reporting
   * @throws {@link HoyoverseApiError} - If retcode is not 0
   */
  private validateApiResponse(
    response: GetAnnContentResponse | GetAnnListResponse,
    endpoint: string,
  ): void {
    if (response.retcode !== 0)
      throw new HoyoverseApiError(response.retcode, response.message, endpoint)
  }
}
