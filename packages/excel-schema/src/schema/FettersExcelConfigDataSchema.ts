/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

import { FetterCondEnum } from '@/enum/FetterCond'

export const OpenCondSchema = z.object({
  condType: FetterCondEnum,
  paramList: z.array(z.number()),
})
export type OpenCond = z.infer<typeof OpenCondSchema>

export const FettersExcelConfigDataSchema = z.object({
  avatarId: z.number(),
  fetterId: z.number(),
  finishConds: z.array(z.any()),
  hideCostumeList: z.array(z.number()),
  isHiden: z.boolean(),
  openConds: z.array(OpenCondSchema),
  showCostumeList: z.array(z.number()),
  tips: z.array(z.number()),
  type: z.number(),
  voiceFile: z.string(),
  voiceFileTextTextMapHash: z.number(),
  voiceTitleLockedTextMapHash: z.number(),
  voiceTitleTextMapHash: z.number(),
})
export type FettersExcelConfigData = z.infer<
  typeof FettersExcelConfigDataSchema
>
