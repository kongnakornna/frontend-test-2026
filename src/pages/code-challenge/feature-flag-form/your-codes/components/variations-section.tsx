import { Layers, Plus, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { NativeSelect } from '#/components/ui/native-select'
import { Textarea } from '#/components/ui/textarea'
import { cn } from '#/lib/utils'

import type { EditorForm } from '../hooks/use-flag-editor-form'
import { createVariation } from '../model/factories'
import {
  VARIATION_TYPES,
  VARIATION_TYPE_LABELS,
  defaultVariationValue,
  variationColor,
} from '../model/variation-types'
import type { VariationType } from '../model/variation-types'
import { EditorSection } from './editor-section'
import {
  FieldMessage,
  FormItem,
  controlProps,
  getFieldError,
} from './form-item'

const MIN_VARIATIONS = 2

export function VariationsSection({ form }: { form: EditorForm }) {
  return (
    <form.Field name="variations" mode="array">
      {(variationsField) => {
        const variations = variationsField.state.value
        return (
          <EditorSection
            icon={Layers}
            title="Variations"
            description="The values this flag can return"
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  variationsField.pushValue(
                    createVariation(
                      form.getFieldValue('variationType'),
                      variations.length,
                    ),
                  )
                }
              >
                <Plus /> Add variation
              </Button>
            }
          >
            <form.Field
              name="variationType"
              listeners={{
                // switching type resets values to valid defaults for the new type
                onChange: ({ value }) =>
                  form.setFieldValue('variations', (current) =>
                    current.map((variation, index) => ({
                      ...variation,
                      value: defaultVariationValue(value, index),
                    })),
                  ),
              }}
            >
              {(field) => (
                <FormItem
                  label="Variation type"
                  htmlFor={field.name}
                  className="sm:max-w-56"
                >
                  <NativeSelect
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(event) =>
                      field.handleChange(event.target.value as VariationType)
                    }
                  >
                    {VARIATION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {VARIATION_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </NativeSelect>
                </FormItem>
              )}
            </form.Field>

            <div className="space-y-3">
              <div className="hidden grid-cols-[0.75rem_minmax(0,1fr)_minmax(0,1.4fr)_2rem] gap-3 px-1 text-xs font-medium text-muted-foreground sm:grid">
                <span />
                <span>Name</span>
                <span>Value</span>
              </div>
              {variations.map((variation, index) => (
                <div
                  key={variation.id}
                  className="grid grid-cols-[0.75rem_minmax(0,1fr)_2rem] items-start gap-3 rounded-lg border border-border p-3 sm:grid-cols-[0.75rem_minmax(0,1fr)_minmax(0,1.4fr)_2rem] sm:border-0 sm:p-0"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'mt-2.5 size-3 rounded-full',
                      variationColor(index),
                    )}
                  />
                  <form.Field name={`variations[${index}].name`}>
                    {(field) => {
                      const error = getFieldError(field)
                      return (
                        <div className="flex min-w-0 flex-col gap-1.5">
                          <Input
                            {...controlProps(field, error)}
                            aria-label={`Variation ${index + 1} name`}
                            placeholder="on"
                            className="font-mono"
                            value={field.state.value}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                          />
                          <FieldMessage id={field.name} error={error} />
                        </div>
                      )
                    }}
                  </form.Field>

                  <div className="col-span-1 col-start-2 row-start-2 sm:col-start-auto sm:row-start-auto">
                    <VariationValueField form={form} index={index} />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="col-start-3 row-start-1 sm:col-start-auto sm:row-start-auto"
                    aria-label={`Remove variation ${index + 1}`}
                    title={
                      variations.length <= MIN_VARIATIONS
                        ? `A flag needs at least ${MIN_VARIATIONS} variations`
                        : 'Remove variation'
                    }
                    disabled={variations.length <= MIN_VARIATIONS}
                    onClick={() => variationsField.removeValue(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
              <FieldMessage error={getFieldError(variationsField)} />
            </div>
          </EditorSection>
        )
      }}
    </form.Field>
  )
}

function VariationValueField({
  form,
  index,
}: {
  form: EditorForm
  index: number
}) {
  return (
    <form.Subscribe selector={(state) => state.values.variationType}>
      {(type) => (
        <form.Field name={`variations[${index}].value`}>
          {(field) => {
            const error = getFieldError(field)
            const common = {
              ...controlProps(field, error),
              'aria-label': `Variation ${index + 1} value`,
            }
            const onChange = (
              event: React.ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
              >,
            ) => field.handleChange(event.target.value)
            return (
              <div className="flex min-w-0 flex-col gap-1.5">
                {type === 'boolean' ? (
                  <NativeSelect
                    {...common}
                    value={field.state.value}
                    onChange={onChange}
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </NativeSelect>
                ) : type === 'json' ? (
                  <Textarea
                    {...common}
                    rows={2}
                    spellCheck={false}
                    className="font-mono text-xs"
                    placeholder='{"color": "blue"}'
                    value={field.state.value}
                    onChange={onChange}
                  />
                ) : (
                  <Input
                    {...common}
                    inputMode={type === 'number' ? 'decimal' : undefined}
                    placeholder={type === 'number' ? '42' : 'value'}
                    className="font-mono"
                    value={field.state.value}
                    onChange={onChange}
                  />
                )}
                <FieldMessage id={field.name} error={error} />
              </div>
            )
          }}
        </form.Field>
      )}
    </form.Subscribe>
  )
}
