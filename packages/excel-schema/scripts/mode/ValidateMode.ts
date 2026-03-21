import type { AnchorName } from '@genshin-manager/crypto'
import type {
  SchemaCLI,
  SchemaOptions,
  SchemaResult,
} from '@scripts/cli/SchemaCLI'
import type { SchemaValidator } from '@scripts/lib/SchemaValidator'

/**
 * Validate mode - validates data against existing Zod schemas
 */
export class ValidateMode {
  /**
   * Create a new ValidateMode
   * @param cli - Schema CLI for UI control
   * @param validator - Schema validator
   */
  constructor(
    private readonly cli: SchemaCLI,
    private readonly validator: SchemaValidator,
  ) {}

  /**
   * Run validate mode
   * @param dataMap - map of anchor name to raw data
   * @param options - schema options
   */
  public async run(
    dataMap: Map<AnchorName, string>,
    options: SchemaOptions,
  ): Promise<void> {
    const results = await this.validateSchemas(dataMap)
    this.showResultsAndExit(results, options.commit)
  }

  /**
   * Validate all schemas
   * @param dataMap - map of anchor name to raw data
   * @returns validation results
   */
  private async validateSchemas(
    dataMap: Map<AnchorName, string>,
  ): Promise<SchemaResult[]> {
    function toTitle([name]: [AnchorName, string]): string {
      return name
    }
    return this.cli.runTasks<[AnchorName, string], SchemaResult>(
      'Validating schemas',
      [...dataMap.entries()],
      ([name, data]) => this.validator.validate(name, data),
      toTitle,
    )
  }

  /**
   * Show results and exit
   * @param results - schema results
   * @param commitId - commit ID
   */
  private showResultsAndExit(results: SchemaResult[], commitId: string): void {
    this.cli.showSummary(results, commitId)

    const errorCount = results.filter((r) => r.status === 'error').length
    if (errorCount > 0) this.cli.saveReport(results, commitId)

    this.cli.outro(
      errorCount > 0 ? `Completed with ${String(errorCount)} errors` : 'Done',
    )

    if (errorCount > 0) process.exit(1)
  }
}
