/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

export const TowerScheduleExcelConfigDataSchema = z.object({
  buffnameTextMapHash: z.number(),
  closeTime: z.coerce.date(),
  descTextMapHash: z.number(),
  entranceFloorId: z.array(z.number()),
  icon: z.string(),
  monthlyLevelConfigId: z.number(),
  rewardGroup: z.number(),
  scheduleId: z.number(),
})
export type TowerScheduleExcelConfigData = z.infer<
  typeof TowerScheduleExcelConfigDataSchema
>
