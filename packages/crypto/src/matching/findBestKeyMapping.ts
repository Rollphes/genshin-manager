import { matchValues } from '@/matching/matchValues'
import type {
  ArrayPattern,
  DecodingResult,
  JsonObject,
  JsonPropertyPath,
  JsonValue,
  ObjectPattern,
  PrimitivePattern,
  RecursivePattern,
  RequiredDecodingOptions,
} from '@/types'

/**
 * Find best key mapping from encrypted data using pattern matching
 * @param encryptedData - Array of encrypted objects
 * @param masterPattern - Master pattern to match against
 * @param options - Decoding options
 * @returns Best decoding result with key mappings
 */
export function findBestKeyMapping(
  encryptedData: readonly JsonObject[],
  masterPattern: RecursivePattern,
  options: RequiredDecodingOptions,
): DecodingResult {
  let bestResult: DecodingResult = {
    success: false,
    keyMappings: new Map(),
    confidence: 0,
  }

  for (const encryptedObject of encryptedData) {
    const matchResult = matchRecursively(
      encryptedObject,
      masterPattern,
      [],
      options,
    )
    if (matchResult.confidence > bestResult.confidence) bestResult = matchResult

    if (matchResult.confidence >= 0.95) break
  }

  return bestResult
}

/**
 * Match primitive pattern
 * @param currentValue - Current value to match
 * @param pattern - Primitive pattern to match against
 * @param options - Decoding options
 * @returns Decoding result with match status and confidence
 */
function matchPrimitive(
  currentValue: JsonValue,
  pattern: PrimitivePattern,
  options: RequiredDecodingOptions,
): DecodingResult {
  const matches = matchValues(
    currentValue,
    pattern.value,
    options.matchStrategy,
  )
  return {
    success: matches,
    keyMappings: new Map(),
    confidence: matches ? 1 : 0,
  }
}

/**
 * Match array pattern
 * @param currentValue - Current value to match
 * @param pattern - Array pattern to match against
 * @param currentPath - Current path in recursion
 * @param options - Decoding options
 * @returns Decoding result with key mappings and confidence
 */
function matchArray(
  currentValue: JsonValue,
  pattern: ArrayPattern,
  currentPath: JsonPropertyPath,
  options: RequiredDecodingOptions,
): DecodingResult {
  if (!Array.isArray(currentValue))
    return { success: false, keyMappings: new Map(), confidence: 0 }

  const arrayValue: readonly JsonValue[] = currentValue
  const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
  let totalConfidence = 0
  let matchedElements = 0

  const minLength = Math.min(arrayValue.length, pattern.elements.length)

  for (let i = 0; i < minLength; i++) {
    const elementResult = matchRecursively(
      arrayValue[i],
      pattern.elements[i],
      [...currentPath, i],
      options,
    )

    if (elementResult.success) {
      matchedElements++
      totalConfidence += elementResult.confidence

      for (const [
        jsonPropertyPath,
        originalPropertyName,
      ] of elementResult.keyMappings)
        pathToOriginalNameMap.set(jsonPropertyPath, originalPropertyName)
    }
  }

  const confidence = minLength > 0 ? totalConfidence / minLength : 0
  const success =
    options.matchStrategy === 'exact'
      ? matchedElements === pattern.elements.length
      : matchedElements > 0

  return { success, keyMappings: pathToOriginalNameMap, confidence }
}

/**
 * Find best key match for a property
 * @param originalPattern - Original pattern to match against
 * @param encryptedEntries - Encrypted key-value entries
 * @param usedEncryptedKeys - Set of already used encrypted keys
 * @param currentPath - Current key path in recursion
 * @param options - Decoding options
 * @returns Best matching encrypted key with confidence, or null if no match
 */
