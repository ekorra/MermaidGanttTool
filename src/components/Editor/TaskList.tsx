import type { GanttStore } from '../../state/useGanttStore'
import { EditableLabel } from '../shared/EditableLabel'
import { DEFAULT_TASK_COLOR } from '../../utils/colors'

interface TaskListProps {
  store: GanttStore
  selectedTaskId: string | null
  onSelectTask: (id: string | null) => void
}

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  active:    { label: 'active',    bg: '#d1f5e0', color: '#1a7a3c' },
  done:      { label: 'done',      bg: '#e2e8f0', color: '#4a5568' },
  crit:      { label: 'crit',      bg: '#fde8e8', color: '#c53030' },
  milestone: { label: 'milestone', bg: '#fef3c7', color: '#92400e' },
}

export function TaskList({ store, selectedTaskId, onSelectTask }: TaskListProps) {
  const { chart, addSection, updateSection, deleteSection, addTask } = store

  return (
    <div style={{
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px 8px',
      gap: 8,
    }}>
      {chart.sections.map(section => (
        <div key={section.id}>
          {/* Section header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 8px',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: 2,
          }}>
            <EditableLabel
              value={section.title}
              onChange={title => updateSection(section.id, { title })}
              placeholder="Section name"
              style={{ flex: 1, fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}
            />
            <button
              onClick={() => deleteSection(section.id)}
              title="Delete section"
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 15, cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}
            >
              ×
            </button>
          </div>

          {/* Task rows */}
          {section.tasks.map(task => {
            const isSelected = task.id === selectedTaskId
            const dotColor = task.color ?? DEFAULT_TASK_COLOR
            const badge = task.status ? STATUS_BADGE[task.status] : null

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(isSelected ? null : task.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 8px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  background: isSelected ? 'var(--color-primary)' : 'transparent',
                  marginBottom: 1,
                }}
                onMouseOver={e => { if (!isSelected) e.currentTarget.style.background = 'var(--color-border)' }}
                onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >
                {/* Color dot */}
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: dotColor,
                  flexShrink: 0,
                }} />

                {/* Label */}
                <span style={{
                  flex: 1,
                  fontSize: 13,
                  color: isSelected ? '#fff' : 'var(--color-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {task.label}
                </span>

                {/* Status badge */}
                {badge && (
                  <span style={{
                    fontSize: 10,
                    padding: '1px 5px',
                    borderRadius: 3,
                    background: isSelected ? 'rgba(255,255,255,0.25)' : badge.bg,
                    color: isSelected ? '#fff' : badge.color,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {badge.label}
                  </span>
                )}
              </div>
            )
          })}

          {/* Add task */}
          <button
            onClick={() => addTask(section.id)}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 2,
              padding: '4px 8px',
              textAlign: 'left',
              fontSize: 12,
              background: 'none',
              border: '1px dashed var(--color-border)',
              borderRadius: 4,
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
          >
            + Ny oppgave
          </button>
        </div>
      ))}

      {/* Add section */}
      <button
        onClick={() => addSection()}
        style={{
          marginTop: 4,
          padding: '7px 8px',
          background: 'none',
          border: '1px dashed var(--color-border)',
          borderRadius: 4,
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          fontSize: 12,
          textAlign: 'left',
        }}
        onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
        onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
      >
        + Ny seksjon
      </button>
    </div>
  )
}
