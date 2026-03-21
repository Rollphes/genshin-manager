/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'
/** Zod enum schema for AvatarIdentity. */
export const AvatarIdentityEnum = z.enum([
  'AVATAR_IDENTITY_MASTER',
  'AVATAR_IDENTITY_NORMAL',
])
/** Type representing AvatarIdentity. */
export type AvatarIdentity = z.infer<typeof AvatarIdentityEnum>
