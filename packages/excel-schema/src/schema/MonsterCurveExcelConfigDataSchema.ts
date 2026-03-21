/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'

import { ArithEnum } from '@/enum/Arith'
import { GrowCurveEnum } from '@/enum/GrowCurve'

export const CurveInfoSchema = z.object({
  arith: ArithEnum,
  type: GrowCurveEnum,
  value: z.number(),
})
export type CurveInfo = z.infer<typeof CurveInfoSchema>

export const MonsterCurveExcelConfigDataSchema = z.object({
  curveInfos: z.array(CurveInfoSchema),
  level: z.number(),
})
export type MonsterCurveExcelConfigData = z.infer<
  typeof MonsterCurveExcelConfigDataSchema
>
