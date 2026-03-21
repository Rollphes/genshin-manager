/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

import { FightPropEnum } from '@/enum/FightProp'
import { ProudEffectEnum } from '@/enum/ProudEffect'

export const FilterCondSchema = z.enum(['TALENT_FILTER_NONE'])
export type FilterCond = z.infer<typeof FilterCondSchema>

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

export const ProudSkillExcelConfigDataSchema = z.object({
  addProps: z.array(AddPropSchema),
  breakLevel: z.number(),
  coinCost: z.number(),
  descTextMapHash: z.number(),
  filterConds: z.array(FilterCondSchema),
  icon: z.string(),
  isHideLifeProudSkill: z.boolean(),
  level: z.number(),
  lifeEffectParams: z.array(z.string()),
  lifeEffectType: ProudEffectEnum,
  nameTextMapHash: z.number(),
  openConfig: z.string(),
  paramDescList: z.array(z.number()),
  paramList: z.array(z.number()),
  proudSkillGroupId: z.number(),
  proudSkillId: z.number(),
  proudSkillType: z.number(),
  unlockDescTextMapHash: z.number(),
  costItems: z.array(CostItemSchema).optional(),
})
export type ProudSkillExcelConfigData = z.infer<
  typeof ProudSkillExcelConfigDataSchema
>
