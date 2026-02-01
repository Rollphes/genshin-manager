import { GeneralError } from '@genshin-manager/core'

import type { EncryptedKeyMasterFile, JsonObject, JsonValue } from '@/types'

/**
 * Master candidate with data density score
 */
interface MasterCandidate {
  readonly object: JsonObject
  readonly dataDensity: number
}

/**
 * Data density analysis result
 */
interface DataDensityAnalysis {
  readonly emptyArrays: number
  readonly emptyStrings: number
  readonly nullValues: number
  readonly totalProperties: number
  readonly density: number
}

/**
 * Generate master file structure from decoded ExcelBin data
 * Analyzes data density to select optimal master patterns
 * @param sourceFileName - Source file name for metadata
 * @param jsonData - Array of JSON objects from ExcelBin
 * @returns EncryptedKeyMasterFile with optimal patterns
 * @throws {@link GeneralError} - When jsonData is empty
 */
export function generateMasterStructure(
  sourceFileName: string,
  jsonData: readonly JsonObject[],
): EncryptedKeyMasterFile {
  if (jsonData.length === 0) {
    throw new GeneralError(
      `Expected non-empty array of objects, got empty array for ${sourceFileName}`,
    )
  }

  const patterns = findOptimalMasterPatterns(jsonData)

  const keyMappingTemplate = patterns[0]
  const alternativePatterns =
    patterns.length > 1 ? patterns.slice(1) : undefined

  return {
    metadata: {
      sourceFile: sourceFileName,
      generatedAt: new Date().toISOString(),
    },
    keyMappingTemplate,
    alternativePatterns,
  }
}

/**
 * Check if a value contains empty arrays deeply
 * @param value - Value to check
 * @returns true if contains empty arrays
 */
function hasDeepEmptyArrays(value: JsonValue): boolean {
  if (Array.isArray(value)) {
    if (value.length === 0) return true
    return (value as JsonValue[]).some((item) => hasDeepEmptyArrays(item))
  }

  if (typeof value === 'object' && value !== null) {
    return Object.values(value as JsonObject).some((item) =>
      hasDeepEmptyArrays(item),
    )
  }

  return false
}

/**
 * Fill empty arrays in target object with non-empty values from candidates
 * @param target - Target object to fill
 * @param candidates - Candidate objects to use for filling
 * @returns filled object
 */
function fillEmptyArraysFromCandidates(
  target: JsonValue,
  candidates: readonly JsonObject[],
): JsonValue {
  if (Array.isArray(target)) {
    const targetArray = target as JsonValue[]
    if (targetArray.length === 0) {
      for (const candidate of candidates) {
        const candidateValue = candidate as JsonValue
        if (
          Array.isArray(candidateValue) &&
          candidateValue.length > 0 &&
          !hasDeepEmptyArrays(candidateValue)
        )
          return candidateValue as JsonValue[]
      }
      return targetArray
    }
    return targetArray.map((item) =>
      fillEmptyArraysFromCandidates(item, candidates),
    )
  }

  if (typeof target === 'object' && target !== null) {
    const result: Record<string, JsonValue> = {}
    for (const [key, value] of Object.entries(target)) {
      if (Array.isArray(value) && value.length === 0) {
        let filled = false
        for (const candidate of candidates) {
          const candidateValue = candidate[key]
          if (
            Array.isArray(candidateValue) &&
            candidateValue.length > 0 &&
            !hasDeepEmptyArrays(candidateValue)
          ) {
            result[key] = candidateValue
            filled = true
            break
          }
        }
        if (!filled) result[key] = value
      } else {
        result[key] = fillEmptyArraysFromCandidates(value, candidates)
      }
    }
    return result
  }

  return target
}

/**
 * Find multiple master patterns based on data density and structural diversity
 * @param jsonData - JSON data array
 * @returns Array of master objects ordered by quality
 */
