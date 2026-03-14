import type { GanttSection } from '../model/types'
import { parseDate, addDays, formatDate } from './dateUtils'
import { parseDurationDays } from './durationUtils'

export interface ResolvedPosition {
  startDate: Date
  endDate: Date
  durationDays: number
}

/**
 * Resolve the visual start/end position for every task in the chart,
 * following afterTaskIds chains. Circular references are broken at depth 32.
 *
 * Returns a Map keyed by task ID.
 */
export function resolveTaskPositions(sections: GanttSection[]): Map<string, ResolvedPosition> {
  const allTasks = sections.flatMap(s => s.tasks)
  const taskMap = new Map(allTasks.map(t => [t.id, t]))
  const resolved = new Map<string, ResolvedPosition>()

  const fallbackStart = new Date()

  function resolve(taskId: string, depth = 0): ResolvedPosition {
    if (resolved.has(taskId)) return resolved.get(taskId)!
    if (depth > 32) {
      const start = fallbackStart
      const end = addDays(start, 1)
      return { startDate: start, endDate: end, durationDays: 1 }
    }

    const task = taskMap.get(taskId)
    if (!task) {
      const start = fallbackStart
      const end = addDays(start, 1)
      return { startDate: start, endDate: end, durationDays: 1 }
    }

    let startDate: Date

    if (task.afterTaskIds.length > 0) {
      // Start after the latest end date among all predecessors
      let latestEnd = new Date(0)
      for (const depId of task.afterTaskIds) {
        const dep = resolve(depId, depth + 1)
        if (dep.endDate > latestEnd) latestEnd = dep.endDate
      }
      startDate = latestEnd
    } else if (task.startDate !== null) {
      try {
        startDate = parseDate(task.startDate)
      } catch {
        startDate = fallbackStart
      }
    } else {
      startDate = fallbackStart
    }

    let endDate: Date
    let durationDays: number

    if (task.endDate !== null) {
      try {
        endDate = parseDate(task.endDate)
        durationDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000))
      } catch {
        durationDays = 1
        endDate = addDays(startDate, 1)
      }
    } else if (task.duration !== null) {
      durationDays = parseDurationDays(task.duration)
      endDate = addDays(startDate, durationDays)
    } else if (task.status === 'milestone') {
      durationDays = 0
      endDate = startDate
    } else {
      durationDays = 1
      endDate = addDays(startDate, 1)
    }

    const pos: ResolvedPosition = { startDate, endDate, durationDays }
    resolved.set(taskId, pos)
    return pos
  }

  for (const task of allTasks) {
    resolve(task.id)
  }

  return resolved
}

/**
 * Return the earliest start and latest end across all resolved positions,
 * with optional padding in days.
 */
export function getChartDateRange(
  positions: Map<string, ResolvedPosition>,
  paddingDays = 2,
): { start: Date; end: Date } {
  let minMs = Infinity
  let maxMs = -Infinity

  for (const pos of positions.values()) {
    if (pos.startDate.getTime() < minMs) minMs = pos.startDate.getTime()
    if (pos.endDate.getTime() > maxMs) maxMs = pos.endDate.getTime()
  }

  if (!isFinite(minMs)) {
    const today = new Date()
    return {
      start: addDays(today, -paddingDays),
      end: addDays(today, 30 + paddingDays),
    }
  }

  return {
    start: addDays(new Date(minMs), -paddingDays),
    end: addDays(new Date(maxMs), paddingDays),
  }
}

export { formatDate }
