import type { EventParameter, ParsedEvent } from './types'

/**
 * Parse @listener table from raw comment
 */
export function parseListenerTable(rawComment: string): EventParameter[] {
  // Find @listener tag and following markdown table
  const listenerMatch =
    /@listener\s*\n([\s\S]*?)(?=\n\s*\*\s*@|\n\s*\*\/|$)/.exec(rawComment)
  if (!listenerMatch) return []

  const tableContent = listenerMatch[1]

  // Extract table rows (exclude header and separator)
  const rows = tableContent
    .split('\n')
    .filter((line) => line.includes('|') && !line.includes('---'))
    .slice(1) // Skip header row

  return rows
    .map((row) => {
      const cells = row
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean)
      if (cells.length < 3) return null

      return {
        param: cells[0],
        type: cells[1],
        description: cells[2],
      }
    })
    .filter((p): p is EventParameter => p !== null)
}

/**
 * Parse @key/@value from raw comment
 */
export function parseMapDescription(
  rawComment: string,
): { key: string; value: string } | undefined {
  const keyMatch = /@key\s+(.+?)(?=\n|$)/.exec(rawComment)
  const valueMatch = /@value\s+(.+?)(?=\n|$)/.exec(rawComment)

  if (!keyMatch && !valueMatch) return undefined

  return {
    key: keyMatch?.[1]?.trim() ?? '',
    value: valueMatch?.[1]?.trim() ?? '',
  }
}

/**
 * Parse events from enum JSDoc comments
 */
export function parseEventsFromRawComments(
  enumName: string,
  rawComments: Map<string, string>,
): ParsedEvent[] {
  const events: ParsedEvent[] = []

  for (const [key, rawComment] of rawComments) {
    // Check if this is an enum member of the target enum
    if (!key.startsWith(`${enumName}.`)) continue

    // Check for @event tag
    const eventMatch = /@event\s+(\w+)/.exec(rawComment)
    if (!eventMatch) continue

    const memberName = key.replace(`${enumName}.`, '')
    const parameters = parseListenerTable(rawComment)

    // Extract description (first line before tags)
    const descMatch = /^\s*\*?\s*([^@\n]+)/.exec(rawComment)
    const description = descMatch?.[1]?.trim() ?? ''

    events.push({
      name: memberName,
      description,
      parameters,
    })
  }

  return events
}

/**
 * Extract raw JSDoc comment from source file
 * This is a simplified version - in production you might want to use ts-morph
 */
export function extractRawComment(source: string, name: string): string {
  // Try to find JSDoc comment before the declaration
  const regex = new RegExp(
    `(/\\*\\*[\\s\\S]*?\\*/)[\\s\\n]*(?:export\\s+)?(?:const|let|var|class|interface|type|enum|function)\\s+${name}\\b`,
    'm',
  )
  const match = source.match(regex)
  return match?.[1] ?? ''
}

/**
 * Check if comment has @deprecated tag
 */
export function hasDeprecatedTag(comment: string): boolean {
  return comment.includes('@deprecated')
}

/**
 * Extract @deprecated message
 */
export function extractDeprecatedMessage(comment: string): string | undefined {
  const match = /@deprecated\s+(.+?)(?=\n|$)/.exec(comment)
  return match?.[1]?.trim()
}

/**
 * Extract @see references
 */
export function extractSeeReferences(comment: string): string[] {
  const matches = comment.matchAll(/@see\s+(.+?)(?=\n|$)/g)
  return Array.from(matches, (m) => m[1].trim())
}

/**
 * Extract @default value
 */
export function extractDefaultValue(comment: string): string | undefined {
  const match = /@default\s+(.+?)(?=\n|$)/.exec(comment)
  return match?.[1]?.trim()
}
