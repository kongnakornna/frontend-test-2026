import { getOperator } from '../model/operators'
import type {
  Condition,
  ConditionGroup,
  ConditionNode,
} from '../schema/flag-schema'

/**
 * Compiles a (recursive) condition group into a GoFeatureFlag query string.
 * Incomplete conditions are skipped so the live preview stays useful while
 * typing; reporting them is the Zod schema's job.
 *
 *   AND(group == beta, OR(country == TH, country == US))
 *   -> group == 'beta' and (country == 'TH' or country == 'US')
 */
export function buildQuery(group: ConditionGroup): string {
  return compileGroup(group, true) ?? ''
}

function compileNode(node: ConditionNode): string | null {
  return node.kind === 'group'
    ? compileGroup(node, false)
    : compileCondition(node)
}

function compileCondition(condition: Condition): string | null {
  const attribute = condition.attribute.trim()
  const operator = getOperator(condition.operator)
  if (!attribute) return null
  if (operator.valueKind !== 'none' && !condition.value.trim()) return null
  return operator.toQuery(attribute, condition.value)
}

function compileGroup(group: ConditionGroup, isRoot: boolean): string | null {
  const parts = group.children
    .map(compileNode)
    .filter((part): part is string => Boolean(part))
  if (parts.length === 0) return null
  const joined = parts.join(` ${group.combinator} `)
  return isRoot || parts.length === 1 ? joined : `(${joined})`
}
