import type { JsonArray, JsonValue } from '@/types'

/**
 * Check if two values match according to strategy
 * @param value1 - First value (pattern)
 * @param value2 - Second value (target to match against)
 * @param strategy - Matching strategy
 * @returns whether values match
 */
export function matchValues(
  value1: JsonValue,
  value2: JsonValue,
  strategy: 'exact' | 'subset' | 'fuzzy',
): boolean {
  // Handle null/undefined
  if (value1 === null || value1 === undefined)
    return value2 === null || value2 === undefined

  if (value2 === null || value2 === undefined) return false

  switch (strategy) {
    case 'exact':
      return value1 === value2

    case 'fuzzy':
      if (typeof value1 === typeof value2) {
        if (typeof value1 === 'string' && typeof value2 === 'string')
          return value1.toLowerCase() === value2.toLowerCase()

        if (typeof value1 === 'number' && typeof value2 === 'number')
          return Math.abs(value1 - value2) < 0.001
      }
      return value1 === value2

    case 'subset':
      return matchSubset(value1, value2)
  }
}

/**
 * Check if value1 is a subset of value2
 * @param value1 - Pattern value
 * @param value2 - Target value
 * @returns whether value1 is subset of value2
 */
function matchSubset(value1: JsonValue, value2: JsonValue): boolean {
  // Primitives: exact match
  if (typeof value1 !== 'object' || typeof value2 !== 'object')
    return value1 === value2

  // Handle null (typeof null === 'object')
  if (value1 === null || value2 === null) return value1 === value2

  // Arrays: value1 elements are subset of value2 elements
  if (Array.isArray(value1) && Array.isArray(value2)) {
    const arr1: JsonArray = value1
    const arr2: JsonArray = value2
    return arr1.every((item1) =>
      arr2.some((item2) => matchValues(item1, item2, 'subset')),
    )
  }

  // Objects: value1 keys/values are subset of value2
  if (!Array.isArray(value1) && !Array.isArray(value2)) {
    const obj1 = value1 as Record<string, JsonValue>
    const obj2 = value2 as Record<string, JsonValue>
    return Object.entries(obj1).every(([key, val1]) => {
      if (!(key in obj2)) return false
      return matchValues(val1, obj2[key], 'subset')
    })
  }

  // Array vs Object mismatch
  return false
}
