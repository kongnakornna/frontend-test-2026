import { useState } from 'react'
import type React from 'react'

/**
 * Native HTML5 drag & drop reordering for one list (no extra dependency).
 * - an item is only draggable while its handle is pressed, so the inputs
 *   inside it stay selectable
 * - events stop propagating, so nested lists (groups inside groups) each
 *   reorder on their own
 * - the handle also reorders with the ArrowUp / ArrowDown keys
 */
export function useDragReorder(
  length: number,
  onMove: (from: number, to: number) => void,
) {
  const [armed, setArmed] = useState<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [over, setOver] = useState<number | null>(null)

  const reset = () => {
    setArmed(null)
    setDragging(null)
    setOver(null)
  }

  const move = (from: number, to: number) => {
    if (from !== to && to >= 0 && to < length) onMove(from, to)
  }

  const itemProps = (index: number) => ({
    draggable: armed === index,
    'data-dragging': dragging === index || undefined,
    'data-drop-target':
      (over === index && dragging !== null && dragging !== index) || undefined,
    onDragStart: (event: React.DragEvent) => {
      event.stopPropagation()
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
      setDragging(index)
    },
    onDragOver: (event: React.DragEvent) => {
      if (dragging === null) return // a drag from another list: let it bubble
      event.preventDefault()
      event.stopPropagation()
      event.dataTransfer.dropEffect = 'move'
      if (over !== index) setOver(index)
    },
    onDrop: (event: React.DragEvent) => {
      if (dragging === null) return
      event.preventDefault()
      event.stopPropagation()
      move(dragging, index)
      reset()
    },
    onDragEnd: (event: React.DragEvent) => {
      event.stopPropagation()
      reset()
    },
  })

  const handleProps = (index: number) => ({
    onPointerDown: () => setArmed(index),
    onPointerUp: () => setArmed(null),
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        move(index, event.key === 'ArrowUp' ? index - 1 : index + 1)
      }
    },
  })

  return { itemProps, handleProps, move }
}

export type DragItemProps = ReturnType<
  ReturnType<typeof useDragReorder>['itemProps']
>
export type DragHandleProps = ReturnType<
  ReturnType<typeof useDragReorder>['handleProps']
>
