'use client'

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { ChevronRight } from 'lucide-react'
import { type ReactNode, useState } from 'react'

import { cn } from '@/lib/cn'

interface CodeAccordionProps {
  title: string
  code: string
  lang?: string
  defaultOpen?: boolean
}

export function CodeAccordion({
  title,
  code,
  lang = 'ts',
  defaultOpen = false,
}: CodeAccordionProps): ReactNode {
  const [isOpen, setIsOpen] = useState(defaultOpen)

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
          <span className="text-sm font-medium">{title}</span>
        </div>
      </button>

      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-fd-border p-4">
            <DynamicCodeBlock lang={lang} code={code.trim()} />
          </div>
        </div>
      </div>
    </div>
  )
}
