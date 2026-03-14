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
const CANVAS_BG = '#1a1a2e'
const SECTION_BG = 'rgba(255,255,255,0.04)'
const GRID_COLOR = 'rgba(255,255,255,0.07)'
const SECTION_TEXT_COLOR = 'rgba(255,255,255,0.4)'
const TODAY_COLOR = '#ff6b6b'

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
    sectionTitle?: string
    y: number
  }
  const rows: RowInfo[] = []
  let currentY = HEADER_HEIGHT

  for (const section of chart.sections) {
    // Only show section header row when the section has a title
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

  // Today marker
  const todayX = chart.todayMarker ? scale.dateToX(new Date()) : null

  // Collect all tasks for dependency lookup
  const allTasks = chart.sections.flatMap(s => s.tasks)

  return (
    <div style={{ overflow: 'auto', height: '100%', position: 'relative', background: CANVAS_BG }}>
      <TimelineHeader scale={scale} dark />

      <svg
        data-testid="canvas-svg"
        width={scale.canvasWidth}
        height={svgHeight}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <ArrowDefs />

        {/* Background */}
        <rect x={0} y={0} width={scale.canvasWidth} height={svgHeight} fill={CANVAS_BG} />

        {/* Weekly grid lines */}
        {Array.from({ length: Math.ceil(scale.totalDays / 7) }, (_, i) => i * 7).map(dayOffset => (
          <line
            key={dayOffset}
            x1={dayOffset * scale.pxPerDay}
            y1={0}
            x2={dayOffset * scale.pxPerDay}
            y2={svgHeight}
            stroke={GRID_COLOR}
            strokeWidth={1}
          />
        ))}

        {rows.map(row => {
          const svgY = row.y - HEADER_HEIGHT

          if (row.type === 'section') {
            return (
              <g key={`sec-bg-${row.sectionId}`}>
                <rect
                  x={0}
                  y={svgY}
                  width={scale.canvasWidth}
                  height={SECTION_HEADER_HEIGHT}
                  fill={SECTION_BG}
                />
                <text
                  x={12}
                  y={svgY + SECTION_HEADER_HEIGHT / 2 + 4}
                  fontSize={11}
                  fontWeight={700}
                  fill={SECTION_TEXT_COLOR}
                  style={{ textTransform: 'uppercase', letterSpacing: 1 }}
                >
                  {row.sectionTitle?.toUpperCase()}
                </text>
              </g>
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
                <MilestoneMarker x={x} label={task.label} color={task.color ?? undefined} />
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
              />
            </g>
          )
        })}

        {/* Dependency arrows — one per afterTaskId per task */}
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

        {/* Today marker line */}
        {todayX !== null && todayX >= 0 && todayX <= scale.canvasWidth && (
          <g style={{ pointerEvents: 'none' }}>
            <line
              x1={todayX}
              y1={0}
              x2={todayX}
              y2={svgHeight}
              stroke={TODAY_COLOR}
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <text
              x={todayX + 4}
              y={12}
              fontSize={10}
              fill={TODAY_COLOR}
              fontWeight={600}
            >
              Today
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
