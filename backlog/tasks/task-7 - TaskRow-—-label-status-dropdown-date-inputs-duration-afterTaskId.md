---
id: TASK-7
title: 'TaskRow — label, status dropdown, date inputs, duration, afterTaskId'
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 09:21'
labels:
  - phase-3
dependencies:
  - TASK-6
---

## Description

Inline task editing row inside the editor panel. Superseded by TASK-24 (`TaskDetailPanel`), which moved all editing to the right-side detail panel.

## Acceptance Criteria

- [x] Label input with debounced update
- [x] Status dropdown: none / active / done / crit / milestone
- [x] Start date and end date inputs (end date hidden when afterTaskId set)
- [x] Duration input (hidden when endDate set — mutually exclusive)
- [x] afterTaskId dropdown listing all other tasks

## Definition of Done

- [x] `src/components/Editor/TaskRow.tsx` implemented
- [x] Replaced by `TaskDetailPanel.tsx` in TASK-24
