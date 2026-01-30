/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable @typescript-eslint/naming-convention */

import type { AnnouncementQuery } from '@/types/api/queries'
import type {
  GetAnnContentResponse,
  GetAnnListResponse,
} from '@/types/api/responses'

export interface HoyoverseApiRoutes {
  readonly '/common/hk4e_global/announcement/api/getAnnList': {
    readonly query: AnnouncementQuery
    readonly response: GetAnnListResponse
  }
}

export interface HoyoverseStaticApiRoutes {
  readonly '/common/hk4e_global/announcement/api/getAnnContent': {
    readonly query: AnnouncementQuery
    readonly response: GetAnnContentResponse
  }
}
