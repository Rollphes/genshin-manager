import * as path from 'node:path'

import { AnimeGameDataClient } from '@genshin-manager/rest'
import { SchemaCLI } from '@scripts/cli/SchemaCLI'
import { DataLoader } from '@scripts/loader/DataLoader'
import { GenerateMode } from '@scripts/mode/GenerateMode'
import { ValidateMode } from '@scripts/mode/ValidateMode'
import { EnumCollector } from '@scripts/processor/EnumCollector'
import { QuicktypeRunner } from '@scripts/processor/QuicktypeRunner'
import { SchemaProcessor } from '@scripts/processor/SchemaProcessor'
import { SchemaTransformer } from '@scripts/processor/SchemaTransformer'
import { SchemaValidator } from '@scripts/validator/SchemaValidator'
import { EnumFileWriter } from '@scripts/writer/EnumFileWriter'
import { IndexFileWriter } from '@scripts/writer/IndexFileWriter'
import { SchemaFileWriter } from '@scripts/writer/SchemaFileWriter'

const SCHEMA_OUTPUT_PATH = path.resolve(__dirname, '../src/schema')
const ENUM_OUTPUT_PATH = path.resolve(__dirname, '../src/enum')
const SRC_OUTPUT_PATH = path.resolve(__dirname, '../src')

/**
 * Main function
 */
async function main(): Promise<void> {
  const cli = new SchemaCLI()
  const client = new AnimeGameDataClient()

  cli.intro()

  const commits = await client.fetchCommits()
  const options = await cli.selectOptions(commits)

  if (!options) {
    cli.outro('Cancelled')
    process.exit(0)
  }

  const loader = new DataLoader(client, cli)
  const dataMap = await loader.loadAll(options.anchorNames, options.commit)

  const quicktype = new QuicktypeRunner()
  const transformer = new SchemaTransformer()

  switch (options.mode) {
    case 'generate': {
      const enumCollector = new EnumCollector()
      const processor = new SchemaProcessor(
        quicktype,
        transformer,
        enumCollector,
      )
      const enumWriter = new EnumFileWriter(ENUM_OUTPUT_PATH)
      const schemaWriter = new SchemaFileWriter(
        SCHEMA_OUTPUT_PATH,
        transformer,
        enumCollector,
      )
      const indexWriter = new IndexFileWriter(SRC_OUTPUT_PATH)
      const mode = new GenerateMode(
        cli,
        processor,
        enumWriter,
        schemaWriter,
        indexWriter,
      )
      await mode.run(dataMap, options)
      break
    }
    case 'validate': {
      const validator = new SchemaValidator()
      const mode = new ValidateMode(cli, validator)
      await mode.run(dataMap, options)
      break
    }
  }
}

main().catch((error: unknown) => {
  console.error(`Fatal error: ${String(error)}`)
  process.exit(1)
})
