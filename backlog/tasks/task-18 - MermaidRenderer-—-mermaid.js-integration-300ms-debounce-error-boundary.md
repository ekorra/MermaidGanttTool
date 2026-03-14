---
id: TASK-18
title: 'MermaidRenderer — mermaid.js integration, 300ms debounce, error boundary'
status: Done
assignee: []
created_date: '2026-03-13 08:15'
updated_date: '2026-03-13 09:34'
labels:
  - phase-5
dependencies:
  - TASK-4
---

## Description

React component that renders the live Mermaid diagram preview using `mermaid.js`. Uses a 300ms debounce to avoid re-rendering on every keystroke. Shows a non-destructive yellow warning on invalid syntax (expected during editing).

## Acceptance Criteria

- [x] `mermaid.initialize({ startOnLoad: false, theme: 'default' })` called once at module level
- [x] 300ms debounce on syntax changes
- [x] `mermaid.render(id, syntax)` called with an incrementing unique ID
- [x] Invalid syntax shows a yellow warning message, does not crash
- [x] Previous valid diagram stays visible while user is mid-edit

## Definition of Done

- [x] Implemented in `src/components/Preview/MermaidRenderer.tsx`
- [x] Renders in Preview panel without console errors
