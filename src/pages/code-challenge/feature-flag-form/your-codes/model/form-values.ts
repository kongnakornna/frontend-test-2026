import type {
  Combinator,
  ConditionNode,
  FlagConfig,
  TargetingRule,
} from '../schema/flag-schema'

/**
 * Shape handed to TanStack Form.
 *
 * TanStack Form computes every possible field path of its data (DeepKeys). A
 * recursive type (group -> children -> group -> ...) makes that infinite and
 * TypeScript stops with TS2589. So at the form boundary, group children are
 * typed as `unknown[]`, and the recursive editor narrows them back with
 * `asConditionNodes`. At runtime the data is exactly `FlagConfig`, and the
 * recursive Zod schema still validates all of it.
 */
export interface FormConditionGroup {
  id: string
  kind: 'group'
  combinator: Combinator
  children: unknown[]
}

export type FormTargetingRule = Omit<TargetingRule, 'group'> & {
  group: FormConditionGroup
}

export type FlagFormValues = Omit<FlagConfig, 'targeting'> & {
  targeting: FormTargetingRule[]
}

/** An item slot inside some group's `children`, at any depth. */
export type NodePath =
  | `targeting[${number}].group.children[${number}]`
  | `targeting[${number}].group.children[${number}].${string}`

/** Any condition group: a rule's root group or a nested one. */
export type GroupPath = `targeting[${number}].group` | NodePath

/** Same runtime object, recursive view. */
export function toFlagConfig(values: FlagFormValues): FlagConfig {
  return values as unknown as FlagConfig
}

export function asConditionNodes(children: unknown): ConditionNode[] {
  return (Array.isArray(children) ? children : []) as ConditionNode[]
}
