---
id: TASK-10
title: useTimelineScale hook + integration tests
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 09:31'
labels:
  - phase-4
dependencies:
  - TASK-1
---

## Description

React hook that computes the pixel-per-day scale and conversion helpers (`dateToX`, `xToDate`, `durationToPx`, `pxToDuration`) from the chart's date range.

## Acceptance Criteria

- [x] `pxPerDay = 40` constant
- [x] `dateToX(date)` maps a date string to a canvas X coordinate
- [x] `xToDate(x)` is the inverse of `dateToX`
- [x] `durationToPx(days)` and `pxToDuration(px)` round-trip correctly
- [x] Scale recomputes when chart sections change (useMemo)

## Definition of Done

- [x] Implemented in `src/hooks/useTimelineScale.ts`
- [x] Integration tests passing
