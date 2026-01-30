import type { Language } from '@genshin-manager/core'

import type { Region } from '@/types/Region'

/**
 * Query parameters for announcement API
 */
export interface AnnouncementQuery {
  /**
   * Game ID
   * @default 'hk4e'
   */
  readonly game: string
  /**
   * Game biz
   * @default 'hk4e_global'
   */
  readonly game_biz: string
  /**
   * Language
   * @default 'en'
   */
  readonly lang: Language
  /**
   * Auth app ID
   * @default 'announcement'
   */
  readonly auth_appid: string
  /**
   * Bundle ID
   * @default 'hk4e_global'
   */
  readonly bundle_id: string
  /**
   * Channel ID
   * @default '1'
   */
  readonly channel_id: string
  /**
   * Level
   * @default '60'
   */
  readonly level: string
  /**
   * Platform
   * @default 'pc'
   */
  readonly platform: string
  /**
   * Region
   * @default 'os_asia'
   */
  readonly region: Region
  /**
   * SDK presentation style
   * @default 'fullscreen'
   */
  readonly sdk_presentation_style: string
  /**
   * SDK screen transparent
   * @default 'true'
   */
  readonly sdk_screen_transparent: string
  /**
   * UID
   * @default '888888888'
   */
  readonly uid: string
}
