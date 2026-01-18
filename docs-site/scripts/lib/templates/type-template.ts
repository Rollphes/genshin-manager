import type { ParsedClass, TypeLinkMap } from '../types'
import { escapeMdx } from '../utils'
import { renderTypeSignature } from './type-renderer'

/**
 * Get category badge for sidebar title
 */
function getCategoryBadge(category: string): string {
  const badges: Record<string, string> = {
    classes: 'class',
    interfaces: 'interface',
    types: 'type',
    functions: 'function',
  }
  return badges[category] ?? category
}

/**
 * Generate type alias MDX content
 */
export function generateTypeMdx(
  item: ParsedClass,
  linkMap: TypeLinkMap,
  category = 'types',
): string {
  const sections: string[] = []

  // Frontmatter with badge field for sidebar TypeBadge
  const description = item.description || `${item.name} type`
  const badge = getCategoryBadge(category)
  sections.push(`---
title: "${item.name}"
description: ${escapeMdx(description.split('\n')[0])}
badge: ${badge}
---

import { TypeTableByBadge, Md } from '@/components/api'
`)

  // Type definition using TypeTable
  if (item.typeRef) {
    const typeJsx = renderTypeSignature(item.typeRef, linkMap)
    sections.push(`\n## Definition\n`)
    sections.push(`
<TypeTableByBadge
  type={{
    "${item.name}": {
      type: ${typeJsx},
      description: <Md>{\`${escapeMdx(description)}\`}</Md>,
    }
  }}
/>
`)
  } else if (item.typeDefinition) {
    // Fallback to code block if no typeRef
    sections.push(`\n## Definition\n`)
    sections.push(`\n\`\`\`typescript
type ${item.name} = ${item.typeDefinition}
\`\`\`\n`)
  }

  return sections.join('\n')
}
