---
id: TASK-24
title: UI redesign — three-panel layout, task detail panel, per-task colors
status: Done
assignee: []
created_date: '2026-03-13 11:00'
updated_date: '2026-03-14 09:00'
labels:
  - ux
  - enhancement
dependencies:
  - TASK-1
  - TASK-2
---

## Description

Redesign the UI to match the POC prototype. Replace the inline-edit editor panel with a compact section/task list on the left and a slide-in detail panel on the right when a task is selected. Add per-task colors (UI only, not exported to Mermaid).

## Acceptance Criteria

- [x] Left panel: compact list — section header + task rows (color dot + label + status badge)
- [x] Clicking a task opens `TaskDetailPanel` on the right (240px)
- [x] TaskDetailPanel fields: name, start date, end date, status dropdown, color picker, calculated duration, delete button
- [x] Color picker shows 9 preset swatches; selected color applied to task bar on canvas
- [x] Canvas: dark background, section labels as text, task bars use `task.color`
- [x] `color: string | null` added to `GanttTask` model (not exported in Mermaid syntax)
- [x] TaskDetailPanel closes when task is deleted or × is clicked

## Definition of Done

- [x] `src/components/Editor/TaskList.tsx` implemented
- [x] `src/components/Editor/TaskDetailPanel.tsx` implemented
- [x] `src/utils/colors.ts` with `PRESET_COLORS` palette
- [x] `src/model/types.ts` updated with `color` field
- [x] Canvas updated to use `task.color` with fallback to `STATUS_COLORS`
- [x] TypeScript strict — no errors
- [x] `npm run typecheck && npm run test:run` passes
