# NOTES: Feature Flag Editor

Route: `/code-challenge/feature-flag-form` · Code: `src/pages/code-challenge/feature-flag-form/your-codes/`

The page shows only the edit form (black theme), with the JSON preview on the right.

## Scope (from the brief)

| Requirement     | Implementation                                                                                                                                                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Flag Metadata   | Flag name, description (`metadata.description`), status Enabled/Disabled (`disable: true`)                                                                                                                                              |
| Flag Variations | Type boolean / string / number / JSON; add/remove variations (min 2), e.g. `on = true`, `off = false`                                                                                                                                   |
| Targeting Rules | Rules are an array with drag & drop (also ↑/↓ keys and up/down buttons). Each rule has an optional name, an on/off toggle, a recursive AND/OR **group** of conditions (an array that nests up to 4 levels), a rollout % and a variation |
| Default rule    | Variation served when no rule matches                                                                                                                                                                                                   |
| Validation      | Zod, with inline errors per field (also deep inside nested groups) and a clickable issue list under the preview                                                                                                                         |
| JSON preview    | `@monaco-editor/react`, live through `form.Subscribe`                                                                                                                                                                                   |

## Structure

```
your-codes/
├── index.tsx                  page: form + sticky JSON preview
├── editor-theme.css           black theme (scoped tokens)
├── schema/flag-schema.ts      Zod: recursive group, rule, flag + cross-field rules
├── model/                     operator registry, variation types, factories, form types
├── lib/                       pure, framework-free, unit tested
│   ├── build-query.ts         condition tree → GoFeatureFlag query string
│   ├── to-go-feature-flag.ts  form state → output JSON (expected.json shape)
│   ├── validate.ts            Zod issues → TanStack field errors + issue list
│   └── describe-issue.ts      "Rule 1 › Group 2 › Condition 1 › Value"
├── hooks/                     useFlagEditorForm, useDragReorder
└── components/                one component per section; ConditionGroupEditor renders itself recursively
```

## Decisions

- **Output.** The initial state serialises exactly to `expected.json` (a test checks this). `name`, `disable` and
  `metadata` are written only when set.
- **Query builder.** The group tree compiles to GoFeatureFlag (nikunjy/rules) syntax, e.g.
  `group == 'beta' and (country in ['TH', 'US'] or role == 'admin')`, and the query is shown under each rule.
  Operators are data in `model/operators.ts`: adding one entry updates the UI, validation and the query output.
- **Variation references are ids.** Renaming a variation updates the rules that serve it.
  Deleting one shows "This variation no longer exists".
- **Recursive types vs TanStack Form.** TanStack computes every field path (`DeepKeys`), and a recursive type makes
  that infinite (TS2589). At the form boundary, group `children` are typed `unknown[]`, and paths use template-literal
  types (`GroupPath`, `NodePath`). The recursive Zod schema still validates the full tree.
- **Validation.** One form-level `onChange` validator returns `{ fields: { path: message } }` from the Zod issues.
  `z.discriminatedUnion` keeps exact paths inside nested groups. `superRefine` covers cross-field rules: unique
  variation names, values matching the type, existing variation references, and percentage 0–100.
  A validator function is used instead of passing the schema itself, because TanStack devtools JSON-serialise the
  options and the recursive schema is circular, which crashed the dev server.
- **Re-renders.** Every input is its own `form.Field`. The preview, the per-rule query and the variation dropdowns
  use `form.Subscribe` with narrow selectors.
- **Drag & drop** uses native HTML5 events, with no new dependency. Items are draggable only while the handle is
  pressed. Nested groups reorder on their own.

## Testing

`pnpm test` runs 17 tests:

- **Logic:** output, query builder, validation paths and cross-field rules.
- **Integration (RTL):** the real form, with Monaco mocked.

`vitest.config.ts` is separate from `vite.config.ts` because the Start/devtools plugins load a second copy of React
in component tests.
