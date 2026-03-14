---
id: TASK-4
title: SyntaxPane — read-only textarea + copy button
status: Done
assignee: []
created_date: '2026-03-13 08:14'
updated_date: '2026-03-13 08:57'
labels:
  - phase-2
dependencies: []
---

## Description

Read-only textarea in the bottom preview panel that always reflects the current Mermaid syntax output. Dark editor theme for readability.

## Acceptance Criteria

- [x] `<textarea>` is read-only and updates on every chart change
- [x] Dark background (`#1e1e2e`), monospace font
- [x] `data-testid="syntax-pane"` for E2E targeting
- [x] Copy button in the pane header

## Definition of Done

- [x] Implemented in `src/components/Preview/SyntaxPane.tsx`
- [x] Visible in Preview panel bottom row
