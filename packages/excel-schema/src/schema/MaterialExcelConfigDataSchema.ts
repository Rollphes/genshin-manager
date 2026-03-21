/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

import { DestroyEnum } from '@/enum/Destroy'
import { FoodQualityEnum } from '@/enum/FoodQuality'
import { ItemEnum } from '@/enum/Item'
import { ItemUseEnum } from '@/enum/ItemUse'
import { ItemUseTargetEnum } from '@/enum/ItemUseTarget'
import { MaterialEnum } from '@/enum/Material'

export const EffectIconSchema = z.enum([
  '',
  'UI_Buff_Fireworks',
  'UI_Buff_Item_Adventure',
  'UI_Buff_Item_Atk_Add',
  'UI_Buff_Item_Atk_CritRate',
  'UI_Buff_Item_Atk_ElementHurt_Elect',
  'UI_Buff_Item_Atk_ElementHurt_Fire',
  'UI_Buff_Item_Atk_ElementHurt_Grass',
  'UI_Buff_Item_Atk_ElementHurt_Ice',
  'UI_Buff_Item_Atk_ElementHurt_Rock',
  'UI_Buff_Item_Atk_ElementHurt_Water',
  'UI_Buff_Item_Atk_ElementHurt_Wind',
  'UI_Buff_Item_Climate_Heat',
  'UI_Buff_Item_Def_Add',
  'UI_Buff_Item_Def_Resistance_Elect',
  'UI_Buff_Item_Def_Resistance_Fire',
  'UI_Buff_Item_Def_Resistance_Grass',
  'UI_Buff_Item_Def_Resistance_Ice',
  'UI_Buff_Item_Def_Resistance_Rock',
  'UI_Buff_Item_Def_Resistance_Water',
  'UI_Buff_Item_Def_Resistance_Wind',
  'UI_Buff_Item_Other_SPAdd',
  'UI_Buff_Item_Other_SPReduceConsume',
  'UI_Buff_Item_Recovery_HpAdd',
  'UI_Buff_Item_Recovery_HpAddAll',
  'UI_Buff_Item_Recovery_Revive',
  'UI_Buff_Item_SpecialEffect',
])
export type EffectIcon = z.infer<typeof EffectIconSchema>

export const EffectNameSchema = z.enum([
  'Eff_RockCrystal_Absorb',
  'Eff_SceneObj_CelestiaSplinter_Absorb',
  'Eff_SceneObj_DendroCrystal_Absorb',
  'Eff_SceneObj_ElectricCrystal_Absorb',
  'Eff_SceneObj_EssenceTreasure_01_Absorb',
  'Eff_SceneObj_FontaineCrystal_Absorb',
  'Eff_SceneObj_LuminousEnergy_01_Absorb',
  'Eff_SceneObj_MagicBookPage_Absorb',
  'Eff_SceneObj_MoonlitSigil_01_Absorb',
  'Eff_SceneObj_NataCrystal_Absorb',
  'Eff_SceneObj_NodKraiCrystal_Absorb',
  'Eff_SceneObj_PenumbraTicket_Collect_01',
  'Eff_WindCrystal_Absorb',
  '',
])
export type EffectName = z.infer<typeof EffectNameSchema>

export const ItemUseSchema = z.object({
  useOp: ItemUseEnum,
  useParam: z.array(z.string()),
})
export type ItemUse = z.infer<typeof ItemUseSchema>

export const MaterialExcelConfigDataSchema = z.object({
  cdGroup: z.number(),
  cdTime: z.number(),
  dropable: z.boolean(),
  descTextMapHash: z.number(),
  destroyReturnMaterial: z.array(z.any()),
  destroyReturnMaterialCount: z.array(z.any()),
  destroyRule: DestroyEnum,
  effectDescTextMapHash: z.number(),
  effectGadgetID: z.number(),
  effectIcon: EffectIconSchema,
  effectName: EffectNameSchema,
  foodQuality: FoodQualityEnum,
  gadgetId: z.number(),
  globalItemLimit: z.number(),
  icon: z.string(),
  id: z.number(),
  interactionTitleTextMapHash: z.number(),
  itemType: ItemEnum,
  itemUse: z.array(ItemUseSchema),
  materialType: MaterialEnum,
  maxUseCount: z.number(),
  nameTextMapHash: z.number(),
  picPath: z.array(z.string()),
  rank: z.number(),
  rankLevel: z.number(),
  satiationParams: z.array(z.number()),
  setID: z.number(),
  specialDescTextMapHash: z.number(),
  stackLimit: z.number(),
  typeDescTextMapHash: z.number(),
  useLevel: z.number(),
  useTarget: ItemUseTargetEnum,
  weight: z.number(),
})
export type MaterialExcelConfigData = z.infer<
  typeof MaterialExcelConfigDataSchema
>
