import * as fs from 'node:fs'
import * as path from 'node:path'

import type { OperationResult, OperationResultOk } from '@genshin-manager/cli'
import {
  BaseCLI,
  categorizeResults,
  type FormatItem,
} from '@genshin-manager/cli'

/**
 * Type generation success data
 */
export interface TypeGenData {
  /** Path to generated type file */
  outputPath: string
}

/**
 * Type generation result
 */
export type TypeGenResult = OperationResult<TypeGenData>

/**
 * Type generation success result
 */
export type TypeGenResultOk = OperationResultOk<TypeGenData>

/**
 * Selected options from REST CLI
 */
export interface RestOptions {
  /** Selected spec files */
  specFiles: string[]
}

/**
 * CLI for REST package operations.
 */
export class RestCLI extends BaseCLI {
  protected readonly logsDir = path.resolve(__dirname, '../logs')
  protected readonly operationName = 'OpenAPI Type Generation'

  /**
   * Select REST API options (spec files)
   * @returns selected options or null if cancelled
   */
  public async selectOptions(): Promise<RestOptions | null> {
    const allSpecFiles = this.discoverSpecFiles()

    if (allSpecFiles.length === 0) {
      this.log.error('No OpenAPI spec files found')
      return null
    }

    const result = await this.group(
      {
        specScope: () => this.selectScope('spec files', allSpecFiles.length),
        specFiles: ({ results }) => {
          if (results.specScope === 'all') return Promise.resolve(allSpecFiles)

          return this.multiselect({
            message: 'Select spec file(s)',
            options: allSpecFiles.map((file) => ({
              value: file,
              label: file,
            })),
            required: true,
          })
        },
      },
      {
        onCancel: () => {
          this.cancel('Cancelled')
          process.exit(0)
        },
      },
    )

    return {
      specFiles: result.specFiles as string[],
    }
  }

  /**
   * Show summary of type generation results
   * @param results - type generation results
   */
  public showSummary(results: TypeGenResult[]): void {
    const { okResults, errorResults, skipResults } = categorizeResults(results)

    const warningResults = okResults.filter(
      (r): r is Required<TypeGenResultOk> =>
        r.warnings !== undefined && r.warnings.length > 0,
    )

    this.note({
      label: 'Generation Summary',
      children: [
        { label: 'Total', value: String(results.length) },
        { label: 'Success', value: String(okResults.length) },
        { label: 'Errors', value: String(errorResults.length) },
        { label: 'Skipped', value: String(skipResults.length) },
        { label: 'Warnings', value: String(warningResults.length) },
      ],
    })
  }

  /**
   * Save report to log file
   * @param results - type generation results
   * @returns path to the report file
   */
  public saveReport(results: TypeGenResult[]): string {
    const { okResults, errorResults, skipResults } = categorizeResults(results)

    const reportItem: FormatItem = {
      label: `=== ${this.operationName} Report ===`,
      children: [
        {
          label: 'Success',
          children: okResults.map((r) => ({
            label: r.data?.outputPath ?? 'unknown',
            ...(r.warnings && r.warnings.length > 0
              ? {
                  children: r.warnings.map((w) => ({
                    label: 'Warning',
                    value: w,
                  })),
                }
              : {}),
          })),
        },
        ...(errorResults.length > 0
          ? [
              {
                label: 'Errors',
                children: errorResults.map((r) => ({
                  label: 'Error',
                  value: r.error.message,
                })),
              },
            ]
          : []),
        ...(skipResults.length > 0
          ? [
              {
                label: 'Skipped',
                children: skipResults.map((r) => ({
                  label: 'Skip',
                  value: r.reason,
                })),
              },
            ]
          : []),
      ],
    }

    return this.saveReportToFile(reportItem)
  }

  /**
   * Discover spec files from openapi directory
   * @returns array of spec file names
   */
  private discoverSpecFiles(): string[] {
    const specsDir = path.resolve(__dirname, '../openapi')

    if (!fs.existsSync(specsDir)) return []

    return fs
      .readdirSync(specsDir)
      .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
  }
}
