import { useState, useCallback, useEffect, useRef } from 'react'
import './styles/global.css'
import { isDarkActive, toggleTheme } from './utils/theme'
import { useGanttStore } from './state/useGanttStore'
import { Toolbar } from './components/shared/Toolbar'
import { SettingsPanel } from './components/shared/SettingsPanel'
import { TaskList } from './components/Editor/TaskList'
import { TaskDetailPanel } from './components/Editor/TaskDetailPanel'
import { Canvas } from './components/Canvas/Canvas'
import { Preview } from './components/Preview/Preview'

const PREVIEW_MIN_H = 120
const PREVIEW_DEFAULT_H = 280
const PREVIEW_STORAGE_KEY = 'mermaid-gantt-preview'

function loadPreviewState(): { open: boolean; height: number } {
  try {
    const raw = localStorage.getItem(PREVIEW_STORAGE_KEY)
    if (!raw) return { open: false, height: PREVIEW_DEFAULT_H }
    return JSON.parse(raw) as { open: boolean; height: number }
  } catch {
    return { open: false, height: PREVIEW_DEFAULT_H }
  }
}

export function App() {
  const store = useGanttStore()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => isDarkActive())

  const handleToggleTheme = () => {
    const dark = toggleTheme()
    setIsDark(dark)
  }

  const [previewOpen, setPreviewOpen] = useState(() => loadPreviewState().open)
  const [previewHeight, setPreviewHeight] = useState(() => loadPreviewState().height)

  // Persist preview state
  useEffect(() => {
    try {
      localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify({ open: previewOpen, height: previewHeight }))
    } catch { /* ignore */ }
  }, [previewOpen, previewHeight])

  const togglePreview = () => setPreviewOpen(v => !v)

  // Vertical drag-to-resize for preview panel
  const dragStartY = useRef<number | null>(null)
  const dragStartH = useRef<number>(PREVIEW_DEFAULT_H)

  const onResizePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragStartY.current = e.clientY
    dragStartH.current = previewHeight
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [previewHeight])

  const onResizePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return
    const delta = dragStartY.current - e.clientY   // drag up = bigger
    const maxH = Math.round(window.innerHeight * 0.6)
    const newH = Math.min(maxH, Math.max(PREVIEW_MIN_H, dragStartH.current + delta))
    setPreviewHeight(newH)
  }, [])

  const onResizePointerUp = useCallback(() => {
    dragStartY.current = null
  }, [])

  const handleExport = () => {
    void navigator.clipboard.writeText(store.mermaidSyntax)
  }

  const taskExists = selectedTaskId !== null &&
    store.chart.sections.some(s => s.tasks.some(t => t.id === selectedTaskId))
  const resolvedSelected = taskExists ? selectedTaskId : null

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: `var(--toolbar-height) 1fr${previewOpen ? ` ${previewHeight}px` : ''}`,
      height: '100dvh',
      overflow: 'hidden',
    }}>
      <Toolbar
        title={store.chart.title}
        onTitleChange={title => store.updateChartMeta({ title })}
        onSettingsOpen={() => setSettingsOpen(true)}
        onExport={handleExport}
        previewOpen={previewOpen}
        onTogglePreview={togglePreview}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main area: Oppgaveliste + Tidslinje + Detaljpanel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `var(--editor-width) 1fr${resolvedSelected ? ' var(--detail-width)' : ''}`,
        overflow: 'hidden',
      }}>
        <div style={{ borderRight: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
          <TaskList store={store} selectedTaskId={resolvedSelected} onSelectTask={setSelectedTaskId} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <Canvas store={store} selectedTaskId={resolvedSelected} onSelectTask={setSelectedTaskId} />
        </div>
        {resolvedSelected && (
          <div style={{ borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <TaskDetailPanel store={store} taskId={resolvedSelected} onClose={() => setSelectedTaskId(null)} />
          </div>
        )}
      </div>

      {/* Preview panel */}
      {previewOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {/* Resize handle */}
          <div
            onPointerDown={onResizePointerDown}
            onPointerMove={onResizePointerMove}
            onPointerUp={onResizePointerUp}
            style={{
              height: 6,
              background: 'var(--color-border)',
              cursor: 'ns-resize',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'var(--color-primary)')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--color-border)')}
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Preview syntax={store.mermaidSyntax} />
          </div>
        </div>
      )}

      {settingsOpen && (
        <SettingsPanel chart={store.chart} onUpdate={store.updateChartMeta} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  )
}
