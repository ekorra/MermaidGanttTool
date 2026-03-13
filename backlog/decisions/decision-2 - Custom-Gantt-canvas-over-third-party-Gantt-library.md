---
id: decision-2
title: Custom Gantt canvas over third-party Gantt library
date: '2026-03-13'
status: accepted
---
## Context

The app needs a visual Gantt timeline with drag-and-drop, resize, milestones, and dependency arrows. Evaluated options:

- `frappe-gantt` — open source, lightweight, but Vanilla JS and not aligned with Mermaid's data model
- `dhtmlx-gantt` / `@bryntum/gantt` — feature-rich but commercial licenses
- Custom SVG rendering with dnd-kit — full control, more work upfront

## Decision

Build a custom Gantt canvas using React SVG rendering and dnd-kit for drag-and-drop.

## Rationale

Mermaid Gantt has a specific data model (sections, `after`-dependencies, milestones, status tags). Third-party libraries require constant adaptation to fit this model. The primary output is always Mermaid syntax — no library supports this natively. Custom rendering keeps `model/` as the single source of truth with no impedance mismatch.

## Consequences

- More implementation work upfront (Phase 4)
- Full control over Mermaid-specific features (excludes, todayMarker, after-dependencies)
- No licensing concerns — project stays fully open source
