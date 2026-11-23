import { flagSchema } from '../schema/flag-schema'
import type { FlagConfig } from '../schema/flag-schema'
import { describeIssuePath, toFieldName } from './describe-issue'

export interface FlagIssue {
  /** TanStack field name, e.g. targeting[1].group.children[0].value */
  field: string
  /** readable location, e.g. Rule 2 › Condition 1 › Value */
  where: string
  message: string
}

/** The one place validation happens: runs the Zod schema and flattens its issues. */
export function getFlagIssues(flag: FlagConfig): FlagIssue[] {
  const result = flagSchema.safeParse(flag)
  if (result.success) return []
  return result.error.issues.map((issue) => ({
    field: toFieldName(issue.path),
    where: describeIssuePath(issue.path, flag),
    message: issue.message,
  }))
}

/**
 * Issues -> TanStack Form's form-level validator result.
 * `{ fields: { [fieldName]: message } }` puts each message on the matching
 * (possibly deeply nested) field. Issues without a path become a form error.
 */
export function toFormErrors(issues: FlagIssue[]) {
  if (issues.length === 0) return undefined
  const fields: Record<string, string> = {}
  let form: string | undefined
  for (const issue of issues) {
    if (!issue.field) form ??= issue.message
    else fields[issue.field] ??= issue.message
  }
  return { form, fields }
}
