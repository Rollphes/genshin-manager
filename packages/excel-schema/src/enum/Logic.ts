/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'
/** Zod enum schema for Logic. */
export const LogicEnum = z.enum(['LOGIC_NONE', 'LOGIC_OR'])
/** Type representing Logic. */
export type Logic = z.infer<typeof LogicEnum>
