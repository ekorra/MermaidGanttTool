import { useState, useEffect } from 'react'
import { useLocale } from '../../i18n/LocaleContext'
import { createShare, buildShareUrl } from '../../utils/shareApi'
import type { GanttChart } from '../../model/types'

interface ShareModalProps {
  chart: GanttChart
  onClose: () => void
}

export function ShareModal({ chart, onClose }: ShareModalProps) {
  const { t } = useLocale()
  const [state, setState] = useState<'creating' | 'ready' | 'error'>('creating')
  const [shareUrl, setShareUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    void createShare(chart).then(result => {
      if (result.ok) {
        setShareUrl(buildShareUrl(result.id))
        setState('ready')
      } else {
        setErrorMsg(result.error)
        setState('error')
      }
    })
  }, [chart])

  const handleCopy = () => {
    void navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          padding: '24px',
          width: 480,
          maxWidth: 'calc(100vw - 32px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-text)' }}>
            {t.shareModalTitle}
          </h2>
          <button
            onClick={onClose}
            aria-label={t.closeButton}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--color-text-muted)' }}
          >
            ×
          </button>
        </div>

        {state === 'creating' && (
          <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 14 }}>
            {t.shareModalCreating}
          </p>
        )}

        {state === 'error' && (
          <p style={{ margin: 0, color: 'var(--color-danger, #d32f2f)', fontSize: 14 }}>
            {t.shareModalError(errorMsg)}
          </p>
        )}

        {state === 'ready' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                {t.shareModalUrlLabel}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  readOnly
                  value={shareUrl}
                  onClick={e => (e.target as HTMLInputElement).select()}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 4,
                    background: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    fontSize: 13,
                    fontFamily: 'monospace',
                  }}
                />
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '6px 14px',
                    background: copied ? 'var(--color-primary)' : 'var(--color-bg)',
                    color: copied ? '#fff' : 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {copied ? t.shareLinkCopied : t.shareCopyLink}
                </button>
              </div>
            </div>

            <ul style={{
              margin: 0, padding: '12px 16px',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              listStyle: 'disc',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              {t.shareModalLimitations.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
