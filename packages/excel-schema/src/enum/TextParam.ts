/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'
/** Zod enum schema for TextParam. */
export const TextParamEnum = z.enum([
  'TEXT_PARAM_AVATAR_NAME',
  'TEXT_PARAM_NONE',
  'TEXT_PARAM_ROUTINE_TYPE',
])
/** Type representing TextParam. */
export type TextParam = z.infer<typeof TextParamEnum>
