import { useEffect, useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { BeforeMount } from '@monaco-editor/react'
import { Check, CircleAlert, CircleCheck, Copy } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { cn } from '#/lib/utils'

import type { EditorTheme } from '../hooks/use-editor-theme'
import type { EditorForm } from '../hooks/use-flag-editor-form'
import { toJson } from '../lib/to-go-feature-flag'
import { getFlagIssues } from '../lib/validate'
import { toFlagConfig } from '../model/form-values'
import type { FlagFormValues } from '../model/form-values'

const EDITOR_HEIGHT = 480

/** Monaco theme per editor theme (Monaco can't read CSS variables). */
const MONACO_THEMES: Record<EditorTheme, string> = {
  light: 'flag-editor-light',
  dark: 'flag-editor-dark',
}

const defineMonacoThemes: BeforeMount = (monaco) => {
  const noLineHighlight = { 'editor.lineHighlightBackground': '#00000000' }
  monaco.editor.defineTheme(MONACO_THEMES.light, {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'editorGutter.background': '#ffffff',
      ...noLineHighlight,
    },
  })
  monaco.editor.defineTheme(MONACO_THEMES.dark, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#0b0b0b',
      'editorGutter.background': '#0b0b0b',
      ...noLineHighlight,
    },
  })
}

/** Live JSON preview: form.Subscribe re-renders only this panel on every change. */
export function PreviewPanel({
  form,
  theme,
}: {
  form: EditorForm
  theme: EditorTheme
}) {
  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => <Preview form={form} values={values} theme={theme} />}
    </form.Subscribe>
  )
}

function Preview({
  form,
  values,
  theme,
}: {
  form: EditorForm
  values: FlagFormValues
  theme: EditorTheme
}) {
  const flag = toFlagConfig(values)
  const json = useMemo(() => toJson(flag), [flag])
  const issues = useMemo(() => getFlagIssues(flag), [flag])

  const focusField = (field: string) => {
    // reveal the inline error too
    form.setFieldMeta(field as never, (meta) => ({ ...meta, isTouched: true }))
    const element = document.getElementsByName(field)[0] as
      | HTMLElement
      | undefined
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element?.focus({ preventScroll: true })
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              flags.json
            </span>
            <StatusBadge count={issues.length} />
          </div>
          <CopyButton text={json} />
        </div>
        <MonacoPreview value={json} theme={theme} />
      </div>

      <section
        aria-live="polite"
        className={cn(
          'rounded-xl border p-4 text-sm',
          issues.length
            ? 'border-destructive/30 bg-destructive/5'
            : 'border-emerald-500/30 bg-emerald-500/5',
        )}
      >
        {issues.length === 0 ? (
          <p className="flex items-center gap-2 font-medium text-[var(--ff-success)]">
            <CircleCheck className="size-4" /> Configuration is valid
          </p>
        ) : (
          <>
            <p className="mb-2 flex items-center gap-2 font-medium text-destructive">
              <CircleAlert className="size-4" />
              {issues.length} {issues.length === 1 ? 'issue' : 'issues'} to fix
            </p>
            <ul className="max-h-56 space-y-1 overflow-auto">
              {issues.map((issue, index) => (
                <li key={`${issue.field}-${index}`}>
                  <button
                    type="button"
                    onClick={() => focusField(issue.field)}
                    className="w-full rounded-md px-2 py-1 text-left hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <span className="font-medium">{issue.where}</span>
                    <span className="text-muted-foreground">
                      {' '}
                      — {issue.message}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}

function MonacoPreview({
  value,
  theme,
}: {
  value: string
  theme: EditorTheme
}) {
  // Monaco is browser-only; render it after hydration
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Skeleton className="rounded-none" style={{ height: EDITOR_HEIGHT }} />
    )
  }

  return (
    <Editor
      height={EDITOR_HEIGHT}
      language="json"
      value={value}
      theme={MONACO_THEMES[theme]}
      beforeMount={defineMonacoThemes}
      loading={<Skeleton className="size-full rounded-none" />}
      options={{
        readOnly: true,
        domReadOnly: true,
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbersMinChars: 3,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        renderLineHighlight: 'none',
        padding: { top: 12, bottom: 12 },
      }}
    />
  )
}

function StatusBadge({ count }: { count: number }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-[0.7rem] font-medium',
        count
          ? 'bg-destructive/15 text-destructive'
          : 'bg-emerald-500/15 text-[var(--ff-success)]',
      )}
    >
      {count ? `${count} ${count === 1 ? 'error' : 'errors'}` : 'valid'}
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? 'Copied' : 'Copy JSON'}
      title="Copy JSON"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => setCopied(true))
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}
