import { merge } from 'ts-deepmerge'

import { AnnContentNotFoundError } from '@/errors/content/AnnContentNotFoundError'
import { NetworkUnavailableError } from '@/errors/network/NetworkUnavailableError'
import { Notice } from '@/models/Notice'
import { createUpdateIntervalSchema } from '@/schemas/createUpdateIntervalSchema'
import { NoticeLanguage, URLParams as URLParams } from '@/types/sg-hk4e-api'
import { APIGetAnnContent, APIGetAnnList } from '@/types/sg-hk4e-api/response'
import { PromiseEventEmitter } from '@/utils/events/PromiseEventEmitter'
import { ValidationHelper } from '@/utils/validation/ValidationHelper'

/**
 * NoticeManager events
 * @see {@link NoticeManager}
 */
export enum NoticeManagerEvents {
  /**
   * When a notice is added, fires
   * @event ADD_NOTICE
   * @listener
   * | param | type | description |
   * | --- | --- | --- |
   * | notice | {@link Notice} | Added Notice |
   */
  ADD_NOTICE = 'ADD_NOTICE',
  /**
   * When a notice is removed, fires
   * @event REMOVE_NOTICE
   * @listener
   * | param | type | description |
   * | --- | --- | --- |
   * | notice | {@link Notice} | Removed Notice |
   */
  REMOVE_NOTICE = 'REMOVE_NOTICE',
}

interface NoticeManagerEventMap {
  ADD_NOTICE: [notice: Notice]
  REMOVE_NOTICE: [notice: Notice]
}

/**
 * Class for fetching notices from mihoyo
 */
export class NoticeManager extends PromiseEventEmitter<
  NoticeManagerEventMap,
  NoticeManagerEvents
> {
  /**
   * Minimum update interval(ms)
   * @default 1 minute
   */
  private static readonly MIN_UPDATE_INTERVAL = 1000 * 60 * 1

  /**
   * URL of getAnnContent
   */
  private static readonly GIT_CONTENT_URL: string =
    'https://sg-hk4e-api-static.hoyoverse.com/common/hk4e_global/announcement/api/getAnnContent'
  /**
   * URL of getAnnList
   */
  private static readonly GIT_LIST_URL: string =
    'https://sg-hk4e-api.hoyoverse.com/common/hk4e_global/announcement/api/getAnnList'
  /**
   * Default URL params
   */
  private static readonly defaultURLParams: URLParams = {
    game: 'hk4e',
    game_biz: 'hk4e_global',
    lang: 'en',
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
  public readonly language: keyof typeof NoticeLanguage

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
   * URL params
   */
  private readonly urlParams: URLParams

  /**
   * Create a NoticeManager
   * @param language language of notices
   * @param updateInterval update interval(ms) Min: 1 minute
   * @param urlParams URL params
   * @example
   * ```ts
   * const noticeManager = new NoticeManager('en', 60000)
   * await noticeManager.update()
   * console.log(noticeManager.notices.size)
   * ```
   */
  constructor(
    language: keyof typeof NoticeLanguage,
    updateInterval?: number,
    urlParams?: Partial<URLParams>,
  ) {
    super()
    this.language = language
    this.updateInterval = updateInterval
    if (this.updateInterval) {
      const schema = createUpdateIntervalSchema(
        NoticeManager.MIN_UPDATE_INTERVAL,
      )
      this.updateInterval = ValidationHelper.validate(
        schema,
        this.updateInterval,
        { propertyKey: 'updateInterval' },
      )
    }
    this.urlParams = merge.withOptions(
      { mergeArrays: false },
      NoticeManager.defaultURLParams,
      urlParams ?? {},
    ) as URLParams
    if (this.updateInterval)
      void setInterval(() => void this.update(), this.updateInterval)
  }

  /**
   * Update notices
   */
  public async update(): Promise<void> {
    const annContent = await this.getAnnContent()
    const annEnContent = await this.getAnnContent('en')
    const annList = await this.getAnnList()
    const annListDatas = annList.data.list.flatMap((tab) => tab.list)
    const annListIds = annListDatas.map((data) => data.ann_id)
    this.notices.forEach((notice, id) => {
      if (!annListIds.includes(id)) {
        this.emit(NoticeManagerEvents.REMOVE_NOTICE, notice)
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
        const notice = new Notice(
          data,
          content,
          enContent,
          this.urlParams.region,
        )
        this.emit(NoticeManagerEvents.ADD_NOTICE, notice)
        this.notices.set(data.ann_id, notice)
      }
    })
  }

  /**
   * Get AnnContent
   * @param lang language of notices
   * @returns annContent
   */
  private async getAnnContent(
    lang?: keyof typeof NoticeLanguage,
  ): Promise<APIGetAnnContent> {
    return (await this._getAnn(
      NoticeManager.GIT_CONTENT_URL,
      lang,
    )) as APIGetAnnContent
  }

  /**
   * Get AnnList
   * @returns annList
   */
  private async getAnnList(): Promise<APIGetAnnList> {
    return (await this._getAnn(NoticeManager.GIT_LIST_URL)) as APIGetAnnList
  }

  /**
   * Get Ann
   * @param urlText URL
   * @param lang language of notices
   * @returns ann
   */
  private async _getAnn(
    urlText: string,
    lang?: keyof typeof NoticeLanguage,
  ): Promise<APIGetAnnContent | APIGetAnnList> {
    const url = new URL(urlText)
    Object.keys(this.urlParams).forEach((key) => {
      if (key === 'lang') url.searchParams.append(key, lang ?? this.language)
      else url.searchParams.append(key, this.urlParams[key as keyof URLParams])
    })
    const res = await fetch(url.toString())
    if (!res.ok) throw new NetworkUnavailableError(res.url, 'GET')

    return (await res.json()) as APIGetAnnContent | APIGetAnnList
  }
}
