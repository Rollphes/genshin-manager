/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

import { FightPropEnum } from '@/enum/FightProp'

export const AddPropSchema = z.object({
  propType: FightPropEnum,
  value: z.number(),
})
export type AddProp = z.infer<typeof AddPropSchema>

export const AvatarTalentExcelConfigDataSchema = z.object({
  addProps: z.array(AddPropSchema),
  descTextMapHash: z.number(),
  icon: z.string(),
  mainCostItemCount: z.number(),
  mainCostItemId: z.number(),
  nameTextMapHash: z.number(),
  openConfig: z.string(),
  paramList: z.array(z.number()),
  prevTalent: z.number(),
  talentId: z.number(),
})
export type AvatarTalentExcelConfigData = z.infer<
  typeof AvatarTalentExcelConfigDataSchema
>
