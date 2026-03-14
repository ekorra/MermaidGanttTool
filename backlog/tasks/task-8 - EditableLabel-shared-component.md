---
id: TASK-8
title: EditableLabel shared component
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 09:21'
labels:
  - phase-3
dependencies: []
---

## Description

Reusable click-to-edit label component. Renders as plain text until clicked, then becomes an `<input>`. Used for section titles and task labels throughout the editor.

## Acceptance Criteria

- [x] Renders as `<span>` in display mode
- [x] Click → switches to `<input>` with current value pre-filled
- [x] Commits on `blur` or `Enter`
- [x] Cancels (reverts) on `Escape`
- [x] `onCommit(value)` callback called only when value actually changed

## Definition of Done

- [x] Implemented in `src/components/shared/EditableLabel.tsx`
- [x] Used in SectionRow and TaskList
