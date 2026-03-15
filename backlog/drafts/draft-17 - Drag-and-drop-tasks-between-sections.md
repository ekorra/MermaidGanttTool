---
id: DRAFT-17
title: Drag and drop tasks between sections
status: Draft
assignee: []
created_date: '2026-03-15 14:24'
labels: [ux, editor]
dependencies: []
---

## Description

Allow tasks to be dragged from one section to another in the TaskList (left panel). Today tasks can be reordered within a section; this extends that to cross-section moves.

When a task is moved to a different section, any **dependency links that cross the move boundary may become inconsistent**:

- **Outgoing dependencies broken:** other tasks that have `afterTaskIds` referencing the moved task are unaffected — the reference follows the task ID, which doesn't change.
- **Incoming dependencies broken:** if the moved task itself has `afterTaskIds` pointing to tasks that are now in a different section, the logical grouping is broken even if the Mermaid syntax still works.
- **User confirmation required** when the move would break at least one dependency (either the moved task depends on a task in the old section, or tasks in the old section depend on the moved task). User must confirm before the move is applied. If declined, the task stays in place.

## Behaviour spec

- Drag handle visible on hover for each task row in TaskList
- Drop targets: section headers and the gap between tasks in another section
- Drop position determines insertion index within the target section
- On drop:
  1. Identify broken dependencies (tasks in other sections that reference the moved task via `afterTaskIds`, or the moved task's own `afterTaskIds` pointing to tasks left behind)
  2. If any broken dependency found → show confirmation dialog listing which links will be removed
  3. User confirms → move task + remove broken `afterTaskIds` entries
  4. User cancels → no change
- If no dependencies are broken → move immediately, no dialog

## Implementation notes

- `useGanttStore.moveTask()` already exists and handles the data move — only needs the broken-dependency cleanup added as an option
- The TaskList currently uses no DnD library for task rows — consider using the browser's native drag-and-drop API (`draggable`, `onDragOver`, `onDrop`) to keep bundle size small, or `@dnd-kit` which is already a project dependency
- Dependency detection: before move, collect all `afterTaskIds` across all tasks, check which ones reference the moved task or are referenced by the moved task, then filter to those that cross section boundaries
- The confirmation dialog can reuse the existing modal style (backdrop + centered card) — no new component needed if kept simple

## Open questions

- Should the drag handle be visible always or only on hover?
- Should broken dependencies be listed by name in the confirmation, or just a count ("2 dependencies will be removed")?
