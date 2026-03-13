import './styles/global.css'
import { useGanttStore } from './state/useGanttStore'
import { Toolbar } from './components/shared/Toolbar'
import { SyntaxPane } from './components/Preview/SyntaxPane'
import { SectionList } from './components/Editor/SectionList'

export function App() {
  const store = useGanttStore()

  const handleExport = () => {
    void navigator.clipboard.writeText(store.mermaidSyntax)
  }

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

      {/* Main area: Editor + Canvas (Phase 3 & 4) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'var(--editor-width) 1fr',
        overflow: 'hidden',
        borderBottom: '1px solid var(--color-border)',
      }}>
        {/* Editor panel */}
        <div style={{
          borderRight: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          overflow: 'hidden',
        }}>
          <SectionList store={store} />
        </div>

        {/* Canvas panel placeholder */}
        <div style={{
          overflow: 'auto',
          background: 'var(--color-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 13,
        }}>
          Canvas panel — Phase 4
        </div>
      </div>

      {/* Preview: Syntax pane (Phase 5 adds MermaidRenderer) */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <SyntaxPane syntax={store.mermaidSyntax} />
      </div>
    </div>
  )
}
