import type { z } from 'zod'

import { createRangeSchema } from '@/schemas/createRangeSchema'

/**
 * Update interval validation schema factory (minInterval to maxInterval)
 * @param minInterval - Minimum interval value
 * @param maxInterval - Maximum interval value (default: 2147483647)
 * @returns Zod number schema for update interval validation
 */
export function createUpdateIntervalSchema(
  minInterval: number,
  maxInterval = 2147483647,
): z.ZodNumber {
  return createRangeSchema(minInterval, maxInterval, 'updateInterval')
}
