---
id: TASK-29
title: Tasks without a section (ungrouped)
status: Done
assignee: []
created_date: '2026-03-14'
labels:
  - mermaid-spec
  - ux
dependencies: []
---

## Description

Mermaid allows tasks before the first `section` declaration — they render without a section header. This task adds a built-in "ungrouped" section (no title emitted) so users can add tasks that sit outside any named section.

## Acceptance Criteria

- [ ] First section in the chart can have `title: ""` (empty string) — treated as ungrouped
- [ ] `exportToMermaid()` omits the `section` line when `section.title === ""`
- [ ] `TaskList` renders an ungrouped section without a section header row
- [ ] New charts do NOT include an ungrouped section by default
- [ ] "Add ungrouped task" button or equivalent in the left panel

## Definition of Done

- [ ] `src/model/export.ts` handles empty section title
- [ ] `src/components/Editor/TaskList.tsx` renders ungrouped tasks correctly
- [ ] Unit tests for export cover ungrouped sections
- [ ] `npm run typecheck && npm run test:run` passes
- [ ] Committed and pushed
