import { z } from 'zod'

import { createRangeSchema } from '@/schemas'

/**
 * Dynamic promote level validation schema factory (0 to maxPromoteLevel)
 * @param maxPromoteLevel Maximum promote level for character/weapon
 * @returns Zod number schema for promote level validation
 */
export function createPromoteLevelSchema(maxPromoteLevel: number): z.ZodNumber {
  return createRangeSchema(0, maxPromoteLevel, 'promoteLevel')
}
