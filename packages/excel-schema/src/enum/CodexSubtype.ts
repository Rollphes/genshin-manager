/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'
/** Zod enum schema for CodexSubtype. */
export const CodexSubtypeEnum = z.enum([
  'CODEX_SUBTYPE_ABYSS',
  'CODEX_SUBTYPE_ANIMAL',
  'CODEX_SUBTYPE_AUTOMATRON',
  'CODEX_SUBTYPE_AVIARY',
  'CODEX_SUBTYPE_BEAST',
  'CODEX_SUBTYPE_BOSS',
  'CODEX_SUBTYPE_CRITTER',
  'CODEX_SUBTYPE_ELEMENTAL',
  'CODEX_SUBTYPE_FATUI',
  'CODEX_SUBTYPE_FISH',
  'CODEX_SUBTYPE_HILICHURL',
  'CODEX_SUBTYPE_HUMAN',
])
/** Type representing CodexSubtype. */
export type CodexSubtype = z.infer<typeof CodexSubtypeEnum>
