import { z } from 'zod'

import { createRangeSchema } from '@/schemas'

/**
 * Update interval validation schema factory (minInterval to maxInterval)
 */
export function createUpdateIntervalSchema(
  minInterval: number,
  maxInterval = 2147483647,
): z.ZodNumber {
  return createRangeSchema(minInterval, maxInterval, 'updateInterval')
}
