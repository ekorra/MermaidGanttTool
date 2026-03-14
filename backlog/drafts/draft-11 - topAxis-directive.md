---
id: DRAFT-11
title: topAxis directive — axis on top of diagram
status: Draft
created_date: '2026-03-14'
labels:
  - mermaid-spec
  - exploration
---

## Idea

Mermaid supports a `topAxis` directive that moves the date axis from the bottom to the top of the rendered diagram. Useful for tall diagrams where scrolling to the bottom to read dates is inconvenient.

## Open questions

- Low implementation cost on the Mermaid side (single boolean directive), but does our canvas `TimelineHeader` already show the axis at top? If so, `topAxis` would make the rendered preview match the canvas layout, which is a nice consistency win.
- Is this worth a full task or just a checkbox in the Settings panel (TASK-30)?

## Exploration needed

- Verify `topAxis` works in the current version of mermaid.js we bundle
- Consider bundling this into TASK-30 (Settings panel) rather than a standalone task