function findOptimalMasterPatterns(
  jsonData: readonly JsonObject[],
): JsonObject[] {
  const masterCandidates: MasterCandidate[] = jsonData.map((candidate) => ({
    object: candidate,
    dataDensity: calculateDataDensity(candidate).density,
  }))

  masterCandidates.sort((a, b) => {
    const aHasEmpty = hasDeepEmptyArrays(a.object)
    const bHasEmpty = hasDeepEmptyArrays(b.object)

    if (aHasEmpty !== bHasEmpty) return aHasEmpty ? 1 : -1

    return b.dataDensity - a.dataDensity
  })

  const selectedPatterns: JsonObject[] = []
  const discoveredPaths = new Set<string>()

  for (const candidate of masterCandidates) {
    if (selectedPatterns.length === 0) {
      let primaryPattern = candidate.object
      if (hasDeepEmptyArrays(primaryPattern)) {
        const filledPattern = fillEmptyArraysFromCandidates(
          primaryPattern,
          jsonData,
        )
        if (typeof filledPattern === 'object' && filledPattern !== null)
          primaryPattern = filledPattern as JsonObject
      }
      selectedPatterns.push(primaryPattern)
      continue
    }

    let hasNewDiversePattern = false

    for (const existing of selectedPatterns) {
      const firstNonEmptyPath = findFirstNonEmptyDifferencePath(
        existing,
        candidate.object,
      )

      if (firstNonEmptyPath.length > 0) {
        const pathKey = firstNonEmptyPath.join(' -> ')

        if (!discoveredPaths.has(pathKey)) {
          discoveredPaths.add(pathKey)
          hasNewDiversePattern = true
        }
      }
    }

    if (hasNewDiversePattern) {
      let pattern = candidate.object
      if (hasDeepEmptyArrays(pattern)) {
        const filledPattern = fillEmptyArraysFromCandidates(pattern, jsonData)
        if (typeof filledPattern === 'object' && filledPattern !== null)
          pattern = filledPattern as JsonObject
      }
      selectedPatterns.push(pattern)
    }
  }

  return selectedPatterns
}

/**
 * Analyze value and update counters for data density calculation
 * @param value - Value to analyze
 * @param counters - Mutable counters object
 * @param counters.emptyArrays - Counter for empty arrays
 * @param counters.emptyStrings - Counter for empty strings
 * @param counters.nullValues - Counter for null values
 * @param counters.totalProperties - Counter for total properties
 */
function analyzeValue(
  value: JsonValue,
  counters: {
    emptyArrays: number
    emptyStrings: number
    nullValues: number
    totalProperties: number
  },
): void {
  counters.totalProperties++

  if (value === null || value === undefined) {
    counters.nullValues++
  } else if (typeof value === 'string' && value === '') {
    counters.emptyStrings++
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      counters.emptyArrays++
    } else {
      ;(value as JsonValue[]).forEach((item) => {
        analyzeValue(item, counters)
      })
    }
  } else if (typeof value === 'object') {
    Object.values(value as JsonObject).forEach((item) => {
      analyzeValue(item, counters)
    })
  }
}

/**
 * Calculate data density for an object (higher is better)
 * @param obj - Object to analyze
 * @returns data density analysis
 */
function calculateDataDensity(obj: JsonObject): DataDensityAnalysis {
  const counters = {
    emptyArrays: 0,
    emptyStrings: 0,
    nullValues: 0,
    totalProperties: 0,
  }

  Object.values(obj).forEach((value) => {
    analyzeValue(value, counters)
  })

  const emptyCount =
    counters.emptyArrays + counters.emptyStrings + counters.nullValues
  const density =
    counters.totalProperties > 0 ? 1 - emptyCount / counters.totalProperties : 0

  return {
    emptyArrays: counters.emptyArrays,
    emptyStrings: counters.emptyStrings,
    nullValues: counters.nullValues,
    totalProperties: counters.totalProperties,
    density,
  }
}

/**
 * Check if a JSON value is empty
 * @param value - The JSON value to check
 * @returns true if the value is empty
 */
function isEmptyJsonValue(value: JsonValue): boolean {
  return (
    value === null ||
    value === undefined ||
    value === 0 ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

/**
 * Find first path where existing is empty but target is not
 * @param existing - The existing JSON value
 * @param target - The target JSON value to compare against
 * @param parentPath - Current path for recursion
 * @returns Path array if non-empty difference found, empty array otherwise
 */
function findFirstNonEmptyDifferencePath(
  existing: JsonValue,
  target: JsonValue,
  parentPath: (string | number)[] = [],
): (string | number)[] {
  if (isEmptyJsonValue(existing) && !isEmptyJsonValue(target)) return parentPath

  if (typeof existing !== typeof target) return parentPath

  if (Array.isArray(existing) && Array.isArray(target)) {
    const existingArray = existing as JsonValue[]
    const targetArray = target as JsonValue[]
    const len = Math.max(existingArray.length, targetArray.length)
    for (let i = 0; i < len; i++) {
      const existingItem = existingArray[i]
      const targetItem = targetArray[i]
      if (existingItem === undefined && targetItem === undefined) continue
      const result = findFirstNonEmptyDifferencePath(existingItem, targetItem, [
        ...parentPath,
        i,
      ])
      if (result.length > 0) return result
    }
    return []
  }

  if (
    typeof existing === 'object' &&
    existing !== null &&
    typeof target === 'object' &&
    target !== null
  ) {
    const existingObj = existing as JsonObject
    const targetObj = target as JsonObject
    const keys = new Set([
      ...Object.keys(existingObj),
      ...Object.keys(targetObj),
    ])
    for (const key of keys) {
      const result = findFirstNonEmptyDifferencePath(
        existingObj[key],
        targetObj[key],
        [...parentPath, key],
      )
      if (result.length > 0) return result
    }
    return []
  }

  return []
}
