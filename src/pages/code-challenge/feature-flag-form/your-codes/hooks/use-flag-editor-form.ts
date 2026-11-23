import { useState } from 'react'
import { useForm } from '@tanstack/react-form'

import { getFlagIssues, toFormErrors } from '../lib/validate'
import { createDefaultFlag } from '../model/factories'
import { toFlagConfig } from '../model/form-values'
import type { FlagFormValues } from '../model/form-values'

interface Options {
  onValidSubmit: (values: FlagFormValues) => void | Promise<void>
}

/**
 * Validation runs the Zod schema at form level and maps every issue onto the
 * field at its path, so deeply nested fields get their own inline error.
 *
 * Why a validator *function* and not the schema itself: TanStack Form devtools
 * JSON-serialise the form options, and the recursive group schema refers to
 * itself, which crashed the dev server ("Converting circular structure to JSON").
 * handleSubmit also runs onChange validators, so there is no separate onSubmit
 * validator; its errors would stay in errorMap.onSubmit after a fix.
 */
function validateFlag({ value }: { value: FlagFormValues }) {
  return toFormErrors(getFlagIssues(toFlagConfig(value)))
}

export function useFlagEditorForm({ onValidSubmit }: Options) {
  const [defaultValues] = useState<FlagFormValues>(createDefaultFlag)

  return useForm({
    defaultValues,
    validators: { onChange: validateFlag },
    onSubmit: ({ value }) => onValidSubmit(value),
  })
}

export type EditorForm = ReturnType<typeof useFlagEditorForm>
