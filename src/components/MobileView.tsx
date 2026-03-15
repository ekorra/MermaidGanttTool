import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/LocaleContext'
import { getShareIdFromUrl, loadShare } from '../utils/shareApi'
import { exportToMermaid } from '../model/export'
import { MermaidRenderer } from './Preview/MermaidRenderer'
import type { GanttChart } from '../model/types'

export function MobileView() {
  const { t } = useLocale()
  const shareId = getShareIdFromUrl()
  const [syntax, setSyntax] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shareId) return
    loadShare(shareId).then(result => {
      if (result.ok) {
        setSyntax(exportToMermaid(result.diagram as GanttChart))
      } else {
        setError(result.notFound ? t.shareLoadNotFound : t.shareLoadError)
      }
    }).catch(() => setError(t.shareLoadError))
  }, [shareId, t.shareLoadNotFound, t.shareLoadError])

  // No share param — show desktop-only message
  if (!shareId) {
    return (
      <div style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        background: 'var(--color-bg)',
        textAlign: 'center',
        gap: 12,
      }}>
        <span style={{ fontSize: 48 }}>🖥</span>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>
          {t.mobileHeading}
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: 'var(--color-text-muted)', maxWidth: 280 }}>
          {t.mobileBody}
        </p>
      </div>
    )
  }

  // Share param present — show loading, error, or the rendered diagram
  return (
    <div style={{
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
    }}>
      <div style={{
        padding: '10px 16px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 15 }}>GanttMaker</span>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>· {t.mobileShareNote}</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {error && (
          <div style={{
            padding: '32px 24px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 14,
          }}>
            {error}
          </div>
        )}
        {!error && !syntax && (
          <div style={{
            padding: '32px 24px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 14,
          }}>
            {t.mobileLoading}
          </div>
        )}
        {syntax && <MermaidRenderer syntax={syntax} />}
      </div>
    </div>
  )
}
