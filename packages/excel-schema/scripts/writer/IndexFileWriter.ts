import * as fs from 'node:fs'
import * as path from 'node:path'

import { buildMetadataHeader } from '@scripts/generator/buildMetadataHeader'
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
   * @param generatedDate - generation timestamp
   */
  public async write(
    schemaNames: string[],
    enumNames: string[],
    commitId: string,
    generatedDate: Date,
  ): Promise<void> {
    const content = await this.generateContent(
      schemaNames,
      enumNames,
      commitId,
      generatedDate,
    )
    fs.writeFileSync(path.resolve(this.outputPath, 'index.ts'), content)
  }

  /**
   * Generate index.ts content
   * @param schemaNames - list of schema type names
   * @param enumNames - list of enum names
   * @param commitId - source commit ID
   * @param generatedDate - generation timestamp
   * @returns formatted file content string
   */
  private async generateContent(
    schemaNames: string[],
    enumNames: string[],
    commitId: string,
    generatedDate: Date,
  ): Promise<string> {
    const header = buildMetadataHeader(commitId, generatedDate)

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
}
