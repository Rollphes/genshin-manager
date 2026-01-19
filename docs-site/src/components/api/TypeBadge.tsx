import { cn } from '@/lib/cn'

type BadgeVariant =
  | 'async'
  | 'static'
  | 'readonly'
  | 'optional'
  | 'deprecated'
  | 'abstract'
  | 'protected'
  | 'const'
  | 'rest'
  | 'getter'
  | 'setter'
  | 'class'
  | 'interface'
  | 'type'
  | 'function'
  | 'enum'

interface TypeBadgeProps {
  variant: BadgeVariant
  className?: string
}

const BADGE_STYLES: Record<BadgeVariant, string> = {
  async: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  static:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  readonly: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  optional: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400',
  deprecated: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  abstract:
    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  protected:
    'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  const: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
  rest: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  getter: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  setter:
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  // Sidebar category badges - same purple style for consistency
  class:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  interface: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  type: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  function:
    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  enum: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
}

const BADGE_LABELS: Record<BadgeVariant, string> = {
  async: 'async',
  static: 'static',
  readonly: 'readonly',
  optional: 'optional',
  deprecated: 'deprecated',
  abstract: 'abstract',
  protected: 'protected',
  const: 'const',
  rest: 'rest',
  getter: 'get',
  setter: 'set',
  class: 'class',
  interface: 'interface',
  type: 'type',
  function: 'function',
  enum: 'enum',
}

export function TypeBadge({
  variant,
  className,
}: TypeBadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        BADGE_STYLES[variant],
        className,
      )}
    >
      {BADGE_LABELS[variant]}
    </span>
  )
}
