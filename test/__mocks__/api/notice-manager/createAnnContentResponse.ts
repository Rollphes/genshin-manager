import { ValueOf } from '@/types/types'
import { NoticeLanguage } from '@/types/sg-hk4e-api'
import type { APIGetAnnContent } from '@/types/sg-hk4e-api/response'

/**
 * Creates mock AnnContent response for API testing
 * @param annIds - Array of announcement IDs to include
 * @param language - Language code for the responses
 * @returns Mock APIGetAnnContent response
 */
export function createAnnContentResponse(
  annIds: number[],
  language: ValueOf<typeof NoticeLanguage> = 'en-us',
): APIGetAnnContent {
  return {
    retcode: 0,
    message: 'OK',
    data: {
      list: annIds.map((id) => ({
        ann_id: id,
        title: `Test Notice ${String(id)}`,
        subtitle: `Test Subtitle ${String(id)}`,
        banner: `https://test.com/banner${String(id)}.jpg`,
        content: `<p>Test content ${String(id)}</p>`,
        lang: language,
      })),
      total: annIds.length,
      pic_list: [],
      pic_total: 0,
    },
  }
}
