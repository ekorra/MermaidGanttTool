import { useState, useRef, useEffect } from 'react'

interface EditableLabelProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  style?: React.CSSProperties
}

/**
 * A span that becomes an input when clicked.
 * Commits on blur or Enter, cancels on Escape.
 */
export function EditableLabel({ value, onChange, placeholder, style }: EditableLabelProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      setDraft(value)
      inputRef.current?.select()
    }
  }, [editing, value])

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed) onChange(trimmed)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') cancel()
        }}
        style={{
          font: 'inherit',
          border: '1px solid var(--color-primary)',
          borderRadius: 3,
          padding: '1px 4px',
          outline: 'none',
          background: 'var(--color-surface)',
          ...style,
        }}
        autoFocus
      />
    )
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      style={{
        cursor: 'text',
        borderRadius: 3,
        padding: '1px 4px',
        display: 'inline-block',
        minWidth: 40,
        color: value ? undefined : 'var(--color-text-muted)',
        ...style,
      }}
    >
      {value || placeholder || '…'}
    </span>
  )
}
