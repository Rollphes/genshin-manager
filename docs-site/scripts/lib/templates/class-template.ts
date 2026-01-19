import type { ParsedAccessor, ParsedClass, TypeLinkMap } from '../types'
import { escapeMdx } from '../utils'
import { renderTypeSignature } from './type-renderer'

/**
 * Guide links mapping
 */
const GUIDE_LINKS: Record<string, string> = {
  Client: '/docs/guide/getting-started',
  Character: '/docs/guide/characters',
  Weapon: '/docs/guide/weapons',
}

/**
 * Generate class MDX content
 */
export function generateClassMdx(
  item: ParsedClass,
  linkMap: TypeLinkMap,
): string {
  const sections: string[] = []

  // Frontmatter
  const description = item.description || `${item.name} class`
  const badgeParts: string[] = []
  if (item.isAbstract) badgeParts.push('abstract')
  if (item.isStatic) badgeParts.push('static')
  badgeParts.push('class')
  const badge = badgeParts.join(' ')
  sections.push(`---
title: "${item.name}"
description: ${escapeMdx(description.split('\n')[0])}
badge: ${badge}
---

import { TypeLink, MethodAccordion, AccessorAccordion, TypeTableByBadge, Md } from '@/components/api'
import { Callout } from 'fumadocs-ui/components/callout'
`)

  if (item.extends) {
    const extendsStr = renderTypeSignature(item.extends, linkMap)
    sections.push(`\nextends ${extendsStr}\n`)
  }

  // Guide link
  const guideLink = GUIDE_LINKS[item.name]
  if (guideLink)
    sections.push(`\n> See [Guide](${guideLink}) for usage examples.\n`)

  // Constructor (member-ordering: constructor first)
  if (item.constructor && item.constructor.parameters.length > 0) {
    sections.push(`\n---\n\n## Constructor\n`)
    sections.push(renderConstructor(item, linkMap))
  }

  // Properties (static first, then instance - per member-ordering)
  const allProperties = [
    ...item.staticProperties.map((p) => ({ ...p, isStatic: true })),
    ...item.properties.map((p) => ({ ...p, isStatic: false })),
  ]
  if (allProperties.length > 0) {
    sections.push(`\n---\n\n## Properties\n`)
    sections.push(renderPropertiesTable(allProperties, linkMap))
  }

  // Methods (static first, then instance - per member-ordering)
  const allMethods = [
    ...item.staticMethods.map((m) => ({ ...m, isStatic: true })),
    ...item.methods.map((m) => ({ ...m, isStatic: false })),
  ]
  if (allMethods.length > 0) {
    sections.push(`\n---\n\n## Methods\n`)
    for (const method of allMethods)
      sections.push(renderMethod(method, linkMap, method.isStatic))
  }

  // Accessors (static first, then instance - per member-ordering)
  const allAccessors = [
    ...item.staticAccessors.map((a) => ({ ...a, isStatic: true })),
    ...item.accessors.map((a) => ({ ...a, isStatic: false })),
  ]
  if (allAccessors.length > 0) {
    sections.push(`\n---\n\n## Accessors\n`)
    for (const accessor of allAccessors)
      sections.push(renderAccessor(accessor, linkMap))
  }

  return sections.join('\n')
}

function renderConstructor(item: ParsedClass, linkMap: TypeLinkMap): string {
  const ctor = item.constructor
  if (!ctor) return ''

  // Build parameters as JS array literal with JSX for types
  const parametersStr = `[${ctor.parameters
    .map((p) => {
      const typeJsx = renderTypeSignature(p.type, linkMap)
      const desc = escapeMdx(p.description ?? '')
      const defVal = p.defaultValue
        ? `"${escapeMdx(p.defaultValue)}"`
        : 'undefined'
      return `{ name: "${p.name}", typeJsx: ${typeJsx}, description: <Md>{\`${desc}\`}</Md>, optional: ${String(p.isOptional)}, defaultValue: ${defVal} }`
    })
    .join(', ')}]`

  return `
<MethodAccordion
  name="new ${item.name}"
  returnType={${renderTypeSignature({ name: item.name }, linkMap)}}
  description={<Md>{\`${escapeMdx(ctor.description ?? '')}\`}</Md>}
  parameters={${parametersStr}}
/>
`
}

type PropertyWithStatic = ParsedClass['properties'][0] & {
  isStatic: boolean
}

function renderPropertiesTable(
  properties: PropertyWithStatic[],
  linkMap: TypeLinkMap,
): string {
  const entries = properties.map((prop) => {
    const typeStr = renderTypeSignature(prop.type, linkMap)
    const badges: string[] = []
    if (prop.isReadonly) badges.push('[readonly]')
    if (prop.isStatic) badges.push('[static]')
    if (prop.isAbstract) badges.push('[abstract]')
    if (prop.isProtected) badges.push('[protected]')
    const badgePrefix = badges.join('')

    // Build description with warnings, additionalDescription, and mapDescription inline
    const descParts: string[] = []

    // Main description
    if (prop.description)
      descParts.push(`<Md>{\`${escapeMdx(prop.description)}\`}</Md>`)

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
      descParts.push(
        `<div className="mt-2"><p className="text-sm font-medium mb-1">Object Structure</p><TypeTableByBadge type={{ "Key": { type: ${keyTypeStr}, description: <Md>{\`${escapeMdx(key)}\`}</Md> }, "Value": { type: ${valueTypeStr}, description: <Md>{\`${escapeMdx(value)}\`}</Md> } }} /></div>`,
      )
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
  isStatic: boolean,
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

  // Clean up example code
  let exampleStr = ''
  if (method.example) {
    const cleanExample = method.example
      .trim()
      .replace(/^```\w*\n?/, '')
      .replace(/\n?```$/, '')
      .trim()
    exampleStr = `example={\`${cleanExample.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}`
  }

  // Build description with warnings and additionalDescription inline
  const descParts: string[] = []
  if (method.description)
    descParts.push(`<Md>{\`${escapeMdx(method.description)}\`}</Md>`)

  if (method.warnings && method.warnings.length > 0) {
    for (const warning of method.warnings) {
      descParts.push(
        `<Callout type="warn"><Md>{\`${escapeMdx(warning)}\`}</Md></Callout>`,
      )
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
  ${exampleStr}
  isAsync={${String(method.isAsync)}}
  isStatic={${String(isStatic)}}
  isAbstract={${String(method.isAbstract)}}
  isProtected={${String(method.isProtected)}}
/>
`
}

function renderAccessor(
  accessor: ParsedAccessor,
  linkMap: TypeLinkMap,
): string {
  const typeStr = renderTypeSignature(accessor.type, linkMap)
  const description = accessor.description
    ? `<Md>{\`${escapeMdx(accessor.description)}\`}</Md>`
    : `<Md>{\`\`}</Md>`

  return `
<AccessorAccordion
  name="${accessor.name}"
  typeJsx={${typeStr}}
  description={${description}}
  hasGetter={${String(accessor.hasGetter)}}
  hasSetter={${String(accessor.hasSetter)}}
  isStatic={${String(accessor.isStatic)}}
  isAbstract={${String(accessor.isAbstract)}}
  isProtected={${String(accessor.isProtected)}}
/>
`
}
