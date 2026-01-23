import type { JsonObject } from '@/domain/types/json'

/**
 * Safely cast a typed object to JsonObject for generic JSON operations
 *
 * @remarks
 * This cast is safe because:
 * - All GeneratedMasterFileMap types are JSON-serializable by construction
 * - They are loaded from JSON files and decoded through type-safe decoders
 * - The structural types satisfy JsonObject's interface requirement
 *
 * TypeScript cannot verify this at compile time because generated types
 * lack explicit index signatures (which would break PrimitiveKeys inference)
 *
 * @param value - Any object to cast to JsonObject
 * @returns The same object typed as JsonObject
 */
export function asJsonObject(value: object): JsonObject {
  return value as unknown as JsonObject
}

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
