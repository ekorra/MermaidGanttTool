---
id: TASK-17
title: 'E2E: canvas.spec.ts — drag changes startDate, resize changes duration'
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-14 09:00'
labels:
  - phase-4
  - testing
dependencies:
  - TASK-14
  - TASK-15
---

## Description

Playwright E2E tests for the canvas: verifies that SVG renders, task bars appear, milestones appear as diamonds, drag changes `startDate`, and resize changes duration.

## Acceptance Criteria

- [x] Canvas SVG element present in DOM (`data-testid="canvas-svg"`)
- [x] At least one task bar visible (`data-testid="task-bar-*"`)
- [x] Milestone diamond visible
- [x] Drag a task bar → Mermaid syntax reflects new start date
- [x] Resize a task bar → Mermaid syntax reflects new duration

## Definition of Done

- [x] Tests in `tests/e2e/canvas.spec.ts`
- [x] All tests pass with `npm run test:e2e`
