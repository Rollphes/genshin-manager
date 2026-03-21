/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'
/** Zod enum schema for ItemUseTarget. */
export const ItemUseTargetEnum = z.enum([
  'ITEM_USE_TARGET_CUR_TEAM',
  'ITEM_USE_TARGET_NONE',
  'ITEM_USE_TARGET_PLAYER_AVATAR',
  'ITEM_USE_TARGET_SPECIFY_ALIVE_AVATAR',
  'ITEM_USE_TARGET_SPECIFY_AVATAR',
  'ITEM_USE_TARGET_SPECIFY_DEAD_AVATAR',
])
/** Type representing ItemUseTarget. */
export type ItemUseTarget = z.infer<typeof ItemUseTargetEnum>
