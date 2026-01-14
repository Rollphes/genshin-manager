import { z } from 'zod'

import { createRangeSchema } from '@/schemas/createRangeSchema'

/**
 * Dynamic artifact level validation schema factory (0 to maxLevel)
 * @param maxLevel Maximum artifact level based on rarity
 * @returns Zod number schema for artifact level validation
 */
export function createArtifactLevelSchema(maxLevel: number): z.ZodNumber {
  return createRangeSchema(0, maxLevel, 'artifact level')
}
