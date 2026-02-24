import type { JsonPropertyPath, JsonValue } from '@/types'

/**
 * Decode encrypted property names in JSON data using key mappings
 * @param encryptedData - Encrypted JSON data to decode
 * @param pathToOriginalNameMap - Map of JSON property paths to original property names
 * @returns Decoded JSON with original property names restored
 */
export function decodePropertyNames(
  encryptedData: JsonValue,
  pathToOriginalNameMap: ReadonlyMap<JsonPropertyPath, string>,
): JsonValue {
  const stringKeyedMap = createStringKeyedMap(pathToOriginalNameMap)
  return decodeRecursively(encryptedData, [], stringKeyedMap)
}

/**
 * Create string-keyed map from JsonPropertyPath-based mappings for O(1) lookup
 * @param pathToOriginalNameMap - Map of JSON property paths to original property names
 * @returns String-keyed map for fast path lookup
 */
function createStringKeyedMap(
  pathToOriginalNameMap: ReadonlyMap<JsonPropertyPath, string>,
): Map<string, string> {
  const stringKeyedMap = new Map<string, string>()
  for (const [
    jsonPropertyPath,
    originalPropertyName,
  ] of pathToOriginalNameMap) {
    const pathAsString = JSON.stringify(jsonPropertyPath)
    stringKeyedMap.set(pathAsString, originalPropertyName)
  }

  return stringKeyedMap
}

/**
 * Recursively decode property names in JSON structure
 * @param currentValue - Current JSON value being processed
 * @param currentPath - Current path in the JSON hierarchy
 * @param stringKeyedMap - String-keyed map for O(1) path lookup
 * @returns Decoded JSON value with original property names
 */
function decodeRecursively(
  currentValue: JsonValue,
  currentPath: JsonPropertyPath,
  stringKeyedMap: Map<string, string>,
): JsonValue {
  if (currentValue === null || currentValue === undefined) return currentValue

  if (Array.isArray(currentValue)) {
    const arrayValue: readonly JsonValue[] = currentValue
    return arrayValue.map((item, index) =>
      decodeRecursively(item, [...currentPath, index], stringKeyedMap),
    )
  }

  if (typeof currentValue === 'object') {
    const decodedObj: Record<string, JsonValue> = {}

    for (const [encryptedKey, childValue] of Object.entries(currentValue)) {
      const currentKeyPath = [...currentPath, encryptedKey]
      const pathAsString = JSON.stringify(currentKeyPath)
      const originalPropertyName =
        stringKeyedMap.get(pathAsString) ?? encryptedKey

      decodedObj[originalPropertyName] = decodeRecursively(
        childValue,
        currentKeyPath,
        stringKeyedMap,
      )
    }

    return decodedObj
  }

  return currentValue
}
