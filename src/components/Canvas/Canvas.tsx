import type { GanttStore } from '../../state/useGanttStore'
import { useTimelineScale } from '../../hooks/useTimelineScale'
import { resolveTaskPositions } from '../../utils/taskPositions'
import { formatDate, addDays, diffDays } from '../../utils/dateUtils'
import { parseDurationDays } from '../../utils/durationUtils'
import { isDarkActive } from '../../utils/theme'
import { TimelineHeader, HEADER_HEIGHT } from './TimelineHeader'
import { TaskBar } from './TaskBar'
import { MilestoneMarker, TASK_ROW_HEIGHT } from './MilestoneMarker'
import { DependencyArrow, ArrowDefs } from './DependencyArrow'

const SECTION_HEADER_HEIGHT = 28

interface CanvasProps {
  store: GanttStore
  selectedTaskId: string | null
  onSelectTask: (id: string | null) => void
}

export function Canvas({ store, selectedTaskId, onSelectTask }: CanvasProps) {
  const { chart, updateTask, deleteTask } = store
  const scale = useTimelineScale(chart.sections)
  const positions = resolveTaskPositions(chart.sections)

  interface RowInfo {
    type: 'section' | 'task'
    sectionId: string
    taskId?: string
    sectionTitle?: string
    y: number
  }
  const rows: RowInfo[] = []
  let currentY = HEADER_HEIGHT

  for (const section of chart.sections) {
    if (section.title !== '') {
      rows.push({ type: 'section', sectionId: section.id, sectionTitle: section.title, y: currentY })
      currentY += SECTION_HEADER_HEIGHT
    }
    for (const task of section.tasks) {
      rows.push({ type: 'task', sectionId: section.id, taskId: task.id, y: currentY })
      currentY += TASK_ROW_HEIGHT
    }
  }
  const svgHeight = Math.max(currentY - HEADER_HEIGHT, 100)

  const todayX = chart.todayMarker ? scale.dateToX(new Date()) : null
  const allTasks = chart.sections.flatMap(s => s.tasks)

  const isDark = isDarkActive()

  return (
    <div style={{ overflow: 'auto', height: '100%', position: 'relative', background: 'var(--canvas-bg)' }}>
      <TimelineHeader scale={scale} dark={isDark} />

      <svg
        data-testid="canvas-svg"
        aria-hidden="true"
        width={scale.canvasWidth}
        height={svgHeight}
        style={{ display: 'block', overflow: 'visible' }}
        onClick={() => onSelectTask(null)}
      >
        <ArrowDefs />

        <rect x={0} y={0} width={scale.canvasWidth} height={svgHeight} style={{ fill: 'var(--canvas-bg)' }} />

        {/* Weekly grid lines */}
        {Array.from({ length: Math.ceil(scale.totalDays / 7) }, (_, i) => i * 7).map(dayOffset => (
          <line
            key={dayOffset}
            x1={dayOffset * scale.pxPerDay} y1={0}
            x2={dayOffset * scale.pxPerDay} y2={svgHeight}
            style={{ stroke: 'var(--canvas-grid)' }} strokeWidth={1}
          />
        ))}

        {rows.map(row => {
          const svgY = row.y - HEADER_HEIGHT

          if (row.type === 'section') {
            return (
              <g key={`sec-bg-${row.sectionId}`}>
                <rect x={0} y={svgY} width={scale.canvasWidth} height={SECTION_HEADER_HEIGHT} style={{ fill: 'var(--canvas-section-bg)' }} />
                <text
                  x={12} y={svgY + SECTION_HEADER_HEIGHT / 2 + 4}
                  fontSize={11} fontWeight={700} style={{ textTransform: 'uppercase', letterSpacing: 1, fill: 'var(--canvas-section-text)' }}
                >
                  {row.sectionTitle?.toUpperCase()}
                </text>
              </g>
            )
          }

          const task = chart.sections.find(s => s.id === row.sectionId)?.tasks.find(t => t.id === row.taskId)
          if (!task) return null
          const pos = positions.get(task.id)
          if (!pos) return null

          const x = scale.dateToX(pos.startDate)
          const width = scale.durationToPx(pos.durationDays)
          const isSelected = task.id === selectedTaskId
          const handleSelect = (e?: React.MouseEvent) => {
            e?.stopPropagation()
            onSelectTask(task.id)
          }

          if (task.status === 'milestone') {
            return (
              <g key={task.id} transform={`translate(0, ${svgY})`} onClick={e => { e.stopPropagation(); onSelectTask(task.id) }}>
                <MilestoneMarker
                  x={x} label={task.label}
                  color={task.color ?? undefined}
                  selected={isSelected}
                  onSelect={() => onSelectTask(isSelected ? null : task.id)}
                />
              </g>
            )
          }

          return (
            <g key={task.id} transform={`translate(0, ${svgY})`}>
              <TaskBar
                task={task}
                x={x}
                width={width}
                pxPerDay={scale.pxPerDay}
                selected={isSelected}
                onSelect={() => handleSelect()}
                onDragEnd={deltaDays => {
                  if (task.afterTaskIds.length > 0 || task.startDate === null) return
                  try {
                    const newStart = addDays(new Date(task.startDate), deltaDays)
                    updateTask(row.sectionId, task.id, { startDate: formatDate(newStart) })
                  } catch { /* ignore invalid dates */ }
                }}
                onResizeEnd={deltaDays => {
                  const newDays = Math.max(1, pos.durationDays + deltaDays)
                  if (task.endDate !== null) {
                    updateTask(row.sectionId, task.id, { endDate: formatDate(addDays(pos.startDate, newDays)) })
                  } else {
                    const base = task.duration ? parseDurationDays(task.duration) : 1
                    updateTask(row.sectionId, task.id, { duration: `${Math.max(1, base + deltaDays)}d` })
                  }
                }}
                onResizeStartEnd={deltaDays => {
                  if (task.afterTaskIds.length > 0 || task.startDate === null) return
                  const newStart = addDays(new Date(task.startDate), deltaDays)
                  const newDays = task.endDate !== null
                    ? diffDays(newStart, new Date(task.endDate))
                    : (task.duration ? parseDurationDays(task.duration) : 1) - deltaDays
                  if (newDays <= 0) {
                    const confirmed = window.confirm(`"${task.label}" ville bli 0 dager eller kortere. Vil du slette oppgaven?`)
                    if (confirmed) deleteTask(row.sectionId, task.id)
                    return
                  }
                  if (task.endDate !== null) {
                    updateTask(row.sectionId, task.id, { startDate: formatDate(newStart) })
                  } else {
                    updateTask(row.sectionId, task.id, { startDate: formatDate(newStart), duration: `${newDays}d` })
                  }
                }}
              />
            </g>
          )
        })}

        {/* Dependency arrows */}
        {allTasks.flatMap(task =>
          task.afterTaskIds.flatMap(depId => {
            const fromTask = allTasks.find(t => t.id === depId)
            if (!fromTask) return []
            const fromPos = positions.get(fromTask.id)
            const toPos = positions.get(task.id)
            const fromRow = rows.find(r => r.taskId === fromTask.id)
            const toRow = rows.find(r => r.taskId === task.id)
            if (!fromPos || !toPos || !fromRow || !toRow) return []
            return [(
              <DependencyArrow
                key={`dep-${depId}-${task.id}`}
                fromX={scale.dateToX(fromPos.endDate)}
                fromRowY={fromRow.y - HEADER_HEIGHT}
                toX={scale.dateToX(toPos.startDate)}
                toRowY={toRow.y - HEADER_HEIGHT}
              />
            )]
          })
        )}

        {/* Today marker */}
        {todayX !== null && todayX >= 0 && todayX <= scale.canvasWidth && (
          <g style={{ pointerEvents: 'none' }}>
            <line x1={todayX} y1={0} x2={todayX} y2={svgHeight} stroke="#ff6b6b" strokeWidth={1.5} strokeDasharray="4 3" />
            <text x={todayX + 4} y={12} fontSize={10} fill="#ff6b6b" fontWeight={600}>Today</text>
          </g>
        )}
      </svg>
    </div>
  )
}
