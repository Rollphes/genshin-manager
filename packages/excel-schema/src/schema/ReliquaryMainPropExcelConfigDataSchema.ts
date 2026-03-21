/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

export const ReliquaryMainPropExcelConfigDataSchema = z.object({
  affixName: z.string(),
  id: z.number(),
  propDepotId: z.number(),
  propType: z.string(),
})
export type ReliquaryMainPropExcelConfigData = z.infer<
  typeof ReliquaryMainPropExcelConfigDataSchema
>
