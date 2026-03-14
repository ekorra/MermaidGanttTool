import { useState, useRef } from 'react'
import type { GanttStore } from '../../state/useGanttStore'
import { EditableLabel } from '../shared/EditableLabel'
import { DEFAULT_TASK_COLOR } from '../../utils/colors'

interface TaskListProps {
  store: GanttStore
  selectedTaskId: string | null
  onSelectTask: (id: string | null) => void
}

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  active:       { label: 'active',    bg: 'var(--badge-active-bg)',    color: 'var(--badge-active-color)' },
  done:         { label: 'done',      bg: 'var(--badge-done-bg)',      color: 'var(--badge-done-color)' },
  crit:         { label: 'crit',      bg: 'var(--badge-crit-bg)',      color: 'var(--badge-crit-color)' },
  'crit+active':{ label: 'crit',      bg: 'var(--badge-crit-bg)',      color: 'var(--badge-crit-color)' },
  'crit+done':  { label: 'crit/done', bg: 'var(--badge-critdone-bg)',  color: 'var(--badge-critdone-color)' },
  milestone:    { label: 'milestone', bg: 'var(--badge-milestone-bg)', color: 'var(--badge-milestone-color)' },
}

export function TaskList({ store, selectedTaskId, onSelectTask }: TaskListProps) {
  const { chart, addSection, updateSection, deleteSection, addTask, updateTask } = store
  const [renamingTaskId, setRenamingTaskId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

  const startRename = (taskId: string, currentLabel: string) => {
    setRenamingTaskId(taskId)
    setRenameDraft(currentLabel)
    // focus is handled by autoFocus on the input
  }

  const commitRename = (sectionId: string, taskId: string) => {
    const trimmed = renameDraft.trim()
    if (trimmed) updateTask(sectionId, taskId, { label: trimmed })
    setRenamingTaskId(null)
  }

  const cancelRename = () => setRenamingTaskId(null)

  // Check if an ungrouped section (empty title) already exists
  const hasUngrouped = chart.sections.some(s => s.title === '')

  return (
    <div
      data-testid="task-list"
      style={{
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 8px',
        gap: 8,
      }}
    >
      {chart.sections.map(section => (
        <div key={section.id}>
          {/* Section header — hidden for ungrouped (empty title) sections */}
          {section.title !== '' ? (
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
                aria-label={`Slett seksjon ${section.title}`}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 15, cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '3px 8px',
              marginBottom: 2,
            }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Ingen seksjon
              </span>
              <button
                onClick={() => deleteSection(section.id)}
                title="Delete ungrouped section"
                aria-label="Slett seksjon uten navn"
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 13, cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          )}

          {/* Task rows */}
          {section.tasks.map(task => {
            const isSelected = task.id === selectedTaskId
            const dotColor = task.color ?? DEFAULT_TASK_COLOR
            const badge = task.status ? STATUS_BADGE[task.status] : null

            return (
              <div
                key={task.id}
                data-testid={`task-item-${task.label}`}
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
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: dotColor,
                  flexShrink: 0,
                }} />
                {renamingTaskId === task.id ? (
                  <input
                    ref={renameInputRef}
                    autoFocus
                    value={renameDraft}
                    onChange={e => setRenameDraft(e.target.value)}
                    onBlur={() => commitRename(section.id, task.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitRename(section.id, task.id)
                      if (e.key === 'Escape') cancelRename()
                    }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      padding: '1px 4px',
                      border: '1px solid var(--color-primary)',
                      borderRadius: 3,
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      outline: 'none',
                      minWidth: 0,
                    }}
                  />
                ) : (
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: isSelected ? '#fff' : 'var(--color-text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    onDoubleClick={e => {
                      e.stopPropagation()
                      startRename(task.id, task.label)
                    }}
                    title="Double-click to rename"
                  >
                    {task.label}
                  </span>
                )}
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
            data-testid="add-task"
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
        data-testid="add-section"
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

      {/* Add ungrouped task (only if no ungrouped section exists yet) */}
      {!hasUngrouped && (
        <button
          onClick={() => {
            // Create an ungrouped section and immediately add a task
            const { addSection: as, addTask: at } = store
            as('')
            // The new section is appended — find it after state update via setTimeout
            setTimeout(() => {
              const ungrouped = store.chart.sections.find(s => s.title === '')
              if (ungrouped) at(ungrouped.id)
            }, 0)
          }}
          style={{
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
          + Oppgave uten seksjon
        </button>
      )}
    </div>
  )
}
