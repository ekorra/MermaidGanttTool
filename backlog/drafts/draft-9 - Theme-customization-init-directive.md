---
id: DRAFT-9
title: Theme customization via %%{init}%% directive
status: Draft
created_date: '2026-03-14'
labels:
  - mermaid-spec
  - exploration
---

## Idea

Mermaid supports `%%{init: {'theme': 'base', 'themeVariables': { 'critBkgColor': '#ff0000', ... }}}%%` at the top of the diagram. This lets users customise the colour palette of the *rendered* Mermaid diagram (not the canvas).

## Open questions

- Should we expose raw JSON input or a visual colour picker per status?
- Do we need a live preview to validate the JSON before saving?
- Which theme variables are most useful for Gantt? (`critBkgColor`, `taskBkgColor`, `activeBkgColor`, `doneTaskBkgColor`, `gridColor`, `todayLineColor`)
- Risk: `%%{init}%%` is Mermaid-version-sensitive — need to test which variables are stable across versions.

## Exploration needed

- Map all Gantt-relevant `themeVariables` from the Mermaid source / docs
- Decide: full JSON textarea vs. per-field colour pickers
- Check if our `MermaidRenderer` re-initialises correctly when `%%{init}%%` changes (may need `mermaid.initialize()` re-call)
