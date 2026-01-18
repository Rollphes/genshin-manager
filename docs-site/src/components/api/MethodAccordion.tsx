'use client'

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { TypeBadge } from '@/components/api/TypeBadge'
import { cn } from '@/lib/cn'

function renderTypeJsx(typeJsx: ReactNode): ReactNode {
  if (typeof typeJsx === 'string')
    return <span dangerouslySetInnerHTML={{ __html: typeJsx }} />

  return typeJsx
}

interface Parameter {
  name: string
  typeJsx: ReactNode
  description?: ReactNode
  optional?: boolean
  defaultValue?: string
}

interface MethodAccordionProps {
  name: string
  returnType: ReactNode
  description?: ReactNode
  parameters?: Parameter[]
  returns?: ReactNode
  example?: string
  isAsync?: boolean
  isStatic?: boolean
  isAbstract?: boolean
  isDeprecated?: boolean
  defaultOpen?: boolean
}

export function MethodAccordion({
  name,
  returnType,
  description,
  parameters = [],
  returns,
  example,
  isAsync = false,
  isStatic = false,
  isAbstract = false,
  isDeprecated = false,
  defaultOpen = false,
}: MethodAccordionProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const badges = [
    isAsync && 'async',
    isStatic && 'static',
    isAbstract && 'abstract',
    isDeprecated && 'deprecated',
  ].filter(Boolean) as ('async' | 'static' | 'abstract' | 'deprecated')[]

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
            {name.startsWith('new ') ? (
              <>
                <span className="text-[#a40e26] dark:text-[#f85149]">new</span>{' '}
                <span className="text-[#8250df] dark:text-[#d2a8ff]">
                  {name.slice(4)}
                </span>
              </>
            ) : (
              <span className="text-[#8250df] dark:text-[#d2a8ff]">{name}</span>
            )}
            (
            {parameters.map((p, i) => (
              <span key={p.name}>
                {i > 0 && ', '}
                <span className="text-[#953800] dark:text-[#ffa657]">
                  {p.name}
                </span>
                {p.optional ? '?' : ''}: {renderTypeJsx(p.typeJsx)}
              </span>
            ))}
            ): {returnType}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-fd-border p-4 space-y-4">
          {description && (
            <p className="text-fd-muted-foreground">{description}</p>
          )}

          {parameters.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Parameters</h4>
              <TypeTable
                type={Object.fromEntries(
                  parameters.map((p) => [
                    p.name,
                    {
                      type: renderTypeJsx(p.typeJsx),
                      description: p.description ?? '',
                      default: p.defaultValue,
                      required: !p.optional,
                    },
                  ]),
                )}
              />
            </div>
          )}

          {(returns !== undefined || returnType !== undefined) && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Returns</h4>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0">{returnType}</span>
                {returns && (
                  <span className="text-fd-muted-foreground text-sm">
                    - {returns}
                  </span>
                )}
              </div>
            </div>
          )}

          {example && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Example</h4>
              <DynamicCodeBlock lang="ts" code={example.trim()} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
