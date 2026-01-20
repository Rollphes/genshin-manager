'use client'

import { ChevronRight } from 'lucide-react'
import { Children, type ReactNode, useState } from 'react'

import { TypeBadge } from '@/components/api/TypeBadge'
import { cn } from '@/lib/cn'

/**
 * Render typeJsx with automatic key assignment to avoid React key warnings.
 */
function renderTypeJsx(typeJsx: ReactNode): ReactNode {
  if (typeof typeJsx === 'string')
    return <span dangerouslySetInnerHTML={{ __html: typeJsx }} />

  return Children.toArray(typeJsx)
}

type BadgeType = 'static' | 'abstract' | 'protected' | 'getter' | 'setter'

interface SeeItem {
  text: string
  url?: string
  typeJsx?: ReactNode
}

/**
 * Render a single see item based on its type.
 */
function renderSeeItem(item: SeeItem): ReactNode {
  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fd-primary hover:underline"
      >
        {item.text}
      </a>
    )
  }
  if (item.typeJsx) return <span className="font-mono">{item.typeJsx}</span>

  return <span className="text-fd-muted-foreground">{item.text}</span>
}

/**
 * See section content.
 */
function SeeSection({ see }: { see: SeeItem[] }): ReactNode {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">See</h4>
      <ul className="list-disc list-inside space-y-1">
        {see.map((s, i) => (
          <li key={i} className="text-sm">
            {renderSeeItem(s)}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Accordion content section.
 */
function AccordionContent({
  description,
  see,
}: {
  description?: ReactNode
  see?: SeeItem[]
}): ReactNode {
  return (
    <div className="border-t border-fd-border p-4 space-y-4">
      {description && (
        <div className="text-fd-muted-foreground">{description}</div>
      )}
      {see && see.length > 0 && <SeeSection see={see} />}
    </div>
  )
}

/**
 * Build badges from accessor flags.
 */
function buildBadges(flags: {
  isStatic: boolean
  isAbstract: boolean
  isProtected: boolean
  hasGetter: boolean
  hasSetter: boolean
}): BadgeType[] {
  return [
    flags.isStatic && 'static',
    flags.isAbstract && 'abstract',
    flags.isProtected && 'protected',
    flags.hasGetter && 'getter',
    flags.hasSetter && 'setter',
  ].filter((b): b is BadgeType => Boolean(b))
}

interface AccessorAccordionProps {
  name: string
  typeJsx: ReactNode
  description?: ReactNode
  see?: SeeItem[]
  hasGetter?: boolean
  hasSetter?: boolean
  isStatic?: boolean
  isAbstract?: boolean
  isProtected?: boolean
  defaultOpen?: boolean
  id?: string // Optional ID for deep linking
}

export function AccessorAccordion({
  name,
  typeJsx,
  description,
  see,
  hasGetter = false,
  hasSetter = false,
  isStatic = false,
  isAbstract = false,
  isProtected = false,
  defaultOpen = false,
  id,
}: AccessorAccordionProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const badges = buildBadges({
    isStatic,
    isAbstract,
    isProtected,
    hasGetter,
    hasSetter,
  })

  // Generate anchor ID from accessor name
  const anchorId = id ?? `accessor-${name.toLowerCase()}`
  const hasContent = description != null || (see != null && see.length > 0)

  return (
    <div
      id={anchorId}
      className="border border-fd-border rounded-lg mb-2 scroll-mt-20"
    >
      <button
        type="button"
        data-state={isOpen ? 'open' : 'closed'}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        className="w-full p-3 text-left hover:bg-fd-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ChevronRight
            className={cn(
              'h-4 w-4 text-fd-muted-foreground transition-transform flex-shrink-0',
              isOpen && 'rotate-90',
            )}
          />
          {badges.length > 0 && (
            <span className="inline-flex gap-1 shrink-0">
              {badges.map((badge) => (
                <TypeBadge key={badge} variant={badge} />
              ))}
            </span>
          )}
          <span className="text-sm">
            <span className="text-[#8250df] dark:text-[#d2a8ff]">{name}</span>:{' '}
            {renderTypeJsx(typeJsx)}
          </span>
        </div>
      </button>

      {hasContent && (
        <div
          className={cn(
            'grid transition-all duration-200 ease-in-out',
            isOpen
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            <AccordionContent description={description} see={see} />
          </div>
        </div>
      )}
    </div>
  )
}
