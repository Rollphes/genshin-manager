import fs from 'fs/promises'
import path from 'path'

import { classifyAllItems } from './lib/domain-classifier'
import { MdxGenerator } from './lib/mdx-generator'
import { MetaGenerator } from './lib/meta-generator'
import { buildTypeLinkMap, typeLinkMapToObject } from './lib/type-link-map'
import { TypeDocParser } from './lib/typedoc-parser'
import type { ApiDocsConfig } from './lib/types'

const CONFIG_FILE = path.resolve(__dirname, '../api-docs.config.json')
const TYPE_LINK_MAP_OUTPUT = path.resolve(
  __dirname,
  '../src/generated/type-link-map.json',
)

async function loadConfig(): Promise<ApiDocsConfig> {
  const content = await fs.readFile(CONFIG_FILE, 'utf-8')
  return JSON.parse(content) as ApiDocsConfig
}

async function main(): Promise<void> {
  console.log('Starting API documentation generation...')

  // Load config
  console.log('\n0. Loading configuration...')
  const config = await loadConfig()
  console.log(`   Config: ${CONFIG_FILE}`)

  const OUTPUT_DIR = path.resolve(__dirname, '..', config.outputDir)
  const TYPEDOC_JSON = path.resolve(__dirname, '..', config.typedocJson)

  console.log(`TypeDoc JSON: ${TYPEDOC_JSON}`)
  console.log(`Output directory: ${OUTPUT_DIR}`)

  // Check if TypeDoc JSON exists
  try {
    await fs.access(TYPEDOC_JSON)
  } catch {
    console.error(`Error: TypeDoc JSON not found at ${TYPEDOC_JSON}`)
    console.error('Run "npm run generate:typedoc" first.')
    process.exit(1)
  }

  // 1. Clean output directory
  console.log('\n1. Cleaning output directory...')
  await cleanOutputDir(OUTPUT_DIR)

  // 2. Parse TypeDoc JSON
  console.log('\n2. Parsing TypeDoc JSON...')
  const parser = new TypeDocParser(TYPEDOC_JSON)
  const allItems = parser.parseAll()
  console.log(`   Parsed ${String(allItems.length)} items`)

  // Filter out @internal items if hideInternal is enabled
  const items = config.hideInternal
    ? allItems.filter((item) => !item.isInternal)
    : allItems
  if (config.hideInternal) {
    const hiddenCount = allItems.length - items.length
    console.log(`   Filtered ${String(hiddenCount)} @internal items`)
  }

  // 3. Classify items by domain
  console.log('\n3. Classifying items by domain...')
  const classifications = classifyAllItems(items, config)
  console.log(`   Classified into ${String(classifications.length)} categories`)

  // Print classification summary
  const domainCounts = new Map<string, number>()
  for (const c of classifications) {
    const current = domainCounts.get(c.domain) ?? 0
    domainCounts.set(c.domain, current + c.items.length)
  }
  for (const [domain, count] of domainCounts)
    console.log(`   - ${domain}: ${String(count)} items`)

  // 4. Build type link map
  console.log('\n4. Building type link map...')
  const typeLinkMap = buildTypeLinkMap(items)
  console.log(`   Created ${String(typeLinkMap.size)} type links`)

  // 5. Save type link map
  console.log('\n5. Saving type link map...')
  await saveTypeLinkMap(typeLinkMap)

  // 6. Generate MDX files
  console.log('\n6. Generating MDX files...')
  const mdxGenerator = new MdxGenerator({
    outputDir: OUTPUT_DIR,
    typeLinkMap,
    guideBasePath: config.guideBasePath,
    guideLinks: config.guideLinks,
    hideExtends: config.hideExtends,
    hideImplements: config.hideImplements,
    eventMappings: config.eventMappings,
  })
  await mdxGenerator.generateAll(classifications)

  // 7. Generate meta.json files
  console.log('\n7. Generating meta.json files...')
  const metaGenerator = new MetaGenerator(OUTPUT_DIR)
  await metaGenerator.generateAll(classifications)

  console.log('\n✅ API documentation generation complete!')
}

async function cleanOutputDir(outputDir: string): Promise<void> {
  try {
    await fs.rm(outputDir, { recursive: true, force: true })
    console.log(`   Removed ${outputDir}`)
  } catch {
    // Directory doesn't exist, ignore
  }
  await fs.mkdir(outputDir, { recursive: true })
  console.log(`   Created ${outputDir}`)
}

async function saveTypeLinkMap(linkMap: Map<string, string>): Promise<void> {
  const dir = path.dirname(TYPE_LINK_MAP_OUTPUT)
  await fs.mkdir(dir, { recursive: true })

  const obj = typeLinkMapToObject(linkMap)
  await fs.writeFile(
    TYPE_LINK_MAP_OUTPUT,
    JSON.stringify(obj, null, 2),
    'utf-8',
  )
  console.log(`   Saved to ${TYPE_LINK_MAP_OUTPUT}`)
}

main().catch((error: unknown) => {
  console.error('\n❌ Error generating API documentation:', error)
  process.exit(1)
})
