/**
 * @generated
 * @source b761e4d2e9e509eb8aa8c04c381b46d2308d7e85
 * @date 2026-03-21T01:00:54.549Z
 */
import { z } from 'zod'
/** Zod enum schema for Equip. */
export const EquipEnum = z.enum([
  'EQUIP_BRACER',
  'EQUIP_DRESS',
  'EQUIP_NECKLACE',
  'EQUIP_RING',
  'EQUIP_SHOES',
])
/** Type representing Equip. */
export type Equip = z.infer<typeof EquipEnum>
