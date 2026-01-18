import fs from 'fs/promises'
import path from 'path'

import type { DomainClassification } from './types'
import { toKebabCase } from './utils'

interface MetaJson {
  title?: string
  pages: string[]
  defaultOpen?: boolean
}

export class MetaGenerator {
  private outputDir: string

  constructor(outputDir: string) {
    this.outputDir = outputDir
  }

  /**
   * Generate all meta.json files (flat structure - no category folders)
   */
  public async generateAll(
    classifications: DomainClassification[],
  ): Promise<void> {
    const domains = [...new Set(classifications.map((c) => c.domain))]

    // Root meta.json
    await this.generateRootMeta(domains)

    // Domain meta.json (flat - includes all items directly)
    for (const domain of domains) {
      const domainClassifications = classifications.filter(
        (c) => c.domain === domain,
      )
      await this.generateDomainMeta(domain, domainClassifications)
    }
  }

  /**
   * Generate root meta.json
   */
  private async generateRootMeta(domains: string[]): Promise<void> {
    const sortedDomains = domains.sort((a, b) => {
      const order = [
        'client',
        'character',
        'weapon',
        'enka',
        'assets',
        'models',
        'errors',
        'types',
        'utilities',
      ]
      return (
        (!order.includes(a) ? 999 : order.indexOf(a)) -
        (!order.includes(b) ? 999 : order.indexOf(b))
      )
    })

    const meta: MetaJson = {
      title: 'API Reference',
      pages: sortedDomains,
      defaultOpen: true,
    }

    await this.writeMeta(this.outputDir, meta)
  }

  /**
   * Generate domain meta.json (flat - all items directly in domain)
   */
  private async generateDomainMeta(
    domain: string,
    classifications: DomainClassification[],
  ): Promise<void> {
    // Collect all items from all categories, sorted by category order then name
    const allItems: { slug: string; category: string }[] = []

    for (const classification of classifications) {
      for (const item of classification.items) {
        allItems.push({
          slug: toKebabCase(item.name),
          category: classification.category,
        })
      }
    }

    // Sort by category order, then alphabetically by slug
    allItems.sort((a, b) => {
      const categoryDiff =
        getCategoryOrder(a.category) - getCategoryOrder(b.category)
      if (categoryDiff !== 0) return categoryDiff
      return a.slug.localeCompare(b.slug)
    })

    const meta: MetaJson = {
      title: capitalize(domain),
      pages: allItems.map((item) => item.slug),
      defaultOpen: true,
    }

    await this.writeMeta(path.join(this.outputDir, domain), meta)
  }

  /**
   * Write meta.json file
   */
  private async writeMeta(dir: string, meta: MetaJson): Promise<void> {
    const filePath = path.join(dir, 'meta.json')
    await fs.writeFile(filePath, JSON.stringify(meta, null, 2), 'utf-8')
    console.log(`Generated: ${filePath}`)
  }
}

function getCategoryOrder(category: string): number {
  const order = ['classes', 'interfaces', 'types', 'functions']
  const index = order.indexOf(category)
  return index === -1 ? 999 : index
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
