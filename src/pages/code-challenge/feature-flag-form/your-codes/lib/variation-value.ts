import type { VariationType } from '../model/variation-types'

export type VariationValue =
  | boolean
  | number
  | string
  | Record<string, unknown>
  | unknown[]

/**
 * The form keeps every variation value as a string (one input for every flag
 * type); this converts it to the real type. It is lenient on purpose so the
 * live preview never breaks. Zod reports invalid values.
 */
export function parseVariationValue(
  type: VariationType,
  raw: string,
): VariationValue {
  switch (type) {
    case 'boolean':
      return raw.trim() === 'true'
    case 'number': {
      const value = Number(raw)
      return raw.trim() !== '' && Number.isFinite(value) ? value : raw
    }
    case 'json':
      try {
        return JSON.parse(raw) as VariationValue
      } catch {
        return raw
      }
    case 'string':
      return raw
  }
}
