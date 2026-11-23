import { describe, expect, it } from 'vitest'

import {
  createCondition,
  createDefaultFlag,
  createGroup,
} from '../model/factories'
import type { FlagConfig } from '../schema/flag-schema'
import { buildQuery } from './build-query'
import { toGoffConfig } from './to-go-feature-flag'
import { getFlagIssues, toFormErrors } from './validate'

const expectedJson = {
  flags: {
    'my-new-feature': {
      variations: { on: true, off: false },
      targeting: [
        { query: "group == 'beta'", percentage: 50, variation: 'on' },
      ],
      defaultRule: { variation: 'off' },
    },
  },
}

const issues = (flag: FlagConfig) =>
  getFlagIssues(flag).map(({ field, message }) => ({ field, message }))

describe('toGoffConfig', () => {
  it('serialises the initial state exactly to expected.json', () => {
    expect(JSON.stringify(toGoffConfig(createDefaultFlag()))).toBe(
      JSON.stringify(expectedJson),
    )
  })

  it('writes optional keys only when set and parses typed values', () => {
    const flag = createDefaultFlag()
    flag.enabled = false
    flag.description = 'New checkout'
    flag.variationType = 'number'
    flag.variations[0].value = '1'
    flag.variations[1].value = '2.5'
    flag.targeting[0].name = 'Beta users'
    flag.targeting[0].disabled = true

    const out = toGoffConfig(flag).flags['my-new-feature']
    expect(out.variations).toEqual({ on: 1, off: 2.5 })
    expect(out.disable).toBe(true)
    expect(out.metadata).toEqual({ description: 'New checkout' })
    expect(out.targeting?.[0]).toMatchObject({
      name: 'Beta users',
      disable: true,
    })
  })

  it('follows variation renames, because rules reference variation ids', () => {
    const flag = createDefaultFlag()
    flag.variations[0].name = 'enabled'
    const out = toGoffConfig(flag).flags['my-new-feature']
    expect(out.targeting?.[0].variation).toBe('enabled')
  })

  it('omits targeting when there are no rules', () => {
    const flag = createDefaultFlag()
    flag.targeting = []
    expect(toGoffConfig(flag).flags['my-new-feature']).not.toHaveProperty(
      'targeting',
    )
  })
})

describe('buildQuery', () => {
  it('joins nested groups with parentheses and escapes values', () => {
    const group = createGroup({
      children: [
        createCondition({ attribute: 'role', operator: 'eq', value: 'admin' }),
        createGroup({
          combinator: 'or',
          children: [
            createCondition({
              attribute: 'country',
              operator: 'in',
              value: 'TH, US',
            }),
            createCondition({ attribute: 'age', operator: 'ge', value: '18' }),
            createGroup({
              children: [
                createCondition({
                  attribute: 'email',
                  operator: 'ew',
                  value: "@o'reilly.com",
                }),
              ],
            }),
          ],
        }),
      ],
    })
    expect(buildQuery(group)).toBe(
      "role == 'admin' and (country in ['TH', 'US'] or age >= 18 or email ew '@o\\'reilly.com')",
    )
  })

  it('handles value-less and negated operators and skips incomplete conditions', () => {
    const group = createGroup({
      combinator: 'or',
      children: [
        createCondition({ attribute: 'email', operator: 'pr' }),
        createCondition({ attribute: 'plan', operator: 'nin', value: 'free' }),
        createCondition({ attribute: '', value: 'x' }),
        createCondition({ attribute: 'beta', value: 'true' }),
        createGroup({ children: [] }),
      ],
    })
    expect(buildQuery(group)).toBe(
      "email pr or not (plan in ['free']) or beta == true",
    )
  })
})

describe('validation', () => {
  it('accepts the initial state', () => {
    expect(issues(createDefaultFlag())).toEqual([])
  })

  it('reports field errors with exact paths, deep inside nested groups too', () => {
    const flag = createDefaultFlag()
    flag.name = ' '
    flag.targeting[0].percentage = 120
    flag.targeting[0].group.children.push(
      createGroup({
        children: [
          createGroup({
            children: [
              createCondition({
                attribute: 'age',
                operator: 'gt',
                value: 'abc',
              }),
            ],
          }),
        ],
      }),
    )

    expect(issues(flag)).toEqual(
      expect.arrayContaining([
        { field: 'name', message: 'Flag name is required' },
        {
          field: 'targeting[0].percentage',
          message: 'Percentage must be between 0 and 100',
        },
        {
          field: 'targeting[0].group.children[1].children[0].children[0].value',
          message: 'This operator needs a number',
        },
      ]),
    )
  })

  it('runs cross-field checks even when other fields are invalid', () => {
    const flag = createDefaultFlag()
    flag.name = ''
    flag.variations[1].name = 'on'
    flag.variations[1].value = 'maybe'
    flag.targeting[0].variation = 'gone'
    flag.targeting[0].percentage = Number.NaN
    flag.defaultRule.variation = ''

    expect(issues(flag)).toEqual(
      expect.arrayContaining([
        { field: 'name', message: 'Flag name is required' },
        {
          field: 'variations[1].name',
          message: 'Variation "on" already exists',
        },
        {
          field: 'variations[1].value',
          message: 'Value must be true or false',
        },
        {
          field: 'targeting[0].variation',
          message: 'This variation no longer exists',
        },
        {
          field: 'targeting[0].percentage',
          message: 'Percentage must be between 0 and 100',
        },
        { field: 'defaultRule.variation', message: 'Select a variation' },
      ]),
    )
  })

  it('rejects empty groups', () => {
    const flag = createDefaultFlag()
    flag.targeting[0].group.children = []
    expect(issues(flag)).toContainEqual({
      field: 'targeting[0].group.children',
      message: 'A group needs at least one condition',
    })
  })

  it('builds TanStack field errors and readable locations', () => {
    const flag = createDefaultFlag()
    flag.targeting[0].name = 'Beta'
    flag.targeting[0].group.children.push(
      createGroup({ children: [createCondition({ attribute: 'role' })] }),
    )
    const [issue] = getFlagIssues(flag)
    expect(issue).toEqual({
      field: 'targeting[0].group.children[1].children[0].value',
      where: 'Rule 1 "Beta" › Group 2 › Condition 1 › Value',
      message: 'Value is required',
    })
    expect(toFormErrors([issue])).toEqual({
      form: undefined,
      fields: { [issue.field]: 'Value is required' },
    })
  })
})
