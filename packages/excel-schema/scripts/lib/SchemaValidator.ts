import { type AnchorName, KeyRestorer } from '@genshin-manager/crypto'
import type { SchemaResult, SchemaResultError } from '@scripts/cli/SchemaCLI'
import type { ZodTypeAny } from 'zod'

/**
 * Validates data against generated Zod schemas
 */
export class SchemaValidator {
  /**
   * Validate data against existing schema
   * @param anchorName - name of the anchor/schema
   * @param raw - raw JSON string from GitLab
   * @returns validation result
   * @throws - Never throws, all errors are caught and converted to SchemaResult
   */
  public async validate(
    anchorName: AnchorName,
    raw: string,
  ): Promise<SchemaResult> {
    try {
      const data = this.restoreData(anchorName, raw)
      const schema = await this.loadSchemaModule(anchorName)

      const validationError = this.validateItems(schema, data, anchorName)
      if (validationError) return validationError

      return { name: anchorName, status: 'ok' }
    } catch (error) {
      return this.buildErrorResult(anchorName, error)
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
   * Load schema module dynamically
   * @param anchorName - name of the anchor
   * @returns loaded Zod schema
   */
  private async loadSchemaModule(anchorName: AnchorName): Promise<ZodTypeAny> {
    const schemaModule = (await import(
      `../../src/schema/${anchorName}Schema`
    )) as Record<string, ZodTypeAny | undefined>
    const schemaName = `${anchorName}Schema`
    const schema = schemaModule[schemaName]

    if (!schema) throw new Error(`Schema ${schemaName} not found in module`)

    return schema
  }

  /**
   * Validate all items against schema
   * @param schema - Zod schema
   * @param items - data items to validate
   * @param anchorName - name of the anchor
   * @returns error result if validation fails, null if success
   */
  private validateItems(
    schema: ZodTypeAny,
    items: unknown[],
    anchorName: AnchorName,
  ): SchemaResult | null {
    for (const item of items) {
      const result = schema.safeParse(item)

      if (!result.success) {
        return {
          name: anchorName,
          status: 'error',
          error: result.error,
        }
      }
    }

    return null
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
