import { useState } from 'react'
import './styles/global.css'
import { useGanttStore } from './state/useGanttStore'
import { Toolbar } from './components/shared/Toolbar'
import { TaskList } from './components/Editor/TaskList'
import { TaskDetailPanel } from './components/Editor/TaskDetailPanel'
import { Canvas } from './components/Canvas/Canvas'
import { Preview } from './components/Preview/Preview'

export function App() {
  const store = useGanttStore()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const handleExport = () => {
    void navigator.clipboard.writeText(store.mermaidSyntax)
  }

  // Deselect if the task was deleted
  const taskExists = selectedTaskId !== null &&
    store.chart.sections.some(s => s.tasks.some(t => t.id === selectedTaskId))
  const resolvedSelected = taskExists ? selectedTaskId : null

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: 'var(--toolbar-height) 1fr var(--preview-height)',
      height: '100dvh',
      overflow: 'hidden',
    }}>
      {/* Toolbar */}
      <Toolbar
        title={store.chart.title}
        onTitleChange={title => store.updateChartMeta({ title })}
        dateFormat={store.chart.dateFormat}
        onDateFormatChange={dateFormat => store.updateChartMeta({ dateFormat })}
        onExport={handleExport}
      />

      {/* Main area: TaskList + Canvas + TaskDetailPanel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `var(--editor-width) 1fr${resolvedSelected ? ' var(--detail-width)' : ''}`,
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)',
      }}>
        {/* Left: compact task list */}
        <div style={{
          borderRight: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          overflow: 'hidden',
        }}>
          <TaskList
            store={store}
            selectedTaskId={resolvedSelected}
            onSelectTask={setSelectedTaskId}
          />
        </div>

        {/* Middle: canvas */}
        <div style={{ overflow: 'hidden' }}>
          <Canvas store={store} />
        </div>

        {/* Right: task detail panel (shown when task selected) */}
        {resolvedSelected && (
          <div style={{
            borderLeft: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            overflow: 'hidden',
          }}>
            <TaskDetailPanel
              store={store}
              taskId={resolvedSelected}
              onClose={() => setSelectedTaskId(null)}
            />
          </div>
        )}
      </div>

      {/* Preview */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Preview syntax={store.mermaidSyntax} />
      </div>
    </div>
  )
}
