import type { GanttStore } from '../../state/useGanttStore'
import { SectionRow } from './SectionRow'

interface SectionListProps {
  store: GanttStore
}

export function SectionList({ store }: SectionListProps) {
  const { chart, addSection, updateSection, deleteSection, addTask, updateTask, deleteTask } = store

  return (
    <div style={{
      height: '100%',
      overflow: 'auto',
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {chart.sections.map(section => (
        <SectionRow
          key={section.id}
          section={section}
          allSections={chart.sections}
          onUpdate={patch => updateSection(section.id, patch)}
          onDelete={() => deleteSection(section.id)}
          onAddTask={() => addTask(section.id)}
          onUpdateTask={(taskId, patch) => updateTask(section.id, taskId, patch)}
          onDeleteTask={taskId => deleteTask(section.id, taskId)}
        />
      ))}

      <button
        onClick={() => addSection()}
        style={{
          marginTop: 4,
          padding: '7px 12px',
          background: 'none',
          border: '1px dashed var(--color-border)',
          borderRadius: 4,
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          fontSize: 13,
          textAlign: 'left',
        }}
        onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
        onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
      >
        + Add section
      </button>
    </div>
  )
}
