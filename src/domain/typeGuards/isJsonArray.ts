import type { JsonArray, JsonValue } from '@/domain/types/json'

/**
 * Type guard for JsonArray
 * @param value - Value to check
 * @returns true if value is JsonArray
 */
export function isJsonArray(value: JsonValue): value is JsonArray {
  return Array.isArray(value)
}
