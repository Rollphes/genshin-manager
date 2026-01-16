import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactNode } from 'react'

import { baseOptions } from '@/lib/layout.shared'

export default function Layout({
  children,
}: {
  children: ReactNode
}): ReactNode {
  return <HomeLayout {...baseOptions()}>{children}</HomeLayout>
}
