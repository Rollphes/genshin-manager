/**
 * Transforms generated Zod schemas (naming normalization, enum replacement)
 */
export class SchemaTransformer {
  /** Regex for enum declaration with type export */
  private static readonly enumDeclPattern =
    /export const (\w+)Schema = z\.enum\(\[\s*[\s\S]*?\s*\]\);\nexport type \w+ = z\.infer<typeof \w+Schema>;\n\n?/g

  /** Regex for zod import statement */
  private static readonly zodImportPattern = /import \* as z from "zod";/

  /** Regex for multiple blank lines */
  private static readonly multiNewlinePattern = /\n{3,}/g

  /**
   * Normalize schema naming convention (Datum -> Data)
   * @param schema - raw generated Zod schema string
   * @param typeName - the type name being processed
   * @returns normalized schema
   */
  public normalizeNames(schema: string, typeName: string): string {
    let processed = schema

    const datumSchemaName = `${typeName.replace('ExcelConfigData', '')}ExcelConfigDatumSchema`
    const schemaName = `${typeName}Schema`
    processed = processed.replace(new RegExp(datumSchemaName, 'g'), schemaName)

    const datumTypeName = `${typeName.replace('ExcelConfigData', '')}ExcelConfigDatum`
    processed = processed.replace(
      new RegExp(`type ${datumTypeName}`, 'g'),
      `type ${typeName}`,
    )
    processed = processed.replace(
      new RegExp(`typeof ${datumTypeName}Schema`, 'g'),
      `typeof ${schemaName}`,
    )

    return processed
  }

  /**
   * Replace local enum definitions with imports from common enum files
   * @param schema - schema string with local enum definitions
   * @param enumNames - list of enum names that have common files
   * @param nameMapping - Map<quicktypeName, derivedNames[]> for this schema
   * @param commitId - source commit ID
   * @param generatedAt - generation timestamp
   * @returns schema with enum imports and metadata header
   */
  public replaceEnumsWithImports(
    schema: string,
    enumNames: string[],
    nameMapping: ReadonlyMap<string, readonly string[]>,
    commitId: string,
    generatedAt: string,
  ): string {
    let processed = schema
    const enumImports = new Set<string>()

    // Find local enums and their mappings
    const localEnumNames = this.findLocalEnumNames(schema)

    // Remove local enum declarations and replace usages
    for (const localName of localEnumNames) {
      const derivedNames = nameMapping.get(localName)
      if (!derivedNames || derivedNames.length === 0) continue

      // Check if all derived names exist in common enums
      const validDerivedNames = derivedNames.filter((name) =>
        enumNames.includes(name),
      )
      if (validDerivedNames.length === 0) continue

      // Remove local enum declaration
      const declRegex = new RegExp(
        `export const ${localName}Schema = z\\.enum\\(\\[[\\s\\S]*?\\]\\);\\nexport type ${localName} = z\\.infer<typeof ${localName}Schema>;\\n\\n?`,
        'g',
      )
      processed = processed.replace(declRegex, '')

      // Build replacement expression
      const replacement = this.buildEnumReference(validDerivedNames)

      // Replace usages of local enum schema (with word boundary to avoid partial matches)
      processed = processed.replace(
        new RegExp(`\\b${localName}Schema\\b`, 'g'),
        replacement,
      )

      // Add to imports
      for (const name of validDerivedNames) enumImports.add(name)
    }

    // Update imports
    processed = this.updateImports(processed, enumImports)

    // Add metadata header
    processed = this.addMetadataHeader(processed, commitId, generatedAt)

    // Clean up multiple blank lines
    processed = processed.replace(SchemaTransformer.multiNewlinePattern, '\n\n')

    return processed
  }

  /**
   * Build enum reference expression (single enum or union)
   * @param derivedNames - array of derived enum names
   * @returns enum reference string
   */
  private buildEnumReference(derivedNames: string[]): string {
    if (derivedNames.length === 1) return `${derivedNames[0]}Enum`

    // Multiple enums -> union type
    const enumRefs = derivedNames.map((name) => `${name}Enum`).join(', ')
    return `z.union([${enumRefs}])`
  }

  /**
   * Find all local enum names in the schema
   * @param schema - schema string
   * @returns list of local enum names
   */
  private findLocalEnumNames(schema: string): string[] {
    const pattern = new RegExp(SchemaTransformer.enumDeclPattern.source, 'g')
    const found: string[] = []
    let match

    while ((match = pattern.exec(schema)) !== null) found.push(match[1])

    return found
  }

  /**
   * Update import statements in schema
   * @param schema - schema string
   * @param enumImports - set of enum names to import
   * @returns schema with updated imports
   */
  private updateImports(schema: string, enumImports: Set<string>): string {
    if (enumImports.size === 0) {
      return schema.replace(
        SchemaTransformer.zodImportPattern,
        `import { z } from 'zod'`,
      )
    }

    const importLines = [...enumImports]
      .sort((a, b) => a.localeCompare(b))
      .map((enumName) => `import { ${enumName}Enum } from '@/enum/${enumName}'`)
      .join('\n')

    return schema.replace(
      SchemaTransformer.zodImportPattern,
      `import { z } from 'zod'\n\n${importLines}`,
    )
  }

  /**
   * Add metadata header to schema
   * @param schema - schema string
   * @param commitId - source commit ID
   * @param generatedAt - generation timestamp
   * @returns schema with metadata header
   */
  private addMetadataHeader(
    schema: string,
    commitId: string,
    generatedAt: string,
  ): string {
    const header = [
      '/**',
      ' * @generated',
      ` * @source ${commitId}`,
      ` * @date ${generatedAt}`,
      ' */',
    ].join('\n')

    return `${header}\n${schema}`
  }
}
