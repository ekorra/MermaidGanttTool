interface ToolbarProps {
  title: string
  onTitleChange: (title: string) => void
  onSettingsOpen: () => void
  onInfoOpen: () => void
  onExport: () => void
  onImport: () => void
  onExportPng: () => void
  previewOpen: boolean
  onTogglePreview: () => void
  isDark: boolean
  onToggleTheme: () => void
}

export function Toolbar({ title, onTitleChange, onSettingsOpen, onInfoOpen, onExport, onImport, onExportPng, previewOpen, onTogglePreview, isDark, onToggleTheme }: ToolbarProps) {
  return (
    <header style={{
      height: 'var(--toolbar-height)',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '0 16px',
      flexShrink: 0,
    }}>
      <span style={{ fontWeight: 600, color: 'var(--color-primary)', marginRight: 4 }}>
        MermaidGantt
      </span>

      <input
        type="text"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        placeholder="Project title"
        style={{
          flex: 1,
          maxWidth: 280,
          padding: '4px 8px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
        }}
      />

      <button
        onClick={onSettingsOpen}
        title="Diagraminnstillinger"
        aria-label="Diagraminnstillinger"
        style={{
          padding: '5px 10px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          background: 'var(--color-bg)',
          color: 'var(--color-text-muted)',
          fontSize: 16,
          lineHeight: 1,
          cursor: 'pointer',
        }}
        onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
        onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
      >
        ⚙
      </button>

      <button
        onClick={onInfoOpen}
        title="Om appen"
        aria-label="Om appen"
        style={{
          padding: '5px 10px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          background: 'var(--color-bg)',
          color: 'var(--color-text-muted)',
          fontSize: 15,
          fontWeight: 700,
          lineHeight: 1,
          cursor: 'pointer',
        }}
        onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
        onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
      >
        ?
      </button>

      <button
        onClick={onToggleTheme}
        title={isDark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'}
        aria-label={isDark ? 'Bytt til lyst tema' : 'Bytt til mørkt tema'}
        style={{
          padding: '5px 10px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          background: 'var(--color-bg)',
          color: 'var(--color-text-muted)',
          fontSize: 15,
          lineHeight: 1,
          cursor: 'pointer',
        }}
        onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
        onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
      >
        {isDark ? '☀' : '🌙'}
      </button>

      <button
        onClick={onImport}
        title="Paste Mermaid from clipboard"
        aria-label="Paste Mermaid from clipboard"
        style={{
          padding: '5px 10px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          background: 'var(--color-bg)',
          color: 'var(--color-text-muted)',
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1,
          cursor: 'pointer',
        }}
        onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
        onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
      >
        Paste Mermaid
      </button>

      {/* Preview toggle */}
      <button
        data-testid="preview-toggle"
        onClick={onTogglePreview}
        title={previewOpen ? 'Skjul preview' : 'Vis preview'}
        style={{
          padding: '5px 12px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          background: previewOpen ? 'var(--color-primary)' : 'var(--color-bg)',
          color: previewOpen ? '#fff' : 'var(--color-text-muted)',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
        onMouseOver={e => { if (!previewOpen) e.currentTarget.style.borderColor = 'var(--color-primary)' }}
        onMouseOut={e => { if (!previewOpen) e.currentTarget.style.borderColor = 'var(--color-border)' }}
      >
        Preview {previewOpen ? '▼' : '▲'}
      </button>

      <button
        onClick={onExportPng}
        style={{
          marginLeft: 'auto',
          padding: '6px 14px',
          background: 'var(--color-bg)',
          color: 'var(--color-text-muted)',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          fontWeight: 500,
          cursor: 'pointer',
        }}
        onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
        onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
      >
        Download PNG
      </button>

      <button
        onClick={onExport}
        style={{
          padding: '6px 14px',
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          fontWeight: 500,
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'var(--color-primary-hover)')}
        onMouseOut={e => (e.currentTarget.style.background = 'var(--color-primary)')}
      >
        Copy Mermaid
      </button>
    </header>
  )
}
