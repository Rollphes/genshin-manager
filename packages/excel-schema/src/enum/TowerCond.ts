/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'
/** Zod enum schema for TowerCond. */
export const TowerCondEnum = z.enum([
  'TOWER_COND_CHALLENGE_LEFT_TIME_MORE_THAN',
  'TOWER_COND_LEFT_HP_GREATER_THAN',
])
/** Type representing TowerCond. */
export type TowerCond = z.infer<typeof TowerCondEnum>
