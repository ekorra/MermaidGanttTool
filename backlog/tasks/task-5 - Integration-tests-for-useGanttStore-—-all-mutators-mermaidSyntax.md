---
id: TASK-5
title: Integration tests for useGanttStore — all mutators + mermaidSyntax
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 08:57'
labels:
  - phase-2
dependencies:
  - TASK-1
---

## Description

Vitest integration tests that exercise every mutator in `useGanttStore` and verify that `mermaidSyntax` is correctly derived after each state change.

## Acceptance Criteria

- [x] Tests for: `addSection`, `updateSection`, `deleteSection`
- [x] Tests for: `addTask`, `updateTask`, `deleteTask`, `moveTask`
- [x] `mermaidSyntax` verified after mutations
- [x] Uses `@testing-library/react` `renderHook`
- [x] Minimum 12 test cases

## Definition of Done

- [x] All tests in `tests/integration/useGanttStore.test.ts`
- [x] `npm run test:run` passes with no failures
