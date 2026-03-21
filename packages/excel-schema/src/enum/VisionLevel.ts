/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'
/** Zod enum schema for VisionLevel. */
export const VisionLevelEnum = z.enum([
  'VISION_LEVEL_LITTLE_REMOTE',
  'VISION_LEVEL_NEARBY',
  'VISION_LEVEL_NORMAL',
  'VISION_LEVEL_REMOTE',
  'VISION_LEVEL_SUPER',
  'VISION_LEVEL_SUPER_NEARBY',
])
/** Type representing VisionLevel. */
export type VisionLevel = z.infer<typeof VisionLevelEnum>
