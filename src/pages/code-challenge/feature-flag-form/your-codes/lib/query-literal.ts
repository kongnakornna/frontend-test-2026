const NUMERIC = /^-?\d+(\.\d+)?$/
const QUOTED = /^(['"]).*\1$/

/**
 * Turns a raw user value into a GoFeatureFlag query literal.
 * - numbers and booleans are emitted as-is
 * - values already wrapped in quotes are kept (lets users force a string, e.g. '123')
 * - everything else becomes a single-quoted, escaped string
 */
export function toLiteral(raw: string): string {
  const value = raw.trim()
  if (NUMERIC.test(value) || value === 'true' || value === 'false') return value
  if (value.length >= 2 && QUOTED.test(value)) return value
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

/** "th, us ,jp" -> ['th', 'us', 'jp'] */
export function splitList(raw: string): string[] {
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function toListLiteral(raw: string): string {
  return `[${splitList(raw).map(toLiteral).join(', ')}]`
}

export function isNumeric(raw: string): boolean {
  return NUMERIC.test(raw.trim())
}
