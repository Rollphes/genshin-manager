import * as path from 'node:path'

import type {
  FormatItem,
  OperationResult,
  OperationResultError,
  OperationResultOk,
  OperationResultSkip,
} from '@genshin-manager/cli'
import { BaseCLI, categorizeResults } from '@genshin-manager/cli'
import { type AnchorName, AnchorNames } from '@genshin-manager/crypto'
import type { Commit } from '@genshin-manager/rest'
import type { QuicktypeWarning } from '@scripts/processor/QuicktypeRunner'
import type { ZodError } from 'zod'

/**
 * Schema operation mode
 */
export type SchemaMode = 'generate' | 'validate'

/**
 * Schema data for successful operations
 */
export interface SchemaData {
  /** Optional warnings from type inference */
  warnings?: QuicktypeWarning[]
}

/**
 * OK result for a schema operation
 */
export type SchemaResultOk = OperationResultOk<SchemaData>

/**
 * Skip result for a schema operation
 */
export type SchemaResultSkip = OperationResultSkip

/**
 * Error result for a schema operation
 */
export type SchemaResultError = OperationResultError

/**
 * Result for a single schema operation
 */
export type SchemaResult = OperationResult<SchemaData>

/**
 * Selected options from schema CLI
 */
export interface SchemaOptions {
  /** Selected operation mode */
  mode: SchemaMode
  /** Selected commit SHA */
  commit: string
  /** Selected anchor names */
  anchorNames: AnchorName[]
}

/**
 * CLI for schema operations.
 */
export class SchemaCLI extends BaseCLI {
  protected readonly logsDir = path.resolve(__dirname, '../logs')
  protected readonly operationName = 'Schema Operation'

  /**
   * Show intro message
   */
  public override intro(): void {
    super.intro(this.operationName)
  }

  /**
   * Select schema options (mode, commit and anchor names)
   * @param commits - array of commits (latest first)
   * @returns selected options or null if cancelled
   */
  public async selectOptions(commits: Commit[]): Promise<SchemaOptions | null> {
    const allAnchorNames = Object.values(AnchorNames)

    const result = await this.group(
      {
        mode: () =>
          this.select({
            message: 'Select operation mode',
            options: [
              {
                value: 'generate',
                label: 'Generate schemas',
                hint: 'Generate Zod schemas from data',
              },
              {
                value: 'validate',
                label: 'Validate schemas',
                hint: 'Validate data against existing schemas',
              },
            ],
          }),
        commit: () => this.selectCommit(commits),
        schemaScope: () => this.selectScope('schemas', allAnchorNames.length),
        anchorNames: ({ results }) => {
          if (results.schemaScope === 'all')
            return Promise.resolve(allAnchorNames)

          return this.multiselect({
            message: 'Select schema(s)',
            options: allAnchorNames.map((name) => ({
              value: name as string,
              label: name,
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
      mode: result.mode as SchemaMode,
      commit: result.commit,
      anchorNames: result.anchorNames as AnchorName[],
    }
  }

  /**
   * Show summary
   * @param results - schema results
   * @param commitId - source commit ID
   */
  public showSummary(results: SchemaResult[], commitId: string): void {
    this.note({
      label: 'Summary',
      children: this.createSummaryItems(results, commitId),
    })
  }

  /**
   * Save report to file
   * @param results - schema results
   * @param commitId - source commit ID
   */
  public saveReport(results: SchemaResult[], commitId: string): void {
    const { okResults, errorResults, skipResults, warningResults } =
      this.categorizeSchemaResults(results)

    this.saveReportToFile({
      label: `=== ${this.operationName} Report ===`,
      children: [
        {
          label: 'Summary',
          children: this.createSummaryItems(results, commitId),
        },
        {
          label: 'OK',
          children: okResults.map(() => ({ label: 'OK' })),
        },
        {
          label: 'Warnings',
          children: warningResults.map((r) => ({
            label: 'Warning:',
            value:
              r.data?.warnings
                ?.map(
                  (w) =>
                    `[${w.type}] ${w.message} (line ${String(w.line)}, col ${String(w.column)})`,
                )
                .join('\n') ?? '',
          })),
        },
        {
          label: 'Skipped',
          children: skipResults.map((r) => ({
            label: 'Skipped:',
            value: r.reason,
          })),
        },
        {
          label: 'Errors',
          children: errorResults.map((r) => ({
            label: 'Error:',
            value: this.formatError(r.error),
          })),
        },
      ],
    })
  }

  /**
   * Categorize results by status (extends shared categorizeResults with warnings)
   * @param results - schema results
   * @returns categorized results
   */
  protected categorizeSchemaResults(results: SchemaResult[]): {
    okResults: readonly SchemaResultOk[]
    errorResults: readonly SchemaResultError[]
    skipResults: readonly SchemaResultSkip[]
    warningResults: readonly SchemaResultOk[]
  } {
    const { okResults, errorResults, skipResults } = categorizeResults(results)

    const warningResults = okResults.filter(
      (r): r is SchemaResultOk =>
        r.data?.warnings !== undefined && r.data.warnings.length > 0,
    )

    return {
      okResults,
      errorResults,
      skipResults,
      warningResults,
    }
  }

  /**
   * Create summary items
   * @param results - schema results
   * @param commitId - source commit ID
   * @returns format items
   */
  private createSummaryItems(
    results: SchemaResult[],
    commitId: string,
  ): FormatItem[] {
    const { okResults, errorResults, skipResults, warningResults } =
      this.categorizeSchemaResults(results)

    return [
      { label: 'Date:', value: new Date().toISOString() },
      { label: 'Source Commit:', value: commitId },
      { label: 'Total:', value: String(results.length) },
      { label: 'OK:', value: String(okResults.length) },
      { label: 'Warnings:', value: String(warningResults.length) },
      { label: 'Errors:', value: String(errorResults.length) },
      { label: 'Skipped:', value: String(skipResults.length) },
    ]
  }

  /**
   * Check if error is a ZodError
   * @param error - error to check
   * @returns true if error is a ZodError
   */
  private isZodError(error: Error): error is ZodError {
    return (
      'issues' in error && Array.isArray((error as { issues?: unknown }).issues)
    )
  }

  /**
   * Format error for display
   * @param error - Error (may be ZodError)
   * @returns formatted error string
   */
  private formatError(error: Error): string {
    if (this.isZodError(error)) {
      return JSON.stringify(
        error.issues.map((issue) => ({
          path: this.formatPath(issue.path),
          code: issue.code,
          message: issue.message,
        })),
        null,
        2,
      )
    }
    return error.message
  }

  /**
   * Format path array to string (e.g., ["items", 0, "name"] -> "items[0].name")
   * @param path - path segments
   * @returns formatted path string
   */
  private formatPath(path: (string | number)[]): string {
    return path.reduce<string>((acc, segment) => {
      if (typeof segment === 'number') return `${acc}[${String(segment)}]`

      return acc.length === 0 ? segment : `${acc}.${segment}`
    }, '')
  }
}
