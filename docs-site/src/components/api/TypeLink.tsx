import Link from 'next/link'

import { cn } from '@/lib/cn'

interface TypeLinkProps {
  type: string
  path?: string
  isArray?: boolean
  className?: string
}

const PRIMITIVE_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'void',
  'null',
  'undefined',
  'any',
  'unknown',
  'never',
  'object',
  'symbol',
  'bigint',
])

// This will be populated by the generated type-link-map.json
// For now, we use a dynamic import approach
let typeLinkMap: Record<string, string> = {}

// Try to load the type link map
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  typeLinkMap = require('@/generated/type-link-map.json') as Record<
    string,
    string
  >
} catch {
  // File doesn't exist yet, use empty map
}

export function TypeLink({
  type,
  path,
  isArray = false,
  className,
}: TypeLinkProps): React.ReactElement {
  const suffix = isArray ? '[]' : ''

  // Primitive types - no link (GitHub blue)
  if (PRIMITIVE_TYPES.has(type)) {
    return (
      <>
        <span className={cn('text-[#0550ae] dark:text-[#79c0ff]', className)}>
          {type}
        </span>
        {suffix}
      </>
    )
  }

  // Use provided path or lookup from map
  const linkPath = path ?? typeLinkMap[type]

  if (linkPath) {
    return (
      <>
        <Link
          href={linkPath}
          className={cn(
            'text-[#0550ae] dark:text-[#79c0ff] underline hover:opacity-80',
            className,
          )}
        >
          {type}
        </Link>
        {suffix}
      </>
    )
  }

  // No link found - render as type color (GitHub blue)
  return (
    <>
      <span className={cn('text-[#0550ae] dark:text-[#79c0ff]', className)}>
        {type}
      </span>
      {suffix}
    </>
  )
}
