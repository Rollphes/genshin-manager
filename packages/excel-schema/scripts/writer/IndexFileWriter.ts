import * as fs from 'node:fs'
import * as path from 'node:path'

import * as prettier from 'prettier'

/**
 * Writes the index.ts barrel file from generated schemas and enums
 */
export class IndexFileWriter {
  /**
   * Create a new IndexFileWriter
   * @param outputPath - directory path for index.ts (src/)
   */
  constructor(private readonly outputPath: string) {}

  /**
   * Write index.ts with all exports
   * @param schemaNames - sorted list of schema type names
   * @param enumNames - sorted list of enum names
   * @param commitId - source commit ID
   * @param generatedAt - generation timestamp
   */
  public async write(
    schemaNames: string[],
    enumNames: string[],
    commitId: string,
    generatedAt: string,
  ): Promise<void> {
    const content = await this.generateContent(
      schemaNames,
      enumNames,
      commitId,
      generatedAt,
    )
    fs.writeFileSync(path.resolve(this.outputPath, 'index.ts'), content)
  }

  /**
   * Generate index.ts content
   * @param schemaNames - list of schema type names
   * @param enumNames - list of enum names
   * @param commitId - source commit ID
   * @param generatedAt - generation timestamp
   * @returns formatted file content string
   */
  private async generateContent(
    schemaNames: string[],
    enumNames: string[],
    commitId: string,
    generatedAt: string,
  ): Promise<string> {
    const header = this.buildMetadataHeader(commitId, generatedAt)

    // Sort by path (schema path includes 'Schema' suffix)
    const sortedSchemaNames = [...schemaNames].sort((a, b) =>
      `${a}Schema`.localeCompare(`${b}Schema`),
    )
    const sortedEnumNames = [...enumNames].sort((a, b) => a.localeCompare(b))

    const schemaExports = sortedSchemaNames.map(
      (name) =>
        `export { type ${name}, ${name}Schema } from '@/schema/${name}Schema'`,
    )

    const enumExports = sortedEnumNames.map(
      (name) => `export { type ${name}, ${name}Enum } from '@/enum/${name}'`,
    )

    const raw = [
      header,
      '',
      '// Schemas',
      ...schemaExports,
      '',
      '// Enums',
      ...enumExports,
    ].join('\n')

    return prettier.format(raw, {
      parser: 'typescript',
      singleQuote: true,
      semi: false,
    })
  }

  /**
   * Build metadata header comment
   * @param commitId - source commit ID
   * @param generatedAt - generation timestamp
   * @returns formatted header comment
   */
  private buildMetadataHeader(commitId: string, generatedAt: string): string {
    return [
      '/**',
      ' * @generated',
      ` * @source ${commitId}`,
      ` * @date ${generatedAt}`,
      ' */',
    ].join('\n')
  }
}
