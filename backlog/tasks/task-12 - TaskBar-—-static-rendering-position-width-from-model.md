---
id: TASK-12
title: TaskBar — static rendering (position + width from model)
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 09:31'
labels:
  - phase-4
dependencies:
  - TASK-10
  - TASK-11
---

## Description

SVG `<g>` element representing a task bar on the canvas. Position and width are derived from `resolveTaskPositions()` + `useTimelineScale`. Drag and resize added in TASK-14/15.

## Acceptance Criteria

- [x] Bar X position = `dateToX(resolvedStart)`
- [x] Bar width = `durationToPx(resolvedDurationDays)`
- [x] Bar color from `task.color ?? STATUS_COLORS[task.status]`
- [x] Task label rendered inside or beside the bar
- [x] `data-testid="task-bar-{taskId}"` for E2E targeting

## Definition of Done

- [x] Implemented in `src/components/Canvas/TaskBar.tsx`
- [x] Renders for all task statuses without layout errors
