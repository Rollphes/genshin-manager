import type { GetAnnContentResponse } from '@/types/api/sg-hk4e-api/responses'

/**
 * Creates detailed mock AnnContent response with custom content
 * @param annId - Announcement ID
 * @param title - Custom title
 * @param subtitle - Custom subtitle
 * @param content - Custom HTML content
 * @param language - Language code
 * @returns Mock GetAnnContentResponse response
 */
export function createDetailedAnnContentResponse(
  annId: number,
  title: string,
  subtitle: string,
  content: string,
  language = 'en-us',
): GetAnnContentResponse {
  return {
    retcode: 0,
    message: 'OK',
    data: {
      list: [
        {
          ann_id: annId,
          title,
          subtitle,
          banner: `https://test.com/detailed_banner${String(annId)}.jpg`,
          content,
          lang: language,
        },
      ],
      total: 1,
      pic_list: [],
      pic_total: 0,
    },
  }
}
