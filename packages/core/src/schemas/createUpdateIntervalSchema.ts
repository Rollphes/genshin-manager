import type { z } from 'zod'

import { createRangeSchema } from '@/schemas/createRangeSchema'

/**
 * Update interval validation schema factory (minInterval to maxInterval)
 * @param minInterval - Minimum interval value
 * @param maxInterval - Maximum interval value (default: Int32 max for setTimeout compatibility)
 * @returns Zod number schema for update interval validation
 */
export function createUpdateIntervalSchema(
  minInterval: number,
  // Int32 max (2^31-1): setTimeout/setInterval limit in JS environments (~24.8 days)
  maxInterval = 2147483647,
): z.ZodNumber {
  return createRangeSchema(minInterval, maxInterval, 'updateInterval')
}
