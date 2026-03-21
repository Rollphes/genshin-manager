/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

import { FetterCondEnum } from '@/enum/FetterCond'

export const FinishCondSchema = z.object({
  condType: FetterCondEnum,
  paramList: z.array(z.number()),
})
export type FinishCond = z.infer<typeof FinishCondSchema>

export const FetterStoryExcelConfigDataSchema = z.object({
  avatarId: z.number(),
  fetterId: z.number(),
  finishConds: z.array(FinishCondSchema),
  isHiden: z.boolean(),
  storyContext2TextMapHash: z.number(),
  storyContextTextMapHash: z.number(),
  storyTitle2TextMapHash: z.number(),
  storyTitleLockedTextMapHash: z.number(),
  storyTitleTextMapHash: z.number(),
  tips: z.array(z.number()),
})
export type FetterStoryExcelConfigData = z.infer<
  typeof FetterStoryExcelConfigDataSchema
>
