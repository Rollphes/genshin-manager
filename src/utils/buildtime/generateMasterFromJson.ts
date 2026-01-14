import fs from 'fs'
import path from 'path'

import { ConfigMissingError } from '@/errors/config/ConfigMissingError'
import { FormatValidationError } from '@/errors/validation/FormatValidationError'
import type { JsonObject, JsonValue } from '@/types/json'
import type { EncryptedKeyMasterFile } from '@/types/types'
import { logger, LogLevel } from '@/utils/logger/Logger'
import { masterFileFolderPath } from '@/utils/paths'

/**
 * Master candidate interface
 */
export interface MasterCandidate {
  /**
   * The JSON object candidate
   */
  object: JsonObject
  /**
   * Data density score (0-1, higher is better)
   */
  dataDensity: number
}

/**
 * Data density analysis result
 */
export interface DataDensityAnalysis {
  /**
   * Number of empty arrays
   */
  emptyArrays: number
  /**
   * Number of empty strings
   */
  emptyStrings: number
  /**
   * Number of null values
   */
  nullValues: number
  /**
   * Total number of properties
   */
  totalProperties: number
  /**
   * Data density ratio (0-1, higher is better)
   */
  density: number
}

/**
 * Generic ExcelBinOutput file processing function
 * @param inputPath - Input file path
 * @param force - Force overwrite flag
 * @returns processing result summary
 */
export function generateMasterFromJson(
  inputPath: string,
  force = false,
): {
  success: boolean
  inputPath: string
  outputPath: string
  totalObjects: number
  uniqueObjects: number
  skipped?: boolean
} {
  logger.configure({ level: LogLevel.DEBUG })

  const fileName = path.basename(inputPath, '.json')
  const outputPath = path.join(masterFileFolderPath, `${fileName}.master.json`)

  if (!fs.existsSync(inputPath))
    throw new ConfigMissingError('inputPath', inputPath)

  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  if (fs.existsSync(outputPath) && !force) {
    logger.warn(`⚠️  Existing master file found: ${outputPath}`)
    logger.warn('Generation skipped to protect manually adjusted files.')
    logger.warn('To overwrite, specify the --force (-f) option.')
    logger.warn(
      `\nExample: npx tsx scripts/generate-structural-master.ts -t ${fileName} -f`,
    )
    return {
      success: true,
      inputPath,
      outputPath,
      totalObjects: 0,
      uniqueObjects: 0,
      skipped: true,
    }
  }

  if (force && fs.existsSync(outputPath)) {
    logger.info(
      `🔄 --force option specified. Overwriting existing file: ${outputPath}`,
    )
  }

  try {
    const jsonContent = fs.readFileSync(inputPath, 'utf-8')
    const jsonData = JSON.parse(jsonContent) as JsonValue

    if (!Array.isArray(jsonData)) {
      throw new FormatValidationError(
        typeof jsonData,
        'array of objects',
        fileName,
      )
    }
    if (
      !jsonData.every((item): item is JsonObject => typeof item === 'object')
    ) {
      throw new FormatValidationError(
        'array with non-object items',
        'array of objects only',
        fileName,
      )
    }

    logger.info(`=== ${fileName} Simple Master Generation ===`)

    const masterFile = createMasterStructure(inputPath, jsonData)

    fs.writeFileSync(outputPath, JSON.stringify(masterFile, null, 2))

    logger.info(`✅ Master file generated: ${outputPath}`)
    logger.info(`   Total objects: ${String(jsonData.length)}`)

    return {
      success: true,
      inputPath,
      outputPath,
      totalObjects: jsonData.length,
      uniqueObjects: jsonData.length,
    }
  } catch (error) {
    logger.error(`Error: Error occurred while processing ${fileName}:`, error)
    throw error
  }
}

/**
 * Generate simple master file (prototype-based with multiple patterns)
 * @param sourceFilePath - Source file path
 * @param jsonData - All JSON data
 * @returns master file
 */
