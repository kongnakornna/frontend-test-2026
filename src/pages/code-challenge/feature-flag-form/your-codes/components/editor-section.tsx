import type { LucideIcon } from 'lucide-react'

interface EditorSectionProps {
  icon: LucideIcon
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

/** One titled block inside a flag card (Variations, Target specific users, ...). */
export function EditorSection({
  icon: Icon,
  title,
  description,
  actions,
  children,
}: EditorSectionProps) {
  return (
    <section className="space-y-4 border-t border-border px-5 py-5 first:border-t-0">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-tight">{title}</h3>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </header>
      {children}
    </section>
  )
}
