import type { ClientOptions } from 'openapi-fetch'

import { createRestClient } from '@/client/createRestClient'
import { HttpError } from '@/error/HttpError'
import type { components, paths } from '@/types/hoyoverse'

/**
 * Announcement content response type.
 */
export type GetAnnContentResponse =
  components['schemas']['GetAnnContentResponse']

/**
 * Announcement list response type.
 */
export type GetAnnListResponse = components['schemas']['GetAnnListResponse']

/**
 * Content item type.
 */
export type ContentItem = components['schemas']['ContentItem']

/**
 * Data item type.
 */
export type DataItem = components['schemas']['DataItem']

/**
 * Supported languages for announcements.
 */
export type AnnouncementLanguage =
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

/**
 * Supported regions for announcements.
 */
export type AnnouncementRegion = 'os_asia' | 'os_euro' | 'os_usa' | 'os_cht'

/**
 * Options for fetching announcements.
 */
export interface AnnouncementOptions {
  /**
   * Language for announcements.
   */
  lang: AnnouncementLanguage
  /**
   * Region for announcements.
   */
  region: AnnouncementRegion
}

const HOYOVERSE_STATIC_BASE_URL = 'https://sg-hk4e-api-static.hoyoverse.com'
const HOYOVERSE_API_BASE_URL = 'https://sg-hk4e-api.hoyoverse.com'

/**
 * Type-safe client for HoYoverse Announcement API.
 */
export class HoyoverseClient {
  private readonly staticClient: ReturnType<typeof createRestClient<paths>>
  private readonly apiClient: ReturnType<typeof createRestClient<paths>>

  /**
   * Creates a new HoyoverseClient instance.
   * @param options - optional client options
   */
  constructor(options?: ClientOptions) {
    this.staticClient = createRestClient<paths>(
      HOYOVERSE_STATIC_BASE_URL,
      options,
    )
    this.apiClient = createRestClient<paths>(HOYOVERSE_API_BASE_URL, options)
  }

  /**
   * Fetch announcement content.
   * @param options - announcement options (lang, region)
   * @returns the announcement content
   * @throws - HttpError if the request fails
   */
  public async fetchAnnContent(
    options: AnnouncementOptions,
  ): Promise<GetAnnContentResponse> {
    const { data, error, response } = await this.staticClient.GET(
      '/common/hk4e_global/announcement/api/getAnnContent',
      {
        params: {
          query: {
            game: 'hk4e',
            game_biz: 'hk4e_global',
            lang: options.lang,
            auth_appid: 'announcement',
            bundle_id: 'hk4e_global',
            channel_id: '1',
            level: '60',
            platform: 'pc',
            region: options.region,
            sdk_presentation_style: 'fullscreen',
            sdk_screen_transparent: 'true',
            uid: '888888888',
          },
        },
      },
    )

    if (error) throw new HttpError(response.status, response.statusText, error)

    return data
  }

  /**
   * Fetch announcement list.
   * @param options - announcement options (lang, region)
   * @returns the announcement list
   * @throws - HttpError if the request fails
   */
  public async fetchAnnList(
    options: AnnouncementOptions,
  ): Promise<GetAnnListResponse> {
    const { data, error, response } = await this.apiClient.GET(
      '/common/hk4e_global/announcement/api/getAnnList',
      {
        params: {
          query: {
            game: 'hk4e',
            game_biz: 'hk4e_global',
            lang: options.lang,
            auth_appid: 'announcement',
            bundle_id: 'hk4e_global',
            channel_id: '1',
            level: '60',
            platform: 'pc',
            region: options.region,
            sdk_presentation_style: 'fullscreen',
            sdk_screen_transparent: 'true',
            uid: '888888888',
          },
        },
      },
    )

    if (error) throw new HttpError(response.status, response.statusText, error)

    return data
  }
}
