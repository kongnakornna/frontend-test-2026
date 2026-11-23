import type {
  Condition,
  ConditionGroup,
  FlagConfig,
  TargetingRule,
  Variation,
} from '../schema/flag-schema'
import { defaultVariationValue } from './variation-types'
import type { VariationType } from './variation-types'

/** Client-side ids for list items (React keys, drag & drop, variation references). Never in the output. */
export function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function createCondition(partial: Partial<Condition> = {}): Condition {
  return {
    id: createId('condition'),
    kind: 'condition',
    attribute: '',
    operator: 'eq',
    value: '',
    ...partial,
  }
}

export function createGroup(
  partial: Partial<ConditionGroup> = {},
): ConditionGroup {
  return {
    id: createId('group'),
    kind: 'group',
    combinator: 'and',
    children: [createCondition()],
    ...partial,
  }
}

export function createRule(variationId = ''): TargetingRule {
  return {
    id: createId('rule'),
    name: '',
    group: createGroup(),
    percentage: 100,
    variation: variationId,
    disabled: false,
  }
}

export function createVariation(type: VariationType, index: number): Variation {
  return {
    id: createId('variation'),
    name: `variation-${index + 1}`,
    value: defaultVariationValue(type, index),
  }
}

/**
 * Initial state. It serialises exactly to the challenge's expected.json.
 * Ids are static so server and client render the same markup (SSR hydration).
 */
export function createDefaultFlag(): FlagConfig {
  return {
    name: 'my-new-feature',
    description: '',
    enabled: true,
    variationType: 'boolean',
    variations: [
      { id: 'variation-on', name: 'on', value: 'true' },
      { id: 'variation-off', name: 'off', value: 'false' },
    ],
    targeting: [
      {
        id: 'rule-beta',
        name: '',
        group: {
          id: 'group-beta',
          kind: 'group',
          combinator: 'and',
          children: [
            {
              id: 'condition-beta',
              kind: 'condition',
              attribute: 'group',
              operator: 'eq',
              value: 'beta',
            },
          ],
        },
        percentage: 50,
        variation: 'variation-on',
        disabled: false,
      },
    ],
    defaultRule: { variation: 'variation-off' },
  }
}
