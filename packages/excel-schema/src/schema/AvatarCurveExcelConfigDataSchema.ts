/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'

import { GrowCurveEnum } from '@/enum/GrowCurve'

export const ArithSchema = z.enum(['ARITH_MULTI'])
export type Arith = z.infer<typeof ArithSchema>

export const CurveInfoSchema = z.object({
  arith: ArithSchema,
  type: GrowCurveEnum,
  value: z.number(),
})
export type CurveInfo = z.infer<typeof CurveInfoSchema>

export const AvatarCurveExcelConfigDataSchema = z.object({
  curveInfos: z.array(CurveInfoSchema),
  level: z.number(),
})
export type AvatarCurveExcelConfigData = z.infer<
  typeof AvatarCurveExcelConfigDataSchema
>
