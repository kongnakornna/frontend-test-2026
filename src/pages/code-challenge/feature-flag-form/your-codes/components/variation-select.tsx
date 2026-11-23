import { NativeSelect } from '#/components/ui/native-select'

import type { EditorForm } from '../hooks/use-flag-editor-form'

interface VariationSelectProps extends Omit<
  React.ComponentProps<'select'>,
  'value' | 'onChange' | 'form'
> {
  form: EditorForm
  /** variation id */
  value: string
  onValueChange: (id: string) => void
}

/**
 * Select by variation id, so renaming a variation never breaks a rule.
 * The selector returns strings, so the shallow comparison only re-renders
 * when a variation is added, removed or renamed.
 */
export function VariationSelect({
  form,
  value,
  onValueChange,
  ...props
}: VariationSelectProps) {
  return (
    <form.Subscribe
      selector={(state) =>
        state.values.variations.map(
          (variation) => `${variation.id}|${variation.name.trim()}`,
        )
      }
    >
      {(entries) => {
        const options = entries.map((entry) => {
          const split = entry.indexOf('|')
          return { id: entry.slice(0, split), name: entry.slice(split + 1) }
        })
        const isMissing = value !== '' && !options.some((o) => o.id === value)
        return (
          <NativeSelect
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            {...props}
          >
            <option value="">Select a variation…</option>
            {isMissing && <option value={value}>(deleted variation)</option>}
            {options.map((option, index) => (
              <option key={option.id} value={option.id}>
                {option.name || `Variation ${index + 1} (unnamed)`}
              </option>
            ))}
          </NativeSelect>
        )
      }}
    </form.Subscribe>
  )
}
