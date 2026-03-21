/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'
/** Zod enum schema for FetterCond. */
export const FetterCondEnum = z.enum([
  'FETTER_COND_AVATAR_LEVEL',
  'FETTER_COND_AVATAR_PROMOTE_LEVEL',
  'FETTER_COND_FETTER_LEVEL',
  'FETTER_COND_FINISH_PARENT_QUEST',
  'FETTER_COND_FINISH_QUEST',
  'FETTER_COND_NONE',
  'FETTER_COND_NOT_OPEN',
  'FETTER_COND_PLAYER_BIRTHDAY',
  'FETTER_COND_UNLOCK_TRANS_POINT',
])
/** Type representing FetterCond. */
export type FetterCond = z.infer<typeof FetterCondEnum>
