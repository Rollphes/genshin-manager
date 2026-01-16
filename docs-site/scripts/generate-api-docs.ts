import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'

interface ExportInfo {
  name: string
  kind: 'class' | 'interface' | 'type' | 'enum' | 'function' | 'const'
  sourcePath: string
  category: string
}

const CATEGORY_MAP: Record<string, string> = {
  'client/Client': 'client',
  'client/EnkaManager': 'client',
  'client/NoticeManager': 'client',
  'models/Artifact': 'models',
  'models/assets': 'assets',
  'models/character': 'character',
  'models/enka': 'enka',
  'models/weapon': 'weapon',
  'models/DailyFarming': 'models',
  'models/Material': 'models',
  'models/Monster': 'models',
  'models/Notice': 'models',
  'models/ProfilePicture': 'models',
  'models/StatProperty': 'models',
  'errors/base': 'errors',
  'errors/validation': 'errors',
  'errors/assets': 'errors',
  'errors/network': 'errors',
  'errors/decoding': 'errors',
  'errors/content': 'errors',
  'errors/config': 'errors',
  'errors/general': 'errors',
  'types/types': 'types',
  'types/generated': 'types',
  'types/enkaNetwork': 'types',
  schemas: 'schemas',
  utils: 'utils',
}

function getCategoryFromPath(sourcePath: string): string {
  for (const [key, category] of Object.entries(CATEGORY_MAP))
    if (sourcePath.includes(key)) return category

  return 'other'
}

function parseExports(): ExportInfo[] {
  const indexPath = path.resolve(__dirname, '../../src/index.ts')
  const content = fs.readFileSync(indexPath, 'utf-8')
  const sourceFile = ts.createSourceFile(
    'index.ts',
    content,
    ts.ScriptTarget.Latest,
    true,
  )

  const exports: ExportInfo[] = []
  const importMap = new Map<string, string>()

  // First pass: collect imports
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text
      const importClause = node.importClause
      if (importClause) {
        if (
          importClause.namedBindings &&
          ts.isNamedImports(importClause.namedBindings)
        ) {
          importClause.namedBindings.elements.forEach((element) => {
            const name = element.name.text
            importMap.set(name, moduleSpecifier)
          })
        }
        if (importClause.name)
          importMap.set(importClause.name.text, moduleSpecifier)
      }
    }
  })

  // Second pass: collect exports
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isExportDeclaration(node) && node.exportClause) {
      if (ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach((element) => {
          const name = element.name.text
          const sourcePath = importMap.get(name) ?? ''
          const category = getCategoryFromPath(sourcePath)

          // Determine kind based on naming convention
          let kind: ExportInfo['kind'] = 'const'
          if (
            name.endsWith('Error') ||
            name === 'Client' ||
            name === 'EnkaManager' ||
            name === 'NoticeManager' ||
            (/^[A-Z][a-z]/.test(name) &&
              !name.includes('Type') &&
              !name.includes('Events'))
          )
            kind = 'class'
          else if (
            name.endsWith('Events') ||
            (name.endsWith('Type') && !name.startsWith('create'))
          )
            kind = 'enum'
          else if (name.startsWith('create')) kind = 'function'
          else if (name === name.toUpperCase() || /^[A-Z][A-Z]/.test(name))
            kind = 'const'

          exports.push({ name, kind, sourcePath, category })
        })
      }
    }
  })

  return exports
}

function generateCategoryPage(category: string, items: ExportInfo[]): string {
  const title = category.charAt(0).toUpperCase() + category.slice(1)

  const classes = items.filter((i) => i.kind === 'class')
  const enums = items.filter((i) => i.kind === 'enum')
  const functions = items.filter((i) => i.kind === 'function')
  const types = items.filter((i) => i.kind === 'type' || i.kind === 'interface')
  const consts = items.filter((i) => i.kind === 'const')

  let content = `---
title: ${title}
description: ${title} API Reference
---

# ${title}

`

  if (classes.length > 0) {
    content += `## Classes\n\n`
    classes.forEach((item) => {
      content += `### ${item.name}\n\n`
      content += `<AutoTypeTable path="../src/${item.sourcePath.replace('@/', '')}.ts" name="${item.name}" />\n\n`
    })
  }

  if (enums.length > 0) {
    content += `## Enums\n\n`
    enums.forEach((item) => {
      content += `### ${item.name}\n\n`
      content += `<AutoTypeTable path="../src/${item.sourcePath.replace('@/', '')}.ts" name="${item.name}" />\n\n`
    })
  }

  if (functions.length > 0) {
    content += `## Functions\n\n`
    functions.forEach((item) => {
      content += `- \`${item.name}\`\n`
    })
    content += '\n'
  }

  if (types.length > 0) {
    content += `## Types\n\n`
    types.forEach((item) => {
      content += `- \`${item.name}\`\n`
    })
    content += '\n'
  }

  if (consts.length > 0) {
    content += `## Constants\n\n`
    consts.forEach((item) => {
      content += `- \`${item.name}\`\n`
    })
    content += '\n'
  }

  return content
}

function generateApiIndex(categories: string[]): string {
  return `---
title: API Reference
description: Genshin Manager API documentation
---

# API Reference

Complete API documentation for Genshin Manager, auto-generated from TypeScript source code.

## Categories

<Cards>
${categories.map((cat) => `  <Card title="${cat.charAt(0).toUpperCase() + cat.slice(1)}" href="/docs/api/${cat}" />`).join('\n')}
</Cards>

## Quick Reference

### Core Classes

- **Client** - Main entry point for the library
- **EnkaManager** - Handles Enka.Network API interactions
- **NoticeManager** - Manages game announcements

### Data Models

- **Character** / **CharacterInfo** - Character data and information
- **Weapon** / **WeaponInfo** - Weapon stats and properties
- **Artifact** - Artifact data and set bonuses
- **Material** - Game materials and items

### Enka Network

- **PlayerDetail** - Player profile information
- **CharacterDetail** - Detailed character showcase data
- **GenshinAccount** - Game account information
`
}

async function main(): Promise<void> {
  const exports = parseExports()

  // Group by category
  const byCategory = new Map<string, ExportInfo[]>()
  exports.forEach((exp) => {
    const list = byCategory.get(exp.category) ?? []
    list.push(exp)
    byCategory.set(exp.category, list)
  })

  const apiDir = path.resolve(__dirname, '../content/docs/api')

  // Ensure api directory exists
  if (!fs.existsSync(apiDir)) fs.mkdirSync(apiDir, { recursive: true })

  // Generate category pages
  const categories: string[] = []
  byCategory.forEach((items, category) => {
    if (category !== 'other' && items.length > 0) {
      categories.push(category)
      const content = generateCategoryPage(category, items)
      const filePath = path.join(apiDir, `${category}.mdx`)
      fs.writeFileSync(filePath, content)
      console.log(`Generated: ${filePath}`)
    }
  })

  // Generate index page
  const indexContent = generateApiIndex(categories.sort())
  fs.writeFileSync(path.join(apiDir, 'index.mdx'), indexContent)
  console.log(`Generated: ${path.join(apiDir, 'index.mdx')}`)

  console.log(`\nGenerated ${String(categories.length)} category pages`)
}

main().catch(console.error)
