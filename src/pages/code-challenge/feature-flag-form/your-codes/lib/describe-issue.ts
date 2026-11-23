import type { FlagConfig } from '../schema/flag-schema'

type PathSegment = PropertyKey | { key: PropertyKey }

const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  description: 'Description',
  value: 'Value',
  attribute: 'Attribute',
  operator: 'Operator',
  percentage: 'Percentage',
  variation: 'Variation',
  variations: 'Variations',
  children: 'Conditions',
}

const LIST_LABELS: Record<string, string> = {
  variations: 'Variation',
  targeting: 'Rule',
}

function normalise(path: readonly PathSegment[]): PropertyKey[] {
  return path.map((segment) =>
    typeof segment === 'object' ? segment.key : segment,
  )
}

/** ['targeting', 0, 'group', 'children', 1, 'value'] -> 'targeting[0].group.children[1].value' */
export function toFieldName(path: readonly PathSegment[]): string {
  return normalise(path).reduce<string>((name, segment) => {
    if (typeof segment === 'number') return `${name}[${segment}]`
    return name ? `${name}.${String(segment)}` : String(segment)
  }, '')
}

/** Human-readable location, e.g. 'Rule 1 › Group 2 › Condition 1 › Value'. */
export function describeIssuePath(
  path: readonly PathSegment[],
  flag: FlagConfig,
): string {
  const segments = normalise(path)
  const labels: string[] = []
  let cursor: unknown = flag

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const next = segments[i + 1]
    const container = cursor as Record<PropertyKey, unknown> | undefined

    // list item: targeting[2], children[1], variations[0]
    if (typeof next === 'number' && typeof segment === 'string') {
      const item = (container?.[segment] as unknown[] | undefined)?.[next] as
        | { kind?: string; name?: string }
        | undefined
      if (segment === 'children') {
        labels.push(
          `${item?.kind === 'group' ? 'Group' : 'Condition'} ${next + 1}`,
        )
      } else {
        const label = `${LIST_LABELS[segment] ?? segment} ${next + 1}`
        labels.push(
          segment === 'targeting' && item?.name
            ? `${label} "${item.name}"`
            : label,
        )
      }
      cursor = item
      i++
      continue
    }

    if (segment === 'name' && i === 0) labels.push('Flag name')
    else if (segment === 'defaultRule') labels.push('Default rule')
    else if (typeof segment === 'string' && segment !== 'group') {
      // a rule's root group is implicit in the UI
      labels.push(FIELD_LABELS[segment] ?? segment)
    }
    cursor = container?.[segment]
  }

  return labels.join(' › ') || 'Flag'
}
