/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

import { TextParamEnum } from '@/enum/TextParam'

export const ManualTextMapConfigDataSchema = z.object({
  paramTypes: z.array(TextParamEnum),
  textMapContentTextMapHash: z.number(),
  textMapId: z.string(),
})
export type ManualTextMapConfigData = z.infer<
  typeof ManualTextMapConfigDataSchema
>
