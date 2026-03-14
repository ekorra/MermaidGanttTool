---
id: TASK-28
title: Click links on tasks (open URL)
status: To Do
assignee: []
created_date: '2026-03-14'
labels:
  - mermaid-spec
  - ux
dependencies: []
---

## Description

Mermaid supports `click <taskId> href "<url>"` directives that make a task clickable in the rendered diagram. This task adds a URL field to tasks and emits the correct `click` directives in the export.

## Acceptance Criteria

- [ ] `GanttTask.clickUrl: string | null` added to model
- [ ] `exportToMermaid()` emits `    click <taskId> href "<url>"` after all tasks in a section when `clickUrl` is set
- [ ] `TaskDetailPanel` shows a URL input field (shown only when field is expanded or always)
- [ ] URL input validates that the value looks like a URL before saving
- [ ] `clickUrl` is not rendered visually on the canvas (tooltip or icon is a nice-to-have)

## Definition of Done

- [ ] `src/model/types.ts` updated with `clickUrl: string | null`
- [ ] `src/model/export.ts` emits `click` directives
- [ ] `src/components/Editor/TaskDetailPanel.tsx` has URL input
- [ ] Unit tests for export cover tasks with/without `clickUrl`
- [ ] `npm run typecheck && npm run test:run` passes
- [ ] Committed and pushed
