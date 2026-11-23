import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Switch } from '#/components/ui/switch'
import { cn } from '#/lib/utils'

import type { EditorForm } from '../hooks/use-flag-editor-form'
import type { DragHandleProps, DragItemProps } from '../hooks/use-drag-reorder'
import { buildQuery } from '../lib/build-query'
import { toFlagConfig } from '../model/form-values'
import { ConditionGroupEditor } from './condition-group-editor'
import { DragHandle } from './drag-handle'
import {
  FieldMessage,
  FormItem,
  controlProps,
  getFieldError,
} from './form-item'
import { VariationSelect } from './variation-select'

interface RuleCardProps {
  form: EditorForm
  index: number
  total: number
  itemProps: DragItemProps
  handleProps: DragHandleProps
  onMove: (to: number) => void
  onRemove: () => void
}

export function RuleCard({
  form,
  index,
  total,
  itemProps,
  handleProps,
  onMove,
  onRemove,
}: RuleCardProps) {
  const base = `targeting[${index}]` as const

  return (
    <li
      {...itemProps}
      className="rounded-xl border border-border bg-background transition-[opacity,box-shadow] data-dragging:opacity-40 data-drop-target:ring-2 data-drop-target:ring-primary"
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <DragHandle label={`Rule ${index + 1}`} {...handleProps} />
        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-semibold">
          Rule {index + 1}
        </span>

        <form.Field name={`${base}.name`}>
          {(field) => {
            const error = getFieldError(field)
            return (
              <div className="min-w-40 flex-1">
                <Input
                  {...controlProps(field, error)}
                  aria-label={`Rule ${index + 1} name`}
                  placeholder="Rule name (optional)"
                  className="h-7 border-transparent bg-transparent shadow-none hover:border-input dark:bg-transparent"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <FieldMessage id={field.name} error={error} />
              </div>
            )
          }}
        </form.Field>

        <div className="ml-auto flex items-center gap-1">
          <form.Field name={`${base}.disabled`}>
            {(field) => (
              <label className="mr-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Switch
                  aria-label={`Rule ${index + 1} enabled`}
                  checked={!field.state.value}
                  onCheckedChange={(enabled) => field.handleChange(!enabled)}
                />
                {field.state.value ? 'Off' : 'On'}
              </label>
            )}
          </form.Field>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Move rule up"
            disabled={index === 0}
            onClick={() => onMove(index - 1)}
          >
            <ChevronUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Move rule down"
            disabled={index === total - 1}
            onClick={() => onMove(index + 1)}
          >
            <ChevronDown />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete rule ${index + 1}`}
            className="text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <form.Subscribe
        selector={(state) =>
          state.values.targeting.at(index)?.disabled ?? false
        }
      >
        {(disabled) => (
          <div className={cn('space-y-4 p-3 sm:p-4', disabled && 'opacity-60')}>
            <div className="space-y-2">
              <StepLabel>If</StepLabel>
              <ConditionGroupEditor
                form={form}
                path={`${base}.group`}
                depth={0}
              />
              <QueryPreview form={form} index={index} />
            </div>

            <div className="space-y-2">
              <StepLabel>Serve</StepLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                <form.Field name={`${base}.percentage`}>
                  {(field) => {
                    const error = getFieldError(field)
                    const value = field.state.value
                    return (
                      <FormItem
                        label="Rollout percentage"
                        htmlFor={field.name}
                        error={error}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            aria-label={`Rule ${index + 1} percentage slider`}
                            className="h-2 flex-1 cursor-pointer accent-primary"
                            value={Number.isFinite(value) ? value : 0}
                            onChange={(event) =>
                              field.handleChange(event.target.valueAsNumber)
                            }
                          />
                          <div className="relative w-24">
                            <Input
                              {...controlProps(field, error)}
                              type="number"
                              min={0}
                              max={100}
                              step="any"
                              className="pr-6 text-right font-mono"
                              value={Number.isNaN(value) ? '' : value}
                              onChange={(event) =>
                                field.handleChange(event.target.valueAsNumber)
                              }
                            />
                            <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                      </FormItem>
                    )
                  }}
                </form.Field>

                <form.Field name={`${base}.variation`}>
                  {(field) => {
                    const error = getFieldError(field)
                    return (
                      <FormItem
                        label="Variation *"
                        htmlFor={field.name}
                        error={error}
                      >
                        <VariationSelect
                          form={form}
                          {...controlProps(field, error)}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        />
                      </FormItem>
                    )
                  }}
                </form.Field>
              </div>
            </div>
          </div>
        )}
      </form.Subscribe>
    </li>
  )
}

function StepLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
      {children}
    </p>
  )
}

function QueryPreview({ form, index }: { form: EditorForm; index: number }) {
  return (
    <form.Subscribe
      selector={(state) => {
        // .at(): the index can point past the end for a moment while a rule is removed
        const rule = toFlagConfig(state.values).targeting.at(index)
        return rule ? buildQuery(rule.group) : ''
      }}
    >
      {(query) => (
        <p className="flex min-w-0 items-baseline gap-2 rounded-md bg-muted/60 px-2.5 py-1.5 text-xs">
          <span className="shrink-0 font-medium text-muted-foreground">
            query
          </span>
          <code className="min-w-0 font-mono break-all">{query || '—'}</code>
        </p>
      )}
    </form.Subscribe>
  )
}
