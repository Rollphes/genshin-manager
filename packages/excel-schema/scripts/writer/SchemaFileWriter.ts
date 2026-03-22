import * as fs from 'node:fs'
import * as path from 'node:path'

import type { AnchorName } from '@genshin-manager/crypto'
import type { EnumCollector } from '@scripts/processor/EnumCollector'
import type { SchemaTransformer } from '@scripts/processor/SchemaTransformer'
import * as prettier from 'prettier'

/**
 * Writes schema files from generated schemas
 */
export class SchemaFileWriter {
  /**
   * Create a new SchemaFileWriter
   * @param outputPath - directory path for schema files
   * @param transformer - schema transformer for enum replacement
   * @param enumCollector - enum collector for enum information
   */
  constructor(
    private readonly outputPath: string,
    private readonly transformer: SchemaTransformer,
    private readonly enumCollector: EnumCollector,
  ) {}

  /**
   * Clean the output directory
   */
  public clean(): void {
    fs.mkdirSync(this.outputPath, { recursive: true })
  }

  /**
   * Write schema files from generated schemas
   * @param generatedSchemas - map of type name to schema
   * @param commitId - source commit ID
   * @param generatedDate - generation timestamp
   */
  public async write(
    generatedSchemas: Map<AnchorName, string>,
    commitId: string,
    generatedDate: Date,
  ): Promise<void> {
    for (const [typeName, schema] of generatedSchemas.entries())
      await this.writeSchemaFile(typeName, schema, commitId, generatedDate)
  }

  /**
   * Write a single schema file
   * @param typeName - name of the type
   * @param schema - generated schema string
   * @param commitId - source commit ID
   * @param generatedDate - generation timestamp
   */
  private async writeSchemaFile(
    typeName: AnchorName,
    schema: string,
    commitId: string,
    generatedDate: Date,
  ): Promise<void> {
    const nameMapping = this.enumCollector.getNameMapping(typeName)
    const enumNames = [...this.enumCollector.enumNames]
    const finalSchema = this.transformer.replaceEnumsWithImports(
      schema,
      enumNames,
      nameMapping,
      commitId,
      generatedDate,
    )
    const formattedSchema = await this.formatSchema(finalSchema)
    fs.writeFileSync(
      path.resolve(this.outputPath, `${typeName}Schema.ts`),
      formattedSchema,
    )
  }

  /**
   * Format schema with prettier
   * @param schema - schema string to format
   * @returns formatted schema
   */
  private async formatSchema(schema: string): Promise<string> {
    return prettier.format(schema, {
      parser: 'typescript',
      singleQuote: true,
      semi: false,
    })
  }
}
