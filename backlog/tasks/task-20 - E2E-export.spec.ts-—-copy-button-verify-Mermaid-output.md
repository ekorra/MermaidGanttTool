---
id: TASK-20
title: 'E2E: export.spec.ts — copy button, verify Mermaid output'
status: Done
assignee: []
created_date: '2026-03-13 08:15'
updated_date: '2026-03-14 09:00'
labels:
  - phase-5
  - testing
dependencies:
  - TASK-4
  - TASK-19
---

## Description

Playwright E2E tests that verify the Mermaid syntax output is correct, the copy button works, and the Preview tab switches to the rendered diagram.

## Acceptance Criteria

- [x] SyntaxPane contains valid Mermaid header (`gantt`, `dateFormat`, `title`)
- [x] Copy button copies syntax to clipboard
- [x] Switching to "Preview" tab renders a diagram (no error message visible)
- [x] Editing a task label updates the syntax in real time

## Definition of Done

- [x] Tests in `tests/e2e/export.spec.ts`
- [x] All tests pass with `npm run test:e2e`
