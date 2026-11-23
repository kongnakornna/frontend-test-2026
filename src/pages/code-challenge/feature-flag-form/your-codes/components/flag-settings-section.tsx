import { Flag } from 'lucide-react'

import { Input } from '#/components/ui/input'
import { Switch } from '#/components/ui/switch'
import { Textarea } from '#/components/ui/textarea'

import type { EditorForm } from '../hooks/use-flag-editor-form'
import { EditorSection } from './editor-section'
import { FormItem, controlProps, getFieldError } from './form-item'

/** Flag metadata: name, description, status. */
export function FlagSettingsSection({ form }: { form: EditorForm }) {
  return (
    <EditorSection
      icon={Flag}
      title="Flag metadata"
      description="Name, description and status"
    >
      <form.Field name="name">
        {(field) => {
          const error = getFieldError(field)
          return (
            <FormItem
              label="Flag name *"
              htmlFor={field.name}
              error={error}
              hint="Used as the flag key, e.g. my-new-feature"
            >
              <Input
                {...controlProps(field, error)}
                value={field.state.value}
                placeholder="my-new-feature"
                autoComplete="off"
                className="font-mono"
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormItem>
          )
        }}
      </form.Field>

      <form.Field name="description">
        {(field) => {
          const error = getFieldError(field)
          return (
            <FormItem label="Description" htmlFor={field.name} error={error}>
              <Textarea
                {...controlProps(field, error)}
                rows={2}
                value={field.state.value}
                placeholder="What does this flag control?"
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </FormItem>
          )
        }}
      </form.Field>

      <form.Field name="enabled">
        {(field) => (
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
            <div className="min-w-0">
              <p id="flag-status-label" className="text-sm font-medium">
                Status: {field.state.value ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-xs text-muted-foreground">
                A disabled flag serves the SDK default (
                <code>disable: true</code>)
              </p>
            </div>
            <Switch
              aria-labelledby="flag-status-label"
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
          </div>
        )}
      </form.Field>
    </EditorSection>
  )
}
