import type { GanttSection, GanttTask } from '../../model/types'
import { EditableLabel } from '../shared/EditableLabel'
import { TaskRow } from './TaskRow'

interface SectionRowProps {
  section: GanttSection
  allSections: GanttSection[]
  onUpdate: (patch: Partial<Omit<GanttSection, 'tasks'>>) => void
  onDelete: () => void
  onAddTask: () => void
  onUpdateTask: (taskId: string, patch: Partial<GanttTask>) => void
  onDeleteTask: (taskId: string) => void
}

export function SectionRow({
  section,
  allSections,
  onUpdate,
  onDelete,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: SectionRowProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      {/* Section header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 8px',
        background: 'var(--color-primary)',
        color: '#fff',
        borderRadius: '4px 4px 0 0',
      }}>
        <EditableLabel
          value={section.title}
          onChange={title => onUpdate({ title })}
          placeholder="Section name"
          style={{ flex: 1, fontWeight: 600, fontSize: 13, color: '#fff' }}
        />
        <button
          onClick={onDelete}
          title="Delete section"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 16,
            lineHeight: 1,
            padding: '0 2px',
            cursor: 'pointer',
          }}
          onMouseOver={e => (e.currentTarget.style.color = '#fff')}
          onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
        >
          ×
        </button>
      </div>

      {/* Tasks */}
      <div style={{
        border: '1px solid var(--color-border)',
        borderTop: 'none',
        borderRadius: '0 0 4px 4px',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        background: 'var(--color-surface)',
      }}>
        {section.tasks.map(task => (
          <TaskRow
            key={task.id}
            task={task}
            allSections={allSections}
            onUpdate={patch => onUpdateTask(task.id, patch)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}

        <button
          onClick={onAddTask}
          style={{
            alignSelf: 'flex-start',
            padding: '4px 10px',
            fontSize: 12,
            background: 'none',
            border: '1px dashed var(--color-border)',
            borderRadius: 3,
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
          }}
          onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
          onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
        >
          + Add task
        </button>
      </div>
    </div>
  )
}
