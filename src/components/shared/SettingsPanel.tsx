import { useRef, useEffect } from 'react'
import type { GanttChart, DateFormat } from '../../model/types'
import { useEscapeKey } from '../../utils/useEscapeKey'

interface SettingsPanelProps {
  chart: GanttChart
  onUpdate: (patch: Partial<Omit<GanttChart, 'sections'>>) => void
  onClose: () => void
}

const DATE_FORMATS: DateFormat[] = ['DD-MM-YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  marginBottom: 3,
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '5px 8px',
  border: '1px solid var(--color-border)',
  borderRadius: 4,
  background: 'var(--color-bg)',
  fontSize: 13,
  boxSizing: 'border-box',
}

export function SettingsPanel({ chart, onUpdate, onClose }: SettingsPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEscapeKey(onClose)
  useEffect(() => { closeRef.current?.focus() }, [])

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Diagraminnstillinger"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      {/* Dialog */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 8,
          padding: 24,
          width: 380,
          maxHeight: '85vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Diagraminnstillinger</span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Lukk innstillinger"
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-muted)', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Date format */}
        <div>
          <label style={fieldLabel}>Datoformat</label>
          <select
            value={chart.dateFormat}
            onChange={e => onUpdate({ dateFormat: e.target.value as DateFormat })}
            style={inputStyle}
          >
            {DATE_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Axis format */}
        <div>
          <label style={fieldLabel}>Akseformat</label>
          <input
            type="text"
            value={chart.axisFormat}
            onChange={e => onUpdate({ axisFormat: e.target.value })}
            placeholder="%b %d"
            style={inputStyle}
          />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            strftime-format, f.eks. %b %d, %Y-%m-%d
          </span>
        </div>

        {/* Tick interval */}
        <div>
          <label style={fieldLabel}>Tikkintervall</label>
          <input
            type="text"
            value={chart.tickInterval ?? ''}
            onChange={e => onUpdate({ tickInterval: e.target.value || null })}
            placeholder="1week"
            style={inputStyle}
          />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            f.eks. 1day, 1week, 1month
          </span>
        </div>

        {/* Excludes */}
        <div>
          <label style={fieldLabel}>Ekskluder</label>
          <input
            type="text"
            value={chart.excludes ?? ''}
            onChange={e => onUpdate({ excludes: e.target.value || null })}
            placeholder="weekends"
            style={inputStyle}
          />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            f.eks. weekends, monday, 2025-12-25
          </span>
        </div>

        {/* Weekday */}
        <div>
          <label style={fieldLabel}>Ukestart</label>
          <select
            value={chart.weekday ?? ''}
            onChange={e => onUpdate({ weekday: e.target.value || null })}
            style={inputStyle}
          >
            <option value="">— standard (søndag) —</option>
            {WEEKDAYS.map(d => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Today marker */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={chart.todayMarker}
              onChange={e => onUpdate({ todayMarker: e.target.checked })}
            />
            <span style={{ fontSize: 13 }}>Vis «Today»-linje</span>
          </label>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            marginTop: 4,
            padding: '8px',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Lukk
        </button>
      </div>
    </div>
  )
}
