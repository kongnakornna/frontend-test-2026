import type { AnyFieldApi } from '@tanstack/react-form'
import { FolderPlus, Plus, Trash2 } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

import type { EditorForm } from '../hooks/use-flag-editor-form'
import { useDragReorder } from '../hooks/use-drag-reorder'
import { createCondition, createGroup } from '../model/factories'
import { asConditionNodes } from '../model/form-values'
import type { GroupPath } from '../model/form-values'
import { COMBINATORS, MAX_GROUP_DEPTH } from '../schema/flag-schema'
import type { Combinator, ConditionNode } from '../schema/flag-schema'
import { ConditionRow } from './condition-row'
import { DragHandle } from './drag-handle'
import { FieldMessage, getFieldError } from './form-item'

const DEPTH_ACCENTS = [
  'border-l-sky-500',
  'border-l-violet-500',
  'border-l-amber-500',
  'border-l-emerald-500',
]

interface ConditionGroupEditorProps {
  form: EditorForm
  path: GroupPath
  depth: number
  /** nested groups can be removed; a rule's root group cannot */
  onRemove?: () => void
  dragHandle?: React.ReactNode
}

/**
 * A recursive AND / OR group. Each level owns one array field (`<path>.children`).
 * Each item in it is either a condition or another ConditionGroupEditor.
 */
export function ConditionGroupEditor({
  form,
  path,
  depth,
  onRemove,
  dragHandle,
}: ConditionGroupEditorProps) {
  return (
    <div
      data-depth={depth}
      className={cn(
        'space-y-2 rounded-lg border border-l-4 border-border bg-muted/30 p-2.5',
        DEPTH_ACCENTS[depth % DEPTH_ACCENTS.length],
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {dragHandle}
        <form.Field name={`${path}.combinator`}>
          {(field) => (
            <CombinatorToggle
              value={field.state.value as Combinator}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
        <span className="text-xs text-muted-foreground">
          {depth === 0 ? 'of the following conditions match' : 'nested group'}
        </span>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="ml-auto text-destructive hover:text-destructive"
            aria-label="Remove group"
            onClick={onRemove}
          >
            <Trash2 />
          </Button>
        )}
      </div>

      <form.Field name={`${path}.children`} mode="array">
        {(childrenField) => (
          <GroupChildren
            form={form}
            path={path}
            depth={depth}
            childrenField={childrenField}
          />
        )}
      </form.Field>
    </div>
  )
}

function GroupChildren({
  form,
  path,
  depth,
  childrenField,
}: {
  form: EditorForm
  path: GroupPath
  depth: number
  /** children are opaque at the form boundary (see model/form-values.ts), hence AnyFieldApi */
  childrenField: AnyFieldApi
}) {
  const children = asConditionNodes(childrenField.state.value)
  const pushNode = (node: ConditionNode) => childrenField.pushValue(node)
  const drag = useDragReorder(children.length, childrenField.moveValue)
  const canNest = depth < MAX_GROUP_DEPTH - 1

  return (
    <>
      <ul className="space-y-2">
        {children.map((node, index) => {
          const childPath = `${path}.children[${index}]` as const
          const handle = (
            <DragHandle
              label={`Item ${index + 1}`}
              {...drag.handleProps(index)}
            />
          )
          return (
            <li
              key={node.id}
              {...drag.itemProps(index)}
              className="rounded-lg transition-[opacity,box-shadow] data-dragging:opacity-40 data-drop-target:ring-2 data-drop-target:ring-primary"
            >
              {index > 0 && <CombinatorDivider form={form} path={path} />}
              {node.kind === 'group' ? (
                <ConditionGroupEditor
                  form={form}
                  path={childPath}
                  depth={depth + 1}
                  dragHandle={handle}
                  onRemove={() => childrenField.removeValue(index)}
                />
              ) : (
                <ConditionRow
                  form={form}
                  path={childPath}
                  dragHandle={handle}
                  canRemove={children.length > 1}
                  onRemove={() => childrenField.removeValue(index)}
                />
              )}
            </li>
          )
        })}
      </ul>

      {/* e.g. "A group needs at least one condition" */}
      <FieldMessage error={getFieldError(childrenField)} />

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => pushNode(createCondition())}
        >
          <Plus /> Condition
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          disabled={!canNest}
          title={
            canNest
              ? 'Add a nested AND / OR group'
              : `Groups can be nested up to ${MAX_GROUP_DEPTH} levels`
          }
          onClick={() => pushNode(createGroup({ combinator: 'or' }))}
        >
          <FolderPlus /> Group
        </Button>
      </div>
    </>
  )
}

function CombinatorToggle({
  value,
  onChange,
}: {
  value: Combinator
  onChange: (value: Combinator) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Match"
      className="inline-flex rounded-md border border-border bg-background p-0.5"
    >
      {COMBINATORS.map((combinator) => (
        <button
          key={combinator}
          type="button"
          role="radio"
          aria-checked={value === combinator}
          onClick={() => onChange(combinator)}
          className={cn(
            'rounded px-2 py-0.5 font-mono text-xs font-semibold uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
            value === combinator
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {combinator === 'and' ? 'All (and)' : 'Any (or)'}
        </button>
      ))}
    </div>
  )
}

function CombinatorDivider({
  form,
  path,
}: {
  form: EditorForm
  path: GroupPath
}) {
  return (
    <form.Field name={`${path}.combinator`}>
      {(field) => (
        <div className="flex items-center gap-2 py-1 pl-9" aria-hidden>
          <span className="rounded bg-background px-1.5 font-mono text-[0.65rem] font-semibold text-muted-foreground uppercase ring-1 ring-border">
            {String(field.state.value)}
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
      )}
    </form.Field>
  )
}
