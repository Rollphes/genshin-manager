import * as path from 'node:path'

import * as TwoslashComponents from 'fumadocs-twoslash/ui'
import {
  createFileSystemGeneratorCache,
  createGenerator,
} from 'fumadocs-typescript'
import { AutoTypeTable } from 'fumadocs-typescript/ui'
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import {
  Braces,
  Code,
  FileSignature,
  Hammer,
  List,
  type LucideIcon,
} from 'lucide-react'
import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import {
  Md,
  MethodAccordion,
  TypeBadge,
  TypeLink,
  TypeTableByBadge,
} from '@/components/api'
import { cn } from '@/lib/cn'

// Section icon mapping for API documentation headers
const SECTION_ICONS: Record<string, LucideIcon> = {
  Constructor: Hammer,
  Properties: Braces,
  Methods: Code,
  Signature: FileSignature,
  Members: List,
  Definition: Code,
}

// Custom h2 component with auto-icon for API sections
function ApiH2({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'h2'>): ReactNode {
  const text = typeof children === 'string' ? children : String(children)
  const Icon = SECTION_ICONS[text]

  return (
    <h2
      {...props}
      className={cn('flex items-center gap-2', className)}
    >
      {Icon && (
        <span className="text-fd-muted-foreground">
          <Icon className="w-5 h-5" />
        </span>
      )}
      {children}
    </h2>
  )
}

// Create a TypeScript generator with caching
// basePath points to the root of genshin-manager (parent of docs-site)
const generator = createGenerator({
  cache: createFileSystemGeneratorCache('.next/fumadocs-typescript'),
  basePath: path.resolve(process.cwd(), '..'),
  tsconfigPath: path.resolve(process.cwd(), '..', 'tsconfig.json'),
})

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TwoslashComponents,
    // Override h2 with auto-icon support for API sections
    h2: ApiH2,
    AutoTypeTable: (props) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    Accordion,
    Accordions,
    Callout,
    Card,
    Cards,
    File,
    Files,
    Folder,
    Step,
    Steps,
    Tab,
    Tabs,
    // API documentation components
    Md,
    MethodAccordion,
    TypeBadge,
    TypeLink,
    TypeTableByBadge,
    ...components,
  }
}
