import * as fs from 'node:fs'
import * as path from 'node:path'

import { type AnchorName, KeyRestorer } from '@genshin-manager/crypto'
import { AnimeGameDataClient } from '@genshin-manager/rest'
import {
  SchemaCLI,
  type SchemaOptions,
  type SchemaResult,
} from '@scripts/cli/SchemaCLI'
import { EnumCollector } from '@scripts/lib/EnumCollector'
import { EnumFileWriter } from '@scripts/lib/EnumFileWriter'
import { IndexFileWriter } from '@scripts/lib/IndexFileWriter'
import { QuicktypeRunner } from '@scripts/lib/QuicktypeRunner'
import { SchemaTransformer } from '@scripts/lib/SchemaTransformer'
import type { GenerationMetadata } from '@scripts/lib/types'
import * as prettier from 'prettier'
import type { ZodTypeAny } from 'zod'

const SCHEMA_OUTPUT_PATH = path.resolve(__dirname, '../src/schema')
const ENUM_OUTPUT_PATH = path.resolve(__dirname, '../src/enum')
const SRC_OUTPUT_PATH = path.resolve(__dirname, '../src')

const cli = new SchemaCLI()
const client = new AnimeGameDataClient()

/**
 * Load all files from GitLab
 * @param allFiles - list of anchor names to load
 * @param ref - commit SHA or branch name (optional)
 * @returns map of anchor name to data
 */
async function loadAllFiles(
  allFiles: AnchorName[],
  ref?: string,
): Promise<Map<AnchorName, string>> {
  const entries = await cli.runTasks(
    'Loading files',
    allFiles,
    async (name): Promise<[AnchorName, string]> => {
      const raw = await client.fetchExcelBinOutput(name, ref)
      return [name, raw]
    },
    (name) => name,
  )
  return new Map(entries)
}

/**
 * Generate schema from restored data
 * @param anchorName - name of the anchor/schema
 * @param raw - raw JSON string from GitLab
 * @param quicktype - QuicktypeRunner instance
 * @param enumCollector - EnumCollector instance
 * @param transformer - SchemaTransformer instance
 * @returns tuple of [result, generatedSchema]
 */
async function generateSchema(
  anchorName: AnchorName,
  raw: string,
  quicktype: QuicktypeRunner,
  enumCollector: EnumCollector,
  transformer: SchemaTransformer,
): Promise<[SchemaResult, string | null]> {
  try {
    const restored = KeyRestorer.restore(anchorName, raw, {
      excludeEncryptedKeysFromData: true,
    })

    if (restored.data.length === 0) {
      return [
        { name: anchorName, status: 'skip', message: 'Empty restored data' },
        null,
      ]
    }

    const samples = restored.data.map((s) => JSON.stringify(s))
    const quicktypeResult = await quicktype.generate(anchorName, samples)
    const normalizedSchema = transformer.normalizeNames(
      quicktypeResult.schema,
      anchorName,
    )

    enumCollector.collect(anchorName, normalizedSchema)

    const result: SchemaResult =
      quicktypeResult.warnings.length > 0
        ? { name: anchorName, status: 'ok', warnings: quicktypeResult.warnings }
        : { name: anchorName, status: 'ok' }

    return [result, normalizedSchema]
  } catch (error) {
    return [
      {
        name: anchorName,
        status: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
      },
      null,
    ]
  }
}

/**
 * Validate schema against restored data
 * @param anchorName - name of the anchor/schema
 * @param raw - raw JSON string from GitLab
 * @returns validation result
 */
