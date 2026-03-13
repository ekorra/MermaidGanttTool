import type { GanttChart, GanttSection, GanttTask } from './types'
import { generateId } from '../utils/idUtils'
import { formatDate, addDays } from '../utils/dateUtils'

/** Create a new task with sensible defaults. */
export function createTask(partial?: Partial<GanttTask>): GanttTask {
  const today = formatDate(new Date())
  return {
    id: generateId('task'),
    label: 'New Task',
    status: null,
    startDate: today,
    endDate: null,
    duration: '3d',
    afterTaskId: null,
    ...partial,
  }
}

/** Create a new section with an optional title. */
export function createSection(title = 'New Section'): GanttSection {
  return {
    id: generateId('sec'),
    title,
    tasks: [],
  }
}

/** Create a new chart with sensible defaults and one sample section. */
export function createChart(title = 'My Project'): GanttChart {
  const today = new Date()
  const start = formatDate(today)
  const week2 = formatDate(addDays(today, 7))
  const week3 = formatDate(addDays(today, 14))

  const sectionId = generateId('sec')
  const task1Id = generateId('task')
  const task2Id = generateId('task')
  const task3Id = generateId('task')

  return {
    title,
    dateFormat: 'YYYY-MM-DD',
    axisFormat: '%b %d',
    tickInterval: '1week',
    excludes: null,
    todayMarker: true,
    sections: [
      {
        id: sectionId,
        title: 'Phase 1',
        tasks: [
          {
            id: task1Id,
            label: 'Design',
            status: 'done',
            startDate: start,
            endDate: null,
            duration: '5d',
            afterTaskId: null,
          },
          {
            id: task2Id,
            label: 'Development',
            status: 'active',
            startDate: week2,
            endDate: null,
            duration: '7d',
            afterTaskId: task1Id,
          },
          {
            id: task3Id,
            label: 'Launch',
            status: 'milestone',
            startDate: week3,
            endDate: null,
            duration: null,
            afterTaskId: task2Id,
          },
        ],
      },
    ],
  }
}
