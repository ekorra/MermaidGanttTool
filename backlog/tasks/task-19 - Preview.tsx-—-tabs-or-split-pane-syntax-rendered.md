---
id: TASK-19
title: Preview.tsx — tabs or split pane (syntax + rendered)
status: Done
assignee: []
created_date: '2026-03-13 08:15'
updated_date: '2026-03-13 09:34'
labels:
  - phase-5
dependencies:
  - TASK-4
  - TASK-18
---

## Description

Tabbed container in the bottom preview pane. Lets the user switch between the raw Mermaid syntax view (`SyntaxPane`) and the live rendered diagram view (`MermaidRenderer`).

## Acceptance Criteria

- [x] Two tabs: "Syntax" and "Preview"
- [x] "Syntax" tab shows `SyntaxPane` (read-only textarea)
- [x] "Preview" tab shows `MermaidRenderer` (live diagram)
- [x] Active tab visually indicated
- [x] State persists while switching tabs (no re-mount flicker)

## Definition of Done

- [x] Implemented in `src/components/Preview/Preview.tsx`
- [x] Wired into `App.tsx` as the bottom pane
