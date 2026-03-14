import { describe, it, expect } from 'vitest'
import { parseGantt, isMermaidGantt } from '../../src/model/import'

// A minimal valid Mermaid Gantt produced by exportToMermaid()
const BASIC_SYNTAX = `gantt
    title My Project
    dateFormat DD-MM-YYYY
    axisFormat %b %d

    section Phase 1
    Task A    :active, taskA, 01-01-2024, 7d
    Task B    :taskB, after taskA, 3d`

describe('isMermaidGantt', () => {
  it('returns true for valid gantt string', () => {
    expect(isMermaidGantt('gantt\n    title Foo')).toBe(true)
  })

  it('is case-insensitive for the gantt keyword', () => {
    expect(isMermaidGantt('GANTT\n    title Foo')).toBe(true)
  })

  it('ignores leading whitespace', () => {
    expect(isMermaidGantt('  gantt\n    title Foo')).toBe(true)
  })

  it('returns false for non-gantt text', () => {
    expect(isMermaidGantt('graph LR\n    A --> B')).toBe(false)
    expect(isMermaidGantt('')).toBe(false)
    expect(isMermaidGantt('hello world')).toBe(false)
  })
})

describe('parseGantt', () => {
  it('returns null for non-gantt input', () => {
    expect(parseGantt('graph LR\n A --> B')).toBeNull()
    expect(parseGantt('')).toBeNull()
  })

  it('parses title and dateFormat', () => {
    const chart = parseGantt(BASIC_SYNTAX)
    expect(chart).not.toBeNull()
    expect(chart!.title).toBe('My Project')
    expect(chart!.dateFormat).toBe('DD-MM-YYYY')
  })

  it('parses axisFormat', () => {
    const chart = parseGantt(BASIC_SYNTAX)
    expect(chart!.axisFormat).toBe('%b %d')
  })

  it('parses sections and tasks', () => {
    const chart = parseGantt(BASIC_SYNTAX)
    expect(chart!.sections).toHaveLength(1)
    expect(chart!.sections[0]!.title).toBe('Phase 1')
    expect(chart!.sections[0]!.tasks).toHaveLength(2)
  })

  it('parses task label and id', () => {
    const chart = parseGantt(BASIC_SYNTAX)
    const taskA = chart!.sections[0]!.tasks[0]!
    expect(taskA.label).toBe('Task A')
    expect(taskA.id).toBe('taskA')
  })

  it('parses task status', () => {
    const chart = parseGantt(BASIC_SYNTAX)
    expect(chart!.sections[0]!.tasks[0]!.status).toBe('active')
  })

  it('parses startDate (converted to ISO)', () => {
    const chart = parseGantt(BASIC_SYNTAX)
    expect(chart!.sections[0]!.tasks[0]!.startDate).toBe('2024-01-01')
  })

  it('parses duration', () => {
    const chart = parseGantt(BASIC_SYNTAX)
    expect(chart!.sections[0]!.tasks[0]!.duration).toBe('7d')
  })

  it('parses afterTaskIds', () => {
    const chart = parseGantt(BASIC_SYNTAX)
    const taskB = chart!.sections[0]!.tasks[1]!
    expect(taskB.afterTaskIds).toEqual(['taskA'])
    expect(taskB.startDate).toBeNull()
  })

  it('parses crit status', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n\n    Crit task    :crit, t1, 2024-01-01, 2d`
    const chart = parseGantt(syntax)
    expect(chart!.sections[0]!.tasks[0]!.status).toBe('crit')
  })

  it('parses crit+active status', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n\n    Crit active    :crit, active, t1, 2024-01-01, 2d`
    const chart = parseGantt(syntax)
    expect(chart!.sections[0]!.tasks[0]!.status).toBe('crit+active')
  })

  it('parses crit+done status', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n\n    Crit done    :crit, done, t1, 2024-01-01, 2d`
    const chart = parseGantt(syntax)
    expect(chart!.sections[0]!.tasks[0]!.status).toBe('crit+done')
  })

  it('parses milestone (0d end field ignored)', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n\n    M1    :milestone, m1, 2024-03-01, 0d`
    const chart = parseGantt(syntax)
    const task = chart!.sections[0]!.tasks[0]!
    expect(task.status).toBe('milestone')
    expect(task.duration).toBeNull()
    expect(task.endDate).toBeNull()
  })

  it('parses endDate', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n\n    Task    :t1, 2024-01-01, 2024-01-10`
    const chart = parseGantt(syntax)
    expect(chart!.sections[0]!.tasks[0]!.endDate).toBe('2024-01-10')
    expect(chart!.sections[0]!.tasks[0]!.duration).toBeNull()
  })

  it('parses todayMarker off', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n    todayMarker off\n\n    T1    :t1, 2024-01-01, 1d`
    const chart = parseGantt(syntax)
    expect(chart!.todayMarker).toBe(false)
  })

  it('parses tickInterval and excludes', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n    tickInterval 1week\n    excludes weekends\n\n    T1    :t1, 2024-01-01, 1d`
    const chart = parseGantt(syntax)
    expect(chart!.tickInterval).toBe('1week')
    expect(chart!.excludes).toBe('weekends')
  })

  it('parses weekday directive', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n    weekday monday\n\n    T1    :t1, 2024-01-01, 1d`
    const chart = parseGantt(syntax)
    expect(chart!.weekday).toBe('monday')
  })

  it('parses click href directives and attaches URLs to tasks', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n\n    Task    :t1, 2024-01-01, 1d\n    click t1 href "https://example.com"`
    const chart = parseGantt(syntax)
    expect(chart!.sections[0]!.tasks[0]!.clickUrl).toBe('https://example.com')
  })

  it('handles multiple sections', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n\n    section Alpha\n    A1    :a1, 2024-01-01, 1d\n\n    section Beta\n    B1    :b1, 2024-02-01, 2d`
    const chart = parseGantt(syntax)
    expect(chart!.sections).toHaveLength(2)
    expect(chart!.sections[0]!.title).toBe('Alpha')
    expect(chart!.sections[1]!.title).toBe('Beta')
  })

  it('handles tasks without a section header (ungrouped)', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n\n    T1    :t1, 2024-01-01, 1d`
    const chart = parseGantt(syntax)
    expect(chart!.sections).toHaveLength(1)
    expect(chart!.sections[0]!.title).toBe('')
  })

  it('parses multiple afterTaskIds', () => {
    const syntax = `gantt\n    title T\n    dateFormat YYYY-MM-DD\n    axisFormat %d\n\n    A    :a, 2024-01-01, 1d\n    B    :b, 2024-01-01, 1d\n    C    :c, after a b, 1d`
    const chart = parseGantt(syntax)
    expect(chart!.sections[0]!.tasks[2]!.afterTaskIds).toEqual(['a', 'b'])
  })

  it('round-trips exportToMermaid output', async () => {
    const { exportToMermaid } = await import('../../src/model/export')
    const { createChart, createTask, createSection } = await import('../../src/model/defaults')
    const chart = createChart()
    const section = createSection('Phase 1')
    section.tasks.push(createTask({ label: 'Task A', startDate: '2024-01-01', duration: '5d' }))
    section.tasks.push(createTask({ label: 'Task B', status: 'done', startDate: '2024-01-08', endDate: '2024-01-12' }))
    chart.sections = [section]

    const syntax = exportToMermaid(chart)
    const reparsed = parseGantt(syntax)

    expect(reparsed).not.toBeNull()
    expect(reparsed!.title).toBe(chart.title)
    expect(reparsed!.sections).toHaveLength(1)
    expect(reparsed!.sections[0]!.tasks).toHaveLength(2)
    expect(reparsed!.sections[0]!.tasks[0]!.label).toBe('Task A')
    expect(reparsed!.sections[0]!.tasks[1]!.status).toBe('done')
  })
})
