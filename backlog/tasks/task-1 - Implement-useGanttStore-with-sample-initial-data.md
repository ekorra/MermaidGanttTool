---
id: TASK-1
title: Implement useGanttStore with sample initial data
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 08:57'
labels:
  - phase-2
dependencies: []
---

## Description

Create the master React hook `useGanttStore` that owns the entire application state. Exposes the `GanttChart` data model, all mutators, and derived `mermaidSyntax`. Single source of truth — no other global state.

## Acceptance Criteria

- [x] Returns `GanttStore` with `chart` and `mermaidSyntax`
- [x] Initial state uses `createChart()` with realistic sample data (multiple sections, tasks of various statuses)
- [x] Mutators: `addSection`, `updateSection`, `deleteSection`, `reorderSections`
- [x] Mutators: `addTask`, `updateTask`, `deleteTask`, `reorderTask`, `moveTask`
- [x] `mermaidSyntax` derived inline on every render — never stale
- [x] All mutators use functional `setState`
- [x] `src/model/` has zero React imports

## Definition of Done

- [x] Implemented in `src/state/useGanttStore.ts`
- [x] Integration tests written and passing (TASK-5)
- [x] TypeScript strict — no `any`, no errors
