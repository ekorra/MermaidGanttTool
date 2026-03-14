---
id: TASK-25
title: Combined task statuses (crit+active, crit+done)
status: To Do
assignee: []
created_date: '2026-03-14'
labels:
  - mermaid-spec
  - model
dependencies: []
---

## Description

Mermaid supports combining `crit` with `active` or `done` (e.g. `crit, active, id, ...`). Currently we only allow one status per task. This change allows a task to be both critical and have a lifecycle status.

## Acceptance Criteria

- [ ] `GanttTask.status` extended to support `crit+active` and `crit+done` combinations
- [ ] `exportToMermaid()` emits both tags: `crit, active, id, ...`
- [ ] Status dropdown in `TaskDetailPanel` shows the combined options
- [ ] Canvas renders combined statuses visually (e.g. red + striped, or use `crit` color as primary)
- [ ] Existing unit tests for export still pass

## Definition of Done

- [ ] `src/model/types.ts` updated (`TaskStatus` covers combinations)
- [ ] `src/model/export.ts` emits correct combined tags
- [ ] `src/components/Editor/TaskDetailPanel.tsx` offers combined options in status dropdown
- [ ] `npm run typecheck && npm run test:run` passes
- [ ] Committed and pushed