export function createMasterStructure(
  sourceFilePath: string,
  jsonData: JsonObject[],
): EncryptedKeyMasterFile {
  const sourceFileName = path.basename(sourceFilePath)

  if (jsonData.length === 0) {
    throw new FormatValidationError(
      'empty array',
      'non-empty array of objects',
      sourceFileName,
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
 * Check if an object contains empty arrays deeply
 * @param value - Value to check
 * @returns true if contains empty arrays, false otherwise
 */
export function hasDeepEmptyArrays(value: JsonValue): boolean {
  if (Array.isArray(value)) {
    if (value.length === 0) return true
    return value.some((item) => hasDeepEmptyArrays(item))
  }

  if (typeof value === 'object' && value !== null)
    return Object.values(value).some((item) => hasDeepEmptyArrays(item))

  return false
}

/**
 * Fill empty arrays in target object with non-empty values from candidates
 * @param target - Target object to fill
 * @param candidates - Candidate objects to use for filling
 * @returns filled object
 */
export function fillEmptyArraysFromCandidates(
  target: JsonValue,
  candidates: JsonObject[],
): JsonValue {
  if (Array.isArray(target)) {
    if (target.length === 0) {
      for (const candidate of candidates) {
        const candidateValue = candidate
        if (
          Array.isArray(candidateValue) &&
          candidateValue.length > 0 &&
          !hasDeepEmptyArrays(candidateValue)
        ) {
          logger.debug('Filled empty array with non-empty candidate')
          return candidateValue
        }
      }
      return target
    }
    return target.map((item) => fillEmptyArraysFromCandidates(item, candidates))
  }

  if (typeof target === 'object' && target !== null) {
    const result: JsonObject = {}
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
            logger.debug(
              `Filled empty array at key '${key}' with non-empty candidate`,
            )
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
 * @param maxCandidates - Maximum number of candidates to analyze
 * @param maxPatterns - Maximum number of patterns to return
 * @returns array of master objects ordered by quality
 */
export function findOptimalMasterPatterns(
  jsonData: JsonObject[],
): JsonObject[] {
  logger.info(`Number of objects to analyze: ${String(jsonData.length)}`)

  const candidates = jsonData
  const masterCandidates: MasterCandidate[] = []

  for (const candidate of candidates) {
    const densityAnalysis = calculateDataDensity(candidate)
    const hasEmptyArrays = hasDeepEmptyArrays(candidate)

    masterCandidates.push({
      object: candidate,
      dataDensity: densityAnalysis.density,
    })

    logger.debug(
      `Candidate ${String(masterCandidates.length)}: density ${densityAnalysis.density.toFixed(3)}, hasEmptyArrays ${String(hasEmptyArrays)}`,
    )
  }

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
        logger.info(
          'Primary pattern has empty arrays, attempting to fill from other candidates...',
        )
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
          logger.debug(`Diverse pattern found at path: ${pathKey}`)
          discoveredPaths.add(pathKey)
          hasNewDiversePattern = true
        }
      }
    }

    if (hasNewDiversePattern) {
      let pattern = candidate.object
      // Fill empty arrays for alternative patterns too
      if (hasDeepEmptyArrays(pattern)) {
        const filledPattern = fillEmptyArraysFromCandidates(pattern, jsonData)
        if (typeof filledPattern === 'object' && filledPattern !== null)
          pattern = filledPattern as JsonObject
      }

      selectedPatterns.push(pattern)
    }
  }

  logger.info(`Total selected patterns: ${String(selectedPatterns.length)}`)

  return selectedPatterns
}

/**
 * Analyze value and update counters for data density calculation
 * @param value - Value to analyze
 * @param counters - Object containing counters
 */
export function analyzeValue(
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
      value.forEach((item) => {
        analyzeValue(item, counters)
      })
    }
  } else if (typeof value === 'object') {
    Object.values(value).forEach((item) => {
      analyzeValue(item, counters)
    })
  }
}

/**
 * Calculate data density for an object (higher is better)
 * @param obj - Object to analyze
 * @returns data density analysis
 */
export function calculateDataDensity(obj: JsonObject): DataDensityAnalysis {
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
 * Check if there is a non-empty difference between two JSON values
 * A non-empty difference is defined as:
 * - existing is empty (null, undefined, empty string, empty array) and target is not empty
 * - or any nested property/element has a non-empty difference
 * @param existing - The existing JSON value
 * @param target - The target JSON value to compare against
 * @param parentPath - (internal) current path (for recursion)
 * @returns if a non-empty difference is found, returns the path array; otherwise, returns an empty array
 */
export function findFirstNonEmptyDifferencePath(
  existing: JsonValue,
  target: JsonValue,
  parentPath: (string | number)[] = [],
): (string | number)[] {
  if (isEmptyJsonValue(existing) && !isEmptyJsonValue(target)) return parentPath

  if (typeof existing !== typeof target) return parentPath

  if (Array.isArray(existing) && Array.isArray(target)) {
    const len = Math.max(existing.length, target.length)
    for (let i = 0; i < len; i++) {
      const result = findFirstNonEmptyDifferencePath(existing[i], target[i], [
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
    target !== null &&
    !Array.isArray(existing) &&
    !Array.isArray(target)
  ) {
    const keys = new Set([
      ...Object.keys(existing as Record<string, JsonValue>),
      ...Object.keys(target as Record<string, JsonValue>),
    ])
    for (const key of keys) {
      const result = findFirstNonEmptyDifferencePath(
        (existing as Record<string, JsonValue>)[key],
        (target as Record<string, JsonValue>)[key],
        [...parentPath, key],
      )
      if (result.length > 0) return result
    }
    return []
  }

  return []
}

/**
 * Check if a JSON value is empty
 * @param value - The JSON value to check
 * @returns true if the value is empty, false otherwise
 */
export function isEmptyJsonValue(value: JsonValue): boolean {
  return (
    value === null ||
    value === undefined ||
    value === 0 ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}
