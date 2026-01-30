import type { JsonObject } from '@genshin-manager/core'
import {
  AssetFormatError,
  AssetNotFoundError,
  logger,
  LogLevel,
} from '@genshin-manager/core'
import type { ExcelBinOutputs } from '@genshin-manager/data'
import { EncryptedKeyDecoder, Location } from '@genshin-manager/data'
import fs from 'fs'
import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from 'quicktype-core'

/**
 * Check if value is JsonObject array
 * @param value - Value to check
 * @returns True if value is JsonObject array
 */
function isJsonObjectArray(value: unknown): value is JsonObject[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'object' && item !== null)
  )
}

/**
 * Generate TypeScript types from master file using quicktype-core
 * @param masterFilePath - Master file path
 * @param typeName - Type name to generate
 * @returns Generated TypeScript code
 * @throws {@link AssetNotFoundError} - When file is not found
 * @throws {@link AssetFormatError} - When file format is invalid
 */
async function generateTypeFromMaster(
  masterFilePath: string,
  typeName: string,
): Promise<string> {
  if (!fs.existsSync(masterFilePath))
    throw new AssetNotFoundError(masterFilePath)

  const fileName = masterFilePath
    .replace(/\\/g, '/')
    .split('/')
    .pop()
    ?.replace('.master.json', '')

  if (!fileName) throw new AssetNotFoundError(masterFilePath)

  const encryptedFilePath = Location.excelBin(
    fileName as keyof typeof ExcelBinOutputs,
  ).resolve()

  if (!fs.existsSync(encryptedFilePath))
    throw new AssetNotFoundError(encryptedFilePath)

  const encryptedContent = fs.readFileSync(encryptedFilePath, 'utf-8')
  const encryptedDataRaw: unknown = JSON.parse(encryptedContent)
  if (!isJsonObjectArray(encryptedDataRaw)) {
    throw new AssetFormatError(
      encryptedFilePath,
      `Expected JsonObject[], got ${typeof encryptedDataRaw}`,
    )
  }

  const decoder = new EncryptedKeyDecoder(
    fileName as keyof typeof ExcelBinOutputs,
  )
  const decodedData = decoder.execute(encryptedDataRaw)

  const jsonInput = jsonInputForTargetLanguage('typescript')
  await jsonInput.addSource({
    name: typeName,
    samples: [JSON.stringify(decodedData)],
  })

  const inputData = new InputData()
  inputData.addInput(jsonInput)

  const result = await quicktype({
    inputData,
    lang: 'typescript',
    rendererOptions: {
      'nice-property-names': 'false',
      'explicit-unions': 'true',
      'prefer-types': 'true',
    },
  })

  return result.lines.join('\n')
}

/**
 * Generate MasterFileMap type definition
 * @param typeMapping - Mapping of file names to type names
 * @returns Generated TypeScript code
 */
function generateMasterFileMapType(
  typeMapping: Record<string, string>,
): string {
  const imports = Object.entries(typeMapping)
    .map(([fileName, typeName]) => {
      return `import type { ${typeName} } from './${fileName}'`
    })
    .join('\n')

  const mapEntries = Object.entries(typeMapping)
    .map(([fileName, typeName]) => {
      return `  ${fileName}: ${typeName}`
    })
    .join('\n')

  return `${imports}

/**
 * Master file type mapping
 * Maps ExcelBinOutput file names to their corresponding decoded types
 */
export interface MasterFileMap {
${mapEntries}
}

/**
 * Type helper to extract decoded type from ExcelBinOutput key
 * Returns array type since all decoded data is an array
 */
export type DecodedType<T extends keyof MasterFileMap> = MasterFileMap[T][]
`
}

/**
 * Generate types for all master files
 * @returns Array of generated file paths
 */
async function generateAllMasterTypes(): Promise<string[]> {
  const outputDir = Location.generatedTypesFolderPath

  logger.info('=== Generating types from all master files ===')
  if (!fs.existsSync(Location.masterFileFolderPath))
    throw new AssetNotFoundError(Location.masterFileFolderPath)

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const masterFiles = fs
    .readdirSync(Location.masterFileFolderPath)
    .filter((file) => file.endsWith('.master.json'))

  const generatedFiles: string[] = []
  const typeMapping: Record<string, string> = {}

  for (const masterFile of masterFiles) {
    const fileName = masterFile.replace('.master.json', '')
    const masterFilePath = Location.masterFile(masterFile).resolve()
    const typeName = `${fileName}Type`

    try {
      logger.info(`Generating type for ${fileName}...`)
      const typeCode = await generateTypeFromMaster(masterFilePath, typeName)

      const outputPath = Location.generatedTypes(`${fileName}.ts`).resolve()
      fs.writeFileSync(outputPath, typeCode)

      generatedFiles.push(outputPath)
      typeMapping[fileName] = typeName

      logger.info(`✅ Generated: ${outputPath}`)
    } catch (error) {
      logger.error(
        `❌ Failed to generate type for ${fileName}:`,
        error instanceof Error ? error : String(error),
      )
    }
  }

  const mapTypeCode = generateMasterFileMapType(typeMapping)
  const mapOutputPath = Location.generatedTypes('MasterFileMap.ts').resolve()
  fs.writeFileSync(mapOutputPath, mapTypeCode)
  generatedFiles.push(mapOutputPath)

  logger.info(`✅ Generated MasterFileMap: ${mapOutputPath}`)
  logger.info(
    `\n=== Type generation complete: ${String(generatedFiles.length)} files ===`,
  )

  return generatedFiles
}

// ============================================================
// CLI Entry Point
// ============================================================

logger.configure({ level: LogLevel.DEBUG })

Location.deploy({ assetCacheFolderPath: Location.defaultCacheFolderPath })

void (async (): Promise<void> => {
  try {
    console.log('🚀 Starting type generation from master files...\n')

    const generatedFiles = await generateAllMasterTypes()

    console.log('\n✅ Type generation completed successfully!')
    console.log(`📁 Output directory: ${Location.generatedTypesFolderPath}`)
    console.log(`📄 Generated ${String(generatedFiles.length)} files`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during type generation:', error)
    process.exit(1)
  }
})()
