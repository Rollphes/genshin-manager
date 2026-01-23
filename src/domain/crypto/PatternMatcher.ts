import type {
  ArrayPattern,
  DecodingResult,
  KeyPath,
  ObjectPattern,
  PrimitivePattern,
  RecursivePattern,
  RequiredDecodingOptions,
} from '@/domain/crypto/types'
import { matchValues } from '@/domain/crypto/valueMatcher'
import { isJsonArray } from '@/domain/typeGuards/isJsonArray'
import { isJsonObject } from '@/domain/typeGuards/isJsonObject'
import type { JsonObject, JsonValue } from '@/domain/types/json'

/**
 * Match primitive pattern
 * @param encryptedValue - Encrypted value to match
 * @param pattern - Primitive pattern to match against
 * @param options - Decoding options
 */
function matchPrimitive(
  encryptedValue: JsonValue,
  pattern: PrimitivePattern,
  options: RequiredDecodingOptions,
): DecodingResult {
  const matches = matchValues(
    encryptedValue,
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
 * @param encryptedValue - Encrypted value to match
 * @param pattern - Array pattern to match against
 * @param currentPath - Current key path in recursion
 * @param options - Decoding options
 */
function matchArray(
  encryptedValue: JsonValue,
  pattern: ArrayPattern,
  currentPath: KeyPath,
  options: RequiredDecodingOptions,
): DecodingResult {
  if (!isJsonArray(encryptedValue))
    return { success: false, keyMappings: new Map(), confidence: 0 }

  const keyMappings = new Map<KeyPath, string>()
  let totalConfidence = 0
  let matchedElements = 0

  const minLength = Math.min(encryptedValue.length, pattern.elements.length)

  for (let i = 0; i < minLength; i++) {
    const elementResult = matchRecursively(
      encryptedValue[i],
      pattern.elements[i],
      [...currentPath, i],
      options,
    )

    if (elementResult.success) {
      matchedElements++
      totalConfidence += elementResult.confidence

      for (const [path, key] of elementResult.keyMappings)
        keyMappings.set(path, key)
    }
  }

  const confidence = minLength > 0 ? totalConfidence / minLength : 0
  const success =
    options.matchStrategy === 'exact'
      ? matchedElements === pattern.elements.length
      : matchedElements > 0

  return { success, keyMappings, confidence }
}

/**
 * Find best key match for a property
 * @param originalPattern - Original pattern to match against
 * @param encryptedEntries - Encrypted key-value entries
 * @param usedEncryptedKeys - Set of already used encrypted keys
 * @param currentPath - Current key path in recursion
 * @param options - Decoding options
 */
function findBestKeyMatch(
  originalPattern: RecursivePattern,
  encryptedEntries: [string, JsonValue][],
  usedEncryptedKeys: Set<string>,
  currentPath: KeyPath,
  options: RequiredDecodingOptions,
): { encryptedKey: string; confidence: number } | null {
  let bestMatch: { encryptedKey: string; confidence: number } | null = null

  for (const [encryptedKey, encryptedValue] of encryptedEntries) {
    if (usedEncryptedKeys.has(encryptedKey)) continue

    const matchResult = matchRecursively(
      encryptedValue,
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
 * @param encryptedValue - Encrypted value to match
 * @param pattern - Object pattern to match against
 * @param currentPath - Current key path in recursion
 * @param options - Decoding options
 */
function matchObject(
  encryptedValue: JsonValue,
  pattern: ObjectPattern,
  currentPath: KeyPath,
  options: RequiredDecodingOptions,
): DecodingResult {
  if (!isJsonObject(encryptedValue))
    return { success: false, keyMappings: new Map(), confidence: 0 }

  const encryptedObj: JsonObject = encryptedValue
  const keyMappings = new Map<KeyPath, string>()
  let totalConfidence = 0
  let matchedProperties = 0

  const encryptedEntries = Object.entries(encryptedObj)
  const usedEncryptedKeys = new Set<string>()

  for (const [originalKey, originalPattern] of pattern.properties) {
    const bestMatch = findBestKeyMatch(
      originalPattern,
      encryptedEntries,
      usedEncryptedKeys,
      currentPath,
      options,
    )

    if (bestMatch) {
      matchedProperties++
      totalConfidence += bestMatch.confidence
      usedEncryptedKeys.add(bestMatch.encryptedKey)

      const originalKeyPath = pattern.keyPaths.get(originalKey)
      if (originalKeyPath) {
        const encryptedKeyPath = [...currentPath, bestMatch.encryptedKey]
        keyMappings.set(encryptedKeyPath, originalKey)
      }

      const nestedResult = matchRecursively(
        encryptedObj[bestMatch.encryptedKey],
        originalPattern,
        [...currentPath, bestMatch.encryptedKey],
        options,
      )

      for (const [path, key] of nestedResult.keyMappings)
        keyMappings.set(path, key)
    }
  }

  const confidence =
    pattern.properties.size > 0 ? totalConfidence / pattern.properties.size : 0
  const success =
    options.matchStrategy === 'exact'
      ? matchedProperties === pattern.properties.size
      : matchedProperties > 0

  return { success, keyMappings, confidence }
}

/**
 * Recursively match pattern against encrypted object
 * @param encryptedValue - Encrypted value to match
 * @param pattern - Pattern to match against
 * @param currentPath - Current path in the structure
 * @param options - Decoding options
 * @returns matching result with key mappings
 */
export function matchRecursively(
  encryptedValue: JsonValue,
  pattern: RecursivePattern,
  currentPath: KeyPath,
  options: RequiredDecodingOptions,
): DecodingResult {
  if (currentPath.length > options.maxDepth)
    return { success: false, keyMappings: new Map(), confidence: 0 }

  switch (pattern.type) {
    case 'primitive':
      return matchPrimitive(encryptedValue, pattern, options)
    case 'array':
      return matchArray(encryptedValue, pattern, currentPath, options)
    case 'object':
      return matchObject(encryptedValue, pattern, currentPath, options)
    default:
      return { success: false, keyMappings: new Map(), confidence: 0 }
  }
}

/**
 * Find best key mapping from encrypted data using pattern matching
 * @param encryptedData - Array of encrypted objects
 * @param pattern - Pattern to match against
 * @param options - Decoding options
 * @returns best decoding result
 */
export function findBestKeyMapping(
  encryptedData: readonly JsonObject[],
  pattern: RecursivePattern,
  options: RequiredDecodingOptions,
): DecodingResult {
  let bestResult: DecodingResult = {
    success: false,
    keyMappings: new Map(),
    confidence: 0,
  }

  for (const obj of encryptedData) {
    const result = matchRecursively(obj, pattern, [], options)
    if (result.confidence > bestResult.confidence) bestResult = result

    if (result.confidence >= 0.95) break
  }

  return bestResult
}
