import { useDrag } from '../../hooks/useDrag'
import { useResize } from '../../hooks/useResize'
import { TASK_ROW_HEIGHT, STATUS_COLORS } from './MilestoneMarker'
import type { GanttTask } from '../../model/types'

export const BAR_PADDING_Y = 6
const BAR_HEIGHT = TASK_ROW_HEIGHT - BAR_PADDING_Y * 2
const MIN_WIDTH = 8
const HANDLE_HIT = 12  // invisible hit area width for each edge handle

interface TaskBarProps {
  task: GanttTask
  x: number
  width: number
  pxPerDay: number
  selected: boolean
  onSelect: () => void
  onDragEnd: (deltaDays: number) => void
  onResizeEnd: (deltaDays: number) => void
  onResizeStartEnd: (deltaDays: number) => void
}

export function TaskBar({ task, x, width, pxPerDay, selected, onSelect, onDragEnd, onResizeEnd, onResizeStartEnd }: TaskBarProps) {
  const drag = useDrag({ onDragEnd, pxPerDay })
  const resizeRight = useResize({ onResizeEnd, pxPerDay })
  const resizeLeft = useResize({ onResizeEnd: onResizeStartEnd, pxPerDay })

  const color = task.color ?? STATUS_COLORS[task.status ?? 'default'] ?? STATUS_COLORS['default']!
  const barWidth = Math.max(MIN_WIDTH, width)
  const y = BAR_PADDING_Y

  const handlePointerUp = (e: React.PointerEvent<SVGRectElement>) => {
    drag.onPointerUp(e)
    if (!drag.wasDragged()) {
      onSelect()
    }
  }

  return (
    <g style={{ cursor: 'grab' }} onClick={e => e.stopPropagation()}>
      {/* Selection highlight */}
      {selected && (
        <rect
          x={x - 2}
          y={y - 2}
          width={barWidth + 2}
          height={BAR_HEIGHT + 4}
          rx={5}
          fill="none"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth={2}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Main bar — handles drag + click */}
      <rect
        data-testid={`task-bar-${task.label}`}
        x={x}
        y={y}
        width={barWidth}
        height={BAR_HEIGHT}
        rx={3}
        fill={color}
        style={{ cursor: 'grab' }}
        onPointerDown={drag.onPointerDown}
        onPointerMove={drag.onPointerMove}
        onPointerUp={handlePointerUp}
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

      {/* Left edge resize handle (invisible, wider hit area) */}
      <rect
        x={x - HANDLE_HIT / 2}
        y={y}
        width={HANDLE_HIT}
        height={BAR_HEIGHT}
        fill="transparent"
        style={{ cursor: 'ew-resize' }}
        onPointerDown={e => { e.stopPropagation(); resizeLeft.onPointerDown(e as unknown as React.PointerEvent) }}
        onPointerMove={e => resizeLeft.onPointerMove(e as unknown as React.PointerEvent)}
        onPointerUp={e => resizeLeft.onPointerUp(e as unknown as React.PointerEvent)}
      />

      {/* Right edge resize handle (invisible, wider hit area) */}
      <rect
        x={x + barWidth - HANDLE_HIT / 2}
        y={y}
        width={HANDLE_HIT}
        height={BAR_HEIGHT}
        fill="transparent"
        style={{ cursor: 'ew-resize' }}
        onPointerDown={e => { e.stopPropagation(); resizeRight.onPointerDown(e as unknown as React.PointerEvent) }}
        onPointerMove={e => resizeRight.onPointerMove(e as unknown as React.PointerEvent)}
        onPointerUp={e => resizeRight.onPointerUp(e as unknown as React.PointerEvent)}
      />
    </g>
  )
}
