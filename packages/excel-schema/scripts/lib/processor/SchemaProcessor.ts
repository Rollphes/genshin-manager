import { type AnchorName, KeyRestorer } from '@genshin-manager/crypto'
import type {
  SchemaResult,
  SchemaResultError,
  SchemaResultOk,
} from '@scripts/cli/SchemaCLI'
import type { EnumCollector } from '@scripts/lib/processor/EnumCollector'
import type { QuicktypeRunner } from '@scripts/lib/QuicktypeRunner'
import type { SchemaTransformer } from '@scripts/lib/SchemaTransformer'

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
    public readonly enumCollector: EnumCollector,
  ) {}

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
          result: {
            name: anchorName,
            status: 'skip',
            message: 'Empty restored data',
          },
          schema: null,
        }
      }

      const { schema, warnings } = await this.generateQuicktypeSchema(
        anchorName,
        data,
      )
      const normalizedSchema = this.normalizeAndCollect(anchorName, schema)
      const result = this.buildResult(anchorName, warnings)

      return {
        result,
        schema: normalizedSchema,
      }
    } catch (error) {
      return {
        result: this.buildErrorResult(anchorName, error),
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
   * @param anchorName - name of the anchor
   * @param warnings - warnings from quicktype
   * @returns schema result
   */
  private buildResult(
    anchorName: AnchorName,
    warnings: QuicktypeWarning[],
  ): SchemaResultOk {
    if (warnings.length > 0) {
      return {
        name: anchorName,
        status: 'ok',
        warnings,
      }
    }
    return {
      name: anchorName,
      status: 'ok',
    }
  }

  /**
   * Build error result
   * @param anchorName - name of the anchor
   * @param error - caught error
   * @returns schema result error
   */
  private buildErrorResult(
    anchorName: AnchorName,
    error: unknown,
  ): SchemaResultError {
    return {
      name: anchorName,
      status: 'error',
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}
