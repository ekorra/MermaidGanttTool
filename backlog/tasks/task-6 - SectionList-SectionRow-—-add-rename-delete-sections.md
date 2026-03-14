---
id: TASK-6
title: 'SectionList + SectionRow — add, rename, delete sections'
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 09:21'
labels:
  - phase-3
dependencies:
  - TASK-1
---

## Description

Editor-panel components for managing sections. Superseded by TASK-24 (new TaskList), but the underlying logic fed the new design.

## Acceptance Criteria

- [x] Add section button appends a new section with a default title
- [x] Section title editable inline via `EditableLabel`
- [x] Delete button removes section and all its tasks
- [x] Sections rendered in order

## Definition of Done

- [x] `src/components/Editor/SectionList.tsx` and `SectionRow.tsx` implemented
- [x] Replaced by `TaskList.tsx` in TASK-24
