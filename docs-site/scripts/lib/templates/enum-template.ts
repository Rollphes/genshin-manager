import type { ParsedItem } from '../types'
import { escapeMdx } from '../utils'

/**
 * Generate enum MDX content
 */
export function generateEnumMdx(item: ParsedItem): string {
  const sections: string[] = []

  // Frontmatter with badge field - always use 'enum' for enum template
  const description = item.description || `${item.name} enum`
  sections.push(`---
title: "${item.name}"
description: ${escapeMdx(description.split('\n')[0])}
badge: enum
---

import { TypeTableByBadge, Md } from '@/components/api'
`)

  // Enum members as TypeTable
  if (item.enumMembers && item.enumMembers.length > 0) {
    sections.push(`\n## Members\n`)
    sections.push(renderEnumMembersTable(item.enumMembers))
  }

  return sections.join('\n')
}

function renderEnumMembersTable(
  members: NonNullable<ParsedItem['enumMembers']>,
): string {
  const entries = members.map((member) => {
    const valueDisplay =
      typeof member.value === 'string'
        ? `<span className="text-[#0a3069] dark:text-[#a5d6ff]">"${escapeMdx(member.value)}"</span>`
        : `<span className="text-[#0550ae] dark:text-[#79c0ff]">${String(member.value)}</span>`

    return `    "${member.name}": {
      type: ${valueDisplay},
      description: <Md>{\`${escapeMdx(member.description ?? '')}\`}</Md>,
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
