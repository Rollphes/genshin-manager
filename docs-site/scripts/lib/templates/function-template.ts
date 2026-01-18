import type { ParsedClass, TypeLinkMap } from '../types'
import { escapeMdx } from '../utils'
import { renderTypeSignature } from './type-renderer'

/**
 * Get category badge for frontmatter
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
 * Generate function MDX content
 */
export function generateFunctionMdx(
  item: ParsedClass,
  linkMap: TypeLinkMap,
  category = 'functions',
): string {
  const sections: string[] = []

  // Frontmatter with badge field
  const description = item.description || `${item.name} function`
  const badge = getCategoryBadge(category)
  sections.push(`---
title: "${item.name}"
description: ${escapeMdx(description.split('\n')[0])}
badge: ${badge}
---

import { TypeLink, MethodAccordion, Md } from '@/components/api'
`)

  // Function as method
  if (item.methods.length > 0) {
    const method = item.methods[0]
    sections.push(`\n---\n\n## Signature\n`)

    const returnTypeStr = renderTypeSignature(method.returnType, linkMap)

    // Build parameters as JS array literal with JSX for types
    const parametersStr = `[${method.parameters
      .map((p) => {
        const typeJsx = renderTypeSignature(p.type, linkMap)
        const desc = escapeMdx(p.description ?? '')
        const defVal = p.defaultValue
          ? `"${escapeMdx(p.defaultValue)}"`
          : 'undefined'
        return `{ name: "${p.name}", typeJsx: ${typeJsx}, description: <Md>{\`${desc}\`}</Md>, optional: ${String(p.isOptional)}, defaultValue: ${defVal} }`
      })
      .join(', ')}]`

    let exampleStr = ''
    if (method.example) {
      const cleanExample = method.example
        .trim()
        .replace(/^```\w*\n?/, '')
        .replace(/\n?```$/, '')
        .trim()
      exampleStr = `example={\`${cleanExample.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}`
    }

    sections.push(`
<MethodAccordion
  name="${item.name}"
  returnType={${returnTypeStr}}
  description={<Md>{\`${escapeMdx(method.description ?? '')}\`}</Md>}
  parameters={${parametersStr}}
  ${method.returns ? `returns={<Md>{\`${escapeMdx(method.returns)}\`}</Md>}` : ''}
  ${exampleStr}
  isAsync={${String(method.isAsync)}}
  isStatic={false}
  isAbstract={false}
  defaultOpen={true}
/>
`)
  }

  return sections.join('\n')
}
