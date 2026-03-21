import type { AnchorName } from '@genshin-manager/crypto'
import type {
  SchemaCLI,
  SchemaOptions,
  SchemaResult,
} from '@scripts/cli/SchemaCLI'
import type {
  SchemaGenerationResult,
  SchemaProcessor,
} from '@scripts/lib/processor/SchemaProcessor'
import type { GenerationMetadata } from '@scripts/lib/types'
import type { EnumFileWriter } from '@scripts/lib/writer/EnumFileWriter'
import type { IndexFileWriter } from '@scripts/lib/writer/IndexFileWriter'
import type { SchemaFileWriter } from '@scripts/lib/writer/SchemaFileWriter'

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

    const metadata: GenerationMetadata = {
      commitId: options.commit,
      generatedAt: new Date().toISOString(),
    }

    await this.writeEnumFiles(metadata)
    await this.writeSchemaFiles(generatedSchemas, metadata)
    await this.writeIndexFile(generatedSchemas, metadata)

    this.showResultsAndExit(results, options.commit)
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
        .filter(
          (output): output is SchemaGenerationResult & { schema: string } =>
            output.schema !== null,
        )
        .map((output): [AnchorName, string] => [
          output.result.name,
          output.schema,
        ]),
    )

    return { results, generatedSchemas }
  }

  /**
   * Write enum files
   * @param metadata - generation metadata
   */
  private async writeEnumFiles(metadata: GenerationMetadata): Promise<void> {
    this.enumFileWriter.clean()
    await this.enumFileWriter.write(
      this.schemaProcessor.enumCollector.enumsSnapshot,
      metadata,
    )
  }

  /**
   * Write schema files
   * @param generatedSchemas - map of type name to schema
   * @param metadata - generation metadata
   */
  private async writeSchemaFiles(
    generatedSchemas: Map<AnchorName, string>,
    metadata: GenerationMetadata,
  ): Promise<void> {
    this.schemaFileWriter.clean()
    await this.schemaFileWriter.write(generatedSchemas, metadata)
  }

  /**
   * Write index file
   * @param generatedSchemas - map of type name to schema
   * @param metadata - generation metadata
   */
  private async writeIndexFile(
    generatedSchemas: Map<AnchorName, string>,
    metadata: GenerationMetadata,
  ): Promise<void> {
    await this.indexFileWriter.write(
      [...generatedSchemas.keys()].map(String).sort(),
      [...this.schemaProcessor.enumCollector.enumNames].sort(),
      metadata,
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
