---
id: TASK-16
title: DependencyArrow — SVG overlay after all bars are positioned
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

Dashed curved arrows connecting tasks that have `afterTaskId` set. Rendered as SVG cubic bezier curves with an arrowhead marker.

## Acceptance Criteria

- [x] Arrow drawn from right edge of anchor task to left edge of dependent task
- [x] Cubic bezier curve (not straight line)
- [x] Dashed stroke style
- [x] Arrowhead marker at destination
- [x] `<ArrowDefs>` renders `<defs>` once in Canvas SVG (not per arrow)
- [x] Arrows render on top of task bars (correct SVG z-order)

## Definition of Done

- [x] Implemented in `src/components/Canvas/DependencyArrow.tsx`
- [x] Visible for all tasks with `afterTaskId` set
