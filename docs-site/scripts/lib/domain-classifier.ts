import type {
  ApiDocsConfig,
  DomainClassification,
  DomainRule,
  ParsedItem,
} from './types'

/**
 * Create a classifier function from domain rules
 * Supports both match (exact names) and matchPattern (regex), or both combined
 */
function createMatcher(rule: DomainRule): (name: string) => boolean {
  const matchList = rule.match
  const regex = rule.matchPattern ? new RegExp(rule.matchPattern) : undefined

  return (name: string): boolean => {
    if (matchList?.includes(name)) return true
    if (regex?.test(name)) return true
    return false
  }
}

/**
 * Determine domain for an item using config rules
 */
export function classifyDomain(
  item: ParsedItem,
  config: ApiDocsConfig,
): string {
  for (const rule of config.domainRules) {
    const matcher = createMatcher(rule)
    if (matcher(item.name)) return rule.domain
  }
  return config.defaultDomain
}

/**
 * Classify all items by domain using config
 */
export function classifyAllItems(
  items: ParsedItem[],
  config: ApiDocsConfig,
): DomainClassification[] {
  // Set domain for each item
  for (const item of items) item.domain = classifyDomain(item, config)

  // Group by domain
  const domainMap = new Map<string, ParsedItem[]>()

  for (const item of items) {
    const existing = domainMap.get(item.domain) ?? []
    existing.push(item)
    domainMap.set(item.domain, existing)
  }

  // Convert to DomainClassification
  const results: DomainClassification[] = []

  for (const [domain, domainItems] of domainMap) {
    // Group by category within domain
    const categories = new Map<string, ParsedItem[]>()

    for (const item of domainItems) {
      const category = getCategory(item.kind)
      const existing = categories.get(category) ?? []
      existing.push(item)
      categories.set(category, existing)
    }

    for (const [category, categoryItems] of categories) {
      results.push({
        domain,
        category: category as DomainClassification['category'],
        items: categoryItems.sort((a, b) => a.name.localeCompare(b.name)),
      })
    }
  }

  return results.sort((a, b) => {
    const domainOrder =
      getDomainOrder(a.domain, config) - getDomainOrder(b.domain, config)
    if (domainOrder !== 0) return domainOrder
    return (
      getCategoryOrder(a.category, config) -
      getCategoryOrder(b.category, config)
    )
  })
}

function getCategory(
  kind: ParsedItem['kind'],
): 'classes' | 'interfaces' | 'types' | 'functions' {
  switch (kind) {
    case 'class':
      return 'classes'
    case 'interface':
      return 'interfaces'
    case 'type':
    case 'enum':
      return 'types'
    case 'function':
      return 'functions'
  }
}

function getDomainOrder(domain: string, config: ApiDocsConfig): number {
  const index = config.domainOrder.indexOf(domain)
  return index === -1 ? 999 : index
}

function getCategoryOrder(category: string, config: ApiDocsConfig): number {
  const index = config.categoryOrder.indexOf(category)
  return index === -1 ? 999 : index
}
