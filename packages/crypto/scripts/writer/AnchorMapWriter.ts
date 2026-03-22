import * as fs from 'node:fs'
import * as path from 'node:path'

import * as prettier from 'prettier'

import type { AnchorName } from '@/types'

/**
 * Writes anchorMap.ts file to disk
 */
export class AnchorMapWriter {
  /** Generated files directory path */
  private readonly generatedDir: string

  /**
   * Create a new AnchorMapWriter
   * @param outputPath - base output directory (src/generated)
   */
  constructor(outputPath: string) {
    this.generatedDir = outputPath
  }

  /**
   * Generate anchorMap.ts file
   * @param allNames - all anchor names to include in the map
   */
  public async write(allNames: AnchorName[]): Promise<void> {
    fs.mkdirSync(this.generatedDir, { recursive: true })

    const sorted = allNames.sort((a, b) => a.localeCompare(b))
    const tsCode = this.generateAnchorMapFile(sorted)
    const formatted = await this.formatCode(tsCode)
    fs.writeFileSync(path.resolve(this.generatedDir, 'anchorMap.ts'), formatted)
  }

  /**
   * Generate anchorMap.ts code
   * @param allNames - all anchor names
   * @returns TypeScript code string
   */
  private generateAnchorMapFile(allNames: AnchorName[]): string {
    const valueImports = allNames.map(
      (name) => `import { ${name} } from '@/generated/anchors/${name}'`,
    )
    const typeImports = `import type { AnchorFile, AnchorName } from '@/types'`
    const mapEntries = allNames.map((name) => `  ${name},`)

    return [
      ...valueImports,
      typeImports,
      '',
      '/**',
      ' * Map of anchor names to anchor files.',
      ' * Auto-generated - do not edit manually.',
      ' */',
      'export const anchorMap = {',
      ...mapEntries,
      '} satisfies Record<AnchorName, AnchorFile | undefined>',
    ].join('\n')
  }

  /**
   * Format TypeScript code with prettier
   * @param code - code to format
   * @returns formatted code
   */
  private async formatCode(code: string): Promise<string> {
    return prettier.format(code, {
      parser: 'typescript',
      singleQuote: true,
      semi: false,
    })
  }
}
