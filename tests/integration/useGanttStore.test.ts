import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGanttStore } from '../../src/state/useGanttStore'
import { createChart, createSection, createTask } from '../../src/model/defaults'
import type { GanttChart } from '../../src/model/types'

function makeMinimalChart(): GanttChart {
  const section = createSection('Phase 1')
  const task = createTask({ label: 'Task A', startDate: '2024-01-01', duration: '3d' })
  section.tasks = [task]
  return {
    ...createChart('Test Project'),
    sections: [section],
  }
}

describe('useGanttStore', () => {
  describe('chart meta', () => {
    it('updateChartMeta updates title', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      act(() => result.current.updateChartMeta({ title: 'New Title' }))
      expect(result.current.chart.title).toBe('New Title')
    })

    it('updateChartMeta updates dateFormat', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      act(() => result.current.updateChartMeta({ dateFormat: 'MM/DD/YYYY' }))
      expect(result.current.chart.dateFormat).toBe('MM/DD/YYYY')
    })

    it('updateChartMeta updates weekday', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      act(() => result.current.updateChartMeta({ weekday: 'monday' }))
      expect(result.current.chart.weekday).toBe('monday')
    })

    it('mermaidSyntax updates when title changes', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      act(() => result.current.updateChartMeta({ title: 'Roadmap Q1' }))
      expect(result.current.mermaidSyntax).toContain('title Roadmap Q1')
    })
  })

  describe('sections', () => {
    it('addSection appends a new section', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      const initialCount = result.current.chart.sections.length
      act(() => result.current.addSection('Phase 2'))
      expect(result.current.chart.sections).toHaveLength(initialCount + 1)
      expect(result.current.chart.sections.at(-1)?.title).toBe('Phase 2')
    })

    it('updateSection renames a section', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      const sectionId = result.current.chart.sections[0]!.id
      act(() => result.current.updateSection(sectionId, { title: 'Renamed' }))
      expect(result.current.chart.sections[0]?.title).toBe('Renamed')
    })

    it('deleteSection removes the section', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      const sectionId = result.current.chart.sections[0]!.id
      act(() => result.current.deleteSection(sectionId))
      expect(result.current.chart.sections).toHaveLength(0)
    })

    it('reorderSections swaps section order', () => {
      const chart = makeMinimalChart()
      chart.sections = [createSection('A'), createSection('B'), createSection('C')]
      const { result } = renderHook(() => useGanttStore(chart))
      const firstId = result.current.chart.sections[0]!.id
      act(() => result.current.reorderSections(0, 2))
      expect(result.current.chart.sections[2]?.id).toBe(firstId)
    })
  })

  describe('tasks', () => {
    it('addTask adds a task to the correct section', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      const sectionId = result.current.chart.sections[0]!.id
      const initialCount = result.current.chart.sections[0]!.tasks.length
      act(() => result.current.addTask(sectionId, { label: 'New Task' }))
      expect(result.current.chart.sections[0]?.tasks).toHaveLength(initialCount + 1)
      expect(result.current.chart.sections[0]?.tasks.at(-1)?.label).toBe('New Task')
    })

    it('updateTask patches a task field', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      const section = result.current.chart.sections[0]!
      const taskId = section.tasks[0]!.id
      act(() => result.current.updateTask(section.id, taskId, { label: 'Updated' }))
      expect(result.current.chart.sections[0]?.tasks[0]?.label).toBe('Updated')
    })

    it('updateTask can set afterTaskIds', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      const section = result.current.chart.sections[0]!
      const taskId = section.tasks[0]!.id
      act(() => result.current.updateTask(section.id, taskId, { afterTaskIds: ['other_id'] }))
      expect(result.current.chart.sections[0]?.tasks[0]?.afterTaskIds).toEqual(['other_id'])
    })

    it('deleteTask removes the task', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      const section = result.current.chart.sections[0]!
      const taskId = section.tasks[0]!.id
      act(() => result.current.deleteTask(section.id, taskId))
      expect(result.current.chart.sections[0]?.tasks).toHaveLength(0)
    })

    it('updateTask change is reflected in mermaidSyntax', () => {
      const { result } = renderHook(() => useGanttStore(makeMinimalChart()))
      const section = result.current.chart.sections[0]!
      const taskId = section.tasks[0]!.id
      act(() => result.current.updateTask(section.id, taskId, { label: 'Deployment' }))
      expect(result.current.mermaidSyntax).toContain('Deployment')
    })

    it('moveTask transfers task between sections', () => {
      const chart = makeMinimalChart()
      const sec2 = createSection('Phase 2')
      chart.sections = [...chart.sections, sec2]
      const { result } = renderHook(() => useGanttStore(chart))
      const fromSection = result.current.chart.sections[0]!
      const taskId = fromSection.tasks[0]!.id
      const toSectionId = result.current.chart.sections[1]!.id
      act(() => result.current.moveTask(taskId, fromSection.id, toSectionId, 0))
      expect(result.current.chart.sections[0]?.tasks).toHaveLength(0)
      expect(result.current.chart.sections[1]?.tasks).toHaveLength(1)
      expect(result.current.chart.sections[1]?.tasks[0]?.id).toBe(taskId)
    })
  })
})
