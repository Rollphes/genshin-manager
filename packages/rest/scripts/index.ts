import * as fs from 'node:fs'
import * as path from 'node:path'

import { buildErrorResult, buildOkResult } from '@genshin-manager/cli'
import type { TypeGenResult } from '@scripts/cli/RestCLI'
import { RestCLI } from '@scripts/cli/RestCLI'
import openapiTS, { astToString } from 'openapi-typescript'

const OPENAPI_PATH = path.resolve(__dirname, '../openapi')
const TYPES_OUTPUT_PATH = path.resolve(__dirname, '../src/types')

const cli = new RestCLI()

/**
 * Generate TypeScript types from OpenAPI specs
 */
async function main(): Promise<void> {
  cli.intro('OpenAPI Type Generation')

  const options = await cli.selectOptions()
  if (!options) {
    cli.outro('Cancelled')
    process.exit(0)
  }

  fs.mkdirSync(TYPES_OUTPUT_PATH, { recursive: true })

  const specFiles = options.specFiles

  cli.log.info(`Generating types for ${String(specFiles.length)} spec file(s)`)

  const results = await cli.runTasks<string, TypeGenResult>(
    'Generating types',
    specFiles,
    async (specFile): Promise<TypeGenResult> => {
      try {
        const specPath = path.resolve(OPENAPI_PATH, specFile)
        const typeName = specFile.replace(/\.ya?ml$/, '')
        const outputPath = path.resolve(TYPES_OUTPUT_PATH, `${typeName}.ts`)

        const ast = await openapiTS(new URL(`file://${specPath}`))
        const content = astToString(ast)
        fs.writeFileSync(outputPath, content)

        return buildOkResult({ outputPath })
      } catch (error) {
        return buildErrorResult(error)
      }
    },
    (specFile) => specFile.replace(/\.ya?ml$/, ''),
  )

  cli.showSummary(results)

  const errorCount = results.filter((r) => r.status === 'error').length
  if (errorCount > 0) cli.saveReport(results)

  cli.outro(
    errorCount > 0
      ? `Completed with ${String(errorCount)} errors`
      : 'Generation complete',
  )

  if (errorCount > 0) process.exit(1)
}

main().catch((error: unknown) => {
  cli.log.error(`Fatal error: ${String(error)}`)
  process.exit(1)
})
