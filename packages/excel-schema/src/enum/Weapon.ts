/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'
/** Zod enum schema for Weapon. */
export const WeaponEnum = z.enum([
  'WEAPON_BOW',
  'WEAPON_CATALYST',
  'WEAPON_CLAYMORE',
  'WEAPON_POLE',
  'WEAPON_SWORD_ONE_HAND',
])
/** Type representing Weapon. */
export type Weapon = z.infer<typeof WeaponEnum>
