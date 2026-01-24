import type { z } from 'zod'

import { createRangeSchema } from '@/domain/schemas/createRangeSchema'

/**
 * Dynamic weapon level validation schema factory (1 to maxLevel)
 * @param maxLevel - Maximum weapon level based on ascension
 * @returns Zod number schema for weapon level validation
 */
export function createDynamicWeaponLevelSchema(maxLevel: number): z.ZodNumber {
  return createRangeSchema(1, maxLevel, 'weapon level')
}
