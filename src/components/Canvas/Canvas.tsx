import type { GanttStore } from '../../state/useGanttStore'
import { useTimelineScale } from '../../hooks/useTimelineScale'
import { resolveTaskPositions } from '../../utils/taskPositions'
import { formatDate, addDays } from '../../utils/dateUtils'
import { parseDurationDays } from '../../utils/durationUtils'
import { TimelineHeader, HEADER_HEIGHT } from './TimelineHeader'
import { TaskBar } from './TaskBar'
import { MilestoneMarker, TASK_ROW_HEIGHT } from './MilestoneMarker'
import { DependencyArrow, ArrowDefs } from './DependencyArrow'

const SECTION_HEADER_HEIGHT = 28
const SECTION_LABEL_FILL = '#4361ee22'

interface CanvasProps {
  store: GanttStore
}

export function Canvas({ store }: CanvasProps) {
  const { chart, updateTask } = store
  const scale = useTimelineScale(chart.sections)
  const positions = resolveTaskPositions(chart.sections)

  // Build row layout
  interface RowInfo {
    type: 'section' | 'task'
    sectionId: string
    taskId?: string
    y: number
  }
  const rows: RowInfo[] = []
  let currentY = HEADER_HEIGHT

  for (const section of chart.sections) {
    rows.push({ type: 'section', sectionId: section.id, y: currentY })
    currentY += SECTION_HEADER_HEIGHT
    for (const task of section.tasks) {
      rows.push({ type: 'task', sectionId: section.id, taskId: task.id, y: currentY })
      currentY += TASK_ROW_HEIGHT
    }
  }
  const svgHeight = Math.max(currentY - HEADER_HEIGHT, 100)

  return (
    <div style={{ overflow: 'auto', height: '100%', position: 'relative' }}>
      <TimelineHeader scale={scale} />

      <svg
        data-testid="canvas-svg"
        width={scale.canvasWidth}
        height={svgHeight}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <ArrowDefs />

        {/* Weekly grid lines */}
        {Array.from({ length: Math.ceil(scale.totalDays / 7) }, (_, i) => i * 7).map(dayOffset => (
          <line
            key={dayOffset}
            x1={dayOffset * scale.pxPerDay}
            y1={0}
            x2={dayOffset * scale.pxPerDay}
            y2={svgHeight}
            stroke="var(--color-border)"
            strokeWidth={1}
          />
        ))}

        {rows.map(row => {
          const svgY = row.y - HEADER_HEIGHT

          if (row.type === 'section') {
            return (
              <rect
                key={`sec-bg-${row.sectionId}`}
                x={0}
                y={svgY}
                width={scale.canvasWidth}
                height={SECTION_HEADER_HEIGHT}
                fill={SECTION_LABEL_FILL}
              />
            )
          }

          const task = chart.sections
            .find(s => s.id === row.sectionId)
            ?.tasks.find(t => t.id === row.taskId)
          if (!task) return null

          const pos = positions.get(task.id)
          if (!pos) return null

          const x = scale.dateToX(pos.startDate)
          const width = scale.durationToPx(pos.durationDays)

          if (task.status === 'milestone') {
            return (
              <g key={task.id} transform={`translate(0, ${svgY})`}>
                <MilestoneMarker x={x} label={task.label} />
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
                onDragEnd={deltaDays => {
                  if (task.afterTaskId !== null || task.startDate === null) return
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
              />
            </g>
          )
        })}

        {/* Dependency arrows */}
        {chart.sections.flatMap(section =>
          section.tasks
            .filter(t => t.afterTaskId !== null)
            .flatMap(task => {
              const fromTask = chart.sections.flatMap(s => s.tasks).find(t => t.id === task.afterTaskId)
              if (!fromTask) return []
              const fromPos = positions.get(fromTask.id)
              const toPos = positions.get(task.id)
              const fromRow = rows.find(r => r.taskId === fromTask.id)
              const toRow = rows.find(r => r.taskId === task.id)
              if (!fromPos || !toPos || !fromRow || !toRow) return []
              return [(
                <DependencyArrow
                  key={`dep-${fromTask.id}-${task.id}`}
                  fromX={scale.dateToX(fromPos.endDate)}
                  fromRowY={fromRow.y - HEADER_HEIGHT}
                  toX={scale.dateToX(toPos.startDate)}
                  toRowY={toRow.y - HEADER_HEIGHT}
                />
              )]
            })
        )}
      </svg>
    </div>
  )
}
