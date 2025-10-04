import fs from 'fs'
import path from 'path'
import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from 'quicktype-core'

import { Client } from '@/client'
import { ConfigMissingError, FormatValidationError } from '@/errors'
import { ExcelBinOutputs } from '@/types'
import type { JsonObject } from '@/types/json'
import { EncryptedKeyDecoder } from '@/utils/crypto'
import { logger, LogLevel } from '@/utils/logger'
import {
  excelBinOutputFolderPathForDevelop,
  masterFileFolderPath,
} from '@/utils/paths'

/**
 * Type guard to check if value is JsonObject array
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
 * @returns generated TypeScript code
 */
async function generateTypeFromMaster(
  masterFilePath: string,
  typeName: string,
): Promise<string> {
  if (!fs.existsSync(masterFilePath))
    throw new ConfigMissingError('masterFilePath', masterFilePath)

  const fileName = path.basename(masterFilePath, '.master.json')

  const encryptedFilePath = path.join(
    excelBinOutputFolderPathForDevelop,
    `${fileName}.json`,
  )

  if (!fs.existsSync(encryptedFilePath))
    throw new ConfigMissingError('encryptedFilePath', encryptedFilePath)

  const encryptedContent = fs.readFileSync(encryptedFilePath, 'utf-8')
  const encryptedDataRaw: unknown = JSON.parse(encryptedContent)
  if (!isJsonObjectArray(encryptedDataRaw)) {
    throw new FormatValidationError(
      typeof encryptedDataRaw,
      'JsonObject[]',
      'encryptedData',
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
 * Generate types for all master files
 * @param outputDir - Output directory for generated types
 * @returns array of generated file paths
 */
export async function generateAllMasterTypes(
  outputDir: string,
): Promise<string[]> {
  logger.configure({ level: LogLevel.DEBUG })
  logger.info('=== Initiating type generation from master files ===')
  const client = new Client({})
  await client.deploy()

  logger.info('=== Generating types from all master files ===')
  if (!fs.existsSync(masterFileFolderPath))
    throw new ConfigMissingError('masterFileFolderPath', masterFileFolderPath)

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const masterFiles = fs
    .readdirSync(masterFileFolderPath)
    .filter((file) => file.endsWith('.master.json'))

  const generatedFiles: string[] = []
  const typeMapping: Record<string, string> = {}

  for (const masterFile of masterFiles) {
    const fileName = masterFile.replace('.master.json', '')
    const masterFilePath = path.join(masterFileFolderPath, masterFile)
    const typeName = `${fileName}Type`

    try {
      logger.info(`Generating type for ${fileName}...`)
      const typeCode = await generateTypeFromMaster(masterFilePath, typeName)

      const outputPath = path.join(outputDir, `${fileName}.ts`)
      fs.writeFileSync(outputPath, typeCode)

      generatedFiles.push(outputPath)
      typeMapping[fileName] = typeName

      logger.info(`✅ Generated: ${outputPath}`)
    } catch (error) {
      logger.error(`❌ Failed to generate type for ${fileName}:`, error)
    }
  }

  const mapTypeCode = generateMasterFileMapType(typeMapping)
  const mapOutputPath = path.join(outputDir, 'MasterFileMap.ts')
  fs.writeFileSync(mapOutputPath, mapTypeCode)
  generatedFiles.push(mapOutputPath)

  logger.info(`✅ Generated MasterFileMap: ${mapOutputPath}`)
  logger.info(
    `\n=== Type generation complete: ${String(generatedFiles.length)} files ===`,
  )

  return generatedFiles
}

/**
 * Generate MasterFileMap type definition
 * @param typeMapping - Mapping of file names to type names
 * @returns generated TypeScript code
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
