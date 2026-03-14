---
id: TASK-14
title: 'Horizontal drag — snap-to-day, update model on drop'
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

Horizontal drag for task bars. Originally planned with dnd-kit, but replaced with a custom SVG pointer-event hook (`useDrag`) after discovering dnd-kit is incompatible with SVG `<g>` elements.

**ADR:** `backlog/decisions/decision-3-svg-pointer-events-instead-of-dnd-kit.md`

## Acceptance Criteria

- [x] Drag task bar horizontally → `startDate` updates in model
- [x] Snaps to whole-day increments
- [x] Minimum 4px movement threshold before drag activates (prevents accidental drags)
- [x] `setPointerCapture` ensures tracking works outside the SVG element
- [x] `afterTaskId` tasks update visually when their anchor moves (resolved positions recalculate)

## Definition of Done

- [x] `useDrag` hook in `src/hooks/useDrag.ts`
- [x] Drag wired into `TaskBar.tsx`
- [x] dnd-kit removed from dependencies
