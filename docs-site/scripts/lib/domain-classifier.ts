import type { DomainClassification, ParsedClass } from './types'

/**
 * Domain classification rules
 */
const DOMAIN_RULES: {
  domain: string
  match: RegExp | string[]
}[] = [
  {
    domain: 'client',
    match: [
      'Client',
      'ClientOption',
      'ClientEvents',
      'AssetCacheManager',
      'NoticeManager',
      'NoticeManagerEvents',
      'Notice',
    ],
  },
  {
    domain: 'character',
    match: /^(Character|Artifact)/,
  },
  {
    domain: 'weapon',
    match: /^Weapon/,
  },
  {
    domain: 'enka',
    match: /^(Enka|Genshin|PlayerDetail)/,
  },
  {
    domain: 'assets',
    match: ['ImageAssets', 'AudioAssets'],
  },
  {
    domain: 'monster',
    match: ['Monster'],
  },
  {
    domain: 'world',
    match: ['Material', 'DailyFarming', 'DomainData'],
  },
  {
    domain: 'common',
    match: ['ProfilePicture', 'StatProperty'],
  },
  {
    domain: 'errors',
    match: /Error$/,
  },
  {
    domain: 'types',
    match: [
      'Element',
      'FightPropType',
      'CVType',
      'ArtifactType',
      'BodyType',
      'QualityType',
      'WeaponType',
      'ItemType',
      'MaterialType',
      'ProfilePictureType',
      'DecodedType',
      'MasterFileMap',
    ],
  },
  {
    domain: 'utilities',
    match: /^(convert|create)/,
  },
]

/**
 * Determine domain for an item
 */
export function classifyDomain(item: ParsedClass): string {
  for (const rule of DOMAIN_RULES) {
    if (Array.isArray(rule.match)) {
      if (rule.match.includes(item.name)) return rule.domain
    } else if (rule.match.test(item.name)) {
      return rule.domain
    }
  }

  // Default to types
  return 'types'
}

/**
 * Classify all items by domain
 */
export function classifyAllItems(items: ParsedClass[]): DomainClassification[] {
  // Set domain for each item
  for (const item of items) item.domain = classifyDomain(item)

  // Group by domain
  const domainMap = new Map<string, ParsedClass[]>()

  for (const item of items) {
    const existing = domainMap.get(item.domain) ?? []
    existing.push(item)
    domainMap.set(item.domain, existing)
  }

  // Convert to DomainClassification
  const results: DomainClassification[] = []

  for (const [domain, domainItems] of domainMap) {
    // Group by category within domain
    const categories = new Map<string, ParsedClass[]>()

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
    const domainOrder = getDomainOrder(a.domain) - getDomainOrder(b.domain)
    if (domainOrder !== 0) return domainOrder
    return getCategoryOrder(a.category) - getCategoryOrder(b.category)
  })
}

function getCategory(
  kind: ParsedClass['kind'],
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

function getDomainOrder(domain: string): number {
  const order = [
    'client',
    'character',
    'weapon',
    'enka',
    'assets',
    'monster',
    'world',
    'common',
    'errors',
    'types',
    'utilities',
  ]
  const index = order.indexOf(domain)
  return index === -1 ? 999 : index
}

function getCategoryOrder(category: string): number {
  const order = ['classes', 'interfaces', 'types', 'functions']
  const index = order.indexOf(category)
  return index === -1 ? 999 : index
}
