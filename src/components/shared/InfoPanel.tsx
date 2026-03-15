import { useRef, useEffect } from 'react'
import { useEscapeKey } from '../../utils/useEscapeKey'
import { useLocale } from '../../i18n/LocaleContext'

interface InfoPanelProps {
  onClose: () => void
}

export function InfoPanel({ onClose }: InfoPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const { t } = useLocale()
  useEscapeKey(onClose)
  useEffect(() => { closeRef.current?.focus() }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.infoTitle}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          width: 520,
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>{t.infoTitle}</span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={t.closeButton}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-muted)', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Description */}
        <section>
          <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
            {t.infoDescription}
          </p>
        </section>

        {/* Features */}
        <section>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            {t.infoFeaturesHeading}
          </h3>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--color-text)', lineHeight: 1.5 }}>
            {t.infoFeatures.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>

        {/* Limitations */}
        <section>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            {t.infoLimitationsHeading}
          </h3>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--color-text)', lineHeight: 1.5 }}>
            {t.infoLimitations.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>

        {/* Why Mermaid */}
        <section>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            {t.infoWhyHeading}
          </h3>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--color-text)', lineHeight: 1.5 }}>
            {t.infoWhy.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>

        {/* Support */}
        <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
            {t.infoSupportText}
          </p>
          {/* TODO: replace YOUR_USERNAME with your Buy Me a Coffee username after creating an account at https://www.buymeacoffee.com */}
          <a
            href="https://buymeacoffee.com/ekorra"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me a Coffee"
              style={{ height: 40, borderRadius: 6 }}
            />
          </a>
        </section>

        {/* Links */}
        <section>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            {t.infoLinksHeading}
          </h3>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.5 }}>
            <li>
              <a href="https://mermaid.js.org/syntax/gantt.html" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                {t.infoLinkMermaidSpec}
              </a>
            </li>
            <li>
              <a href="https://mermaid.js.org" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                {t.infoLinkMermaidHome}
              </a>
            </li>
            <li>
              <a href="https://github.com/ekorra/MermaidGanttTool" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                {t.infoLinkGitHub}
              </a>
            </li>
            <li>
              <a href="https://github.com/ekorra/MermaidGanttTool/issues" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                {t.infoLinkBugs}
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
