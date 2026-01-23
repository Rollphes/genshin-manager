import type { JsonObject } from '@/domain/types/json'

/**
 * Safely cast a typed object array to JsonObject array
 *
 * @param values - Array of objects to cast
 * @returns The same array typed as JsonObject[]
 */
export function asJsonObjectArray(
  values: readonly object[],
): readonly JsonObject[] {
  return values as unknown as readonly JsonObject[]
}
