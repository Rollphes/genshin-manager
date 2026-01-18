import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

interface SectionHeaderProps {
  icon: ReactNode
  children: ReactNode
  className?: string
}

export function SectionHeader({
  icon,
  children,
  className,
}: SectionHeaderProps): React.ReactElement {
  return (
    <h2
      className={cn(
        'flex items-center gap-2 text-xl font-semibold mt-8 mb-4',
        className,
      )}
    >
      <span className="text-fd-muted-foreground">{icon}</span>
      {children}
    </h2>
  )
}
