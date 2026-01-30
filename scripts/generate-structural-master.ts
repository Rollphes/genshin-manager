import type { JsonObject, JsonValue } from '@genshin-manager/core'
import {
  AssetFormatError,
  AssetNotFoundError,
  logger,
  LogLevel,
} from '@genshin-manager/core'
import type { EncryptedKeyMasterFile } from '@genshin-manager/crypto'
import type { MasterFileMap } from '@genshin-manager/data'
import { Location } from '@genshin-manager/data'
import fs from 'fs'

interface MasterCandidate {
  readonly object: JsonObject
  readonly dataDensity: number
}

interface DataDensityAnalysis {
  readonly emptyArrays: number
  readonly emptyStrings: number
  readonly nullValues: number
  readonly totalProperties: number
  readonly density: number
}

/**
 * Generic ExcelBinOutput file processing function.
 * @param inputPath - Input file path.
 * @param force - Force overwrite flag.
 * @returns Processing result summary.
 * @throws {@link AssetNotFoundError} - When file is not found.
 * @throws {@link AssetFormatError} - When file format is invalid.
 */
function generateMasterFromJson(
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
  const fileName = inputPath
    .replace(/\\/g, '/')
    .split('/')
    .pop()
    ?.replace('.json', '')

  if (!fileName) throw new AssetNotFoundError(inputPath)

  const outputPath = Location.masterFile(`${fileName}.master.json`).resolve()

  if (!fs.existsSync(inputPath)) throw new AssetNotFoundError(inputPath)

  const outputDir = Location.masterFileFolderPath
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
      throw new AssetFormatError(
        inputPath,
        `Expected array of objects, got ${typeof jsonData}`,
      )
    }
    if (
      !jsonData.every((item): item is JsonObject => typeof item === 'object')
    ) {
      throw new AssetFormatError(
        inputPath,
        'Expected array of objects only, got array with non-object items',
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
    logger.error(
      `Error: Error occurred while processing ${fileName}:`,
      error instanceof Error ? error : String(error),
    )
    throw error
  }
}

function createMasterStructure(
  sourceFilePath: string,
  jsonData: JsonObject[],
): EncryptedKeyMasterFile {
  const sourceFileName =
    sourceFilePath.replace(/\\/g, '/').split('/').pop() ?? ''

  if (jsonData.length === 0) {
    throw new AssetFormatError(
      sourceFilePath,
      'Expected non-empty array of objects, got empty array',
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

function fillEmptyArraysFromCandidates(
  target: JsonValue,
  candidates: JsonObject[],
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

function findOptimalMasterPatterns(jsonData: JsonObject[]): JsonObject[] {
  logger.info(`Number of objects to analyze: ${String(jsonData.length)}`)

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

  logger.info(`Total selected patterns: ${String(selectedPatterns.length)}`)
  return selectedPatterns
}

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
  return { ...counters, density }
}

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
      const result = findFirstNonEmptyDifferencePath(
        existingArray[i],
        targetArray[i],
        [...parentPath, i],
      )
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
// CLI
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
    throw new AssetNotFoundError(excelBinOutputFolderPath)

  const files = fs
    .readdirSync(excelBinOutputFolderPath)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''))

  console.log(`Number of files found: ${String(files.length)}`)
  const results = []
  for (const fileName of files) {
    try {
      console.log(`\nProcessing: ${fileName}...`)
      const inputPath = Location.excelBin(
        fileName as keyof MasterFileMap,
      ).resolve()
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
  npx tsx scripts/generate-structural-master.ts [OPTIONS]

Options:
  -t, --target <filename>    Process only the specified file
  -f, --force               Force overwrite existing master files
  -h, --help                Show this help
`)
}

// --- Entry Point ---
logger.configure({ level: LogLevel.DEBUG })

const options = parseArgs()
if (options.help) {
  showHelp()
  process.exit(0)
}

Location.deploy({ assetCacheFolderPath: Location.defaultCacheFolderPath })

const excelBinOutputFolderPath = Location.excelBinFolderPath

try {
  if (options.target) {
    console.log(`🎯 Starting processing for ${options.target}...`)
    const inputPath = Location.excelBin(
      options.target as keyof MasterFileMap,
    ).resolve()
    const result = generateMasterFromJson(inputPath, options.force)
    if (result.success) {
      if (result.skipped)
        console.log('\n⏭️  Existing file is protected, skipped.')
      else console.log('\n✅ Processing completed')
    }
  } else {
    console.log('🚀 Starting auto-processing of all ExcelBinOutput files...\n')
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
  }
} catch (error) {
  console.error('❌ Error:', error)
  process.exit(1)
}
