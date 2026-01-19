import type {
  GeneratorConfig,
  ParsedEnumMember,
  ParsedItem,
  TypeLinkMap,
} from '../types'
import { escapeMdx } from '../utils'
import {
  renderAccessor,
  renderMethod,
  renderPropertiesTable,
} from './shared-renderers'
import { renderTypeParameters, renderTypeSignature } from './type-renderer'

/**
 * Generate frontmatter and imports for class
 */
function generateFrontmatter(item: ParsedItem): string {
  const description = item.description || `${item.name} class`
  // Badge must be one of: class, interface, type, function, enum
  // Abstract/static modifiers are shown via InheritanceInfo or badges in UI
  const badge = 'class'

  return `---
title: "${item.name}"
description: ${escapeMdx(description.split('\n')[0])}
badge: ${badge}
---

import { TypeLink, MethodAccordion, AccessorAccordion, EventAccordion, CodeAccordion, TypeTableByBadge, Md, InheritanceInfo } from '@/components/api'
import { Callout } from 'fumadocs-ui/components/callout'
`
}

/**
 * Render inheritance info component if applicable
 */
function renderInheritanceSection(
  item: ParsedItem,
  linkMap: TypeLinkMap,
  hideExtends?: boolean,
  hideImplements?: boolean,
): string | null {
  const hasTypeParams =
    item.typeParameters !== undefined && item.typeParameters.length > 0
  const hasExtends = !hideExtends && item.extends !== undefined
  const hasImplements =
    !hideImplements &&
    item.implements !== undefined &&
    item.implements.length > 0

  if (!hasTypeParams && !hasExtends && !hasImplements) return null

  const typeParamsStr =
    item.typeParameters && item.typeParameters.length > 0
      ? renderTypeParameters(item.typeParameters, linkMap)
      : 'undefined'
  const extendsStr =
    hasExtends && item.extends
      ? renderTypeSignature(item.extends, linkMap)
      : 'undefined'
  const implementsStr =
    hasImplements && item.implements && item.implements.length > 0
      ? `[${item.implements.map((i) => renderTypeSignature(i, linkMap)).join(', ')}]`
      : 'undefined'

  return `
<InheritanceInfo
  typeParams={${typeParamsStr}}
  extendsType={${extendsStr}}
  implementsTypes={${implementsStr}}
/>
`
}

/**
 * Generate class MDX content
 */
export function generateClassMdx(
  item: ParsedItem,
  config: GeneratorConfig,
): string {
  const {
    typeLinkMap: linkMap,
    guideLinks,
    hideExtends,
    hideImplements,
    eventMappings,
    allItems,
  } = config
  const sections: string[] = []

  // Frontmatter
  sections.push(generateFrontmatter(item))

  // Inheritance info
  const inheritanceSection = renderInheritanceSection(
    item,
    linkMap,
    hideExtends,
    hideImplements,
  )
  if (inheritanceSection) sections.push(inheritanceSection)

  // Guide link
  const guideLink = guideLinks[item.name]
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
      sections.push(renderMethod(method, linkMap))
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

  // Events (from mapped event enum)
  const eventsSection = renderEventsSection(
    item.name,
    linkMap,
    eventMappings,
    allItems,
  )
  if (eventsSection) sections.push(eventsSection)

  return sections.join('\n')
}

/**
 * Render events section from mapped event enum
 */
function renderEventsSection(
  className: string,
  linkMap: TypeLinkMap,
  eventMappings?: Record<string, string>,
  allItems?: ParsedItem[],
): string | null {
  if (!eventMappings || !allItems) return null

  const eventEnumName = eventMappings[className]
  if (!eventEnumName) return null

  const eventEnum = allItems.find(
    (i) => i.kind === 'enum' && i.name === eventEnumName,
  )
  if (!eventEnum?.enumMembers || eventEnum.enumMembers.length === 0) return null

  // Get first event for example
  const firstEvent = eventEnum.enumMembers[0]
  const paramList =
    firstEvent.parameters?.map((p) => p.name).join(', ') ?? 'data'

  const sections: string[] = []
  sections.push(`\n---\n\n## Events\n`)

  // Add usage example in accordion
  const exampleCode = `import { ${className}, ${eventEnumName} } from 'genshin-manager'

const ${className.toLowerCase()} = new ${className}()

${className.toLowerCase()}.on(${eventEnumName}.${firstEvent.name}, (${paramList}) => {
  // Handle event
})`

  sections.push(`
<CodeAccordion
  title="How to use"
  code={\`${exampleCode}\`}
/>
`)

  for (const member of eventEnum.enumMembers)
    sections.push(renderEvent(member, linkMap))

  return sections.join('\n')
}

/**
 * Render single event as EventAccordion
 */
function renderEvent(member: ParsedEnumMember, linkMap: TypeLinkMap): string {
  const anchorId = member.name.replace(/\s+/g, '-').toLowerCase()

  // Build parameters array
  const parametersStr =
    member.parameters && member.parameters.length > 0
      ? `[${member.parameters
          .map((p) => {
            const typeJsx = renderTypeSignature(p.type, linkMap)
            const desc = escapeMdx(p.description ?? '')
            return `{ name: "${p.name}", typeJsx: ${typeJsx}, description: <Md>{\`${desc}\`}</Md> }`
          })
          .join(', ')}]`
      : '[]'

  const description = escapeMdx(member.description ?? '')

  return `
### ${member.name}

<EventAccordion
  name="${member.name}"
  description={<Md>{\`${description}\`}</Md>}
  parameters={${parametersStr}}
  id="${anchorId}"
/>
`
}

function renderConstructor(item: ParsedItem, linkMap: TypeLinkMap): string {
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
      return `{ name: "${p.name}", typeJsx: ${typeJsx}, description: <Md>{\`${desc}\`}</Md>, optional: ${String(p.isOptional)}, rest: ${String(p.isRest)}, defaultValue: ${defVal} }`
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
