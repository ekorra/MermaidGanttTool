import { useState } from 'react'
import { useLocale } from '../../i18n/LocaleContext'

interface SyntaxPaneProps {
  syntax: string
}

export function SyntaxPane({ syntax }: SyntaxPaneProps) {
  const [copied, setCopied] = useState(false)
  const { t } = useLocale()

  const handleCopy = () => {
    void navigator.clipboard.writeText(syntax).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 12px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 500, fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t.syntaxPaneTitle}
        </span>
        <button
          onClick={handleCopy}
          style={{
            padding: '3px 10px',
            fontSize: 12,
            background: copied ? '#28a745' : 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 3,
            transition: 'background 0.15s',
          }}
        >
          {copied ? t.copiedButton : t.copyButton}
        </button>
      </div>
      <textarea
        readOnly
        value={syntax}
        data-testid="syntax-pane"
        style={{
          flex: 1,
          resize: 'none',
          border: 'none',
          padding: '10px 12px',
          fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
          fontSize: 12,
          lineHeight: 1.6,
          background: '#1e1e2e',
          color: '#cdd6f4',
          outline: 'none',
        }}
      />
    </div>
  )
}
