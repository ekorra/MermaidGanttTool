---
id: TASK-26
title: Multiple after-dependencies (after task1 task2)
status: Done
assignee: []
created_date: '2026-03-14'
labels:
  - mermaid-spec
  - model
dependencies: []
---

## Description

Mermaid supports `after task1 task2` syntax — a task starts after the *latest* end date among the listed tasks. Currently we only support one `afterTaskId`. This change allows linking to multiple predecessor tasks.

## Acceptance Criteria

- [ ] `GanttTask.afterTaskIds: string[]` replaces `afterTaskId: string | null`
- [ ] `exportToMermaid()` emits `after id1 id2 ...` when multiple IDs present
- [ ] `resolveTaskPositions()` computes start as max end date of all predecessors
- [ ] `TaskDetailPanel` allows adding/removing multiple predecessor tasks
- [ ] `DependencyArrow` renders one arrow per predecessor
- [ ] Backward compatible: single-item array behaves identically to old single ID

## Definition of Done

- [ ] `src/model/types.ts` updated (`afterTaskIds: string[]`)
- [ ] `src/model/export.ts` updated
- [ ] `src/utils/taskPositions.ts` updated
- [ ] `src/components/Editor/TaskDetailPanel.tsx` updated
- [ ] `src/components/Canvas/DependencyArrow.tsx` updated
- [ ] All existing tests updated and passing
- [ ] `npm run typecheck && npm run test:run` passes
- [ ] Committed and pushed
