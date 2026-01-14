import { ValueOf } from '@/types/types'
import { NoticeLanguage } from '@/types/sg-hk4e-api'
import type { APIGetAnnList } from '@/types/sg-hk4e-api/response'

/**
 * Creates mock AnnList response for API testing
 * @param annIds - Array of announcement IDs to include
 * @param language - Language code for the responses
 * @returns Mock APIGetAnnList response
 */
export function createAnnListResponse(
  annIds: number[],
  language: ValueOf<typeof NoticeLanguage> = 'en-us',
): APIGetAnnList {
  return {
    retcode: 0,
    message: 'OK',
    data: {
      list: [
        {
          list: annIds.map((id, index) => ({
            ann_id: id,
            title: `Test Notice ${String(id)}`,
            subtitle: `Test Subtitle ${String(id)}`,
            banner: `https://test.com/banner${String(id)}.jpg`,
            content: '',
            type_label: index % 2 === 0 ? 'Event' : 'Maintenance',
            tag_label: String(index + 1),
            tag_icon: `https://test.com/tag${String(index + 1)}.png`,
            login_alert: 1,
            lang: language,
            start_time: '2024-01-01 00:00:00',
            end_time: '2024-01-31 23:59:59',
            type: index % 2 === 0 ? 1 : 2,
            remind: 0,
            alert: 0,
            tag_start_time: '2024-01-01 00:00:00',
            tag_end_time: '2024-01-31 23:59:59',
            remind_ver: 1,
            has_content: true,
            extra_remind: 0,
          })),
          type_id: 1,
          type_label: 'Event',
        },
      ],
      total: annIds.length,
      type_list: [
        {
          id: 1,
          name: 'Event',
          mi18n_name: 'Event',
        },
      ],
      alert: false,
      alert_id: 0,
      timezone: 8,
      t: '1640995200',
      pic_list: [],
      pic_total: 0,
      pic_type_list: [],
      pic_alert: false,
      pic_alert_id: 0,
      static_sign: 'test_sign',
    },
  }
}
