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
 * Generate interface MDX content
 */
export function generateInterfaceMdx(
  item: ParsedClass,
  linkMap: TypeLinkMap,
  category = 'interfaces',
): string {
  const sections: string[] = []

  // Frontmatter with badge field
  const description = item.description || `${item.name} interface`
  const badge = getCategoryBadge(category)
  sections.push(`---
title: "${item.name}"
description: ${escapeMdx(description.split('\n')[0])}
badge: ${badge}
---

import { TypeLink, MethodAccordion, TypeTableByBadge, Md } from '@/components/api'
import { Callout } from 'fumadocs-ui/components/callout'
`)

  if (item.extends) {
    const extendsStr = renderTypeSignature(item.extends, linkMap)
    sections.push(`\nextends ${extendsStr}\n`)
  }

  // Properties
  if (item.properties.length > 0) {
    sections.push(`\n---\n\n## Properties\n`)
    sections.push(renderPropertiesTable(item.properties, linkMap))
  }

  // Methods
  if (item.methods.length > 0) {
    sections.push(`\n---\n\n## Methods\n`)
    for (const method of item.methods)
      sections.push(renderMethod(method, linkMap))
  }

  return sections.join('\n')
}

function renderPropertiesTable(
  properties: ParsedClass['properties'],
  linkMap: TypeLinkMap,
): string {
  const entries = properties.map((prop) => {
    const typeStr = renderTypeSignature(prop.type, linkMap)
    const badges: string[] = []
    if (prop.isReadonly) badges.push('[readonly]')
    const badgePrefix = badges.join('')

    // Build description with warnings, additionalDescription, and mapDescription inline
    const descParts: string[] = []

    // Main description
    if (prop.description) {
      descParts.push(`<Md>{\`${escapeMdx(prop.description)}\`}</Md>`)
    }

    // Warnings as Callout
    if (prop.warnings && prop.warnings.length > 0) {
      for (const warning of prop.warnings) {
        descParts.push(
          `<Callout type="warn"><Md>{\`${escapeMdx(warning)}\`}</Md></Callout>`,
        )
      }
    }

    // Additional description as Callout
    if (prop.additionalDescription) {
      descParts.push(
        `<Callout type="info"><Md>{\`${escapeMdx(prop.additionalDescription)}\`}</Md></Callout>`,
      )
    }

    // Map/Record structure with @key/@value as nested TypeTable
    if (prop.mapDescription) {
      const { key, keyType, value, valueType } = prop.mapDescription
      const keyTypeStr = renderTypeSignature(keyType, linkMap)
      const valueTypeStr = renderTypeSignature(valueType, linkMap)
      descParts.push(`<div className="mt-2"><p className="text-sm font-medium mb-1">Object Structure</p><TypeTableByBadge type={{ "Key": { type: ${keyTypeStr}, description: <Md>{\`${escapeMdx(key)}\`}</Md> }, "Value": { type: ${valueTypeStr}, description: <Md>{\`${escapeMdx(value)}\`}</Md> } }} /></div>`)
    }

    const description =
      descParts.length > 0 ? `<>${descParts.join('')}</>` : `<Md>{\`\`}</Md>`

    return `    "${badgePrefix}${prop.name}": {
      type: ${typeStr},
      description: ${description},${prop.isOptional ? '' : '\n      required: true,'}
    }`
  })

  return `
<TypeTableByBadge
  type={{
${entries.join(',\n')}
  }}
/>
`
}

function renderMethod(
  method: ParsedClass['methods'][0],
  linkMap: TypeLinkMap,
): string {
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

  // Build description with warnings and additionalDescription inline
  const descParts: string[] = []
  if (method.description) {
    descParts.push(`<Md>{\`${escapeMdx(method.description)}\`}</Md>`)
  }
  if (method.warnings && method.warnings.length > 0) {
    for (const warning of method.warnings) {
      descParts.push(`<Callout type="warn"><Md>{\`${escapeMdx(warning)}\`}</Md></Callout>`)
    }
  }
  if (method.additionalDescription) {
    descParts.push(
      `<Callout type="info"><Md>{\`${escapeMdx(method.additionalDescription)}\`}</Md></Callout>`,
    )
  }
  const description =
    descParts.length > 0 ? `<>${descParts.join('')}</>` : `<Md>{\`\`}</Md>`

  return `
<MethodAccordion
  name="${method.name}"
  returnType={${returnTypeStr}}
  description={${description}}
  parameters={${parametersStr}}
  ${method.returns ? `returns={<Md>{\`${escapeMdx(method.returns)}\`}</Md>}` : ''}
  isAsync={${String(method.isAsync)}}
  isStatic={false}
  isAbstract={false}
/>
`
}
