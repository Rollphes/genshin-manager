/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

export const ReliquarySetExcelConfigDataSchema = z.object({
  bagSortValue: z.number(),
  containsList: z.array(z.number()),
  disableFilter: z.number(),
  dungeonGroup: z.array(z.number()),
  equipAffixId: z.number(),
  setIcon: z.string(),
  setId: z.number(),
  setNeedNum: z.array(z.number()),
  textList: z.array(z.number()),
})
export type ReliquarySetExcelConfigData = z.infer<
  typeof ReliquarySetExcelConfigDataSchema
>
