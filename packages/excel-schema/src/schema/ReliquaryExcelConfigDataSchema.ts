/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

import { DestroyEnum } from '@/enum/Destroy'
import { EquipEnum } from '@/enum/Equip'

export const ItemTypeSchema = z.enum(['ITEM_RELIQUARY'])
export type ItemType = z.infer<typeof ItemTypeSchema>

export const ReliquaryExcelConfigDataSchema = z.object({
  addPropLevels: z.array(z.number()),
  appendPropDepotId: z.number(),
  appendPropNum: z.number(),
  baseConvExp: z.number(),
  descTextMapHash: z.number(),
  destroyReturnMaterial: z.array(z.number()),
  destroyReturnMaterialCount: z.array(z.number()),
  destroyRule: DestroyEnum,
  dropable: z.boolean(),
  equipType: EquipEnum,
  gadgetId: z.number(),
  globalItemLimit: z.number(),
  icon: z.string(),
  id: z.number(),
  initialLockState: z.number(),
  itemType: ItemTypeSchema,
  mainPropDepotId: z.number(),
  maxLevel: z.number(),
  nameTextMapHash: z.number(),
  rank: z.number(),
  rankLevel: z.number(),
  setId: z.number(),
  showPic: z.string(),
  storyId: z.number(),
  useLevel: z.number(),
  weight: z.number(),
})
export type ReliquaryExcelConfigData = z.infer<
  typeof ReliquaryExcelConfigDataSchema
>
