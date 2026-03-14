---
id: TASK-9
title: 'E2E: editor.spec.ts — add/edit/delete sections and tasks'
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-14 09:00'
labels:
  - phase-3
  - testing
dependencies:
  - TASK-6
  - TASK-7
  - TASK-24
---

## Description

Playwright E2E tests covering the full editor panel workflow: loading default data, adding/renaming/deleting sections and tasks.

## Acceptance Criteria

- [x] Default sample data renders on load (section names + task names visible)
- [x] Add section → new section appears in list
- [x] Rename section → name updates in list and canvas
- [x] Delete section → section and its tasks disappear
- [x] Add task to a section → task appears in list and canvas
- [x] Click task → TaskDetailPanel opens with task data
- [x] Edit task name in detail panel → updates in list
- [x] Delete task → task removed from list and canvas

## Definition of Done

- [x] Tests in `tests/e2e/editor.spec.ts`
- [x] All tests pass with `npm run test:e2e`
