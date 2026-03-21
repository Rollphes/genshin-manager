/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'
/** Zod enum schema for CodexCountType. */
export const CodexCountTypeEnum = z.enum([
  'CODEX_COUNT_TYPE_CAPTURE',
  'CODEX_COUNT_TYPE_FISH',
  'CODEX_COUNT_TYPE_KILL',
  'CODEX_COUNT_TYPE_NONE',
])
/** Type representing CodexCountType. */
export type CodexCountType = z.infer<typeof CodexCountTypeEnum>
