import { describe, it, expect } from 'vitest'
import { createTask, createSection, createChart } from '../../src/model/defaults'

describe('createTask', () => {
  it('returns a task with required fields', () => {
    const task = createTask()
    expect(task.id).toMatch(/^task_[a-f0-9]{8}$/)
    expect(task.label).toBe('New Task')
    expect(task.status).toBeNull()
    expect(typeof task.startDate).toBe('string')
  })

  it('allows partial override', () => {
    const task = createTask({ label: 'Design', status: 'crit' })
    expect(task.label).toBe('Design')
    expect(task.status).toBe('crit')
    expect(task.id).toMatch(/^task_/)
  })

  it('id has no whitespace', () => {
    const task = createTask()
    expect(task.id).not.toMatch(/\s/)
  })
})

describe('createSection', () => {
  it('returns a section with default title', () => {
    const section = createSection()
    expect(section.title).toBe('New Section')
    expect(section.tasks).toEqual([])
    expect(section.id).toMatch(/^sec_/)
  })

  it('accepts a custom title', () => {
    const section = createSection('Phase 2')
    expect(section.title).toBe('Phase 2')
  })
})

describe('createChart', () => {
  it('returns a chart with required fields', () => {
    const chart = createChart()
    expect(chart.title).toBe('My Project')
    expect(chart.dateFormat).toBe('YYYY-MM-DD')
    expect(chart.sections.length).toBeGreaterThan(0)
  })

  it('accepts a custom title', () => {
    const chart = createChart('Q1 Roadmap')
    expect(chart.title).toBe('Q1 Roadmap')
  })

  it('sample tasks have valid ids (no whitespace)', () => {
    const chart = createChart()
    for (const section of chart.sections) {
      for (const task of section.tasks) {
        expect(task.id).not.toMatch(/\s/)
      }
    }
  })
})
