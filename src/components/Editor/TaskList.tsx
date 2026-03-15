import { useState, useRef } from 'react'
import type { GanttStore } from '../../state/useGanttStore'
import { EditableLabel } from '../shared/EditableLabel'
import { DEFAULT_TASK_COLOR } from '../../utils/colors'
import { useLocale } from '../../i18n/LocaleContext'

interface TaskListProps {
  store: GanttStore
  selectedTaskId: string | null
  onSelectTask: (id: string | null) => void
}

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  active:       { bg: 'var(--badge-active-bg)',    color: 'var(--badge-active-color)' },
  done:         { bg: 'var(--badge-done-bg)',      color: 'var(--badge-done-color)' },
  crit:         { bg: 'var(--badge-crit-bg)',      color: 'var(--badge-crit-color)' },
  'crit+active':{ bg: 'var(--badge-crit-bg)',      color: 'var(--badge-crit-color)' },
  'crit+done':  { bg: 'var(--badge-critdone-bg)',  color: 'var(--badge-critdone-color)' },
  milestone:    { bg: 'var(--badge-milestone-bg)', color: 'var(--badge-milestone-color)' },
}

// Badge labels come from translation keys (set in TaskList render)
const STATUS_BADGE_KEY: Record<string, string> = {
  active: 'taskStatusActive',
  done: 'taskStatusDone',
  crit: 'taskStatusCrit',
  'crit+active': 'taskStatusCrit',
  'crit+done': 'taskStatusCritDone',
  milestone: 'taskStatusMilestone',
}

export function TaskList({ store, selectedTaskId, onSelectTask }: TaskListProps) {
  const { chart, addSection, updateSection, deleteSection, addTask, updateTask } = store
  const { t } = useLocale()
  const [renamingTaskId, setRenamingTaskId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const renameInputRef = useRef<HTMLInputElement>(null)

  const startRename = (taskId: string, currentLabel: string) => {
    setRenamingTaskId(taskId)
    setRenameDraft(currentLabel)
  }

  const commitRename = (sectionId: string, taskId: string) => {
    const trimmed = renameDraft.trim()
    if (trimmed) updateTask(sectionId, taskId, { label: trimmed })
    setRenamingTaskId(null)
  }

  const cancelRename = () => setRenamingTaskId(null)

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
                placeholder={t.sectionNamePlaceholder}
                style={{ flex: 1, fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}
              />
              <button
                onClick={() => deleteSection(section.id)}
                title={t.deleteSectionTitle}
                aria-label={t.deleteSectionAriaLabel(section.title)}
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
                {t.ungroupedSectionLabel}
              </span>
              <button
                onClick={() => deleteSection(section.id)}
                title={t.deleteUngroupedTitle}
                aria-label={t.deleteUngroupedAriaLabel}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 13, cursor: 'pointer', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          )}

          {section.tasks.map(task => {
            const isSelected = task.id === selectedTaskId
            const dotColor = task.color ?? DEFAULT_TASK_COLOR
            const badgeStyle = task.status ? STATUS_BADGE[task.status] : null
            const badgeKey = task.status ? STATUS_BADGE_KEY[task.status] : null
            const badgeLabel = badgeKey ? (t as unknown as Record<string, string>)[badgeKey] : null

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
                    title={t.doubleClickToRename}
                  >
                    {task.label}
                  </span>
                )}
                {badgeStyle && badgeLabel && (
                  <span style={{
                    fontSize: 10,
                    padding: '1px 5px',
                    borderRadius: 3,
                    background: isSelected ? 'rgba(255,255,255,0.25)' : badgeStyle.bg,
                    color: isSelected ? '#fff' : badgeStyle.color,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {badgeLabel}
                  </span>
                )}
              </div>
            )
          })}

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
            {t.addTask}
          </button>
        </div>
      ))}

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
        {t.addSection}
      </button>

      {!hasUngrouped && (
        <button
          onClick={() => {
            const { addSection: as, addTask: at } = store
            as('')
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
          {t.addUngroupedTask}
        </button>
      )}
    </div>
  )
}
