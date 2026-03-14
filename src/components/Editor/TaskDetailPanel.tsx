import type { GanttStore } from '../../state/useGanttStore'
import type { TaskStatus } from '../../model/types'
import { resolveTaskPositions } from '../../utils/taskPositions'
import { diffDays } from '../../utils/dateUtils'
import { PRESET_COLORS } from '../../utils/colors'

interface TaskDetailPanelProps {
  store: GanttStore
  taskId: string
  onClose: () => void
}

const STATUS_OPTIONS: Array<{ value: TaskStatus | ''; label: string }> = [
  { value: '',           label: 'Normal' },
  { value: 'active',    label: 'Active' },
  { value: 'done',      label: 'Done' },
  { value: 'crit',      label: 'Critical' },
  { value: 'crit+active', label: 'Critical + Active' },
  { value: 'crit+done',   label: 'Critical + Done' },
  { value: 'milestone', label: 'Milestone' },
]

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

export function TaskDetailPanel({ store, taskId, onClose }: TaskDetailPanelProps) {
  const { chart, updateTask, deleteTask } = store

  const section = chart.sections.find(s => s.tasks.some(t => t.id === taskId))
  const task = section?.tasks.find(t => t.id === taskId)
  if (!task || !section) return null

  const allOtherTasks = chart.sections.flatMap(s => s.tasks).filter(t => t.id !== task.id)

  const positions = resolveTaskPositions(chart.sections)
  const pos = positions.get(task.id)
  const durationDays = pos ? diffDays(pos.startDate, pos.endDate) : null

  const update = (patch: Parameters<typeof updateTask>[2]) =>
    updateTask(section.id, task.id, patch)

  const handleDelete = () => {
    deleteTask(section.id, task.id)
    onClose()
  }

  const toggleAfterTask = (depId: string, checked: boolean) => {
    const ids = checked
      ? [...task.afterTaskIds, depId]
      : task.afterTaskIds.filter(id => id !== depId)
    update({ afterTaskIds: ids })
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'auto',
      padding: 16,
      gap: 14,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>Rediger oppgave</span>
        <button
          onClick={onClose}
          aria-label="Lukk detaljpanel"
          style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--color-text-muted)', lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      {/* Name */}
      <div>
        <label style={fieldLabel}>Navn</label>
        <input
          type="text"
          value={task.label}
          onChange={e => update({ label: e.target.value })}
          style={inputStyle}
        />
      </div>

      {/* Status */}
      <div>
        <label style={fieldLabel}>Status</label>
        <select
          value={task.status ?? ''}
          onChange={e => {
            const s = (e.target.value as TaskStatus) || null
            update(s === 'milestone' ? { status: s, duration: null, endDate: null } : { status: s })
          }}
          style={inputStyle}
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* After tasks (multi-select via checkboxes) */}
      {allOtherTasks.length > 0 && (
        <div>
          <label style={fieldLabel}>Starter etter</label>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            maxHeight: 120,
            overflowY: 'auto',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            padding: '4px 6px',
            background: 'var(--color-bg)',
          }}>
            {allOtherTasks.map(t => (
              <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={task.afterTaskIds.includes(t.id)}
                  onChange={e => toggleAfterTask(t.id, e.target.checked)}
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Start date (only when no afterTaskIds) */}
      {task.afterTaskIds.length === 0 && (
        <div>
          <label style={fieldLabel}>Start</label>
          <input
            type="date"
            value={task.startDate ?? ''}
            onChange={e => update({ startDate: e.target.value || null })}
            style={inputStyle}
          />
        </div>
      )}

      {/* End date / Duration */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <label style={fieldLabel}>Slutt</label>
          <input
            type="date"
            value={task.endDate ?? ''}
            onChange={e => update({ endDate: e.target.value || null, duration: e.target.value ? null : task.duration })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={fieldLabel}>Varighet</label>
          <input
            type="text"
            value={task.endDate ? '' : (task.duration ?? '')}
            disabled={task.endDate !== null}
            onChange={e => update({ duration: e.target.value || null })}
            placeholder="f.eks. 3d, 1w"
            style={{ ...inputStyle, opacity: task.endDate ? 0.4 : 1 }}
          />
        </div>
      </div>

      {/* Click URL */}
      <div>
        <label style={fieldLabel}>Lenke (URL)</label>
        <input
          type="url"
          value={task.clickUrl ?? ''}
          onChange={e => update({ clickUrl: e.target.value || null })}
          placeholder="https://..."
          style={inputStyle}
        />
      </div>

      {/* Color picker */}
      <div>
        <label style={fieldLabel}>Farge</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              onClick={() => update({ color: c })}
              title={c}
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                background: c,
                border: '1px solid var(--swatch-border)',
                outline: task.color === c ? '2px solid var(--color-text)' : 'none',
                outlineOffset: 1,
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Duration display */}
      {durationDays !== null && (
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          {durationDays} dager
        </div>
      )}

      {/* Delete */}
      <div style={{ marginTop: 'auto', paddingTop: 8 }}>
        <button
          onClick={handleDelete}
          aria-label={`Slett oppgave ${task.label}`}
          style={{
            width: '100%',
            padding: '8px',
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Slett oppgave
        </button>
      </div>
    </div>
  )
}
