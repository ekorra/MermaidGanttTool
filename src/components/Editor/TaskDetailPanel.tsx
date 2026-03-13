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
  { value: '',          label: 'Normal' },
  { value: 'active',   label: 'Active' },
  { value: 'done',     label: 'Done' },
  { value: 'crit',     label: 'Critical' },
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
          onChange={e => update({ status: (e.target.value as TaskStatus) || null })}
          style={inputStyle}
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Starts after */}
      <div>
        <label style={fieldLabel}>Starter etter</label>
        <select
          value={task.afterTaskId ?? ''}
          onChange={e => update({ afterTaskId: e.target.value || null })}
          style={inputStyle}
        >
          <option value="">— ingen (bruk startdato) —</option>
          {allOtherTasks.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Start date (only when no afterTaskId) */}
      {task.afterTaskId === null && (
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
                border: task.color === c ? '2px solid var(--color-text)' : '2px solid transparent',
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