function findBestKeyMatch(
  originalPattern: RecursivePattern,
  encryptedEntries: [string, JsonValue][],
  usedEncryptedKeys: Set<string>,
  currentPath: JsonPropertyPath,
  options: RequiredDecodingOptions,
): { encryptedKey: string; confidence: number } | null {
  let bestMatch: { encryptedKey: string; confidence: number } | null = null

  for (const [encryptedKey, entryValue] of encryptedEntries) {
    if (usedEncryptedKeys.has(encryptedKey)) continue

    const matchResult = matchRecursively(
      entryValue,
      originalPattern,
      [...currentPath, encryptedKey],
      options,
    )

    if (
      matchResult.success &&
      (!bestMatch || matchResult.confidence > bestMatch.confidence)
    )
      bestMatch = { encryptedKey, confidence: matchResult.confidence }
  }

  return bestMatch
}

/**
 * Match object pattern
 * @param currentValue - Current value to match
 * @param pattern - Object pattern to match against
 * @param currentPath - Current path in recursion
 * @param options - Decoding options
 * @returns Decoding result with key mappings and confidence
 */
function matchObject(
  currentValue: JsonValue,
  pattern: ObjectPattern,
  currentPath: JsonPropertyPath,
  options: RequiredDecodingOptions,
): DecodingResult {
  if (
    typeof currentValue !== 'object' ||
    currentValue === null ||
    Array.isArray(currentValue)
  )
    return { success: false, keyMappings: new Map(), confidence: 0 }

  const encryptedObj = currentValue as JsonObject
  const pathToOriginalNameMap = new Map<JsonPropertyPath, string>()
  let totalConfidence = 0
  let matchedProperties = 0

  const encryptedEntries = Object.entries(encryptedObj)
  const usedEncryptedKeys = new Set<string>()

  for (const [originalPropertyName, propertyPattern] of pattern.properties) {
    const bestMatch = findBestKeyMatch(
      propertyPattern,
      encryptedEntries,
      usedEncryptedKeys,
      currentPath,
      options,
    )

    if (bestMatch) {
      matchedProperties++
      totalConfidence += bestMatch.confidence
      usedEncryptedKeys.add(bestMatch.encryptedKey)

      const originalJsonPropertyPath =
        pattern.keyPaths.get(originalPropertyName)
      if (originalJsonPropertyPath) {
        const encryptedJsonPropertyPath = [
          ...currentPath,
          bestMatch.encryptedKey,
        ]
        pathToOriginalNameMap.set(
          encryptedJsonPropertyPath,
          originalPropertyName,
        )
      }

      const childResult = matchRecursively(
        encryptedObj[bestMatch.encryptedKey],
        propertyPattern,
        [...currentPath, bestMatch.encryptedKey],
        options,
      )

      for (const [
        jsonPropertyPath,
        childOriginalPropertyName,
      ] of childResult.keyMappings)
        pathToOriginalNameMap.set(jsonPropertyPath, childOriginalPropertyName)
    }
  }

  const confidence =
    pattern.properties.size > 0 ? totalConfidence / pattern.properties.size : 0
  const success =
    options.matchStrategy === 'exact'
      ? matchedProperties === pattern.properties.size
      : matchedProperties > 0

  return { success, keyMappings: pathToOriginalNameMap, confidence }
}

/**
 * Recursively match pattern against encrypted object
 * @param currentValue - Current value to match
 * @param pattern - Pattern to match against
 * @param currentPath - Current path in the structure
 * @param options - Decoding options
 * @returns Matching result with key mappings
 */
function matchRecursively(
  currentValue: JsonValue,
  pattern: RecursivePattern,
  currentPath: JsonPropertyPath,
  options: RequiredDecodingOptions,
): DecodingResult {
  if (currentPath.length > options.maxDepth)
    return { success: false, keyMappings: new Map(), confidence: 0 }

  switch (pattern.type) {
    case 'primitive':
      return matchPrimitive(currentValue, pattern, options)
    case 'array':
      return matchArray(currentValue, pattern, currentPath, options)
    case 'object':
      return matchObject(currentValue, pattern, currentPath, options)
    default:
      return { success: false, keyMappings: new Map(), confidence: 0 }
  }
}
