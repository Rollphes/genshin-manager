import {
  buildErrorResult,
  buildOkResult,
  buildSkipResult,
} from '@genshin-manager/cli'
import { type AnchorName, KeyRestorer } from '@genshin-manager/crypto'
import type { SchemaData, SchemaResult } from '@scripts/cli/SchemaCLI'
import type { EnumCollector } from '@scripts/processor/EnumCollector'
import type { QuicktypeRunner } from '@scripts/processor/QuicktypeRunner'
import type { SchemaTransformer } from '@scripts/processor/SchemaTransformer'

/**
 * Result from schema generation
 */
export interface SchemaGenerationResult {
  /** Result metadata */
  result: SchemaResult
  /** Generated schema string (null if generation failed) */
  schema: string | null
}

/** Quicktype warning interface */
interface QuicktypeWarning {
  type: 'any' | 'null'
  message: string
  line: number
  column: number
}

/**
 * Processes and generates Zod schemas from encrypted JSON data
 */
export class SchemaProcessor {
  /**
   * Create a new SchemaProcessor
   * @param quicktype - Quicktype runner for schema generation
   * @param transformer - Schema transformer for normalization
   * @param enumCollector - Enum collector for extracting enum values
   */
  constructor(
    private readonly quicktype: QuicktypeRunner,
    private readonly transformer: SchemaTransformer,
    private readonly enumCollector: EnumCollector,
  ) {}

  /**
   * Get enum names collected during schema processing
   * @returns readonly array of enum names
   */
  public get enumNames(): readonly string[] {
    return this.enumCollector.enumNames
  }

  /**
   * Get snapshot of collected enums
   * @returns readonly map of enum name to set of values
   */
  public get enumsSnapshot(): ReadonlyMap<string, ReadonlySet<string>> {
    return this.enumCollector.enumsSnapshot
  }

  /**
   * Get enum name mapping for a specific schema
   * @param schemaName - schema name to query
   * @returns readonly map of quicktype enum name to generated enum names
   */
  public getNameMapping(
    schemaName: string,
  ): ReadonlyMap<string, readonly string[]> {
    return this.enumCollector.getNameMapping(schemaName)
  }

  /**
   * Generate Zod schema from encrypted JSON data
   * @param anchorName - name of the anchor/schema
   * @param raw - raw JSON string from GitLab
   * @returns generation result with schema (null if failed)
   * @throws - Never throws, all errors are caught and converted to SchemaGenerationResult
   */
  public async generate(
    anchorName: AnchorName,
    raw: string,
  ): Promise<SchemaGenerationResult> {
    try {
      const data = this.restoreData(anchorName, raw)

      if (data.length === 0) {
        return {
          result: buildSkipResult('Empty restored data'),
          schema: null,
        }
      }

      const { schema, warnings } = await this.generateQuicktypeSchema(
        anchorName,
        data,
      )
      const normalizedSchema = this.normalizeAndCollect(anchorName, schema)
      const result = this.buildResult(warnings)

      return {
        result,
        schema: normalizedSchema,
      }
    } catch (error) {
      return {
        result: this.buildErrorResult(error),
        schema: null,
      }
    }
  }

  /**
   * Restore encrypted data using KeyRestorer
   * @param anchorName - name of the anchor
   * @param raw - raw encrypted JSON string
   * @returns array of restored data objects
   */
  private restoreData(anchorName: AnchorName, raw: string): unknown[] {
    const restored = KeyRestorer.restore(anchorName, raw, {
      excludeEncryptedKeysFromData: true,
    })
    return restored.data
  }

  /**
   * Generate Zod schema using Quicktype
   * @param anchorName - name of the anchor
   * @param data - restored data objects
   * @returns generated schema and warnings
   */
  private async generateQuicktypeSchema(
    anchorName: AnchorName,
    data: unknown[],
  ): Promise<{ schema: string; warnings: QuicktypeWarning[] }> {
    const samples = data.map((s) => JSON.stringify(s))
    const quicktypeResult = await this.quicktype.generate(anchorName, samples)
    return {
      schema: quicktypeResult.schema,
      warnings: quicktypeResult.warnings,
    }
  }

  /**
   * Normalize schema names and collect enum values
   * @param anchorName - name of the anchor
   * @param schema - raw schema from quicktype
   * @returns normalized schema
   */
  private normalizeAndCollect(anchorName: AnchorName, schema: string): string {
    const normalizedSchema = this.transformer.normalizeNames(schema, anchorName)
    this.enumCollector.collect(anchorName, normalizedSchema)
    return normalizedSchema
  }

  /**
   * Build result metadata
   * @param warnings - warnings from quicktype
   * @returns schema result
   */
  private buildResult(warnings: QuicktypeWarning[]): SchemaResult {
    const data: SchemaData = warnings.length > 0 ? { warnings } : {}
    return buildOkResult(data)
  }

  /**
   * Build error result
   * @param error - caught error
   * @returns schema result error
   */
  private buildErrorResult(error: unknown): SchemaResult {
    return buildErrorResult(error)
  }
}
