import type { DateFormat } from '../../model/types'

interface ToolbarProps {
  title: string
  onTitleChange: (title: string) => void
  dateFormat: DateFormat
  onDateFormatChange: (format: DateFormat) => void
  onExport: () => void
}

const DATE_FORMATS: DateFormat[] = ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD-MM-YYYY']

export function Toolbar({ title, onTitleChange, dateFormat, onDateFormatChange, onExport }: ToolbarProps) {
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

      <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
        Date format
        <select
          value={dateFormat}
          onChange={e => onDateFormatChange(e.target.value as DateFormat)}
          style={{
            padding: '4px 6px',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            background: 'var(--color-bg)',
          }}
        >
          {DATE_FORMATS.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </label>

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
