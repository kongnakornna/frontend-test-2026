import { cn } from '#/lib/utils'

interface FieldLike {
  name: string
  handleBlur: () => void
  state: { meta: { errors: readonly unknown[]; isTouched: boolean } }
}

/**
 * The field's error message, shown once the field was touched. handleSubmit
 * marks every field as touched, so submitting reveals all errors.
 */
export function getFieldError(
  field: Pick<FieldLike, 'state'>,
): string | undefined {
  const { errors, isTouched } = field.state.meta
  if (!isTouched || errors.length === 0) return undefined
  const messages = errors
    .map((error) =>
      typeof error === 'string'
        ? error
        : (error as { message?: string } | undefined)?.message,
    )
    .filter((message): message is string => Boolean(message))
  return [...new Set(messages)].join(' · ') || undefined
}

/** id / name / a11y props linking a control to its error message. */
export function controlProps(field: FieldLike, error: string | undefined) {
  return {
    id: field.name,
    name: field.name,
    onBlur: field.handleBlur,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${field.name}-error` : undefined,
  }
}

interface FormItemProps {
  label?: React.ReactNode
  htmlFor?: string
  hint?: React.ReactNode
  error?: string
  className?: string
  children: React.ReactNode
}

export function FormItem({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: FormItemProps) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-xs font-medium text-muted-foreground"
        >
          {label}
        </label>
      )}
      {children}
      <FieldMessage id={htmlFor} error={error} hint={hint} />
    </div>
  )
}

export function FieldMessage({
  id,
  error,
  hint,
}: {
  id?: string
  error?: string
  hint?: React.ReactNode
}) {
  if (error) {
    return (
      <p
        id={id ? `${id}-error` : undefined}
        role="alert"
        className="text-xs font-medium text-destructive"
      >
        {error}
      </p>
    )
  }
  return hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null
}
