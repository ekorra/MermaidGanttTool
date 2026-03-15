import { useRef, useEffect } from 'react'
import type { GanttChart, DateFormat } from '../../model/types'
import type { ThemeSetting } from '../../utils/theme'
import { useEscapeKey } from '../../utils/useEscapeKey'
import { useLocale } from '../../i18n/LocaleContext'
import { LOCALE_NAMES, type Locale } from '../../i18n/translations'

interface SettingsPanelProps {
  chart: GanttChart
  onUpdate: (patch: Partial<Omit<GanttChart, 'sections'>>) => void
  themeSetting: ThemeSetting
  onSetTheme: (setting: ThemeSetting) => void
  onClose: () => void
}

const DATE_FORMATS: DateFormat[] = ['DD-MM-YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const LOCALES = Object.keys(LOCALE_NAMES) as Locale[]

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
  color: 'var(--color-text)',
  fontSize: 13,
  boxSizing: 'border-box',
}

const sectionHeading: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

export function SettingsPanel({ chart, onUpdate, themeSetting, onSetTheme, onClose }: SettingsPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const { t, locale, setLocale } = useLocale()
  useEscapeKey(onClose)
  useEffect(() => { closeRef.current?.focus() }, [])

  const themeOptions: { value: ThemeSetting; label: string }[] = [
    { value: 'light', label: t.themeLightOption },
    { value: 'dark', label: t.themeDarkOption },
    { value: 'system', label: t.themeSystemOption },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.settingsTitle}
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
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text)' }}>{t.settingsTitle}</span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={t.closeButton}
            style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--color-text-muted)', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* ── Appearance ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={sectionHeading}>{t.appearanceLabel}</span>

          {/* Language */}
          <div>
            <label style={fieldLabel}>{t.languageLabel}</label>
            <select
              value={locale}
              onChange={e => setLocale(e.target.value as Locale)}
              style={inputStyle}
            >
              {LOCALES.map(l => (
                <option key={l} value={l}>{LOCALE_NAMES[l]}</option>
              ))}
            </select>
          </div>

          {/* Theme */}
          <div>
            <label style={fieldLabel}>{t.themeLabel}</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {themeOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => onSetTheme(value)}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    border: `1px solid ${themeSetting === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 4,
                    background: themeSetting === value ? 'var(--color-primary)' : 'var(--color-bg)',
                    color: themeSetting === value ? '#fff' : 'var(--color-text)',
                    fontSize: 12,
                    fontWeight: themeSetting === value ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 0 }} />

        {/* ── Diagram settings ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={sectionHeading}>{t.settingsTitle}</span>

          {/* Date format */}
          <div>
            <label style={fieldLabel}>{t.dateFormatLabel}</label>
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
            <label style={fieldLabel}>{t.axisFormatLabel}</label>
            <input
              type="text"
              value={chart.axisFormat}
              onChange={e => onUpdate({ axisFormat: e.target.value })}
              placeholder="%b %d"
              style={inputStyle}
            />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              {t.axisFormatHint}
            </span>
          </div>

          {/* Tick interval */}
          <div>
            <label style={fieldLabel}>{t.tickIntervalLabel}</label>
            <input
              type="text"
              value={chart.tickInterval ?? ''}
              onChange={e => onUpdate({ tickInterval: e.target.value || null })}
              placeholder="1week"
              style={inputStyle}
            />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              {t.tickIntervalHint}
            </span>
          </div>

          {/* Excludes */}
          <div>
            <label style={fieldLabel}>{t.excludesLabel}</label>
            <input
              type="text"
              value={chart.excludes ?? ''}
              onChange={e => onUpdate({ excludes: e.target.value || null })}
              placeholder="weekends"
              style={inputStyle}
            />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              {t.excludesHint}
            </span>
          </div>

          {/* Weekday */}
          <div>
            <label style={fieldLabel}>{t.weekdayLabel}</label>
            <select
              value={chart.weekday ?? ''}
              onChange={e => onUpdate({ weekday: e.target.value || null })}
              style={inputStyle}
            >
              <option value="">{t.weekdayDefault}</option>
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
              <span style={{ fontSize: 13, color: 'var(--color-text)' }}>{t.todayMarkerLabel}</span>
            </label>
          </div>
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
          {t.closeButton}
        </button>
      </div>
    </div>
  )
}
