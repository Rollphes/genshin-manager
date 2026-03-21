/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T17:11:38.550Z
 */
import { z } from 'zod'
/** Zod enum schema for Destroy. */
export const DestroyEnum = z.enum(['DESTROY_NONE', 'DESTROY_RETURN_MATERIAL'])
/** Type representing Destroy. */
export type Destroy = z.infer<typeof DestroyEnum>
