/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

import { TowerCondEnum } from '@/enum/TowerCond'

export const CondSchema = z.object({
  argumentList: z.array(z.number()),
  argumentListUpper: z.array(z.number()),
  towerCondType: TowerCondEnum,
})
export type Cond = z.infer<typeof CondSchema>

export const TowerLevelExcelConfigDataSchema = z.object({
  conds: z.array(CondSchema),
  dungeonId: z.number(),
  firstMonsterList: z.array(z.number()),
  firstPassRewardId: z.number(),
  levelGroupId: z.number(),
  levelId: z.number(),
  levelIndex: z.number(),
  monsterLevel: z.number(),
  secondMonsterList: z.array(z.number()),
  towerBuffConfigStrList: z.array(z.string()),
})
export type TowerLevelExcelConfigData = z.infer<
  typeof TowerLevelExcelConfigDataSchema
>
