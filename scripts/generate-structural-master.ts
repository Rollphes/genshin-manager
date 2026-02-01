import type { JsonObject, JsonValue } from '@genshin-manager/core'
import { logger, LogLevel } from '@genshin-manager/core'
import { generateMasterStructure } from '@genshin-manager/crypto'
import {
  AssetFormatError,
  AssetNotFoundError,
  Location,
} from '@genshin-manager/data'
import type { MasterFileMap } from '@genshin-manager/data'
import fs from 'fs'

/**
 * Generic ExcelBinOutput file processing function.
 * @param location - Input file Location.
 * @param force - Force overwrite flag.
 * @returns Processing result summary.
 * @throws {@link AssetNotFoundError} - When file is not found.
 * @throws {@link AssetFormatError} - When file format is invalid.
 */
function generateMasterFromJson(
  location: Location,
  force = false,
): {
  success: boolean
  inputPath: string
  outputPath: string
  totalObjects: number
  uniqueObjects: number
  skipped?: boolean
} {
  const inputPath = location.resolve()
  const fileName = location.excelBinName

  if (!fileName) throw new AssetNotFoundError(location)

  const outputLocation = Location.masterFile(`${fileName}.master.json`)
  const outputPath = outputLocation.resolve()

  if (!fs.existsSync(inputPath)) throw new AssetNotFoundError(location)

  const outputDir = Location.masterFileFolderPath
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  if (fs.existsSync(outputPath) && !force) {
    logger.warn(`Existing master file found: ${outputPath}`)
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
      `--force option specified. Overwriting existing file: ${outputPath}`,
    )
  }

  try {
    const jsonContent = fs.readFileSync(inputPath, 'utf-8')
    const jsonData = JSON.parse(jsonContent) as JsonValue

    if (!Array.isArray(jsonData)) {
      throw new AssetFormatError(
        location,
        `Expected array of objects, got ${typeof jsonData}`,
      )
    }
    if (
      !jsonData.every((item): item is JsonObject => typeof item === 'object')
    ) {
      throw new AssetFormatError(
        location,
        'Expected array of objects only, got array with non-object items',
      )
    }

    logger.info(`=== ${fileName} Simple Master Generation ===`)
    logger.info(`Number of objects to analyze: ${String(jsonData.length)}`)

    const masterFile = generateMasterStructure(`${fileName}.json`, jsonData)

    fs.writeFileSync(outputPath, JSON.stringify(masterFile, null, 2))

    logger.info(`Master file generated: ${outputPath}`)
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
  force = false,
): {
  fileName: string
  success: boolean
  totalObjects: number
  uniqueObjects: number
  skipped?: boolean
  error?: string
}[] {
  const excelBinOutputFolderPath = Location.excelBinFolderPath

  if (!fs.existsSync(excelBinOutputFolderPath)) {
    throw new AssetNotFoundError(Location.excelBin('AvatarExcelConfigData'))
  }

  const files = fs
    .readdirSync(excelBinOutputFolderPath)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''))

  console.log(`Number of files found: ${String(files.length)}`)
  const results = []
  for (const fileName of files) {
    try {
      console.log(`\nProcessing: ${fileName}...`)
      const location = Location.excelBin(fileName as keyof MasterFileMap)
      const result = generateMasterFromJson(location, force)
      results.push({
        fileName,
        success: result.success,
        totalObjects: result.totalObjects,
        uniqueObjects: result.uniqueObjects,
        skipped: result.skipped,
      })
    } catch (error) {
      console.error(`${fileName}: ${String(error)}`)
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

try {
  if (options.target) {
    console.log(`Starting processing for ${options.target}...`)
    const location = Location.excelBin(options.target as keyof MasterFileMap)
    const result = generateMasterFromJson(location, options.force)
    if (result.success) {
      if (result.skipped)
        console.log('\nExisting file is protected, skipped.')
      else console.log('\nProcessing completed')
    }
  } else {
    console.log('Starting auto-processing of all ExcelBinOutput files...\n')
    const results = processAllAvailableFiles(options.force)

    console.log('\n=== Processing Results Summary ===')
    const successful = results.filter((r) => r.success && !r.skipped)
    const skipped = results.filter((r) => r.skipped)
    const failed = results.filter((r) => !r.success)

    console.log(`Successful: ${String(successful.length)} files`)
    if (skipped.length > 0)
      console.log(`Skipped: ${String(skipped.length)} files`)
    if (failed.length > 0)
      console.log(`Failed: ${String(failed.length)} files`)
  }
} catch (error) {
  console.error('Error:', error)
  process.exit(1)
}
