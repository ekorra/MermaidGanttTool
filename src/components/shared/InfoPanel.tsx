import { useRef, useEffect } from 'react'
import { useEscapeKey } from '../../utils/useEscapeKey'

interface InfoPanelProps {
  onClose: () => void
}

export function InfoPanel({ onClose }: InfoPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEscapeKey(onClose)
  useEffect(() => { closeRef.current?.focus() }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Om MermaidGanttTool"
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
          <span style={{ fontWeight: 700, fontSize: 16 }}>Om MermaidGanttTool</span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Lukk"
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-muted)', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* What is it */}
        <section>
          <p style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
            Et visuelt verktøy for å lage <strong>Mermaid Gantt-diagrammer</strong>. Tegn tidslinjen
            visuelt, og eksporter gyldig Mermaid-syntaks klar til å lime inn i GitHub,
            Confluence eller annen Markdown-basert dokumentasjon.
          </p>
        </section>

        {/* Features */}
        <section>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Funksjoner
          </h3>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--color-text)', lineHeight: 1.5 }}>
            <li>Visuell redigering — legg til seksjoner og oppgaver med et skjemapanel</li>
            <li>Dra for å flytte oppgaver, dra høyre kant for å endre varighet</li>
            <li>Avhengigheter — koble oppgaver med «starter etter» og se piler i tidslinjen</li>
            <li>Milepæler — vises som diamanter</li>
            <li>Statustyper: active, done, crit, crit+active, crit+done, milestone</li>
            <li>Klikk-lenker — åpner URL fra canvas når du klikker en oppgave</li>
            <li>Oppgaver uten seksjon (ungrouped)</li>
            <li>Innstillinger: datoformat, ukestart, ekskluderinger, today marker</li>
            <li>Eksporter Mermaid-syntaks med ett klikk</li>
            <li>Diagrammet lagres automatisk i nettleseren (localStorage)</li>
            <li>Mørkt og lyst tema</li>
          </ul>
        </section>

        {/* Limitations */}
        <section>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Begrensninger
          </h3>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--color-text)', lineHeight: 1.5 }}>
            <li><strong>Farger er kun visuelle</strong> — de eksporteres ikke til Mermaid-syntaksen</li>
            <li>Ingen import fra eksisterende Mermaid-syntaks (planlagt)</li>
            <li>Ingen PNG-eksport (planlagt)</li>
            <li>Lagring kun lokalt i nettleseren — ikke synkronisert mellom enheter</li>
          </ul>
        </section>

        {/* Why Mermaid */}
        <section>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Hvorfor Mermaid.js?
          </h3>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--color-text)', lineHeight: 1.5 }}>
            <li>Diagram-som-tekst — versjonskontrollvennlig, diff-bart</li>
            <li>Innebygd støtte i GitHub, GitLab, Notion, Confluence og flere</li>
            <li>Ingen bildefiler å holde oppdatert</li>
            <li>Åpen kildekode og aktivt vedlikeholdt</li>
          </ul>
        </section>

        {/* Links */}
        <section>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Lenker
          </h3>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.5 }}>
            <li>
              <a href="https://mermaid.js.org/syntax/gantt.html" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                Mermaid Gantt-spesifikasjon
              </a>
            </li>
            <li>
              <a href="https://mermaid.js.org" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                Mermaid.js hjemmeside
              </a>
            </li>
            <li>
              <a href="https://github.com/ekorra/MermaidGanttTool" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                MermaidGanttTool på GitHub
              </a>
            </li>
            <li>
              <a href="https://github.com/ekorra/MermaidGanttTool/issues" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                Rapporter en feil eller forslag
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
