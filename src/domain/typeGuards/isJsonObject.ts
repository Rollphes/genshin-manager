import type { JsonObject, JsonValue } from '@/domain/types/json'

/**
 * Type guard for JsonObject (non-array object)
 * @param value - Value to check
 * @returns true if value is JsonObject
 */
export function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
