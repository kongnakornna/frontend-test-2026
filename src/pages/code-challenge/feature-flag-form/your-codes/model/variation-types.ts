export const VARIATION_TYPES = ['boolean', 'string', 'number', 'json'] as const
export type VariationType = (typeof VARIATION_TYPES)[number]

export const VARIATION_TYPE_LABELS: Record<VariationType, string> = {
  boolean: 'Boolean',
  string: 'String',
  number: 'Number',
  json: 'JSON',
}

/** Sensible starting value for the n-th variation when the flag type changes. */
export function defaultVariationValue(
  type: VariationType,
  index: number,
): string {
  switch (type) {
    case 'boolean':
      return index % 2 === 0 ? 'true' : 'false'
    case 'number':
      return String(index)
    case 'json':
      return '{}'
    case 'string':
      return `value-${index + 1}`
  }
}

/** Colour marker per variation (same idea as the GoFeatureFlag editor). */
const VARIATION_COLORS = [
  'bg-sky-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-fuchsia-500',
]

export function variationColor(index: number): string {
  return VARIATION_COLORS[index % VARIATION_COLORS.length]
}
