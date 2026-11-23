import { Plus, Target } from 'lucide-react'

import { Button } from '#/components/ui/button'

import type { EditorForm } from '../hooks/use-flag-editor-form'
import { useDragReorder } from '../hooks/use-drag-reorder'
import { createRule } from '../model/factories'
import type { FormTargetingRule } from '../model/form-values'
import { EditorSection } from './editor-section'
import { RuleCard } from './rule-card'

/** The array-field surface the list needs (decoupled from FieldApi generics). */
interface RulesArrayField {
  state: { value: FormTargetingRule[] }
  pushValue: (rule: FormTargetingRule) => void
  removeValue: (index: number) => void
  moveValue: (from: number, to: number) => void
}

export function TargetingSection({ form }: { form: EditorForm }) {
  return (
    <form.Field name="targeting" mode="array">
      {(rulesField) => <RulesList form={form} rulesField={rulesField} />}
    </form.Field>
  )
}

function RulesList({
  form,
  rulesField,
}: {
  form: EditorForm
  rulesField: RulesArrayField
}) {
  const rules = rulesField.state.value
  const drag = useDragReorder(rules.length, rulesField.moveValue)

  const addRule = () => {
    // new rules serve the first variation so they're valid right away
    const first = form.getFieldValue('variations').at(0)
    rulesField.pushValue(createRule(first?.id))
  }

  return (
    <EditorSection
      icon={Target}
      title="Targeting rules"
      description="Rules run top to bottom and the first match wins. Drag to reorder."
      actions={
        <Button type="button" variant="outline" size="sm" onClick={addRule}>
          <Plus /> Add rule
        </Button>
      }
    >
      {rules.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No targeting rules. Every user gets the default rule.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={addRule}
          >
            <Plus /> Add your first rule
          </Button>
        </div>
      ) : (
        <ol className="space-y-3" aria-label="Targeting rules">
          {rules.map((rule, index) => (
            <RuleCard
              key={rule.id}
              form={form}
              index={index}
              total={rules.length}
              itemProps={drag.itemProps(index)}
              handleProps={drag.handleProps(index)}
              onMove={(to) => drag.move(index, to)}
              onRemove={() => rulesField.removeValue(index)}
            />
          ))}
        </ol>
      )}
    </EditorSection>
  )
}
