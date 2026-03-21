/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'
/** Zod enum schema for Drag. */
export const DragEnum = z.enum([
  'DRAG_NONE',
  'DRAG_ROTATE_CAMERA',
  'DRAG_ROTATE_CHARACTER',
])
/** Type representing Drag. */
export type Drag = z.infer<typeof DragEnum>
