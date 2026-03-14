interface ToolbarProps {
  title: string
  onTitleChange: (title: string) => void
  onSettingsOpen: () => void
  onExport: () => void
}

export function Toolbar({ title, onTitleChange, onSettingsOpen, onExport }: ToolbarProps) {
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
        }}
      />

      {/* Settings button */}
      <button
        onClick={onSettingsOpen}
        title="Diagraminnstillinger"
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
        onClick={onExport}
        style={{
          marginLeft: 'auto',
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
