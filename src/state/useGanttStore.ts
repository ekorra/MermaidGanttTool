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

const STORAGE_KEY = 'mermaid-gantt-chart'

function loadFromStorage(): GanttChart | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as GanttChart
  } catch {
    return null
  }
}

function saveToStorage(chart: GanttChart): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chart))
  } catch {
    // Storage quota exceeded or private mode — silently ignore
  }
}

export function useGanttStore(initial?: GanttChart): GanttStore {
  const [chart, setChart] = useState<GanttChart>(() => initial ?? loadFromStorage() ?? createChart())

  const persistingSetChart: typeof setChart = useCallback((action) => {
    setChart(prev => {
      const next = typeof action === 'function' ? action(prev) : action
      saveToStorage(next)
      return next
    })
  }, [])

  const mermaidSyntax = exportToMermaid(chart)

  const updateChartMeta = useCallback((patch: Partial<Omit<GanttChart, 'sections'>>) => {
    persistingSetChart(prev => ({ ...prev, ...patch }))
  }, [persistingSetChart])

  const addSection = useCallback((title?: string) => {
    persistingSetChart(prev => ({
      ...prev,
      sections: [...prev.sections, createSection(title)],
    }))
  }, [persistingSetChart])

  const updateSection = useCallback((sectionId: string, patch: Partial<Omit<GanttSection, 'tasks'>>) => {
    persistingSetChart(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, ...patch } : s),
    }))
  }, [persistingSetChart])

  const deleteSection = useCallback((sectionId: string) => {
    persistingSetChart(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
    }))
  }, [persistingSetChart])

  const reorderSections = useCallback((fromIndex: number, toIndex: number) => {
    persistingSetChart(prev => {
      const sections = [...prev.sections]
      const [moved] = sections.splice(fromIndex, 1)
      if (moved === undefined) return prev
      sections.splice(toIndex, 0, moved)
      return { ...prev, sections }
    })
  }, [persistingSetChart])

  const addTask = useCallback((sectionId: string, partial?: Partial<GanttTask>) => {
    persistingSetChart(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, tasks: [...s.tasks, createTask(partial)] }
          : s
      ),
    }))
  }, [persistingSetChart])

  const updateTask = useCallback((sectionId: string, taskId: string, patch: Partial<GanttTask>) => {
    persistingSetChart(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, tasks: s.tasks.map(t => t.id === taskId ? { ...t, ...patch } : t) }
          : s
      ),
    }))
  }, [persistingSetChart])

  const deleteTask = useCallback((sectionId: string, taskId: string) => {
    persistingSetChart(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId
          ? { ...s, tasks: s.tasks.filter(t => t.id !== taskId) }
          : s
      ),
    }))
  }, [persistingSetChart])

  const reorderTask = useCallback((sectionId: string, fromIndex: number, toIndex: number) => {
    persistingSetChart(prev => ({
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
  }, [persistingSetChart])

  const moveTask = useCallback((taskId: string, fromSectionId: string, toSectionId: string, newIndex: number) => {
    persistingSetChart(prev => {
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
  }, [persistingSetChart])

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
