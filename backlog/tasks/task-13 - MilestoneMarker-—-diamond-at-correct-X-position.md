---
id: TASK-13
title: MilestoneMarker — diamond at correct X position
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 09:31'
labels:
  - phase-4
dependencies:
  - TASK-10
---

## Description

SVG diamond polygon for tasks with `status = 'milestone'`. Positioned at the task's resolved start date X coordinate.

## Acceptance Criteria

- [x] Diamond shape rendered as SVG `<polygon>`
- [x] Positioned at `dateToX(resolvedStart)`
- [x] Color follows `task.color ?? STATUS_COLORS.milestone`
- [x] `STATUS_COLORS` exported for reuse across canvas components

## Definition of Done

- [x] Implemented in `src/components/Canvas/MilestoneMarker.tsx`
- [x] Diamond visible on canvas for milestone tasks
