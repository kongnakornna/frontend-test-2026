import type { FlagConfig } from '../schema/flag-schema'
import { buildQuery } from './build-query'
import { parseVariationValue } from './variation-value'
import type { VariationValue } from './variation-value'

export interface GoffRule {
  name?: string
  query: string
  percentage: number
  variation: string
  disable?: true
}

export interface GoffFlag {
  variations: Record<string, VariationValue>
  targeting?: GoffRule[]
  defaultRule: { variation: string }
  disable?: true
  metadata?: { description: string }
}

export interface GoffConfig {
  flags: Record<string, GoffFlag>
}

export const UNTITLED_FLAG_KEY = 'untitled-flag'

/**
 * Editor state -> GoFeatureFlag config (the shape of expected.json).
 * Optional keys are only written when set, so the initial state serialises
 * exactly to expected.json. Client ids are dropped, and variation references
 * (ids) become variation names.
 */
export function toGoffConfig(flag: FlagConfig): GoffConfig {
  const nameOf = (id: string) =>
    flag.variations.find((variation) => variation.id === id)?.name.trim() ?? ''

  const targeting = flag.targeting.map(
    (rule): GoffRule => ({
      ...(rule.name.trim() ? { name: rule.name.trim() } : {}),
      query: buildQuery(rule.group),
      percentage: rule.percentage,
      variation: nameOf(rule.variation),
      ...(rule.disabled ? { disable: true as const } : {}),
    }),
  )
  const description = flag.description.trim()

  return {
    flags: {
      [flag.name.trim() || UNTITLED_FLAG_KEY]: {
        variations: Object.fromEntries(
          flag.variations.map((variation) => [
            variation.name.trim(),
            parseVariationValue(flag.variationType, variation.value),
          ]),
        ),
        ...(targeting.length ? { targeting } : {}),
        defaultRule: { variation: nameOf(flag.defaultRule.variation) },
        ...(flag.enabled ? {} : { disable: true as const }),
        ...(description ? { metadata: { description } } : {}),
      },
    },
  }
}

export function toJson(flag: FlagConfig): string {
  return JSON.stringify(toGoffConfig(flag), null, 2)
}
