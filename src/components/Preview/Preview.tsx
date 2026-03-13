import { useState } from 'react'
import { SyntaxPane } from './SyntaxPane'
import { MermaidRenderer } from './MermaidRenderer'

interface PreviewProps {
  syntax: string
}

type Tab = 'syntax' | 'preview'

export function Preview({ syntax }: PreviewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('syntax')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        flexShrink: 0,
      }}>
        {(['syntax', 'preview'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '4px 16px',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
              textTransform: 'capitalize',
            }}
          >
            {tab}
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
