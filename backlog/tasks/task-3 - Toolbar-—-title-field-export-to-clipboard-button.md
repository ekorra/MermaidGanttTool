---
id: TASK-3
title: Toolbar — title field + export-to-clipboard button
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 08:57'
labels:
  - phase-2
dependencies: []
---

## Description

Top toolbar with chart title input, date format selector, and a "Copy Mermaid" button that copies the current syntax to the clipboard.

## Acceptance Criteria

- [x] Title `<input>` updates `chart.title` via `updateChartMeta`
- [x] Date format `<select>` with options: `YYYY-MM-DD`, `MM/DD/YYYY`, `DD-MM-YYYY`
- [x] "Copy Mermaid" button copies `mermaidSyntax` to clipboard
- [x] Copy button shows brief visual feedback on success

## Definition of Done

- [x] Implemented in `src/components/shared/Toolbar.tsx`
- [x] Renders in 48px toolbar row
