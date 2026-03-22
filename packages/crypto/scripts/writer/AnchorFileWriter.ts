import * as fs from 'node:fs'
import * as path from 'node:path'

import * as prettier from 'prettier'

import type { AnchorFile, AnchorName } from '@/types'

/**
 * Writes individual anchor files to disk
 */
export class AnchorFileWriter {
  /** Anchors directory path */
  private readonly anchorsDir: string

  /**
   * Create a new AnchorFileWriter
   * @param outputPath - base output directory (src/generated)
   */
  constructor(outputPath: string) {
    this.anchorsDir = path.resolve(outputPath, 'anchors')
  }

  /**
   * Save anchor file to disk as TypeScript
   * @param name - anchor name
   * @param anchorFile - anchor file to save
   */
  public async save(name: AnchorName, anchorFile: AnchorFile): Promise<void> {
    fs.mkdirSync(this.anchorsDir, { recursive: true })

    const tsCode = this.generateAnchorTsFile(name, anchorFile)
    const formatted = await this.formatCode(tsCode)
    fs.writeFileSync(path.resolve(this.anchorsDir, `${name}.ts`), formatted)
  }

  /**
   * Generate TypeScript code for an anchor file
   * @param name - anchor name
   * @param anchorFile - anchor file data
   * @returns TypeScript code string
   */
  private generateAnchorTsFile(
    name: AnchorName,
    anchorFile: AnchorFile,
  ): string {
    return [
      `import type { AnchorFile } from '@/types'`,
      '',
      '/**',
      ` * Anchor file for ${name}.`,
      ' * Auto-generated - do not edit manually.',
      ' */',
      `export const ${name} = ${JSON.stringify(anchorFile, null, 2)} as unknown as AnchorFile`,
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
