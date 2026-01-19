import { type ReactNode } from 'react'

interface InheritanceInfoProps {
  typeParams?: ReactNode
  extendsType?: ReactNode
  implementsTypes?: ReactNode[]
}

export function InheritanceInfo({
  typeParams,
  extendsType,
  implementsTypes,
}: InheritanceInfoProps): React.ReactElement | null {
  const hasContent =
    typeParams !== undefined ||
    extendsType !== undefined ||
    (implementsTypes !== undefined && implementsTypes.length > 0)

  if (!hasContent) return null

  return (
    <div className="my-4 p-4 rounded-lg border border-fd-border bg-fd-card">
      <div className="flex flex-col gap-2 text-sm font-mono">
        {typeParams && (
          <div className="flex items-baseline gap-2">
            <span className="text-fd-muted-foreground font-sans text-xs uppercase tracking-wide">
              Type Parameters
            </span>
            <span>{typeParams}</span>
          </div>
        )}
        {extendsType && (
          <div className="flex items-baseline gap-2">
            <span className="text-[#cf222e] dark:text-[#ff7b72] font-semibold">
              extends
            </span>
            <span>{extendsType}</span>
          </div>
        )}
        {implementsTypes && implementsTypes.length > 0 && (
          <div className="flex items-baseline gap-2">
            <span className="text-[#cf222e] dark:text-[#ff7b72] font-semibold">
              implements
            </span>
            <span>
              {implementsTypes.map((impl, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  {impl}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
