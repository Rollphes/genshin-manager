import fs from 'fs/promises'
import path from 'path'

import {
  generateClassMdx,
  generateEnumMdx,
  generateFunctionMdx,
  generateInterfaceMdx,
  generateTypeMdx,
} from './templates'
import type {
  DomainClassification,
  GeneratorConfig,
  ParsedClass,
} from './types'
import { capitalize, toKebabCase } from './utils'

export class MdxGenerator {
  private config: GeneratorConfig

  constructor(config: GeneratorConfig) {
    this.config = config
  }

  /**
   * Generate all MDX files
   */
  public async generateAll(
    classifications: DomainClassification[],
  ): Promise<void> {
    // Create directories
    await this.createDirectories(classifications)

    // Generate MDX for each item
    for (const classification of classifications) {
      for (const item of classification.items)
        await this.generateMdx(item, classification)
    }

    // Generate index pages
    await this.generateIndexPages(classifications)
  }

  /**
   * Create directory structure (flat - no category subdirectories)
   */
  private async createDirectories(
    classifications: DomainClassification[],
  ): Promise<void> {
    const domains = new Set(classifications.map((c) => c.domain))

    for (const domain of domains) {
      const domainPath = path.join(this.config.outputDir, domain)
      await fs.mkdir(domainPath, { recursive: true })
    }
  }

  /**
   * Generate individual MDX file (flat structure - directly in domain folder)
   */
  private async generateMdx(
    item: ParsedClass,
    classification: DomainClassification,
  ): Promise<void> {
    const mdxContent = this.generateMdxContent(item)
    const fileName = `${toKebabCase(item.name)}.mdx`
    const filePath = path.join(
      this.config.outputDir,
      classification.domain,
      fileName,
    )

    await fs.writeFile(filePath, mdxContent, 'utf-8')
    console.log(`Generated: ${filePath}`)
  }

  /**
   * Generate MDX content based on item kind
   */
  private generateMdxContent(item: ParsedClass): string {
    switch (item.kind) {
      case 'class':
        return generateClassMdx(item, this.config.typeLinkMap)
      case 'interface':
        return generateInterfaceMdx(item, this.config.typeLinkMap)
      case 'type':
        return generateTypeMdx(item, this.config.typeLinkMap)
      case 'enum':
        return generateEnumMdx(item)
      case 'function':
        return generateFunctionMdx(item, this.config.typeLinkMap)
      default:
        return ''
    }
  }

  /**
   * Generate index pages (root only - no domain indexes)
   */
  private async generateIndexPages(
    classifications: DomainClassification[],
  ): Promise<void> {
    const domains = [...new Set(classifications.map((c) => c.domain))]

    // Root index only
    await this.generateRootIndex(domains)
  }

  /**
   * Generate root index
   */
  private async generateRootIndex(domains: string[]): Promise<void> {
    const content = `---
title: API Reference
description: genshin-manager API Reference
---

# API Reference

Complete API documentation for genshin-manager.

## Categories

${domains.map((d) => `- [${capitalize(d)}](/docs/api/${d})`).join('\n')}
`

    await fs.writeFile(
      path.join(this.config.outputDir, 'index.mdx'),
      content,
      'utf-8',
    )
    console.log(`Generated: ${this.config.outputDir}/index.mdx`)
  }
}
