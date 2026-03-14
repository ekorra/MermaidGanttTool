---
id: TASK-11
title: TimelineHeader — date axis rendering
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

Sticky date axis above the canvas with weekly tick marks and date labels.

## Acceptance Criteria

- [x] `HEADER_HEIGHT = 40px`
- [x] Weekly tick marks aligned with the canvas grid
- [x] Date labels formatted per `chart.axisFormat`
- [x] Stays in sync with canvas scroll

## Definition of Done

- [x] Implemented in `src/components/Canvas/TimelineHeader.tsx`
- [x] Renders correctly across the full chart date range
