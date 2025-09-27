import fs from 'fs'
import path from 'path'

import type { EncryptedKeyMasterFile } from '@/types'
import type { JsonObject, JsonValue } from '@/types/json'
import { masterFileFolderPath } from '@/utils/utilPath'

/**
 * Master candidate interface
 */
interface MasterCandidate {
  object: JsonObject
  dataDensity: number
}

/**
 * Data density analysis result
 */
interface DataDensityAnalysis {
  emptyArrays: number
  emptyStrings: number
  nullValues: number
  totalProperties: number
  density: number // 0-1, higher is better
}

/**
 * Generic ExcelBinOutput file processing function
 * @param inputPath - Input file path
 * @param force - Force overwrite flag
 * @returns Processing result summary
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
  const fileName = path.basename(inputPath, '.json')
  const outputPath = path.join(masterFileFolderPath, `${fileName}.master.json`)

  if (!fs.existsSync(inputPath))
    throw new Error(`Input file not found: ${inputPath}`)

  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  if (fs.existsSync(outputPath) && !force) {
    console.log(`⚠️  Existing master file found: ${outputPath}`)
    console.log('Generation skipped to protect manually adjusted files.')
    console.log('To overwrite, specify the --force (-f) option.')
    console.log(
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
    console.log(
      `🔄 --force option specified. Overwriting existing file: ${outputPath}`,
    )
  }

  try {
    const jsonContent = fs.readFileSync(inputPath, 'utf-8')
    const jsonData = JSON.parse(jsonContent) as JsonObject[]

    if (!Array.isArray(jsonData))
      throw new Error(`${fileName}.json must be an array of objects`)

    console.log(`=== ${fileName} Simple Master Generation ===`)

    const masterFile = createMasterStructure(inputPath, jsonData)

    fs.writeFileSync(outputPath, JSON.stringify(masterFile, null, 2))

    console.log(`✅ Master file generated: ${outputPath}`)
    console.log(`   Total objects: ${String(jsonData.length)}`)

    return {
      success: true,
      inputPath,
      outputPath,
      totalObjects: jsonData.length,
      uniqueObjects: jsonData.length,
    }
  } catch (error) {
    console.error(`Error: Error occurred while processing ${fileName}:`, error)
    throw error
  }
}

/**
 * Generate simple master file (prototype-based with multiple patterns)
 * @param sourceFilePath - Source file path
 * @param jsonData - All JSON data
 * @returns Master file
 */
function createMasterStructure(
  sourceFilePath: string,
  jsonData: JsonObject[],
): EncryptedKeyMasterFile {
  const sourceFileName = path.basename(sourceFilePath)

  if (jsonData.length === 0) throw new Error('No objects found')

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
 * Find multiple master patterns based on data density and structural diversity
 * @param jsonData - JSON data array
 * @param maxCandidates - Maximum number of candidates to analyze
 * @param maxPatterns - Maximum number of patterns to return
 * @returns Array of master objects ordered by quality
 */
function findOptimalMasterPatterns(jsonData: JsonObject[]): JsonObject[] {
  console.log(`Number of objects to analyze: ${String(jsonData.length)}`)

  const candidates = jsonData
  const masterCandidates: MasterCandidate[] = []

  for (const candidate of candidates) {
    const densityAnalysis = calculateDataDensity(candidate)

    masterCandidates.push({
      object: candidate,
      dataDensity: densityAnalysis.density,
    })

    console.log(
      `Candidate ${String(masterCandidates.length)}: density ${densityAnalysis.density.toFixed(3)}`,
    )
  }

  masterCandidates.sort((a, b) => {
    return b.dataDensity - a.dataDensity
  })

  const selectedPatterns: JsonObject[] = []
  const discoveredPaths = new Set<string>()

  for (const candidate of masterCandidates) {
    if (selectedPatterns.length === 0) {
      selectedPatterns.push(candidate.object)
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
          console.log(`  Diverse pattern found at path: ${pathKey}`)
          discoveredPaths.add(pathKey)
          hasNewDiversePattern = true
        }
      }
    }

    if (hasNewDiversePattern) selectedPatterns.push(candidate.object)
  }

  console.log(`Total selected patterns: ${String(selectedPatterns.length)}`)

  return selectedPatterns
}

/**
 * Analyze value and update counters for data density calculation
 * @param value - Value to analyze
 * @param counters - Object containing counters
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
 * @returns Data density analysis
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
 * Check if there is a non-empty difference between two JSON values
 * A non-empty difference is defined as:
 * - existing is empty (null, undefined, empty string, empty array) and target is not empty
 * - or any nested property/element has a non-empty difference
 * @param existing - The existing JSON value
 * @param target - The target JSON value to compare against
 * @param parentPath - (internal) current path (for recursion)
 * @returns If a non-empty difference is found, returns the path array; otherwise, returns an empty array
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
 * @returns True if the value is empty, false otherwise
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
