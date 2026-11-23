import { CornerDownRight } from 'lucide-react'

import type { EditorForm } from '../hooks/use-flag-editor-form'
import { EditorSection } from './editor-section'
import { FormItem, controlProps, getFieldError } from './form-item'
import { VariationSelect } from './variation-select'

export function DefaultRuleSection({ form }: { form: EditorForm }) {
  return (
    <EditorSection
      icon={CornerDownRight}
      title="Default rule"
      description="Served when no targeting rule matches"
    >
      <form.Field name="defaultRule.variation">
        {(field) => {
          const error = getFieldError(field)
          return (
            <FormItem
              label="Serve variation *"
              htmlFor={field.name}
              error={error}
              className="sm:max-w-72"
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
    </EditorSection>
  )
}
