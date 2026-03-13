import { useState, useCallback } from 'react'
import type { GanttChart, GanttSection, GanttTask } from '../model/types'
import { createChart, createSection, createTask } from '../model/defaults'
import { exportToMermaid } from '../model/export'

export interface GanttStore {
  chart: GanttChart
  mermaidSyntax: string

  // Chart-level
  updateChartMeta: (patch: Partial<Omit<GanttChart, 'sections'>>) => void

  // Sections
  addSection: (title?: string) => void
  updateSection: (sectionId: string, patch: Partial<Omit<GanttSection, 'tasks'>>) => void
  deleteSection: (sectionId: string) => void
  reorderSections: (fromIndex: number, toIndex: number) => void

  // Tasks
  addTask: (sectionId: string, partial?: Partial<GanttTask>) => void
  updateTask: (sectionId: string, taskId: string, patch: Partial<GanttTask>) => void
  deleteTask: (sectionId: string, taskId: string) => void
  reorderTask: (sectionId: string, fromIndex: number, toIndex: number) => void
  moveTask: (taskId: string, fromSectionId: string, toSectionId: string, newIndex: number) => void
}

export function useGanttStore(initial?: GanttChart): GanttStore {
  const [chart, setChart] = useState<GanttChart>(() => initial ?? createChart())

  const mermaidSyntax = exportToMermaid(chart)

  const updateChartMeta = useCallback((patch: Partial<Omit<GanttChart, 'sections'>>) => {
    setChart(prev => ({ ...prev, ...patch }))
  }, [])

  const addSection = useCallback((title?: string) => {
    setChart(prev => ({
      ...prev,
      sections: [...prev.sections, createSection(title)],
    }))
  }, [])

  const updateSection = useCallback((sectionId: string, patch: Partial<Omit<GanttSection, 'tasks'>>) => {
    setChart(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, ...patch } : s),
    }))
  }, [])

  const deleteSection = useCallback((sectionId: string) => {
    setChart(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
    }))
  }, [])

  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    setChart(prev => {
      const sections = [...prev.sections]
      const [moved] = sections.splice(fromIndex, 1)
      if (moved === undefined) return prev
      sections.splice(toIndex, 0, moved)
      return { ...prev, sections }
    })
  }, [])

  const addTask = useCallback((sectionId: string, partial?: Partial<GanttTask>) => {
    setChart(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, tasks: [...s.tasks, createTask(partial)] }
          : s
      ),
    }))
  }, [])

  const updateTask = useCallback((sectionId: string, taskId: string, patch: Partial<GanttTask>) => {
    setChart(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, tasks: s.tasks.map(t => t.id === taskId ? { ...t, ...patch } : t) }
          : s
      ),
    }))
  }, [])

  const deleteTask = useCallback((sectionId: string, taskId: string) => {
    setChart(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, tasks: s.tasks.filter(t => t.id !== taskId) }
          : s
      ),
    }))
  }, [])

  const reorderTask = useCallback((sectionId: string, fromIndex: number, toIndex: number) => {
    setChart(prev => ({
      ...prev,
      sections: prev.sections.map(s => {
        if (s.id !== sectionId) return s
        const tasks = [...s.tasks]
        const [moved] = tasks.splice(fromIndex, 1)
        if (moved === undefined) return s
        tasks.splice(toIndex, 0, moved)
        return { ...s, tasks }
      }),
    }))
  }, [])

  const moveTask = useCallback((taskId: string, fromSectionId: string, toSectionId: string, newIndex: number) => {
    setChart(prev => {
      let taskToMove: GanttTask | undefined
      const sections = prev.sections.map(s => {
        if (s.id !== fromSectionId) return s
        taskToMove = s.tasks.find(t => t.id === taskId)
        return { ...s, tasks: s.tasks.filter(t => t.id !== taskId) }
      })
      if (taskToMove === undefined) return prev
      const task = taskToMove
      return {
        ...prev,
        sections: sections.map(s => {
          if (s.id !== toSectionId) return s
          const tasks = [...s.tasks]
          tasks.splice(newIndex, 0, task)
          return { ...s, tasks }
        }),
      }
    })
  }, [])

  return {
    chart,
    mermaidSyntax,
    updateChartMeta,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addTask,
    updateTask,
    deleteTask,
    reorderTask,
    moveTask,
  }
}
