import type { GanttChart, GanttSection, GanttTask } from './types'

/**
 * Convert a GanttChart data model to a valid Mermaid Gantt syntax string.
 *
 * Rules:
 * - afterTaskId takes priority over startDate
 * - endDate takes priority over duration
 * - Milestones get "0d" duration when neither endDate nor duration is set
 * - Sections with no tasks are omitted
 */
export function exportToMermaid(chart: GanttChart): string {
  const lines: string[] = ['gantt']

  lines.push(`    title ${chart.title}`)
  lines.push(`    dateFormat ${chart.dateFormat}`)
  lines.push(`    axisFormat ${chart.axisFormat}`)

  if (chart.tickInterval !== null) {
    lines.push(`    tickInterval ${chart.tickInterval}`)
  }
  if (chart.excludes !== null) {
    lines.push(`    excludes ${chart.excludes}`)
  }
  if (!chart.todayMarker) {
    lines.push(`    todayMarker off`)
  }

  for (const section of chart.sections) {
    if (section.tasks.length === 0) continue
    lines.push('')
    lines.push(`    section ${section.title}`)
    for (const task of section.tasks) {
      lines.push(`    ${formatTask(task)}`)
    }
  }

  return lines.join('\n')
}

function formatTask(task: GanttTask): string {
  const parts: string[] = []

  // Status tag
  if (task.status !== null) {
    parts.push(task.status)
  }

  // ID
  parts.push(task.id)

  // Start: afterTaskId takes priority
  if (task.afterTaskId !== null) {
    parts.push(`after ${task.afterTaskId}`)
  } else if (task.startDate !== null) {
    parts.push(task.startDate)
  } else {
    // Fallback: no start info — use a placeholder (should not happen in practice)
    parts.push('0d')
  }

  // End/duration: endDate takes priority
  if (task.endDate !== null) {
    parts.push(task.endDate)
  } else if (task.duration !== null) {
    parts.push(task.duration)
  } else if (task.status === 'milestone') {
    parts.push('0d')
  } else {
    parts.push('1d')
  }

  const tagsPart = parts.join(', ')
  return `${task.label}    :${tagsPart}`
}

// Re-export types used by consumers so they only need to import from model/
export type { GanttChart, GanttSection, GanttTask }
