/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'
/** Zod enum schema for DungeonEntryCondition. */
export const DungeonEntryConditionEnum = z.enum([
  'DUNGEON_ENTRY_CONDITION_LEVEL',
  'DUNGEON_ENTRY_CONDITION_NONE',
  'DUNGEON_ENTRY_CONDITION_QUEST',
])
/** Type representing DungeonEntryCondition. */
export type DungeonEntryCondition = z.infer<typeof DungeonEntryConditionEnum>
