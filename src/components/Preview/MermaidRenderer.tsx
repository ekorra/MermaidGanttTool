import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false, theme: 'default' })

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

      void mermaid.render(id, syntax)
        .then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg
            setError(null)
          }
        })
        .catch((err: unknown) => {
          // Invalid syntax during live editing is expected — show non-destructive error
          const msg = err instanceof Error ? err.message : String(err)
          setError(msg)
        })
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
