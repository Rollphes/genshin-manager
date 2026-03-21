/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'
/** Zod enum schema for FightPropBase. */
export const FightPropBaseEnum = z.enum([
  'FIGHT_PROP_BASE_ATTACK',
  'FIGHT_PROP_BASE_DEFENSE',
  'FIGHT_PROP_BASE_HP',
])
/** Type representing FightPropBase. */
export type FightPropBase = z.infer<typeof FightPropBaseEnum>
