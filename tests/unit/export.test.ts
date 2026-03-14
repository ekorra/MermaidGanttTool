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
    weekday: null,
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
    afterTaskIds: [],
    clickUrl: null,
    color: null,
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

  it('includes weekday when set', () => {
    const result = exportToMermaid(makeChart({ weekday: 'monday' }))
    expect(result).toContain('weekday monday')
  })

  it('omits weekday when null', () => {
    const result = exportToMermaid(makeChart({ weekday: null }))
    expect(result).not.toContain('weekday')
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
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask()] }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('section Phase 1')
    expect(result).toContain('My Task    :task_abc12345, 2024-01-01, 3d')
  })

  it('renders a task with crit status', () => {
    const chart = makeChart({
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask({ status: 'crit' })] }],
    })
    expect(exportToMermaid(chart)).toContain(':crit, task_abc12345, 2024-01-01, 3d')
  })

  it('renders combined crit+active as two tags', () => {
    const chart = makeChart({
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask({ status: 'crit+active' })] }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain(':crit, active, task_abc12345')
  })

  it('renders combined crit+done as two tags', () => {
    const chart = makeChart({
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask({ status: 'crit+done' })] }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain(':crit, done, task_abc12345')
  })

  it('prefers endDate over duration', () => {
    const chart = makeChart({
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask({ endDate: '2024-01-10', duration: '3d' })] }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('2024-01-10')
    expect(result).not.toContain('3d')
  })

  it('prefers afterTaskIds over startDate (single)', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1', title: 'Phase 1',
        tasks: [makeTask({ afterTaskIds: ['task_prev0001'], startDate: '2024-01-01' })],
      }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('after task_prev0001')
    expect(result).not.toContain('2024-01-01')
  })

  it('emits multiple after ids when afterTaskIds has two entries', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1', title: 'Phase 1',
        tasks: [makeTask({ afterTaskIds: ['task_a', 'task_b'] })],
      }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('after task_a task_b')
  })

  it('milestone with no duration gets 0d', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1', title: 'Milestones',
        tasks: [makeTask({ status: 'milestone', duration: null, endDate: null })],
      }],
    })
    expect(exportToMermaid(chart)).toContain(':milestone, task_abc12345, 2024-01-01, 0d')
  })

  it('emits click directive when clickUrl is set', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1', title: 'Phase 1',
        tasks: [makeTask({ clickUrl: 'https://example.com' })],
      }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('click task_abc12345 href "https://example.com"')
  })

  it('does not emit click directive when clickUrl is null', () => {
    const chart = makeChart({
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask()] }],
    })
    expect(exportToMermaid(chart)).not.toContain('click')
  })

  it('ungrouped section (empty title) omits section header', () => {
    const chart = makeChart({
      sections: [{ id: 'sec1', title: '', tasks: [makeTask()] }],
    })
    const result = exportToMermaid(chart)
    expect(result).not.toContain('section ')
    expect(result).toContain('My Task')
  })

  it('done task renders correctly', () => {
    const chart = makeChart({
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask({ status: 'done' })] }],
    })
    expect(exportToMermaid(chart)).toContain(':done, task_abc12345')
  })

  it('active task renders correctly', () => {
    const chart = makeChart({
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask({ status: 'active' })] }],
    })
    expect(exportToMermaid(chart)).toContain(':active, task_abc12345')
  })

  it('multiple sections render in order', () => {
    const chart = makeChart({
      sections: [
        { id: 'sec1', title: 'Phase 1', tasks: [makeTask({ id: 'task_a', label: 'A' })] },
        { id: 'sec2', title: 'Phase 2', tasks: [makeTask({ id: 'task_b', label: 'B' })] },
      ],
    })
    const result = exportToMermaid(chart)
    expect(result.indexOf('section Phase 1')).toBeLessThan(result.indexOf('section Phase 2'))
  })
})

describe('date format conversion', () => {
  it('converts ISO dates to DD-MM-YYYY on export', () => {
    const chart = makeChart({
      dateFormat: 'DD-MM-YYYY',
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask({ startDate: '2024-03-15', endDate: '2024-04-01' })] }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('15-03-2024')
    expect(result).toContain('01-04-2024')
    expect(result).not.toContain('2024-03-15')
  })

  it('converts ISO dates to MM/DD/YYYY on export', () => {
    const chart = makeChart({
      dateFormat: 'MM/DD/YYYY',
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask({ startDate: '2024-03-15', endDate: null, duration: '3d' })] }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('03/15/2024')
    expect(result).not.toContain('2024-03-15')
  })

  it('keeps ISO format when dateFormat is YYYY-MM-DD', () => {
    const chart = makeChart({
      dateFormat: 'YYYY-MM-DD',
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask({ startDate: '2024-03-15' })] }],
    })
    expect(exportToMermaid(chart)).toContain('2024-03-15')
  })

  it('does not convert dates in afterTaskIds (no date there)', () => {
    const chart = makeChart({
      dateFormat: 'DD-MM-YYYY',
      sections: [{ id: 'sec1', title: 'Phase 1', tasks: [makeTask({ afterTaskIds: ['task_prev'], startDate: '2024-03-15' })] }],
    })
    const result = exportToMermaid(chart)
    expect(result).toContain('after task_prev')
    expect(result).not.toContain('15-03-2024')
  })
})

describe('milestone export', () => {
  it('milestone with duration set still emits 0d', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1', title: 'Phase 1',
        tasks: [makeTask({ status: 'milestone', duration: '3d', endDate: null })],
      }],
    })
    expect(exportToMermaid(chart)).toContain(':milestone, task_abc12345, 2024-01-01, 0d')
  })

  it('milestone with endDate set still emits 0d', () => {
    const chart = makeChart({
      sections: [{
        id: 'sec1', title: 'Phase 1',
        tasks: [makeTask({ status: 'milestone', duration: null, endDate: '2024-01-10' })],
      }],
    })
    expect(exportToMermaid(chart)).toContain(':milestone, task_abc12345, 2024-01-01, 0d')
  })
})
