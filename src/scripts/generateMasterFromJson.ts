import fs from 'fs'
import path from 'path'

import { FormatValidationError } from '@/domain/errors/validation/FormatValidationError'
import { isJsonArray } from '@/domain/typeGuards/isJsonArray'
import { isJsonObject } from '@/domain/typeGuards/isJsonObject'
import type { JsonObject, JsonValue } from '@/domain/types/json'
import { ConfigMissingError } from '@/infrastructure/errors/ConfigMissingError'
import { logger, LogLevel } from '@/infrastructure/logger/Logger'
import { masterFileFolderPath } from '@/infrastructure/paths'
import type { EncryptedKeyMasterFile } from '@/infrastructure/types/crypto'

/**
 * Master candidate interface
 */
interface MasterCandidate {
  /**
   * The JSON object candidate
   */
  readonly object: JsonObject
  /**
   * Data density score (0-1, higher is better)
   */
  readonly dataDensity: number
}

/**
 * Data density analysis result
 */
interface DataDensityAnalysis {
  /**
   * Number of empty arrays
   */
  readonly emptyArrays: number
  /**
   * Number of empty strings
   */
  readonly emptyStrings: number
  /**
   * Number of null values
   */
  readonly nullValues: number
  /**
   * Total number of properties
   */
  readonly totalProperties: number
  /**
   * Data density ratio (0-1, higher is better)
   */
  readonly density: number
}

/**
 * Generic ExcelBinOutput file processing function.
 * @param inputPath - Input file path.
 * @param force - Force overwrite flag.
 * @returns Processing result summary.
 * @throws {@link Error} - When file processing fails.
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
 * Generate simple master file (prototype-based with multiple patterns).
 * @param sourceFilePath - Source file path.
 * @param jsonData - All JSON data.
 * @returns Master file.
 * @throws {@link FormatValidationError} - When JSON data is empty.
 */
