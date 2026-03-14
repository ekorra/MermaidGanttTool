import type { GanttChart, GanttSection, GanttTask, TaskStatus, DateFormat } from './types'

/**
 * Convert a GanttChart data model to a valid Mermaid Gantt syntax string.
 *
 * Internal dates are always stored as YYYY-MM-DD (ISO).
 * This function converts them to chart.dateFormat on output.
 *
 * Rules:
 * - afterTaskIds takes priority over startDate
 * - endDate takes priority over duration
 * - Milestones get "0d" duration when neither endDate nor duration is set
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
    if (section.title !== '') {
      lines.push(`    section ${section.title}`)
    }
    for (const task of section.tasks) {
      lines.push(`    ${formatTask(task, chart.dateFormat)}`)
    }
    for (const task of section.tasks) {
      if (task.clickUrl !== null && task.clickUrl !== '') {
        lines.push(`    click ${task.id} href "${task.clickUrl}"`)
      }
    }
  }

  return lines.join('\n')
}

/**
 * Convert an internally stored ISO date (YYYY-MM-DD) to the chart's dateFormat.
 * Returns the original string if it cannot be parsed (safe fallback).
 */
function toMermaidDate(isoDate: string, dateFormat: DateFormat): string {
  const parts = isoDate.split('-')
  if (parts.length !== 3) return isoDate
  const [year, month, day] = parts
  if (!year || !month || !day) return isoDate
  switch (dateFormat) {
    case 'YYYY-MM-DD': return isoDate
    case 'MM/DD/YYYY': return `${month}/${day}/${year}`
    case 'DD-MM-YYYY': return `${day}-${month}-${year}`
    case 'DD/MM/YYYY': return `${day}/${month}/`
  }
}

function statusTags(status: TaskStatus | null): string[] {
  if (status === null) return []
  if (status === 'crit+active') return ['crit', 'active']
  if (status === 'crit+done') return ['crit', 'done']
  return [status]
}

function formatTask(task: GanttTask, dateFormat: DateFormat): string {
  const parts: string[] = []

  parts.push(...statusTags(task.status))
  parts.push(task.id)

  if (task.afterTaskIds.length > 0) {
    parts.push(`after ${task.afterTaskIds.join(' ')}`)
  } else if (task.startDate !== null) {
    parts.push(toMermaidDate(task.startDate, dateFormat))
  } else {
    parts.push('0d')
  }

  if (task.endDate !== null) {
    parts.push(toMermaidDate(task.endDate, dateFormat))
  } else if (task.duration !== null) {
    parts.push(task.duration)
  } else if (task.status === 'milestone') {
    parts.push('0d')
  } else {
    parts.push('1d')
  }

  return `${task.label}    :${parts.join(', ')}`
}

export type { GanttChart, GanttSection, GanttTask }
