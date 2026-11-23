import { toListLiteral, toLiteral } from '../lib/query-literal'

/**
 * Operator registry. Adding an operator = adding one entry here: the select
 * options, the value input, validation and the query builder all read from it.
 * Syntax follows the GoFeatureFlag (nikunjy/rules) query language.
 */
export const OPERATOR_IDS = [
  'eq',
  'ne',
  'in',
  'nin',
  'co',
  'sw',
  'ew',
  'gt',
  'ge',
  'lt',
  'le',
  'pr',
] as const

export type OperatorId = (typeof OPERATOR_IDS)[number]

/** text = free value, number = numeric value, list = comma separated, none = no value */
export type OperatorValueKind = 'text' | 'number' | 'list' | 'none'

export interface OperatorDefinition {
  label: string
  valueKind: OperatorValueKind
  toQuery: (attribute: string, value: string) => string
}

export const OPERATORS: Record<OperatorId, OperatorDefinition> = {
  eq: {
    label: 'equals (==)',
    valueKind: 'text',
    toQuery: (a, v) => `${a} == ${toLiteral(v)}`,
  },
  ne: {
    label: 'not equals (!=)',
    valueKind: 'text',
    toQuery: (a, v) => `${a} != ${toLiteral(v)}`,
  },
  in: {
    label: 'is one of (in)',
    valueKind: 'list',
    toQuery: (a, v) => `${a} in ${toListLiteral(v)}`,
  },
  nin: {
    label: 'is not one of (not in)',
    valueKind: 'list',
    toQuery: (a, v) => `not (${a} in ${toListLiteral(v)})`,
  },
  co: {
    label: 'contains (co)',
    valueKind: 'text',
    toQuery: (a, v) => `${a} co ${toLiteral(v)}`,
  },
  sw: {
    label: 'starts with (sw)',
    valueKind: 'text',
    toQuery: (a, v) => `${a} sw ${toLiteral(v)}`,
  },
  ew: {
    label: 'ends with (ew)',
    valueKind: 'text',
    toQuery: (a, v) => `${a} ew ${toLiteral(v)}`,
  },
  gt: {
    label: 'greater than (>)',
    valueKind: 'number',
    toQuery: (a, v) => `${a} > ${v.trim()}`,
  },
  ge: {
    label: 'greater or equal (>=)',
    valueKind: 'number',
    toQuery: (a, v) => `${a} >= ${v.trim()}`,
  },
  lt: {
    label: 'less than (<)',
    valueKind: 'number',
    toQuery: (a, v) => `${a} < ${v.trim()}`,
  },
  le: {
    label: 'less or equal (<=)',
    valueKind: 'number',
    toQuery: (a, v) => `${a} <= ${v.trim()}`,
  },
  pr: {
    label: 'is present (pr)',
    valueKind: 'none',
    toQuery: (a) => `${a} pr`,
  },
}

/** Safe lookup for values coming from the (loosely typed) form; falls back to equals. */
export function getOperator(id: unknown): OperatorDefinition {
  return typeof id === 'string' && id in OPERATORS
    ? OPERATORS[id as OperatorId]
    : OPERATORS.eq
}

/** Suggestions for the attribute input (any attribute can still be typed). */
export const ATTRIBUTE_SUGGESTIONS = [
  'targetingKey',
  'key',
  'group',
  'role',
  'email',
  'country',
  'plan',
  'company',
  'beta',
  'age',
  'appVersion',
] as const
