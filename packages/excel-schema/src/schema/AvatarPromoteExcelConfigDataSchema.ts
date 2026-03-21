/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

import { FightPropEnum } from '@/enum/FightProp'

export const AddPropSchema = z.object({
  propType: FightPropEnum,
  value: z.number(),
})
export type AddProp = z.infer<typeof AddPropSchema>

export const CostItemSchema = z.object({
  count: z.number(),
  id: z.number(),
})
export type CostItem = z.infer<typeof CostItemSchema>

export const AvatarPromoteExcelConfigDataSchema = z.object({
  addProps: z.array(AddPropSchema),
  avatarPromoteId: z.number(),
  promoteAudio: z.string(),
  promoteLevel: z.number(),
  requiredPlayerLevel: z.number(),
  scoinCost: z.number(),
  unlockMaxLevel: z.number(),
  costItems: z.array(CostItemSchema).optional(),
})
export type AvatarPromoteExcelConfigData = z.infer<
  typeof AvatarPromoteExcelConfigDataSchema
>
