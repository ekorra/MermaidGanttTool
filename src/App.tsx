import { useState, useCallback, useEffect, useRef } from 'react'
import './styles/global.css'
import { isDarkActive, toggleTheme } from './utils/theme'
import { useGanttStore } from './state/useGanttStore'
import { parseGantt, isMermaidGantt } from './model/import'
import { useLocale } from './i18n/LocaleContext'
import { getShareIdFromUrl, loadShare } from './utils/shareApi'
import { Toolbar } from './components/shared/Toolbar'
import { SettingsPanel } from './components/shared/SettingsPanel'
import { InfoPanel } from './components/shared/InfoPanel'
import { ExportPngModal } from './components/shared/ExportPngModal'
import { ShareModal } from './components/shared/ShareModal'
import { SharedModeBanner } from './components/shared/SharedModeBanner'
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
  const { t } = useLocale()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [exportPngOpen, setExportPngOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareId, setShareId] = useState<string | null>(null)
  const [shareLoadError, setShareLoadError] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(() => isDarkActive())

  // Load shared diagram from ?share= query param on mount
  useEffect(() => {
    const id = getShareIdFromUrl()
    if (!id) return
    loadShare(id).then(result => {
      if (result.ok) {
        store.replaceChart(result.diagram)
        setShareId(id)
      } else {
        setShareLoadError(result.notFound ? t.shareLoadNotFound : t.shareLoadError)
      }
    }).catch(() => setShareLoadError(t.shareLoadError))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const handleImport = async () => {
    let text: string
    try {
      text = await navigator.clipboard.readText()
    } catch {
      alert(t.clipboardReadError)
      return
    }
    if (!isMermaidGantt(text)) {
      alert(t.noMermaidInClipboard)
      return
    }
    const parsed = parseGantt(text)
    if (!parsed) {
      alert(t.mermaidParseError)
      return
    }
    if (window.confirm(t.importConfirm)) {
      store.replaceChart(parsed)
      setSelectedTaskId(null)
    }
  }

  const taskExists = selectedTaskId !== null &&
    store.chart.sections.some(s => s.tasks.some(t => t.id === selectedTaskId))
  const resolvedSelected = taskExists ? selectedTaskId : null

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      overflow: 'hidden',
    }}>
      <Toolbar
        title={store.chart.title}
        onTitleChange={title => store.updateChartMeta({ title })}
        onSettingsOpen={() => setSettingsOpen(true)}
        onInfoOpen={() => setInfoOpen(true)}
        onExport={handleExport}
        onImport={() => { void handleImport() }}
        onExportPng={() => setExportPngOpen(true)}
        onShare={() => setShareOpen(true)}
        previewOpen={previewOpen}
        onTogglePreview={togglePreview}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {shareId && <SharedModeBanner shareId={shareId} chart={store.chart} />}

      {shareLoadError && (
        <div style={{
          background: 'var(--color-danger, #d32f2f)',
          color: '#fff',
          padding: '6px 16px',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span>{shareLoadError}</span>
          <button
            onClick={() => setShareLoadError(null)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Main area: Oppgaveliste + Tidslinje + Detaljpanel */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: `var(--editor-width) 1fr${resolvedSelected ? ' var(--detail-width)' : ''}`,
        overflow: 'hidden',
        minHeight: 0,
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
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--color-border)', overflow: 'hidden', height: previewHeight, flexShrink: 0 }}>
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

      {infoOpen && <InfoPanel onClose={() => setInfoOpen(false)} />}
      {exportPngOpen && <ExportPngModal chart={store.chart} onClose={() => setExportPngOpen(false)} />}
      {shareOpen && <ShareModal chart={store.chart} onClose={() => setShareOpen(false)} />}
    </div>
  )
}
