import { useEffect, useRef, useState } from 'react'
import type mermaidType from 'mermaid'

// Mermaid is loaded lazily on first render — keeps it out of the main bundle
let mermaidInstance: typeof mermaidType | null = null
let mermaidLoadPromise: Promise<typeof mermaidType> | null = null

function getMermaid(): Promise<typeof mermaidType> {
  if (mermaidInstance) return Promise.resolve(mermaidInstance)
  if (!mermaidLoadPromise) {
    mermaidLoadPromise = import('mermaid').then(m => {
      m.default.initialize({ startOnLoad: false, theme: 'default' })
      mermaidInstance = m.default
      return m.default
    })
  }
  return mermaidLoadPromise
}

let renderCounter = 0

interface MermaidRendererProps {
  syntax: string
}

export function MermaidRenderer({ syntax }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      if (!containerRef.current) return
      const id = `mermaid-${++renderCounter}`

      void getMermaid().then(mermaid =>
        mermaid.render(id, syntax)
          .then(({ svg }) => {
            if (containerRef.current) {
              containerRef.current.innerHTML = svg
              setError(null)
            }
          })
          .catch((err: unknown) => {
            const msg = err instanceof Error ? err.message : String(err)
            setError(msg)
          })
      )
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [syntax])

  return (
    <div style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
      {error && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: 4,
          padding: '4px 10px',
          fontSize: 11,
          color: '#856404',
          maxWidth: 300,
          zIndex: 1,
        }}>
          Invalid syntax — editing…
        </div>
      )}
      <div
        ref={containerRef}
        data-testid="mermaid-renderer"
        style={{
          padding: '12px 16px',
          minHeight: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      />
    </div>
  )
}
