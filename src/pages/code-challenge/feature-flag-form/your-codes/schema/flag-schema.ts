import { z } from 'zod'

import { isNumeric, splitList } from '../lib/query-literal'
import { OPERATORS, OPERATOR_IDS } from '../model/operators'
import { VARIATION_TYPES } from '../model/variation-types'
import type { VariationType } from '../model/variation-types'

export const MAX_GROUP_DEPTH = 4

const ATTRIBUTE_PATTERN = /^[A-Za-z_][\w.-]*$/
const FLAG_NAME_PATTERN = /^[A-Za-z0-9][\w.-]*$/
const VARIATION_NAME_PATTERN = /^[\w.-]+$/

/** Accepts NaN (an empty number input) so the flag-level refinements still run; the range is checked separately. */
const numberInput = z.custom<number>(
  (value) => typeof value === 'number',
  'Must be a number',
)

/* ---------------------------------------------------------------- condition */

export const conditionSchema = z
  .object({
    id: z.string(),
    kind: z.literal('condition'),
    attribute: z
      .string()
      .trim()
      .min(1, 'Attribute is required')
      .regex(
        ATTRIBUTE_PATTERN,
        'Attribute must start with a letter (letters, numbers, "_", "." only)',
      ),
    operator: z.enum(OPERATOR_IDS, 'Pick an operator'),
    value: z.string(),
  })
  .superRefine((condition, ctx) => {
    const { valueKind } = OPERATORS[condition.operator]
    const value = condition.value.trim()
    if (valueKind === 'none') return
    if (!value) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Value is required',
      })
    } else if (valueKind === 'number' && !isNumeric(value)) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'This operator needs a number',
      })
    } else if (valueKind === 'list' && splitList(value).length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Enter at least one value, separated by commas',
      })
    }
  })

export type Condition = z.infer<typeof conditionSchema>

/* ------------------------------------------------------- group (recursive) */

export const COMBINATORS = ['and', 'or'] as const
export type Combinator = (typeof COMBINATORS)[number]

export interface ConditionGroup {
  id: string
  kind: 'group'
  combinator: Combinator
  children: ConditionNode[]
}
export type ConditionNode = Condition | ConditionGroup

// Zod 4 recursive object via getter. discriminatedUnion (not union) keeps the exact
// path of issues inside nested groups, so TanStack Form puts them on the right field.
export const conditionGroupSchema = z.object({
  id: z.string(),
  kind: z.literal('group'),
  combinator: z.enum(COMBINATORS),
  get children(): z.ZodArray<z.ZodType<ConditionNode>> {
    return z
      .array(
        z.discriminatedUnion('kind', [conditionSchema, conditionGroupSchema]),
      )
      .min(1, 'A group needs at least one condition')
  },
})

// compile-time guard: the schema really describes ConditionGroup
const _groupSchemaMatches: z.ZodType<ConditionGroup> = conditionGroupSchema
void _groupSchemaMatches

/* ------------------------------------------------------ variation and rule */

export const variationSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .trim()
    .min(1, 'Variation name is required')
    .regex(
      VARIATION_NAME_PATTERN,
      'Use letters, numbers, "_", "-" or "." only',
    ),
  value: z.string(),
})

export const targetingRuleSchema = z.object({
  id: z.string(),
  name: z.string().trim().max(80, 'Rule name is too long (max 80)'),
  group: conditionGroupSchema,
  /** rollout: % of matching users who get the variation */
  percentage: numberInput,
  /** variation id */
  variation: z.string(),
  disabled: z.boolean(),
})

export type Variation = z.infer<typeof variationSchema>
export type TargetingRule = z.infer<typeof targetingRuleSchema>

/* --------------------------------------------------------------------- flag */

function variationValueError(type: VariationType, raw: string): string | null {
  const value = raw.trim()
  switch (type) {
    case 'boolean':
      return value === 'true' || value === 'false'
        ? null
        : 'Value must be true or false'
    case 'number':
      return value !== '' && Number.isFinite(Number(value))
        ? null
        : 'Value must be a number'
    case 'json':
      try {
        const parsed: unknown = JSON.parse(value)
        return typeof parsed === 'object' && parsed !== null
          ? null
          : 'Value must be a JSON object or array'
      } catch {
        return 'Value must be valid JSON'
      }
    case 'string':
      return null
  }
}

export const flagSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Flag name is required')
      .max(64, 'Flag name is too long (max 64)')
      .regex(
        FLAG_NAME_PATTERN,
        'Use letters, numbers, ".", "-" or "_" (no spaces)',
      ),
    description: z.string().max(500, 'Description is too long (max 500)'),
    enabled: z.boolean(),
    variationType: z.enum(VARIATION_TYPES),
    variations: z.array(variationSchema).min(2, 'Add at least two variations'),
    targeting: z.array(targetingRuleSchema),
    defaultRule: z.object({ variation: z.string() }),
  })
  .superRefine((flag, ctx) => {
    // Cross-field rules: unique names, values match the type, references exist.
    const names = new Set<string>()
    const ids = new Set(flag.variations.map((variation) => variation.id))

    flag.variations.forEach((variation, index) => {
      const name = variation.name.trim()
      if (name && names.has(name)) {
        ctx.addIssue({
          code: 'custom',
          path: ['variations', index, 'name'],
          message: `Variation "${name}" already exists`,
        })
      }
      names.add(name)
      const valueError = variationValueError(
        flag.variationType,
        variation.value,
      )
      if (valueError) {
        ctx.addIssue({
          code: 'custom',
          path: ['variations', index, 'value'],
          message: valueError,
        })
      }
    })

    const checkVariation = (id: string, path: (string | number)[]) => {
      if (!id)
        ctx.addIssue({ code: 'custom', path, message: 'Select a variation' })
      else if (!ids.has(id)) {
        ctx.addIssue({
          code: 'custom',
          path,
          message: 'This variation no longer exists',
        })
      }
    }

    flag.targeting.forEach((rule, index) => {
      checkVariation(rule.variation, ['targeting', index, 'variation'])
      const { percentage } = rule
      if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
        ctx.addIssue({
          code: 'custom',
          path: ['targeting', index, 'percentage'],
          message: 'Percentage must be between 0 and 100',
        })
      }
    })
    checkVariation(flag.defaultRule.variation, ['defaultRule', 'variation'])
  })

/** Fully typed (recursive) flag model. */
export type FlagConfig = z.infer<typeof flagSchema>
