---
id: TASK-21
title: localStorage persistence (wrap setChart in the store)
status: Done
assignee: []
created_date: '2026-03-13 08:15'
updated_date: '2026-03-13 10:00'
labels:
  - phase-6
dependencies:
  - TASK-1
---

## Description

Persist the `GanttChart` state to `localStorage` so that the user's work survives a page refresh. Load saved state on startup; fall back to the default sample chart if no saved state exists.

## Acceptance Criteria

- [x] Chart state written to `localStorage` on every mutation
- [x] Chart state loaded from `localStorage` on app startup
- [x] Falls back to `createChart()` if localStorage is empty or corrupted
- [x] Storage key: `mermaid-gantt-chart`
- [x] No noticeable performance impact (write is synchronous but fast for this data size)

## Definition of Done

- [x] Persistence logic in `src/state/useGanttStore.ts`
- [x] Refresh page → work is preserved
