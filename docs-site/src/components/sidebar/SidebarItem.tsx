'use client'

import { useFolderDepth } from 'fumadocs-ui/components/sidebar/base'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { TypeBadge } from '../api/TypeBadge'

type BadgeVariant = 'class' | 'interface' | 'type' | 'function' | 'enum'

// FumaDocs PageTree.Item type definition with custom badge field
interface PageTreeItem {
  type: 'page'
  name: ReactNode
  url: string
  external?: boolean
  description?: ReactNode
  icon?: ReactNode
  $id?: string
  badge?: BadgeVariant
}

interface SidebarItemProps {
  item: PageTreeItem
}

// Calculate indent offset based on depth (matching FumaDocs implementation)
function getItemOffset(depth: number): string {
  return `calc(${String(2 + 3 * depth)} * var(--spacing))`
}

export function SidebarItem({ item }: SidebarItemProps): React.ReactElement {
  const pathname = usePathname()
  const isActive = pathname === item.url
  const { badge } = item
  const depth = useFolderDepth()

  return (
    <Link
      href={item.url}
      data-active={isActive}
      style={{ paddingInlineStart: getItemOffset(depth) }}
      className={cn(
        'relative flex items-center gap-2 rounded-lg p-2 text-sm transition-colors',
        'hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80',
        'data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary',
        'text-fd-muted-foreground',
        depth >= 1 &&
          "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:start-2.5",
      )}
    >
      {badge && <TypeBadge variant={badge} className="flex-shrink-0" />}
      <span className="whitespace-nowrap">{item.name}</span>
    </Link>
  )
}
