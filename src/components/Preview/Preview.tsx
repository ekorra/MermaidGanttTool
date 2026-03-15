import { useState } from 'react'
import { SyntaxPane } from './SyntaxPane'
import { MermaidRenderer } from './MermaidRenderer'
import { useLocale } from '../../i18n/LocaleContext'

interface PreviewProps {
  syntax: string
}

type Tab = 'syntax' | 'preview'

export function Preview({ syntax }: PreviewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('syntax')
  const { t } = useLocale()

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: 'syntax', label: t.previewTabSyntax },
    { key: 'preview', label: t.previewTabPreview },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        flexShrink: 0,
      }}>
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '4px 16px',
              border: 'none',
              borderBottom: activeTab === key ? '2px solid var(--color-primary)' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: activeTab === key ? 600 : 400,
              color: activeTab === key ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'syntax'
          ? <SyntaxPane syntax={syntax} />
          : <MermaidRenderer syntax={syntax} />
        }
      </div>
    </div>
  )
}
