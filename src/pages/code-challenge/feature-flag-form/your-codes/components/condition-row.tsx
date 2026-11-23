import { useId } from 'react'
import { X } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { NativeSelect } from '#/components/ui/native-select'

import type { EditorForm } from '../hooks/use-flag-editor-form'
import type { NodePath } from '../model/form-values'
import {
  ATTRIBUTE_SUGGESTIONS,
  OPERATORS,
  OPERATOR_IDS,
  getOperator,
} from '../model/operators'
import type { OperatorId } from '../model/operators'
import { FieldMessage, controlProps, getFieldError } from './form-item'

const VALUE_PLACEHOLDER = {
  text: 'beta',
  number: '18',
  list: 'TH, US, JP',
  none: '',
} as const

interface ConditionRowProps {
  form: EditorForm
  path: NodePath
  dragHandle: React.ReactNode
  canRemove: boolean
  onRemove: () => void
}

export function ConditionRow({
  form,
  path,
  dragHandle,
  canRemove,
  onRemove,
}: ConditionRowProps) {
  const suggestionsId = useId()

  return (
    <div className="flex items-start gap-1.5 rounded-lg border border-border bg-background p-2">
      <div className="pt-0.5">{dragHandle}</div>

      <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)]">
        <form.Field name={`${path}.attribute`}>
          {(field) => {
            const error = getFieldError(field)
            return (
              <div className="flex min-w-0 flex-col gap-1">
                <Input
                  {...controlProps(field, error)}
                  aria-label="Attribute"
                  list={suggestionsId}
                  placeholder="attribute, e.g. group"
                  autoComplete="off"
                  className="font-mono"
                  value={String(field.state.value ?? '')}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
                <datalist id={suggestionsId}>
                  {ATTRIBUTE_SUGGESTIONS.map((attribute) => (
                    <option key={attribute} value={attribute} />
                  ))}
                </datalist>
                <FieldMessage id={field.name} error={error} />
              </div>
            )
          }}
        </form.Field>

        {/* the value input depends on the operator, so it lives inside the operator field */}
        <form.Field name={`${path}.operator`}>
          {(operatorField) => {
            const operator = getOperator(operatorField.state.value)
            return (
              <>
                <NativeSelect
                  id={operatorField.name}
                  name={operatorField.name}
                  aria-label="Operator"
                  value={String(operatorField.state.value)}
                  onChange={(event) =>
                    operatorField.handleChange(event.target.value as OperatorId)
                  }
                >
                  {OPERATOR_IDS.map((id) => (
                    <option key={id} value={id}>
                      {OPERATORS[id].label}
                    </option>
                  ))}
                </NativeSelect>

                {operator.valueKind === 'none' ? (
                  <p className="flex h-8 items-center text-xs text-muted-foreground">
                    No value needed
                  </p>
                ) : (
                  <form.Field name={`${path}.value`}>
                    {(field) => {
                      const error = getFieldError(field)
                      return (
                        <div className="flex min-w-0 flex-col gap-1">
                          <Input
                            {...controlProps(field, error)}
                            aria-label="Value"
                            inputMode={
                              operator.valueKind === 'number'
                                ? 'decimal'
                                : undefined
                            }
                            placeholder={VALUE_PLACEHOLDER[operator.valueKind]}
                            className="font-mono"
                            value={String(field.state.value ?? '')}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                          />
                          <FieldMessage
                            id={field.name}
                            error={error}
                            hint={
                              operator.valueKind === 'list'
                                ? 'Comma separated'
                                : undefined
                            }
                          />
                        </div>
                      )
                    }}
                  </form.Field>
                )}
              </>
            )
          }}
        </form.Field>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Remove condition"
        title={
          canRemove
            ? 'Remove condition'
            : 'A group needs at least one condition'
        }
        disabled={!canRemove}
        onClick={onRemove}
      >
        <X />
      </Button>
    </div>
  )
}
