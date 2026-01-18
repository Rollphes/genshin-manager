import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'

import { SidebarItem } from '@/components/sidebar/SidebarItem'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export default function Layout({
  children,
}: {
  children: ReactNode
}): ReactNode {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions()}
      sidebar={{
        components: {
          Item: SidebarItem,
        },
      }}
    >
      {children}
    </DocsLayout>
  )
}
