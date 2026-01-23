import { pathToString } from '@/domain/crypto/pathToString'
import type { KeyPath } from '@/domain/crypto/types'
import { isJsonArray } from '@/domain/typeGuards/isJsonArray'
import { isJsonObject } from '@/domain/typeGuards/isJsonObject'
import type { JsonValue } from '@/domain/types/json'

/**
 * Apply recursive decoding to an object using key mappings
 * @param obj - Object to decode
 * @param keyMappings - Map of encrypted key paths to original keys
 * @returns decoded object
 */
export function applyDecoding(
  obj: JsonValue,
  keyMappings: ReadonlyMap<KeyPath, string>,
): JsonValue {
  const stringMappings = convertToStringMap(keyMappings)
  return applyAtPath(obj, [], stringMappings)
}

/**
 * Convert KeyPath-based mappings to string-based mappings for faster lookup
 * @param keyMappings - Original key mappings with KeyPath keys
 * @returns string-based key mappings
 */
function convertToStringMap(
  keyMappings: ReadonlyMap<KeyPath, string>,
): Map<string, string> {
  const result = new Map<string, string>()
  for (const [path, key] of keyMappings) result.set(pathToString(path), key)

  return result
}

/**
 * Apply decoding at specific path in object hierarchy
 * @param value - Current value
 * @param currentPath - Current path
 * @param stringMappings - String-based key mappings for O(1) lookup
 * @returns decoded value
 */
function applyAtPath(
  value: JsonValue,
  currentPath: KeyPath,
  stringMappings: Map<string, string>,
): JsonValue {
  if (value === null || value === undefined) return value

  if (isJsonArray(value)) {
    return value.map((item, index) =>
      applyAtPath(item, [...currentPath, index], stringMappings),
    )
  }

  if (isJsonObject(value)) {
    const decodedObj: Record<string, JsonValue> = {}

    for (const [encryptedKey, nestedValue] of Object.entries(value)) {
      const keyPath = [...currentPath, encryptedKey]
      const pathKey = pathToString(keyPath)

      const originalKey = stringMappings.get(pathKey) ?? encryptedKey

      decodedObj[originalKey] = applyAtPath(
        nestedValue,
        keyPath,
        stringMappings,
      )
    }

    return decodedObj
  }

  return value
}
