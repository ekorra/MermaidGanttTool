---
id: decision-3
title: dnd-kit for drag-and-drop interaction
date: '2026-03-13'
status: accepted
---
## Context

Drag-and-drop is required for moving and resizing task bars on the Gantt canvas. Options:

- Custom pointer events (pointerdown/pointermove/pointerup) — zero dependencies, full control
- `react-beautiful-dnd` — deprecated
- `dnd-kit` — modern, pointer-event based, ~10KB gzipped, keyboard accessible

## Decision

Use `@dnd-kit/core` + `@dnd-kit/modifiers` for horizontal task drag. Use custom pointer events for resize (right-edge handle).

## Rationale

dnd-kit uses a virtual coordinate model (not DOM-tree traversal), making it compatible with shadow DOM and browser extension environments. Built-in `restrictToHorizontalAxis` modifier and snap-to-grid support reduces custom code. Keyboard accessibility is built-in. Resize is a different interaction than drag (single-edge, not whole element) — easier to handle with ~30 lines of custom pointer event code.

## Consequences

- Only external UI library added to the project (10KB gzipped)
- Browser extension port remains feasible — no DOM walking
- Resize handle stays as custom code in `useResize.ts`
