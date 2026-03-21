/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'
/** Zod enum schema for Body. */
export const BodyEnum = z.enum([
  'BODY_BOY',
  'BODY_GIRL',
  'BODY_LADY',
  'BODY_LOLI',
  'BODY_MALE',
])
/** Type representing Body. */
export type Body = z.infer<typeof BodyEnum>
