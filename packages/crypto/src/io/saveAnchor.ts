import * as fs from 'node:fs'
import * as path from 'node:path'

import * as prettier from 'prettier'

import type { AnchorFile, AnchorName } from '@/types'

/** Generated files directory path */
const GENERATED_DIR = path.resolve(__dirname, '../generated')
const ANCHORS_DIR = path.resolve(GENERATED_DIR, 'anchors')

/**
 * Generate TypeScript code for an anchor file
 * @param name - anchor name
 * @param anchorFile - anchor file data
 * @returns TypeScript code string
 */
function generateAnchorTsFile(
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
 * Generate anchorMap.ts code
 * @param allNames - all anchor names
 * @returns TypeScript code string
 */
function generateAnchorMapFile(allNames: AnchorName[]): string {
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
 * Save anchor file to disk as TypeScript
 * @param name - anchor name
 * @param anchorFile - anchor file to save
 */
export async function saveAnchor(
  name: AnchorName,
  anchorFile: AnchorFile,
): Promise<void> {
  fs.mkdirSync(ANCHORS_DIR, { recursive: true })

  const tsCode = generateAnchorTsFile(name, anchorFile)
  const formatted = await prettier.format(tsCode, {
    parser: 'typescript',
    singleQuote: true,
    semi: false,
  })
  fs.writeFileSync(path.resolve(ANCHORS_DIR, `${name}.ts`), formatted)
}

/**
 * Generate anchorMap.ts file
 * @param allNames - all anchor names to include in the map
 */
export async function generateAnchorMap(allNames: AnchorName[]): Promise<void> {
  fs.mkdirSync(GENERATED_DIR, { recursive: true })

  const sorted = allNames.sort((a, b) => a.localeCompare(b))
  const tsCode = generateAnchorMapFile(sorted)
  const formatted = await prettier.format(tsCode, {
    parser: 'typescript',
    singleQuote: true,
    semi: false,
  })
  fs.writeFileSync(path.resolve(GENERATED_DIR, 'anchorMap.ts'), formatted)
}
