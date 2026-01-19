'use client'

import { TypeTable } from 'fumadocs-ui/components/type-table'
import { ChevronRight } from 'lucide-react'
import { Children, type ReactNode, useState } from 'react'

import { cn } from '@/lib/cn'

/**
 * Render typeJsx with automatic key assignment to avoid React key warnings
 */
function renderTypeJsx(typeJsx: ReactNode): ReactNode {
  if (typeof typeJsx === 'string')
    return <span dangerouslySetInnerHTML={{ __html: typeJsx }} />

  return Children.toArray(typeJsx)
}

interface EventParameter {
  name: string
  typeJsx: ReactNode
  description?: ReactNode
}

function ParametersSection({
  parameters,
}: {
  parameters: EventParameter[]
}): ReactNode {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">Parameters</h4>
      <TypeTable
        type={Object.fromEntries(
          parameters.map((p) => [
            p.name,
            {
              type: renderTypeJsx(p.typeJsx),
              description: p.description ?? '',
            },
          ]),
        )}
      />
    </div>
  )
}

function AccordionContent({
  description,
  parameters,
}: {
  description?: ReactNode
  parameters: EventParameter[]
}): ReactNode {
  return (
    <div className="border-t border-fd-border p-4 space-y-4">
      {description && <div className="text-fd-muted-foreground">{description}</div>}
      {parameters.length > 0 && <ParametersSection parameters={parameters} />}
    </div>
  )
}

interface EventAccordionProps {
  name: string
  description?: ReactNode
  parameters?: EventParameter[]
  defaultOpen?: boolean
  id?: string
}

export function EventAccordion({
  name,
  description,
  parameters = [],
  defaultOpen = false,
  id,
}: EventAccordionProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const anchorId = id ?? name.replace(/\s+/g, '-').toLowerCase()

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
          <span className="text-sm overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="text-[#8250df] dark:text-[#d2a8ff]">{name}</span>(
            {parameters.map((p, i) => (
              <span key={p.name}>
                {i > 0 && ', '}
                <span className="text-[#953800] dark:text-[#ffa657]">
                  {p.name}
                </span>
                : {renderTypeJsx(p.typeJsx)}
              </span>
            ))}
            )
          </span>
        </div>
      </button>

      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <AccordionContent description={description} parameters={parameters} />
        </div>
      </div>
    </div>
  )
}
