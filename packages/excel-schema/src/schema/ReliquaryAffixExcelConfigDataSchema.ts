/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

export const ReliquaryAffixExcelConfigDataSchema = z.object({
  depotId: z.number(),
  groupId: z.number(),
  id: z.number(),
  propType: z.string(),
  propValue: z.number(),
})
export type ReliquaryAffixExcelConfigData = z.infer<
  typeof ReliquaryAffixExcelConfigDataSchema
>
