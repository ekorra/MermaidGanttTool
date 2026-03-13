import type { GanttTask, GanttSection, TaskStatus } from '../../model/types'

interface TaskRowProps {
  task: GanttTask
  allSections: GanttSection[]
  onUpdate: (patch: Partial<GanttTask>) => void
  onDelete: () => void
}

const STATUS_OPTIONS: Array<{ value: TaskStatus | ''; label: string }> = [
  { value: '', label: 'None' },
  { value: 'active', label: 'Active' },
  { value: 'done', label: 'Done' },
  { value: 'crit', label: 'Critical' },
  { value: 'milestone', label: 'Milestone' },
]

const inputStyle: React.CSSProperties = {
  padding: '2px 6px',
  border: '1px solid var(--color-border)',
  borderRadius: 3,
  background: 'var(--color-bg)',
  fontSize: 12,
  width: '100%',
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--color-text-muted)',
  marginBottom: 2,
  display: 'block',
}

export function TaskRow({ task, allSections, onUpdate, onDelete }: TaskRowProps) {
  const allTasks = allSections.flatMap(s => s.tasks).filter(t => t.id !== task.id)

  return (
    <div style={{
      padding: '8px 10px',
      background: 'var(--color-bg)',
      borderRadius: 4,
      border: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      {/* Label + delete */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          type="text"
          value={task.label}
          onChange={e => onUpdate({ label: e.target.value })}
          placeholder="Task label"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          onClick={onDelete}
          title="Delete task"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: 16,
            lineHeight: 1,
            padding: '0 2px',
          }}
          onMouseOver={e => (e.currentTarget.style.color = '#dc3545')}
          onMouseOut={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          ×
        </button>
      </div>

      {/* Status */}
      <div>
        <label style={labelStyle}>Status</label>
        <select
          value={task.status ?? ''}
          onChange={e => onUpdate({ status: (e.target.value as TaskStatus) || null })}
          style={inputStyle}
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Dependency (after) */}
      <div>
        <label style={labelStyle}>Starts after</label>
        <select
          value={task.afterTaskId ?? ''}
          onChange={e => onUpdate({ afterTaskId: e.target.value || null })}
          style={inputStyle}
        >
          <option value="">— none (use start date) —</option>
          {allTasks.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Start date (shown only when no afterTaskId) */}
      {task.afterTaskId === null && (
        <div>
          <label style={labelStyle}>Start date</label>
          <input
            type="date"
            value={task.startDate ?? ''}
            onChange={e => onUpdate({ startDate: e.target.value || null })}
            style={inputStyle}
          />
        </div>
      )}

      {/* End date OR duration */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div>
          <label style={labelStyle}>End date</label>
          <input
            type="date"
            value={task.endDate ?? ''}
            onChange={e => onUpdate({ endDate: e.target.value || null, duration: e.target.value ? null : task.duration })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Duration</label>
          <input
            type="text"
            value={task.endDate ? '' : (task.duration ?? '')}
            disabled={task.endDate !== null}
            onChange={e => onUpdate({ duration: e.target.value || null })}
            placeholder="e.g. 3d, 1w"
            style={{ ...inputStyle, opacity: task.endDate ? 0.4 : 1 }}
          />
        </div>
      </div>
    </div>
  )
}
