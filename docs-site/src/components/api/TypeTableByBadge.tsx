'use client'

import { TypeTable } from 'fumadocs-ui/components/type-table'
import type { ReactElement, ReactNode } from 'react'
import { useEffect, useMemo, useRef } from 'react'

type BadgeVariant = 'readonly' | 'static' | 'abstract' | 'optional'

interface TypeNodeWithBadges {
  description?: ReactNode
  type: ReactNode
  typeDescription?: ReactNode
  typeDescriptionLink?: string
  default?: ReactNode
  required?: boolean
  deprecated?: boolean
}

interface TypeTableByBadgeProps {
  type: Record<string, TypeNodeWithBadges>
}

interface InjectedElement {
  wrapper: HTMLSpanElement
  codeEl: Element
  originalParent: ParentNode
}

const BADGE_STYLES: Record<BadgeVariant, string> = {
  readonly: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  static:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  abstract:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  optional: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400',
}

/**
 * Extract badges from key name
 * e.g., "[readonly][static]propName" → { badges: ['readonly', 'static'], cleanName: 'propName' }
 */
function parseKeyName(key: string): {
  badges: BadgeVariant[]
  cleanName: string
} {
  const badges: BadgeVariant[] = []
  let remaining = key

  const badgePattern = /^\[(readonly|static|abstract|optional)\]/
  let match = badgePattern.exec(remaining)

  while (match) {
    badges.push(match[1] as BadgeVariant)
    remaining = remaining.slice(match[0].length)
    match = badgePattern.exec(remaining)
  }

  return { badges, cleanName: remaining }
}

/**
 * Create badge element using pure DOM (avoids React createRoot race condition)
 */
function createBadgeElement(variant: BadgeVariant): HTMLSpanElement {
  const badge = document.createElement('span')
  badge.className = `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${BADGE_STYLES[variant]}`
  badge.textContent = variant
  return badge
}

/**
 * TypeTable wrapper that adds TypeBadge support
 * Use badge prefixes in key names: "[readonly][static]propName"
 */
export function TypeTableByBadge({
  type,
}: TypeTableByBadgeProps): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)

  // Build badge map and clean type object with useMemo
  const { badgeMap, cleanType } = useMemo(() => {
    const map = new Map<string, BadgeVariant[]>()
    const clean: Record<string, TypeNodeWithBadges> = {}

    for (const [key, value] of Object.entries(type)) {
      const { badges, cleanName } = parseKeyName(key)
      if (badges.length > 0) map.set(cleanName, badges)
      clean[cleanName] = value
    }

    return { badgeMap: map, cleanType: clean }
  }, [type])

  useEffect(() => {
    if (!containerRef.current) return

    // Find all code elements with text-fd-primary class (name elements)
    const codeElements = containerRef.current.querySelectorAll(
      'code.text-fd-primary',
    )

    const injected: InjectedElement[] = []

    codeElements.forEach((codeEl) => {
      // Check if already wrapped
      if (codeEl.parentElement?.classList.contains('type-table-prop-wrapper'))
        return

      const originalParent = codeEl.parentNode
      if (!originalParent) return

      // Get the name text (first text node, before the "?" if optional)
      const textContent = codeEl.textContent
      if (!textContent) return
      const name = textContent.replace(/\?$/, '')
      const badges = badgeMap.get(name)

      // Wrap code element in flex container for consistent layout
      const wrapper = document.createElement('span')
      wrapper.className =
        'type-table-prop-wrapper inline-flex items-center overflow-hidden pe-2'
      codeEl.classList.remove('w-[25%]', 'pe-2')
      originalParent.insertBefore(wrapper, codeEl)
      wrapper.appendChild(codeEl)

      // Add badge container only if badges exist
      if (badges && badges.length > 0) {
        const badgeContainer = document.createElement('span')
        badgeContainer.className =
          'badge-container inline-flex gap-1 mr-1.5 shrink-0'
        badges.forEach((variant) => {
          badgeContainer.appendChild(createBadgeElement(variant))
        })
        wrapper.insertBefore(badgeContainer, codeEl)
      }

      injected.push({ wrapper, codeEl, originalParent })
    })

    // Cleanup on unmount - restore original DOM structure
    return (): void => {
      injected.forEach(({ wrapper, codeEl, originalParent }) => {
        // Restore codeEl's original classes
        codeEl.classList.add('pe-2')
        // Move codeEl back to original parent and remove wrapper
        originalParent.insertBefore(codeEl, wrapper)
        wrapper.remove()
      })
    }
  }, [badgeMap])

  return (
    <div ref={containerRef}>
      <TypeTable type={cleanType} />
    </div>
  )
}
