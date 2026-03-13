import { describe, it, expect } from 'vitest'
import { exportToMermaid } from '../../src/model/export'
import type { GanttChart, GanttTask } from '../../src/model/types'

function makeChart(overrides?: Partial<GanttChart>): GanttChart {
  return {
    title: 'Test Chart',
    dateFormat: 'YYYY-MM-DD',
    axisFormat: '%b %d',
    tickInterval: null,
    excludes: null,
    todayMarker: true,
    sections: [],
    ...overrides,
  }
}

function makeTask(overrides?: Partial<GanttTask>): GanttTask {
  return {
    id: 'task_abc12345',
    label: 'My Task',
    status: null,
    startDate: '2024-01-01',
    endDate: null,
    duration: '3d',
    afterTaskId: null,
    ...overrides,
  }
}

describe('exportToMermaid', () => {
  it('produces a gantt header', () => {
    const result = exportToMermaid(makeChart())
    expect(result).toMatch(/^gantt/)
    expect(result).toContain('title Test Chart')
    expect(result).toContain('dateFormat YYYY-MM-DD')
    expect(result).toContain('axisFormat %b %d')
  })

  it('omits tickInterval when null', () => {
    const result = exportToMermaid(makeChart({ tickInterval: null }))
    expect(result).not.toContain('tickInterval')
  })

  it('includes tickInterval when set', () => {
    const result = exportToMermaid(makeChart({ tickInterval: '1week' }))
    expect(result).toContain('tickInterval 1week')
  })

  it('includes excludes when set', () => {
    const result = exportToMermaid(makeChart({ excludes: 'weekends' }))
    expect(result).toContain('excludes weekends')
  })

  it('includes todayMarker off when false', () => {
    const result = exportToMermaid(makeChart({ todayMarker: false }))
    expect(result).toContain('todayMarker off')
  })

  it('omits todayMarker when true', () => {
    const result = exportToMermaid(makeChart({ todayMarker: true }))
    expect(result).not.toContain('todayMarker')
  })

  it('omits sections with no tasks', () => {
    const chart = makeChart({
      sections: [{ id: 'sec1', title: 'Empty', tasks: [] }],
    })
    const result = exportToMermaid(chart)
    expect(result).not.toContain('section Empty')
  })

  it('renders a plain task with startDate and duration', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1',
        title: 'Phase 1',
        tasks: [makeTask()],
      }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('section Phase 1')
    expect(result).toContain('My Task    :task_abc12345, 2024-01-01, 3d')
  })

  it('renders a task with status tag', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1',
        title: 'Phase 1',
        tasks: [makeTask({ status: 'crit' })],
      }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain(':crit, task_abc12345, 2024-01-01, 3d')
  })

  it('prefers endDate over duration', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1',
        title: 'Phase 1',
        tasks: [makeTask({ endDate: '2024-01-10', duration: '3d' })],
      }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('2024-01-10')
    expect(result).not.toContain('3d')
  })

  it('prefers afterTaskId over startDate', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1',
        title: 'Phase 1',
        tasks: [makeTask({ afterTaskId: 'task_prev0001', startDate: '2024-01-01' })],
      }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('after task_prev0001')
    expect(result).not.toContain('2024-01-01')
  })

  it('milestone with no duration gets 0d', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1',
        title: 'Milestones',
        tasks: [makeTask({ status: 'milestone', duration: null, endDate: null })],
      }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain(':milestone, task_abc12345, 2024-01-01, 0d')
  })

  it('done task renders correctly', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1',
        title: 'Phase 1',
        tasks: [makeTask({ status: 'done' })],
      }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain(':done, task_abc12345')
  })

  it('active task renders correctly', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1',
        title: 'Phase 1',
        tasks: [makeTask({ status: 'active' })],
      }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain(':active, task_abc12345')
  })

  it('multiple sections render in order', () => {
    const chart = makeChart({
      sections: [
        { id: 'sec1', title: 'Phase 1', tasks: [makeTask({ id: 'task_a', label: 'A' })] },
        { id: 'sec2', title: 'Phase 2', tasks: [makeTask({ id: 'task_b', label: 'B' })] },
      ],
    })
    const result = exportToMermaid(chart)
    const p1 = result.indexOf('section Phase 1')
    const p2 = result.indexOf('section Phase 2')
    expect(p1).toBeLessThan(p2)
  })
})
