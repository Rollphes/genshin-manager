/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'
/** Zod enum schema for Codex. */
export const CodexEnum = z.enum(['CODEX_ANIMAL', 'CODEX_MONSTER'])
/** Type representing Codex. */
export type Codex = z.infer<typeof CodexEnum>