async function validateSchema(
  anchorName: AnchorName,
  raw: string,
): Promise<SchemaResult> {
  try {
    const restored = KeyRestorer.restore(anchorName, raw, {
      excludeEncryptedKeysFromData: true,
    })

    const schemaModule = (await import(
      `../src/schema/${anchorName}Schema`
    )) as Record<string, ZodTypeAny | undefined>
    const schemaName = `${anchorName}Schema`
    const schema = schemaModule[schemaName]

    if (!schema) {
      return {
        name: anchorName,
        status: 'skip',
        message: `Schema ${schemaName} not found in module`,
      }
    }

    for (const item of restored.data) {
      const result = schema.safeParse(item)

      if (!result.success) {
        return {
          name: anchorName,
          status: 'error',
          error: result.error,
        }
      }
    }

    return { name: anchorName, status: 'ok' }
  } catch (error) {
    return {
      name: anchorName,
      status: 'error',
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}

/**
 * Run generate mode
 * @param dataMap - map of anchor name to raw data
 * @param options - schema options
 */
async function runGenerate(
  dataMap: Map<AnchorName, string>,
  options: SchemaOptions,
): Promise<void> {
  const quicktype = new QuicktypeRunner()
  const enumCollector = new EnumCollector()
  const transformer = new SchemaTransformer()
  const enumWriter = new EnumFileWriter(ENUM_OUTPUT_PATH)

  const outputs = await cli.runTasks(
    'Generating schemas',
    [...dataMap.entries()],
    ([name, data]) =>
      generateSchema(name, data, quicktype, enumCollector, transformer),
    ([name]) => name,
  )

  const results = outputs.map(([result]) => result)
  const generatedSchemas = new Map(
    outputs
      .filter((output): output is [SchemaResult, string] => output[1] !== null)
      .map(([result, schema]) => [result.name, schema]),
  )

  const metadata: GenerationMetadata = {
    commitId: options.commit,
    generatedAt: new Date().toISOString(),
  }

  enumWriter.clean()
  await enumWriter.write(enumCollector.toMap(), metadata)

  fs.mkdirSync(SCHEMA_OUTPUT_PATH, { recursive: true })
  for (const [typeName, schema] of generatedSchemas.entries()) {
    const nameMapping = enumCollector.getNameMapping(typeName)
    const finalSchema = transformer.replaceEnumsWithImports(
      schema,
      enumCollector.getEnumNames(),
      nameMapping,
      metadata,
    )
    const formattedSchema = await prettier.format(finalSchema, {
      parser: 'typescript',
      singleQuote: true,
      semi: false,
    })
    fs.writeFileSync(
      path.resolve(SCHEMA_OUTPUT_PATH, `${typeName}Schema.ts`),
      formattedSchema,
    )
  }

  const indexWriter = new IndexFileWriter(SRC_OUTPUT_PATH)
  await indexWriter.write(
    [...generatedSchemas.keys()].sort(),
    enumCollector.getEnumNames().sort(),
    metadata,
  )

  cli.showSummary(results, options.commit)

  const errorCount = results.filter((r) => r.status === 'error').length
  if (errorCount > 0) cli.saveReport(results, options.commit)

  cli.outro(
    errorCount > 0 ? `Completed with ${String(errorCount)} errors` : 'Done',
  )
  if (errorCount > 0) process.exit(1)
}

/**
 * Run validate mode
 * @param dataMap - map of anchor name to raw data
 * @param options - schema options
 */
async function runValidate(
  dataMap: Map<AnchorName, string>,
  options: SchemaOptions,
): Promise<void> {
  const results = await cli.runTasks(
    'Validating schemas',
    [...dataMap.entries()],
    ([name, data]) => validateSchema(name, data),
    ([name]) => name,
  )

  cli.showSummary(results, options.commit)

  const errorCount = results.filter((r) => r.status === 'error').length
  if (errorCount > 0) cli.saveReport(results, options.commit)

  cli.outro(
    errorCount > 0 ? `Completed with ${String(errorCount)} errors` : 'Done',
  )

  if (errorCount > 0) process.exit(1)
}

/**
 * Main function
 */
async function main(): Promise<void> {
  cli.intro()

  const commits = await client.fetchCommits()
  const options = await cli.selectOptions(commits)

  if (!options) {
    cli.outro('Cancelled')
    process.exit(0)
  }

  const dataMap = await loadAllFiles(options.anchorNames, options.commit)

  switch (options.mode) {
    case 'generate':
      await runGenerate(dataMap, options)
      break
    case 'validate':
      await runValidate(dataMap, options)
      break
  }
}

main().catch((error: unknown) => {
  cli.log.error(`Fatal error: ${String(error)}`)
  process.exit(1)
})
