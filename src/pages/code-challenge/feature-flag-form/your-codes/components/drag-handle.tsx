import { GripVertical } from 'lucide-react'

import { cn } from '#/lib/utils'

interface DragHandleProps extends React.ComponentProps<'button'> {
  label: string
}

export function DragHandle({ label, className, ...props }: DragHandleProps) {
  return (
    <button
      type="button"
      aria-label={`${label}: drag, or use arrow up / down keys to reorder`}
      title="Drag to reorder (or focus + ↑ / ↓)"
      className={cn(
        'flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 active:cursor-grabbing',
        className,
      )}
      {...props}
    >
      <GripVertical className="size-4" />
    </button>
  )
}
