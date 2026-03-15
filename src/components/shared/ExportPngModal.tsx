import { useRef, useEffect, useState } from 'react'
import { useEscapeKey } from '../../utils/useEscapeKey'
import { useTimelineScale } from '../../hooks/useTimelineScale'
import { isDarkActive } from '../../utils/theme'
import { exportPng } from '../../utils/exportPng'
import { useLocale } from '../../i18n/LocaleContext'
import type { GanttChart } from '../../model/types'

interface ExportPngModalProps {
  chart: GanttChart
  onClose: () => void
}

export function ExportPngModal({ chart, onClose }: ExportPngModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [includeTodayMarker, setIncludeTodayMarker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scale = useTimelineScale(chart.sections)
  const { t } = useLocale()

  useEscapeKey(onClose)
  useEffect(() => { closeRef.current?.focus() }, [])

  const handleDownload = async () => {
    const svgEl = document.querySelector<SVGSVGElement>('[data-testid="canvas-svg"]')
    if (!svgEl) { setError(t.exportPngCanvasNotFound); return }
    setLoading(true)
    setError(null)
    try {
      await exportPng({ svgEl, scale, title: chart.title, includeTodayMarker, isDark: isDarkActive() })
      onClose()
    } catch (e) {
      setError(t.exportPngFailed(String(e)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.exportPngTitle}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          width: 340,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>{t.exportPngTitle}</span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={t.closeButton}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-muted)', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--color-text)' }}>
          <input
            type="checkbox"
            checked={includeTodayMarker}
            onChange={e => setIncludeTodayMarker(e.target.checked)}
          />
          {t.exportPngTodayMarkerLabel}
        </label>

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
          {t.exportPngHint}
        </p>

        {error && (
          <p style={{ fontSize: 12, color: '#e63946', margin: 0 }}>{error}</p>
        )}

        <button
          onClick={() => { void handleDownload() }}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontWeight: 500,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? t.exportPngLoading : t.exportPngDownload}
        </button>
      </div>
    </div>
  )
}
