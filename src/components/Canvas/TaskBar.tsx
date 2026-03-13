import { useDrag } from '../../hooks/useDrag'
import { useResize } from '../../hooks/useResize'
import { TASK_ROW_HEIGHT, STATUS_COLORS } from './MilestoneMarker'
import type { GanttTask } from '../../model/types'

export const BAR_PADDING_Y = 6
const BAR_HEIGHT = TASK_ROW_HEIGHT - BAR_PADDING_Y * 2
const MIN_WIDTH = 8

interface TaskBarProps {
  task: GanttTask
  x: number
  width: number
  pxPerDay: number
  onDragEnd: (deltaDays: number) => void
  onResizeEnd: (deltaDays: number) => void
}

export function TaskBar({ task, x, width, pxPerDay, onDragEnd, onResizeEnd }: TaskBarProps) {
  const drag = useDrag({ onDragEnd, pxPerDay })
  const resize = useResize({ onResizeEnd, pxPerDay })

  const color = task.color ?? STATUS_COLORS[task.status ?? 'default'] ?? STATUS_COLORS['default']!
  const barWidth = Math.max(MIN_WIDTH, width)
  const y = BAR_PADDING_Y

  return (
    <g style={{ cursor: 'grab' }}>
      {/* Main bar — handles drag */}
      <rect
        data-testid={`task-bar-${task.label}`}
        x={x}
        y={y}
        width={barWidth - 6}
        height={BAR_HEIGHT}
        rx={3}
        fill={color}
        style={{ cursor: 'grab' }}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
      />

      {/* Label */}
      <text
        x={x + 6}
        y={y + BAR_HEIGHT / 2 + 4}
        fontSize={11}
        fill="#fff"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {task.label.length > 20 ? task.label.slice(0, 18) + '\u2026' : task.label}
      </text>

      {/* Resize handle (right edge) */}
      <rect
        x={x + barWidth - 6}
        y={y}
        width={6}
        height={BAR_HEIGHT}
        rx={3}
        fill="rgba(0,0,0,0.25)"
        style={{ cursor: 'ew-resize' }}
        onPointerDown={e => { e.stopPropagation(); resize.onPointerDown(e as unknown as React.PointerEvent) }}
        onPointerMove={e => resize.onPointerMove(e as unknown as React.PointerEvent)}
        onPointerUp={e => resize.onPointerUp(e as unknown as React.PointerEvent)}
      />
    </g>
  )
}