function createMasterStructure(
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
function hasDeepEmptyArrays(value: JsonValue): boolean {
  if (isJsonArray(value)) {
    if (value.length === 0) return true
    return value.some((item) => hasDeepEmptyArrays(item))
  }

  if (isJsonObject(value))
    return Object.values(value).some((item) => hasDeepEmptyArrays(item))

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
  candidates: JsonObject[],
): JsonValue {
  if (isJsonArray(target)) {
    if (target.length === 0) {
      for (const candidate of candidates) {
        const candidateValue = candidate
        if (
          isJsonArray(candidateValue) &&
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

  if (isJsonObject(target)) {
    const result: Record<string, JsonValue> = {}
    for (const [key, value] of Object.entries(target)) {
      if (isJsonArray(value) && value.length === 0) {
        let filled = false
        for (const candidate of candidates) {
          const candidateValue = candidate[key]
          if (
            isJsonArray(candidateValue) &&
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
 * Find multiple master patterns based on data density and structural diversity.
 * @param jsonData - JSON data array.
 * @returns Array of master objects ordered by quality.
 */
function findOptimalMasterPatterns(
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
 * Analyze value and update counters for data density calculation.
 * @param value - Value to analyze.
 * @param counters - Object containing counters.
 * @param counters.emptyArrays - Count of empty arrays.
 * @param counters.emptyStrings - Count of empty strings.
 * @param counters.nullValues - Count of null values.
 * @param counters.totalProperties - Total property count.
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
  } else if (isJsonArray(value)) {
    if (value.length === 0) {
      counters.emptyArrays++
    } else {
      value.forEach((item) => {
        analyzeValue(item, counters)
      })
    }
  } else if (isJsonObject(value)) {
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
 * @returns if a non-empty difference is found, returns the path array; otherwise, returns an empty array
 */
function findFirstNonEmptyDifferencePath(
  existing: JsonValue,
  target: JsonValue,
  parentPath: (string | number)[] = [],
): (string | number)[] {
  if (isEmptyJsonValue(existing) && !isEmptyJsonValue(target)) return parentPath

  if (typeof existing !== typeof target) return parentPath

  if (isJsonArray(existing) && isJsonArray(target)) {
    const len = Math.max(existing.length, target.length)
    for (let i = 0; i < len; i++) {
      const existingItem = existing[i]
      const targetItem = target[i]
      if (existingItem === undefined && targetItem === undefined) continue
      const result = findFirstNonEmptyDifferencePath(existingItem, targetItem, [
        ...parentPath,
        i,
      ])
      if (result.length > 0) return result
    }
    return []
  }

  if (isJsonObject(existing) && isJsonObject(target)) {
    const keys = new Set([...Object.keys(existing), ...Object.keys(target)])
    for (const key of keys) {
      const result = findFirstNonEmptyDifferencePath(
        existing[key],
        target[key],
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
function isEmptyJsonValue(value: JsonValue): boolean {
  return (
    value === null ||
    value === undefined ||
    value === 0 ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  )
}

// ============================================================
// CLI Entry Point
// ============================================================

interface CommandOptions {
  target?: string
  force: boolean
  help: boolean
}

function parseArgs(): CommandOptions {
  const args = process.argv.slice(2)
  const options: CommandOptions = {
    target: undefined,
    force: false,
    help: false,
  }

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--target':
      case '-t':
        options.target = args[i + 1]
        i++
        break
      case '--force':
      case '-f':
        options.force = true
        break
      case '--help':
      case '-h':
        options.help = true
        break
    }
  }

  return options
}

function processAllAvailableFiles(
  excelBinOutputFolderPath: string,
  force = false,
): {
  fileName: string
  success: boolean
  totalObjects: number
  uniqueObjects: number
  skipped?: boolean
  error?: string
}[] {
  if (!fs.existsSync(excelBinOutputFolderPath))
    throw new Error(`cache directory not found: ${excelBinOutputFolderPath}`)

  const files = fs
    .readdirSync(excelBinOutputFolderPath)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''))

  console.log(`Number of files found: ${String(files.length)}`)
  console.log(
    'Processing targets:',
    files.slice(0, 5).join(', '),
    files.length > 5 ? `... and ${String(files.length - 5)} more` : '',
  )

  const results = []

  for (const fileName of files) {
    try {
      console.log(`\nProcessing: ${fileName}...`)
      const inputPath = path.join(excelBinOutputFolderPath, `${fileName}.json`)
      const result = generateMasterFromJson(inputPath, force)
      results.push({
        fileName,
        success: result.success,
        totalObjects: result.totalObjects,
        uniqueObjects: result.uniqueObjects,
        skipped: result.skipped,
      })
    } catch (error) {
      console.error(`❌ ${fileName}: ${String(error)}`)
      results.push({
        fileName,
        success: false,
        totalObjects: 0,
        uniqueObjects: 0,
        error: String(error),
      })
    }
  }

  return results
}

function showHelp(): void {
  console.log(`
Structural Master File Generator

Usage:
  npx tsx src/scripts/generateMasterFromJson.ts [OPTIONS]

Options:
  -t, --target <filename>    Process only the specified file (e.g., -t WeaponPromoteExcelConfigData)
  -f, --force               Force overwrite existing master files
  -h, --help                Show this help

Examples:
  npx tsx src/scripts/generateMasterFromJson.ts -t WeaponPromoteExcelConfigData
  npx tsx src/scripts/generateMasterFromJson.ts -f
  npx tsx src/scripts/generateMasterFromJson.ts --target CharacterExcelConfigData

Notes:
  - By default, processes all ExcelBinOutput files
  - Existing master files are protected (use -f to overwrite)
  `)
}

if (require.main === module) {
  const options = parseArgs()

  if (options.help) {
    showHelp()
    process.exit(0)
  }

  const excelBinOutputFolderPath = path.join(
    __dirname,
    '../cache/ExcelBinOutput',
  )

  try {
    if (options.target) {
      console.log(`🎯 Starting processing for ${options.target}...`)
      const inputPath = path.join(
        excelBinOutputFolderPath,
        `${options.target}.json`,
      )
      const result = generateMasterFromJson(inputPath, options.force)

      if (result.success) {
        if (result.skipped)
          console.log('\n⏭️  Existing file is protected, skipped.')
        else console.log('\n✅ Processing completed')
      }
    } else {
      console.log(
        '🚀 Starting auto-processing of all ExcelBinOutput files...\n',
      )
      const results = processAllAvailableFiles(
        excelBinOutputFolderPath,
        options.force,
      )

      console.log('\n=== Processing Results Summary ===')
      const successful = results.filter((r) => r.success && !r.skipped)
      const skipped = results.filter((r) => r.skipped)
      const failed = results.filter((r) => !r.success)

      console.log(`✅ Successful: ${String(successful.length)} files`)
      if (skipped.length > 0)
        console.log(`⏭️  Skipped: ${String(skipped.length)} files`)
      if (failed.length > 0)
        console.log(`❌ Failed: ${String(failed.length)} files`)

      successful.forEach((r) => {
        console.log(
          `  ✅ ${r.fileName}: ${String(r.totalObjects)} objects → ${String(r.uniqueObjects)} unique`,
        )
      })

      if (skipped.length > 0) {
        console.log('\nSkipped files (can be overwritten with -f):')
        skipped.forEach((r) => {
          console.log(`  ⏭️  ${r.fileName}`)
        })
      }

      if (failed.length > 0) {
        console.log('\nFailed files:')
        failed.forEach((r) => {
          console.log(`  ❌ ${r.fileName}: ${r.error ?? 'Unknown error'}`)
        })
      }
    }
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}
