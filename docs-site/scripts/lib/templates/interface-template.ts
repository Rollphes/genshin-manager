import type { GeneratorConfig, ParsedItem } from '../types'
import { escapeMdx } from '../utils'
import { renderMethod, renderPropertiesTable } from './shared-renderers'
import { renderTypeParameters, renderTypeSignature } from './type-renderer'

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
  item: ParsedItem,
  config: GeneratorConfig,
  category = 'interfaces',
): string {
  const { typeLinkMap: linkMap, hideExtends } = config
  const sections: string[] = []

  // Frontmatter with badge field
  const description = item.description || `${item.name} interface`
  const badge = getCategoryBadge(category)
  sections.push(`---
title: "${item.name}"
description: ${escapeMdx(description.split('\n')[0])}
badge: ${badge}
---

import { TypeLink, MethodAccordion, TypeTableByBadge, Md, InheritanceInfo } from '@/components/api'
import { Callout } from 'fumadocs-ui/components/callout'
`)

  // Inheritance info (type params, extends)
  const hasTypeParams =
    item.typeParameters !== undefined && item.typeParameters.length > 0
  const hasExtends = !hideExtends && item.extends !== undefined
  const hasInheritance = hasTypeParams || hasExtends

  if (hasInheritance) {
    const typeParamsStr =
      item.typeParameters && item.typeParameters.length > 0
        ? renderTypeParameters(item.typeParameters, linkMap)
        : 'undefined'
    const extendsType = item.extends
    const extendsStr =
      hasExtends && extendsType
        ? renderTypeSignature(extendsType, linkMap)
        : 'undefined'

    sections.push(`
<InheritanceInfo
  typeParams={${typeParamsStr}}
  extendsType={${extendsStr}}
/>
`)
  }

  // Properties
  if (item.properties.length > 0) {
    sections.push(`\n---\n\n## Properties\n`)
    // Interface properties don't have static flag
    const propsWithFlags = item.properties.map((p) => ({
      ...p,
      isStatic: false,
    }))
    sections.push(renderPropertiesTable(propsWithFlags, linkMap))
  }

  // Methods
  if (item.methods.length > 0) {
    sections.push(`\n---\n\n## Methods\n`)
    for (const method of item.methods) {
      // Interface methods don't have static flag
      const methodWithFlags = { ...method, isStatic: false }
      sections.push(renderMethod(methodWithFlags, linkMap))
    }
  }

  return sections.join('\n')
}
