/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

export const AvatarCostumeExcelConfigDataSchema = z.object({
  animatorConfigPathHash: z.union([z.number(), z.string()]),
  characterId: z.number(),
  controllerPathHash: z.union([z.number(), z.string()]),
  controllerRemotePathHash: z.union([z.number(), z.string()]),
  descTextMapHash: z.number(),
  frontIconName: z.string(),
  hide: z.boolean(),
  imageNameHash: z.union([z.number(), z.string()]),
  indexID: z.number(),
  isDefault: z.boolean(),
  itemId: z.number(),
  jsonName: z.string(),
  nameTextMapHash: z.number(),
  prefabManekinPathHash: z.union([z.number(), z.string()]),
  prefabNpcPathHash: z.union([z.number(), z.string()]),
  prefabPathHash: z.union([z.number(), z.string()]),
  prefabRemotePathHash: z.union([z.number(), z.string()]),
  quality: z.number(),
  sideIconName: z.string(),
  skinId: z.number(),
})
export type AvatarCostumeExcelConfigData = z.infer<
  typeof AvatarCostumeExcelConfigDataSchema
>
