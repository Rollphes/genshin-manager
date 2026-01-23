import type { JsonValue } from '@/types/json'

/**
 * Check if two values match according to strategy
 * @param value1 - First value
 * @param value2 - Second value
 * @param strategy - Matching strategy
 * @returns whether values match
 */
export function matchValues(
  value1: JsonValue,
  value2: JsonValue,
  strategy: 'exact' | 'subset' | 'fuzzy',
): boolean {
  if (strategy === 'exact') return value1 === value2

  if (strategy === 'fuzzy') {
    if (typeof value1 === typeof value2) {
      if (typeof value1 === 'string' && typeof value2 === 'string')
        return value1.toLowerCase() === value2.toLowerCase()

      if (typeof value1 === 'number' && typeof value2 === 'number')
        return Math.abs(value1 - value2) < 0.001
    }
  }

  if (value1 === null || value1 === undefined)
    return value2 === null || value2 === undefined

  return value1 === value2
}
