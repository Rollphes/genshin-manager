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

export const FetterInfoExcelConfigDataSchema = z.object({
  avatarAssocType: z.string(),
  avatarConstellationAfterTextMapHash: z.number(),
  avatarConstellationBeforTextMapHash: z.number(),
  avatarDetailTextMapHash: z.number(),
  avatarId: z.number(),
  avatarNativeTextMapHash: z.number(),
  avatarTitleTextMapHash: z.number(),
  avatarVisionAfterTextMapHash: z.number(),
  avatarVisionBeforTextMapHash: z.number(),
  cvChineseTextMapHash: z.number(),
  cvEnglishTextMapHash: z.number(),
  cvJapaneseTextMapHash: z.number(),
  cvKoreanTextMapHash: z.number(),
  fetterId: z.number(),
  finishConds: z.array(FinishCondSchema),
  infoBirthDay: z.number(),
  infoBirthMonth: z.number(),
  isHiden: z.boolean(),
  openConds: z.array(z.any()),
})
export type FetterInfoExcelConfigData = z.infer<
  typeof FetterInfoExcelConfigDataSchema
>
