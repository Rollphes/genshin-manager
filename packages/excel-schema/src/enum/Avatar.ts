/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'
/** Zod enum schema for Avatar. */
export const AvatarEnum = z.enum([
  'AVATAR_ABANDON',
  'AVATAR_FORMAL',
  'AVATAR_SYNC_TEST',
  'AVATAR_TEST',
])
/** Type representing Avatar. */
export type Avatar = z.infer<typeof AvatarEnum>
