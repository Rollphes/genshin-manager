import * as fs from 'node:fs'
import * as path from 'node:path'

import * as prettier from 'prettier'

/**
 * Writes enum files from collected enum values
 */
export class EnumFileWriter {
  /** Regex for invalid artifact values */
  private static readonly artifactPattern = /^[\s,;:'"()]/

  /**
   * Create a new EnumFileWriter
   * @param outputPath - directory path for enum files
   */
  constructor(private readonly outputPath: string) {}

  /**
   * Clean the output directory
   */
  public clean(): void {
    if (fs.existsSync(this.outputPath))
      fs.rmSync(this.outputPath, { recursive: true })

    fs.mkdirSync(this.outputPath, { recursive: true })
  }

  /**
   * Write enum files from collected enums
   * @param enums - map of enumName to Set of values
   * @param commitId - source commit ID
   * @param generatedAt - generation timestamp
   */
  public async write(
    enums: ReadonlyMap<string, ReadonlySet<string>>,
    commitId: string,
    generatedAt: string,
  ): Promise<void> {
    for (const [enumName, values] of enums.entries()) {
      const sortedValues = this.prepareValues(values)

      if (sortedValues.length === 0) continue

      const content = await this.generateContent(
        enumName,
        sortedValues,
        commitId,
        generatedAt,
      )
      fs.writeFileSync(path.resolve(this.outputPath, `${enumName}.ts`), content)
    }
  }

  /**
   * Prepare values for writing (filter, sort, escape)
   * @param values - raw set of values
   * @returns sorted and escaped array of values
   */
  private prepareValues(values: ReadonlySet<string>): string[] {
    return [...values]
      .filter((v) => v === '' || !EnumFileWriter.artifactPattern.test(v))
      .sort()
      .map((v) =>
        v
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r'),
      )
  }

  /**
   * Generate enum file content
   * @param enumName - name of the enum
   * @param values - sorted and escaped values
   * @param commitId - source commit ID
   * @param generatedAt - generation timestamp
   * @returns formatted file content string
   */
  private async generateContent(
    enumName: string,
    values: string[],
    commitId: string,
    generatedAt: string,
  ): Promise<string> {
    const header = this.buildMetadataHeader(commitId, generatedAt)
    const importLine = `import { z } from 'zod'`
    const schemaDoc = `/** Zod enum schema for ${enumName}. */`
    const enumValues = values.map((v) => `'${v}'`).join(', ')
    const schema = `export const ${enumName}Enum = z.enum([${enumValues}])`
    const typeDoc = `/** Type representing ${enumName}. */`
    const typeExport = `export type ${enumName} = z.infer<typeof ${enumName}Enum>`

    const raw = [
      header,
      importLine,
      schemaDoc,
      schema,
      typeDoc,
      typeExport,
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
