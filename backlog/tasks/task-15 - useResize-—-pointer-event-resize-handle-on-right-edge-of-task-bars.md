---
id: TASK-15
title: useResize — pointer-event resize handle on right edge of task bars
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 09:31'
labels:
  - phase-4
dependencies:
  - TASK-12
---

## Description

Resize handle on the right edge of task bars. Dragging it changes the task duration (or end date).

## Acceptance Criteria

- [x] 8px wide transparent hit area on right edge of task bar
- [x] Drag right edge → updates `duration` (or `endDate` if set) in model
- [x] Snaps to whole-day increments
- [x] Minimum 1-day duration enforced
- [x] Uses `setPointerCapture` for reliable out-of-bounds tracking

## Definition of Done

- [x] `useResize` hook in `src/hooks/useResize.ts`
- [x] Resize handle wired into `TaskBar.tsx`
