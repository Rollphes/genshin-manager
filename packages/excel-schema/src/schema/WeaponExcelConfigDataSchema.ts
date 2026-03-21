/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

import { DestroyEnum } from '@/enum/Destroy'
import { FightPropEnum } from '@/enum/FightProp'
import { GrowCurveEnum } from '@/enum/GrowCurve'
import { WeaponEnum } from '@/enum/Weapon'

export const ItemTypeSchema = z.enum(['ITEM_WEAPON'])
export type ItemType = z.infer<typeof ItemTypeSchema>

export const MaterialTypeSchema = z.enum(['WEAPON_MATERIAL_NONE'])
export type MaterialType = z.infer<typeof MaterialTypeSchema>

export const WeaponPropSchema = z.object({
  initValue: z.number(),
  propType: FightPropEnum,
  type: GrowCurveEnum,
})
export type WeaponProp = z.infer<typeof WeaponPropSchema>

export const WeaponExcelConfigDataSchema = z.object({
  awakenCosts: z.array(z.number()),
  awakenIcon: z.string(),
  awakenLightMapTexture: z.string(),
  awakenMaterial: z.number(),
  awakenTexture: z.string(),
  descTextMapHash: z.number(),
  destroyReturnMaterial: z.array(z.number()),
  destroyReturnMaterialCount: z.array(z.number()),
  destroyRule: DestroyEnum,
  dropable: z.boolean(),
  gachaCardNameHash: z.string(),
  gadgetId: z.number(),
  globalItemLimit: z.number(),
  icon: z.string(),
  weaponPromoteId: z.number(),
  initialLockState: z.number(),
  itemType: ItemTypeSchema,
  materialType: MaterialTypeSchema,
  nameTextMapHash: z.number(),
  rank: z.number(),
  rankLevel: z.number(),
  skillAffix: z.array(z.number()),
  storyId: z.number(),
  useLevel: z.number(),
  weaponBaseExp: z.number(),
  weaponProp: z.array(WeaponPropSchema),
  weaponType: WeaponEnum,
  weight: z.number(),
  id: z.number().optional(),
  unRotate: z.boolean().optional(),
})
export type WeaponExcelConfigData = z.infer<typeof WeaponExcelConfigDataSchema>
