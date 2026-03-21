/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

export const BgImageSchema = z.enum([
  'UI_TowerPic_1',
  'UI_TowerPic_10',
  'UI_TowerPic_11',
  'UI_TowerPic_2',
  'UI_TowerPic_3',
  'UI_TowerPic_4',
  'UI_TowerPic_5',
  'UI_TowerPic_8',
  'UI_TowerPic_9',
])
export type BgImage = z.infer<typeof BgImageSchema>

export const TowerFloorExcelConfigDataSchema = z.object({
  bgImage: BgImageSchema,
  floorId: z.number(),
  floorIndex: z.number(),
  floorLevelConfigId: z.number(),
  levelGroupId: z.number(),
  overrideMonsterLevel: z.number(),
  rewardIdFifteenStars: z.number(),
  rewardIdFiveStars: z.number(),
  rewardIdNineStars: z.number(),
  rewardIdSixStars: z.number(),
  rewardIdTenStars: z.number(),
  rewardIdThreeStars: z.number(),
  teamNum: z.number(),
  unlockStarCount: z.number(),
})
export type TowerFloorExcelConfigData = z.infer<
  typeof TowerFloorExcelConfigDataSchema
>
