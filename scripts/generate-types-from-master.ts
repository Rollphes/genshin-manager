import type { JsonObject } from '@genshin-manager/core'
import {
  AssetFormatError,
  AssetNotFoundError,
  logger,
  LogLevel,
} from '@genshin-manager/core'
import type { ExcelBinOutputs } from '@genshin-manager/data'
import { EncryptedKeyDecoder, FileLocation } from '@genshin-manager/data'
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
 * Check if property name is encrypted (all uppercase letters only)
 * @param name - Property name to check
 * @returns True if property name is encrypted
 */
function isEncryptedPropertyName(name: string): boolean {
  return /^[A-Z]+$/.test(name)
}

/**
 * Recursively filter out encrypted properties from object
 * @param obj - Object to filter
 * @returns Filtered object without encrypted properties
 */
function filterEncryptedProperties(obj: JsonObject): JsonObject {
  const result: JsonObject = {}

  for (const [key, value] of Object.entries(obj)) {
    // Skip encrypted property names (all uppercase)
    if (isEncryptedPropertyName(key)) {
      continue
    }

    if (Array.isArray(value)) {
      // Process array elements
      result[key] = value.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return filterEncryptedProperties(item as JsonObject)
        }
        return item
      })
    } else if (typeof value === 'object' && value !== null) {
      // Process nested object
      result[key] = filterEncryptedProperties(value as JsonObject)
    } else {
      result[key] = value
    }
  }

  return result
}

/**
 * Generate TypeScript types from master file using quicktype-core
 * @param masterFileLocation - Master file FileLocation
 * @param typeName - Type name to generate
 * @returns Generated TypeScript code
 * @throws {@link AssetNotFoundError} - When file is not found
 * @throws {@link AssetFormatError} - When file format is invalid
 */
async function generateTypeFromMaster(
  masterFileLocation: FileLocation,
  typeName: string,
): Promise<string> {
  const masterFilePath = masterFileLocation.resolve()
  if (!fs.existsSync(masterFilePath))
    throw new AssetNotFoundError(masterFileLocation)

  const fileName = masterFileLocation.basename().replace('.master.json', '')

  if (!fileName) throw new AssetNotFoundError(masterFileLocation)

  const encryptedFileLocation = FileLocation.excelBin(
    fileName as keyof typeof ExcelBinOutputs,
  )
  const encryptedFilePath = encryptedFileLocation.resolve()

  if (!fs.existsSync(encryptedFilePath))
    throw new AssetNotFoundError(encryptedFileLocation)

  const encryptedContent = fs.readFileSync(encryptedFilePath, 'utf-8')
  const encryptedDataRaw: unknown = JSON.parse(encryptedContent)
  if (!isJsonObjectArray(encryptedDataRaw)) {
    throw new AssetFormatError(
      encryptedFileLocation,
      `Expected JsonObject[], got ${typeof encryptedDataRaw}`,
    )
  }

  const decoder = new EncryptedKeyDecoder(
    fileName as keyof typeof ExcelBinOutputs,
  )
  const decodedData = decoder.execute(encryptedDataRaw)

  // Filter out encrypted properties (all uppercase) before type generation
  const filteredData = decodedData.map((item) => filterEncryptedProperties(item))

  const jsonInput = jsonInputForTargetLanguage('typescript')
  await jsonInput.addSource({
    name: typeName,
    samples: [JSON.stringify(filteredData)],
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
  const outputFolder = FileLocation.generatedTypesFolder()
  const outputDir = outputFolder.resolve()
  const masterFileFolder = FileLocation.masterFileFolder()
  const masterFileFolderPath = masterFileFolder.resolve()

  logger.info('=== Generating types from all master files ===')
  if (!fs.existsSync(masterFileFolderPath))
    throw new AssetNotFoundError(masterFileFolder)

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const masterFiles = fs
    .readdirSync(masterFileFolderPath)
    .filter((file) => file.endsWith('.master.json'))

  const generatedFiles: string[] = []
  const typeMapping: Record<string, string> = {}

  for (const masterFile of masterFiles) {
    const fileName = masterFile.replace('.master.json', '')
    const masterFileLocation = FileLocation.masterFile(masterFile)
    const typeName = `${fileName}Type`

    try {
      logger.info(`Generating type for ${fileName}...`)
      const typeCode = await generateTypeFromMaster(
        masterFileLocation,
        typeName,
      )

      const outputLocation = FileLocation.generatedTypes(`${fileName}.ts`)
      const outputPath = outputLocation.resolve()
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
  const mapOutputLocation = FileLocation.generatedTypes('MasterFileMap.ts')
  const mapOutputPath = mapOutputLocation.resolve()
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

FileLocation.deploy({
  assetCacheFolderPath: FileLocation.defaultCacheFolder().resolve(),
})

void (async (): Promise<void> => {
  try {
    console.log('🚀 Starting type generation from master files...\n')

    const generatedFiles = await generateAllMasterTypes()

    console.log('\n✅ Type generation completed successfully!')
    console.log(
      `📁 Output directory: ${FileLocation.generatedTypesFolder().resolve()}`,
    )
    console.log(`📄 Generated ${String(generatedFiles.length)} files`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during type generation:', error)
    process.exit(1)
  }
})()
