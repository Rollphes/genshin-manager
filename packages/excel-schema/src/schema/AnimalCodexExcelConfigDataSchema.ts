/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

import { CodexEnum } from '@/enum/Codex'
import { CodexCountTypeEnum } from '@/enum/CodexCountType'
import { CodexSubtypeEnum } from '@/enum/CodexSubtype'

export const AnimalCodexExcelConfigDataSchema = z.object({
  countType: CodexCountTypeEnum,
  describeId: z.number(),
  descTextMapHash: z.number(),
  id: z.number(),
  isDisuse: z.boolean(),
  isSeenActive: z.boolean(),
  modelPath: z.string(),
  pushTipsCodexId: z.number(),
  showOnlyUnlocked: z.boolean(),
  sortOrder: z.number(),
  subType: CodexSubtypeEnum,
  type: CodexEnum,
})
export type AnimalCodexExcelConfigData = z.infer<
  typeof AnimalCodexExcelConfigDataSchema
>
