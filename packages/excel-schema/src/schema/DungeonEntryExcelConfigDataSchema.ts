/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

import { DungeonEntryConditionEnum } from '@/enum/DungeonEntryCondition'
import { LogicEnum } from '@/enum/Logic'

export const SatisfiedCondSchema = z.object({
  param1: z.number(),
  param2: z.number(),
  type: DungeonEntryConditionEnum,
})
export type SatisfiedCond = z.infer<typeof SatisfiedCondSchema>

export const DungeonEntryExcelConfigDataSchema = z.object({
  condComb: LogicEnum,
  cooldownTipsDungeonId: z.array(z.number()),
  descriptionCycleRewardList: z.array(z.array(z.number())),
  descTextMapHash: z.number(),
  dungeonEntryId: z.number(),
  id: z.number(),
  isDefaultOpen: z.boolean(),
  isShowInAdvHandbook: z.boolean(),
  picPath: z.string(),
  rewardDataId: z.number(),
  satisfiedCond: z.array(SatisfiedCondSchema),
  sceneId: z.number(),
  systemOpenUiId: z.number(),
  type: z.string(),
})
export type DungeonEntryExcelConfigData = z.infer<
  typeof DungeonEntryExcelConfigDataSchema
>
