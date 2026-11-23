import { useState } from 'react'
import { CircleCheck, RotateCcw, ShieldCheck } from 'lucide-react'

import { Button } from '#/components/ui/button'

import './editor-theme.css'
import { DefaultRuleSection } from './components/default-rule-section'
import { FlagSettingsSection } from './components/flag-settings-section'
import { PreviewPanel } from './components/preview-panel'
import { TargetingSection } from './components/targeting-section'
import { VariationsSection } from './components/variations-section'
import { useFlagEditorForm } from './hooks/use-flag-editor-form'
import { toJson } from './lib/to-go-feature-flag'
import { toFlagConfig } from './model/form-values'

/** Feature Flag edit form (black theme), fields modelled on the GoFeatureFlag editor. */
function YourCode() {
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const form = useFlagEditorForm({
    onValidSubmit: async (values) => {
      try {
        await navigator.clipboard.writeText(toJson(toFlagConfig(values)))
      } catch {
        // clipboard unavailable (insecure origin / denied); the JSON is still in the preview
      }
      setSavedAt(new Date().toLocaleTimeString())
    },
  })

  return (
    <section className="ff-black dark rounded-2xl border border-border p-4 sm:p-6">
      <header className="mb-6 border-b border-border pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Feature Flag Editor
        </h1>
        <p className="mt-2 text-muted-foreground">
          Configure the flag. The JSON on the right updates as you type.
        </p>
      </header>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
        className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
      >
        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <FlagSettingsSection form={form} />
          <VariationsSection form={form} />
          <TargetingSection form={form} />
          <DefaultRuleSection form={form} />
        </div>

        <aside className="min-w-0 space-y-3 xl:sticky xl:top-4">
          <PreviewPanel form={form} />

          <div className="flex flex-wrap items-center gap-2">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  <ShieldCheck /> Validate &amp; copy JSON
                </Button>
              )}
            </form.Subscribe>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                form.reset()
                setSavedAt(null)
              }}
            >
              <RotateCcw /> Reset
            </Button>
            {savedAt && (
              <span className="flex items-center gap-1.5 text-sm text-[var(--ff-success)]">
                <CircleCheck className="size-4" /> Valid, copied at {savedAt}
              </span>
            )}
          </div>
        </aside>
      </form>
    </section>
  )
}

export default YourCode
