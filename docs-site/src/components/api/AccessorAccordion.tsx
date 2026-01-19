'use client'

import { ChevronRight } from 'lucide-react'
import { Children, type ReactNode } from 'react'
import { useState } from 'react'

import { TypeBadge } from '@/components/api/TypeBadge'
import { cn } from '@/lib/cn'

/**
 * Render typeJsx with automatic key assignment to avoid React key warnings
 */
function renderTypeJsx(typeJsx: ReactNode): ReactNode {
  if (typeof typeJsx === 'string')
    return <span dangerouslySetInnerHTML={{ __html: typeJsx }} />

  return Children.toArray(typeJsx)
}

type BadgeType = 'static' | 'abstract' | 'protected' | 'getter' | 'setter'

interface AccessorAccordionProps {
  name: string
  typeJsx: ReactNode
  description?: ReactNode
  hasGetter?: boolean
  hasSetter?: boolean
  isStatic?: boolean
  isAbstract?: boolean
  isProtected?: boolean
  defaultOpen?: boolean
}

export function AccessorAccordion({
  name,
  typeJsx,
  description,
  hasGetter = false,
  hasSetter = false,
  isStatic = false,
  isAbstract = false,
  isProtected = false,
  defaultOpen = false,
}: AccessorAccordionProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const badges: BadgeType[] = [
    isStatic && 'static',
    isAbstract && 'abstract',
    isProtected && 'protected',
    hasGetter && 'getter',
    hasSetter && 'setter',
  ].filter((b): b is BadgeType => Boolean(b))

  return (
    <div className="border border-fd-border rounded-lg mb-2">
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

      {isOpen && description && (
        <div className="border-t border-fd-border p-4">
          <p className="text-fd-muted-foreground">{description}</p>
        </div>
      )}
    </div>
  )
}
