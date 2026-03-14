import type { GanttChart, GanttSection, GanttTask, TaskStatus } from './types'

/**
 * Convert a GanttChart data model to a valid Mermaid Gantt syntax string.
 *
 * Rules:
 * - afterTaskIds takes priority over startDate
 * - endDate takes priority over duration
 * - Milestones get "0d" duration when neither endDate nor duration is set
 * - Sections with no tasks are omitted
 * - Sections with empty title emit tasks without a "section" header (ungrouped)
 * - crit+active / crit+done emit two comma-separated tags
 * - clickUrl emits "click <id> href \"<url>\"" directives
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
  if (chart.weekday !== null) {
    lines.push(`    weekday ${chart.weekday}`)
  }
  if (!chart.todayMarker) {
    lines.push(`    todayMarker off`)
  }

  for (const section of chart.sections) {
    if (section.tasks.length === 0) continue
    lines.push('')
    // Ungrouped section (empty title) — omit the section header line
    if (section.title !== '') {
      lines.push(`    section ${section.title}`)
    }
    for (const task of section.tasks) {
      lines.push(`    ${formatTask(task)}`)
    }
    // click directives (must come after all tasks in the section)
    for (const task of section.tasks) {
      if (task.clickUrl !== null && task.clickUrl !== '') {
        lines.push(`    click ${task.id} href "${task.clickUrl}"`)
      }
    }
  }

  return lines.join('\n')
}

/** Expand a combined status into its Mermaid tags. */
function statusTags(status: TaskStatus | null): string[] {
  if (status === null) return []
  if (status === 'crit+active') return ['crit', 'active']
  if (status === 'crit+done') return ['crit', 'done']
  return [status]
}

function formatTask(task: GanttTask): string {
  const parts: string[] = []

  // Status tag(s)
  parts.push(...statusTags(task.status))

  // ID
  parts.push(task.id)

  // Start: afterTaskIds takes priority
  if (task.afterTaskIds.length > 0) {
    parts.push(`after ${task.afterTaskIds.join(' ')}`)
  } else if (task.startDate !== null) {
    parts.push(task.startDate)
  } else {
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
