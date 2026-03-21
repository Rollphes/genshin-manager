/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

export const MonsterDescribeExcelConfigDataSchema = z.object({
  icon: z.string(),
  id: z.number(),
  nameTextMapHash: z.number(),
  specialNameLabID: z.number(),
  titleID: z.number(),
})
export type MonsterDescribeExcelConfigData = z.infer<
  typeof MonsterDescribeExcelConfigDataSchema
>
