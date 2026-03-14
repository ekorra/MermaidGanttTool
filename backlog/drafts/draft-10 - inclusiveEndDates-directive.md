---
id: DRAFT-10
title: inclusiveEndDates directive
status: Draft
created_date: '2026-03-14'
labels:
  - mermaid-spec
  - exploration
---

## Idea

Mermaid has an `inclusiveEndDates` directive that makes end dates *inclusive* (the task runs through the end date) rather than exclusive (task ends at the start of the end date). Many users expect inclusive end dates, especially when working with calendar dates.

## Open questions

- Does enabling `inclusiveEndDates` affect how we compute `resolveTaskPositions()`? Our canvas uses exclusive end dates internally — if we emit `inclusiveEndDates`, the Mermaid-rendered preview and the canvas would show slightly different lengths.
- Should this be a chart-level toggle or always-on?
- Need to validate the exact Mermaid version that introduced `inclusiveEndDates` — it was added relatively late.

## Exploration needed

- Test `inclusiveEndDates` in `MermaidRenderer` to verify behaviour
- Decide whether the canvas should also shift its end-date calculation by +1 day when enabled (to stay in sync with the Mermaid preview)
- Check impact on `after <taskId>` chaining — does the inclusive shift propagate?
