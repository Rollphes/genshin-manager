/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

export const DungeonLevelEntityConfigDataSchema = z.object({
  abilityGroupName: z.string(),
  clientId: z.number(),
  descTextMapHash: z.number(),
  id: z.number(),
  levelConfigName: z.string(),
  show: z.boolean(),
  switchTitleTextMapHash: z.number(),
})
export type DungeonLevelEntityConfigData = z.infer<
  typeof DungeonLevelEntityConfigDataSchema
>
