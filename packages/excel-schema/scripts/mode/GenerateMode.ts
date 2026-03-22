import type { AnchorName } from '@genshin-manager/crypto'
import type {
  SchemaCLI,
  SchemaOptions,
  SchemaResult,
} from '@scripts/cli/SchemaCLI'
import type {
  SchemaGenerationResult,
  SchemaProcessor,
} from '@scripts/processor/SchemaProcessor'
import type { EnumFileWriter } from '@scripts/writer/EnumFileWriter'
import type { IndexFileWriter } from '@scripts/writer/IndexFileWriter'
import type { SchemaFileWriter } from '@scripts/writer/SchemaFileWriter'

/**
 * Metadata for generated schema files
 */
export interface GenerationMetadata {
  /** Source file name */
  sourceFile: string
  /** Source commit ID */
  commitId: string
  /** Generation timestamp */
  generatedAt: string
  /** Total number of elements processed */
  totalElements: number
}

/**
 * Generate mode - generates Zod schemas from encrypted JSON data
 */
export class GenerateMode {
  /**
   * Create a new GenerateMode
   * @param cli - Schema CLI for UI control
   * @param schemaProcessor - Schema processor
   * @param enumFileWriter - Enum file writer
   * @param schemaFileWriter - Schema file writer
   * @param indexFileWriter - Index file writer
   */
  constructor(
    private readonly cli: SchemaCLI,
    private readonly schemaProcessor: SchemaProcessor,
    private readonly enumFileWriter: EnumFileWriter,
    private readonly schemaFileWriter: SchemaFileWriter,
    private readonly indexFileWriter: IndexFileWriter,
  ) {}

  /**
   * Run generate mode
   * @param dataMap - map of anchor name to raw data
   * @param options - schema options
   */
  public async run(
    dataMap: Map<AnchorName, string>,
    options: SchemaOptions,
  ): Promise<void> {
    const { results, generatedSchemas } = await this.generateSchemas(dataMap)

    const commitId = options.commit
    const generatedDate = new Date()

    await this.writeEnumFiles(commitId, generatedDate)
    await this.writeSchemaFiles(generatedSchemas, commitId, generatedDate)
    await this.writeIndexFile(generatedSchemas, commitId, generatedDate)

    this.showResultsAndExit(results, commitId)
  }

  /**
   * Generate all schemas
   * @param dataMap - map of anchor name to raw data
   * @returns results and generated schemas
   */
  private async generateSchemas(dataMap: Map<AnchorName, string>): Promise<{
    results: SchemaResult[]
    generatedSchemas: Map<AnchorName, string>
  }> {
    function toTitle([name]: [AnchorName, string]): string {
      return name
    }
    const outputs = await this.cli.runTasks<
      [AnchorName, string],
      SchemaGenerationResult
    >(
      'Generating schemas',
      [...dataMap.entries()],
      ([name, data]) => this.schemaProcessor.generate(name, data),
      toTitle,
    )

    const results = outputs.map((output) => output.result)
    const generatedSchemas = new Map<AnchorName, string>(
      outputs
        .map((output, index): [AnchorName, string | null] => [
          [...dataMap.keys()][index],
          output.schema,
        ])
        .filter((entry): entry is [AnchorName, string] => entry[1] !== null),
    )

    return { results, generatedSchemas }
  }

  /**
   * Write enum files
   * @param commitId - source commit ID
   * @param generatedDate - generation timestamp
   */
  private async writeEnumFiles(
    commitId: string,
    generatedDate: Date,
  ): Promise<void> {
    this.enumFileWriter.clean()
    await this.enumFileWriter.write(
      this.schemaProcessor.enumsSnapshot,
      commitId,
      generatedDate,
    )
  }

  /**
   * Write schema files
   * @param generatedSchemas - map of type name to schema
   * @param commitId - source commit ID
   * @param generatedDate - generation timestamp
   */
  private async writeSchemaFiles(
    generatedSchemas: Map<AnchorName, string>,
    commitId: string,
    generatedDate: Date,
  ): Promise<void> {
    this.schemaFileWriter.clean()
    await this.schemaFileWriter.write(generatedSchemas, commitId, generatedDate)
  }

  /**
   * Write index file
   * @param generatedSchemas - map of type name to schema
   * @param commitId - source commit ID
   * @param generatedDate - generation timestamp
   */
  private async writeIndexFile(
    generatedSchemas: Map<AnchorName, string>,
    commitId: string,
    generatedDate: Date,
  ): Promise<void> {
    await this.indexFileWriter.write(
      [...generatedSchemas.keys()].map(String).sort(),
      [...this.schemaProcessor.enumNames].sort(),
      commitId,
      generatedDate,
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
