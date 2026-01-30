import type { Notice } from '@/dto/Notice'

/**
 * NoticeManager events
 */
export enum NoticeManagerEvents {
  /** When a notice is added, fires */
  AddNotice = 'AddNotice',
  /** When a notice is removed, fires */
  RemoveNotice = 'RemoveNotice',
}

/**
 * NoticeManager event map
 */
export interface NoticeManagerEventMap {
  /**
   * When a notice is added, fires
   * @param notice - Added Notice
   */
  [NoticeManagerEvents.AddNotice]: [notice: Notice]
  /**
   * When a notice is removed, fires
   * @param notice - Removed Notice
   */
  [NoticeManagerEvents.RemoveNotice]: [notice: Notice]
}
