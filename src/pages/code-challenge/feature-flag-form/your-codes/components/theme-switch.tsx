import { Moon, Sun } from 'lucide-react'

import { cn } from '#/lib/utils'

import { EDITOR_THEMES } from '../hooks/use-editor-theme'
import type { EditorTheme } from '../hooks/use-editor-theme'

const OPTIONS: Record<EditorTheme, { label: string; icon: typeof Sun }> = {
  light: { label: 'Light', icon: Sun },
  dark: { label: 'Dark', icon: Moon },
}

/** Two modes: 1. Light, 2. Dark. */
export function ThemeSwitch({
  value,
  onChange,
}: {
  value: EditorTheme
  onChange: (theme: EditorTheme) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Editor theme"
      className="inline-flex shrink-0 rounded-lg border border-border bg-muted/50 p-0.5"
    >
      {EDITOR_THEMES.map((theme) => {
        const { label, icon: Icon } = OPTIONS[theme]
        const selected = value === theme
        return (
          <button
            key={theme}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(theme)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
              selected
                ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
