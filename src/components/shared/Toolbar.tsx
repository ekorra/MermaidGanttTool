import { useLocale } from '../../i18n/LocaleContext'
import { Icon } from './Icon'

interface ToolbarProps {
  title: string
  onTitleChange: (title: string) => void
  onSettingsOpen: () => void
  onInfoOpen: () => void
  onExport: () => void
  onImport: () => void
  onExportPng: () => void
  onShare: () => void
  previewOpen: boolean
  onTogglePreview: () => void
}

const btnStyle: React.CSSProperties = {
  padding: '6px 8px',
  border: '1px solid var(--color-border)',
  borderRadius: 4,
  background: 'var(--color-bg)',
  color: 'var(--color-text-muted)',
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const divider: React.CSSProperties = {
  width: 1,
  alignSelf: 'stretch',
  background: 'var(--color-border)',
  margin: '8px 4px',
  flexShrink: 0,
}

export function Toolbar({ title, onTitleChange, onSettingsOpen, onInfoOpen, onExport, onImport, onExportPng, onShare, previewOpen, onTogglePreview }: ToolbarProps) {
  const { t } = useLocale()

  const hover = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.borderColor = 'var(--color-primary)')
  const unhover = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.borderColor = 'var(--color-border)')

  return (
    <header style={{
      height: 'var(--toolbar-height)',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '0 12px',
      flexShrink: 0,
    }}>
      <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 14, whiteSpace: 'nowrap', marginRight: 4 }}>
        GanttMaker
      </span>

      <input
        type="text"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        placeholder={t.projectTitlePlaceholder}
        style={{
          flex: 1,
          maxWidth: 260,
          padding: '4px 8px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
          fontSize: 13,
        }}
      />

      {/* ── Mermaid clipboard group ── */}
      <div style={divider} />

      <button
        onClick={onImport}
        title={t.pasteMermaid}
        aria-label={t.pasteMermaid}
        style={btnStyle}
        onMouseOver={hover}
        onMouseOut={unhover}
      >
        <Icon name="content_paste" />
      </button>

      <button
        onClick={onExport}
        title={t.copyMermaid}
        aria-label={t.copyMermaid}
        style={btnStyle}
        onMouseOver={hover}
        onMouseOut={unhover}
      >
        <Icon name="content_copy" />
      </button>

      {/* ── Export / share group ── */}
      <div style={divider} />

      <button
        onClick={onExportPng}
        title={t.downloadPng}
        aria-label={t.downloadPng}
        style={btnStyle}
        onMouseOver={hover}
        onMouseOut={unhover}
      >
        <Icon name="download" />
      </button>

      <button
        onClick={onShare}
        title={t.shareButton}
        aria-label={t.shareButton}
        style={btnStyle}
        onMouseOver={hover}
        onMouseOut={unhover}
      >
        <Icon name="share" />
      </button>

      <button
        data-testid="preview-toggle"
        onClick={onTogglePreview}
        title={previewOpen ? t.hidePreview : t.showPreview}
        aria-label={previewOpen ? t.hidePreview : t.showPreview}
        style={{
          ...btnStyle,
          background: previewOpen ? 'var(--color-primary)' : 'var(--color-bg)',
          color: previewOpen ? '#fff' : 'var(--color-text-muted)',
          borderColor: previewOpen ? 'var(--color-primary)' : 'var(--color-border)',
        }}
        onMouseOver={e => { if (!previewOpen) hover(e) }}
        onMouseOut={e => { if (!previewOpen) unhover(e) }}
      >
        <Icon name="preview" />
      </button>

      {/* ── App group (pushed right) ── */}
      <div style={{ ...divider, marginLeft: 'auto' }} />

      <button
        onClick={onSettingsOpen}
        title={t.settingsLabel}
        aria-label={t.settingsLabel}
        style={btnStyle}
        onMouseOver={hover}
        onMouseOut={unhover}
      >
        <Icon name="settings" />
      </button>

      <button
        onClick={onInfoOpen}
        title={t.infoLabel}
        aria-label={t.infoLabel}
        style={btnStyle}
        onMouseOver={hover}
        onMouseOut={unhover}
      >
        <Icon name="info" />
      </button>
    </header>
  )
}
