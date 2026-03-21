/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

export const ProfilePictureExcelConfigDataSchema = z.object({
  iconPath: z.string(),
  id: z.number(),
  nameTextMapHash: z.number(),
  priority: z.number().optional(),
  unlockDescTextMapHash: z.number(),
  unlockParam: z.number(),
})
export type ProfilePictureExcelConfigData = z.infer<
  typeof ProfilePictureExcelConfigDataSchema
>
