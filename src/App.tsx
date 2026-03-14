import { useState } from 'react'
import './styles/global.css'
import { useGanttStore } from './state/useGanttStore'
import { Toolbar } from './components/shared/Toolbar'
import { SettingsPanel } from './components/shared/SettingsPanel'
import { TaskList } from './components/Editor/TaskList'
import { TaskDetailPanel } from './components/Editor/TaskDetailPanel'
import { Canvas } from './components/Canvas/Canvas'
import { Preview } from './components/Preview/Preview'

export function App() {
  const store = useGanttStore()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

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
      <Toolbar
        title={store.chart.title}
        onTitleChange={title => store.updateChartMeta({ title })}
        onSettingsOpen={() => setSettingsOpen(true)}
        onExport={handleExport}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: `var(--editor-width) 1fr${resolvedSelected ? ' var(--detail-width)' : ''}`,
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)',
      }}>
        {/* Oppgaveliste */}
        <div style={{ borderRight: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
          <TaskList
            store={store}
            selectedTaskId={resolvedSelected}
            onSelectTask={setSelectedTaskId}
          />
        </div>

        {/* Tidslinje */}
        <div style={{ overflow: 'hidden' }}>
          <Canvas
            store={store}
            selectedTaskId={resolvedSelected}
            onSelectTask={setSelectedTaskId}
          />
        </div>

        {/* Detaljpanel */}
        {resolvedSelected && (
          <div style={{ borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <TaskDetailPanel
              store={store}
              taskId={resolvedSelected}
              onClose={() => setSelectedTaskId(null)}
            />
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Preview syntax={store.mermaidSyntax} />
      </div>

      {settingsOpen && (
        <SettingsPanel
          chart={store.chart}
          onUpdate={store.updateChartMeta}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}
